const COOKIE_NAME = "bm_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;
// Workers Free has a short CPU budget per request. Keep the prototype's
// password check within that budget and add rate limiting below as a second
// line of defence.
const PASSWORD_ITERATIONS = 4000;
const LEGACY_PASSWORD_ITERATIONS = 120000;
const MAX_REQUEST_BYTES = 200000;
const MAX_SESSIONS = 8;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function errorResponse(message, status = 400, code = "BAD_REQUEST") {
  return json({ ok: false, error: message, code }, status);
}

function normalizeNickname(nickname) {
  return String(nickname || "").trim().normalize("NFKC").toLocaleLowerCase("ko-KR");
}

function cleanText(value, maximum, fallback = "") {
  const text = typeof value === "string" ? value.trim() : "";
  return (text || fallback).slice(0, maximum);
}

function clampInteger(value, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(Math.max(Math.trunc(parsed), minimum), maximum);
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeUserKey(value) {
  return bytesToBase64Url(encoder.encode(value));
}

function decodeUserKey(value) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(value)) throw new Error("Invalid user key");
  return decoder.decode(base64UrlToBytes(value));
}

function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

async function derivePassword(password, salt, iterations = PASSWORD_ITERATIONS) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: base64UrlToBytes(salt),
      iterations,
    },
    key,
    256,
  );
  return bytesToBase64Url(new Uint8Array(bits));
}

function constantTimeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string" || left.length !== right.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function readJson(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) throw new ApiError("저장 데이터가 너무 큽니다.", 413, "PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (encoder.encode(text).byteLength > MAX_REQUEST_BYTES) {
    throw new ApiError("저장 데이터가 너무 큽니다.", 413, "PAYLOAD_TOO_LARGE");
  }
  try {
    return text ? JSON.parse(text) : {};
  } catch (_error) {
    throw new ApiError("요청 형식이 올바르지 않습니다.", 400, "INVALID_JSON");
  }
}

class ApiError extends Error {
  constructor(message, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function parseCookie(request) {
  const header = request.headers.get("cookie") || "";
  const match = header.match(new RegExp("(?:^|;\\s*)" + COOKIE_NAME + "=([^;]+)"));
  if (!match) return null;

  try {
    const value = decodeURIComponent(match[1]);
    const separator = value.indexOf(".");
    if (separator <= 0) return null;
    const encodedKey = value.slice(0, separator);
    const token = value.slice(separator + 1);
    if (!/^[A-Za-z0-9_-]{32,64}$/.test(token)) return null;
    const key = decodeUserKey(encodedKey);
    if (!key || key !== normalizeNickname(key)) return null;
    return { key, token };
  } catch (_error) {
    return null;
  }
}

function sessionCookie(key, token) {
  const value = encodeURIComponent(encodeUserKey(key) + "." + token);
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

function expiredSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function checkSameOrigin(request, url) {
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) {
    throw new ApiError("허용되지 않은 요청입니다.", 403, "ORIGIN_REJECTED");
  }
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new ApiError("허용되지 않은 요청입니다.", 403, "ORIGIN_REJECTED");
  }
}

function getUserStub(env, key) {
  const id = env.USERS.idFromName(key);
  return env.USERS.get(id);
}

function internalRequest(path, method, body, token) {
  const headers = { "content-type": "application/json" };
  if (token) headers["x-session-token"] = token;
  return new Request("https://user.internal" + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function relayAuthenticated(request, env, path) {
  const auth = parseCookie(request);
  if (!auth) return errorResponse("로그인이 필요합니다.", 401, "UNAUTHORIZED");
  const stub = getUserStub(env, auth.key);
  const body = request.method === "GET" ? undefined : await readJson(request);
  return stub.fetch(internalRequest(path, request.method, body, auth.token));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({ ok: true, service: "baseball-manager", storage: "durable-objects" });
      }

      if (request.method !== "GET") checkSameOrigin(request, url);

      if (url.pathname === "/api/auth" && request.method === "POST") {
        const body = await readJson(request);
        const nickname = cleanText(body.nickname, 16);
        const key = normalizeNickname(nickname);
        const password = typeof body.password === "string" ? body.password : "";
        if (!nickname || !key || nickname.length > 16 || password.length < 4 || password.length > 64) {
          return errorResponse("닉네임과 4~64자의 비밀번호를 입력해주세요.", 400, "INVALID_CREDENTIALS");
        }

        const stub = getUserStub(env, key);
        const response = await stub.fetch(internalRequest("/auth", "POST", { nickname, key, password }));
        const data = await response.json();
        if (!response.ok) return json(data, response.status);

        const token = data.token;
        delete data.token;
        return json(data, 200, { "set-cookie": sessionCookie(key, token) });
      }

      if (url.pathname === "/api/session" && request.method === "GET") {
        return await relayAuthenticated(request, env, "/state");
      }

      if (url.pathname === "/api/state" && (request.method === "GET" || request.method === "PUT")) {
        return await relayAuthenticated(request, env, "/state");
      }

      if (url.pathname === "/api/logout" && request.method === "POST") {
        const response = await relayAuthenticated(request, env, "/logout");
        return json(response.ok ? { ok: true } : await response.json(), response.ok ? 200 : response.status, {
          "set-cookie": expiredSessionCookie(),
        });
      }

      return errorResponse("요청한 API를 찾을 수 없습니다.", 404, "NOT_FOUND");
    } catch (error) {
      if (error instanceof ApiError) return errorResponse(error.message, error.status, error.code);
      console.error("Unhandled API error", error);
      return errorResponse("서버에서 요청을 처리하지 못했습니다.", 500, "INTERNAL_ERROR");
    }
  },
};

function sanitizeProfile(value) {
  if (!value || typeof value !== "object") return null;
  const mascotIds = new Set([
    "otter", "fox", "wolf", "tiger", "bear", "eagle",
    "shark", "whale", "lion", "rabbit", "panda", "raccoon",
  ]);
  const color = /^#[0-9a-f]{6}$/i.test(value.color || "") ? value.color.toLowerCase() : "#f0445e";
  const mascot = mascotIds.has(value.mascot) ? value.mascot : "otter";
  return {
    teamName: cleanText(value.teamName, 12, "블루스톰"),
    color,
    mascot,
    wins: clampInteger(value.wins, 0, 9999),
    losses: clampInteger(value.losses, 0, 9999),
    draws: clampInteger(value.draws, 0, 9999),
  };
}

function sanitizeResult(value) {
  if (!value || typeof value !== "object") return null;
  const result = {
    title: cleanText(value.title, 80),
    description: cleanText(value.description, 500),
    log: cleanText(value.log, 500),
    success: Boolean(value.success),
    chance: clampInteger(value.chance, 0, 100),
    baseChance: clampInteger(value.baseChance, 0, 100),
  };
  if (value.challengeAttempted) {
    result.challengeAttempted = true;
    result.challengeSuccess = Boolean(value.challengeSuccess);
    result.challengeBonus = clampInteger(value.challengeBonus, 0, 4);
  }
  return result;
}

function sanitizeLog(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-120).map((entry) => ({
    message: cleanText(entry && entry.message, 500),
    timeLabel: cleanText(entry && entry.timeLabel, 30),
    highlight: Boolean(entry && entry.highlight),
  }));
}

function sanitizeInningScores(value) {
  const source = value && typeof value === "object" ? value : {};
  const sanitizeSide = (side) => {
    const innings = Array.isArray(source[side]) ? source[side].slice(0, 9) : [];
    while (innings.length < 9) innings.push(0);
    return innings.map((runs) => clampInteger(runs, 0, 20));
  };
  return { away: sanitizeSide("away"), home: sanitizeSide("home") };
}

function sanitizeGame(value) {
  if (!value || typeof value !== "object" || value.finished) return null;
  const scores = value.scores && typeof value.scores === "object" ? value.scores : {};
  const stats = value.stats && typeof value.stats === "object" ? value.stats : {};
  return {
    opponent: cleanText(value.opponent, 24, "레드폭스"),
    eventIndex: clampInteger(value.eventIndex, 0, 5),
    scores: {
      away: clampInteger(scores.away, 0, 50),
      home: clampInteger(scores.home, 0, 50),
    },
    inningScores: sanitizeInningScores(value.inningScores),
    bases: Array.from({ length: 3 }, (_, index) => Boolean(Array.isArray(value.bases) && value.bases[index])),
    outs: clampInteger(value.outs, 0, 2),
    bullpen: clampInteger(value.bullpen, 0, 100),
    usedPinchHit: Boolean(value.usedPinchHit),
    resolved: Boolean(value.resolved),
    finished: false,
    lastResult: sanitizeResult(value.lastResult),
    currentPitcherName: value.currentPitcherName ? cleanText(value.currentPitcherName, 24) : null,
    log: sanitizeLog(value.log),
    stats: {
      homeHits: clampInteger(stats.homeHits, 0, 100),
      awayHits: clampInteger(stats.awayHits, 0, 100),
      decisions: clampInteger(stats.decisions, 0, 6),
    },
  };
}

export class UserStore {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/auth" && request.method === "POST") return await this.authenticate(request);
      if (url.pathname === "/state" && request.method === "GET") return await this.readState(request);
      if (url.pathname === "/state" && request.method === "PUT") return await this.writeState(request);
      if (url.pathname === "/logout" && request.method === "POST") return await this.logout(request);
      return errorResponse("내부 요청을 찾을 수 없습니다.", 404, "NOT_FOUND");
    } catch (error) {
      if (error instanceof ApiError) return errorResponse(error.message, error.status, error.code);
      console.error("UserStore error", error);
      return errorResponse("계정 저장소에서 요청을 처리하지 못했습니다.", 500, "INTERNAL_ERROR");
    }
  }

  async authenticate(request) {
    const body = await readJson(request);
    const now = Date.now();
    const guard = (await this.state.storage.get("authGuard")) || { failures: 0, blockedUntil: 0 };
    if (guard.blockedUntil > now) {
      const waitSeconds = Math.ceil((guard.blockedUntil - now) / 1000);
      throw new ApiError(`${waitSeconds}초 후 다시 시도해주세요.`, 429, "TOO_MANY_ATTEMPTS");
    }

    let account = await this.state.storage.get("account");
    let created = false;
    if (!account) {
      const salt = randomToken(16);
      account = {
        key: body.key,
        nickname: cleanText(body.nickname, 16),
        salt,
        passwordHash: await derivePassword(body.password, salt, PASSWORD_ITERATIONS),
        passwordIterations: PASSWORD_ITERATIONS,
        createdAt: now,
      };
      await this.state.storage.put("account", account);
      created = true;
    } else {
      // A failed first deployment could have left only an empty legacy
      // account behind. It has no game/profile/session to protect, so repair
      // that placeholder with the current password instead of trapping the
      // user on the old expensive hash.
      const legacyAccount = !Number.isInteger(account.passwordIterations);
      if (legacyAccount) {
        const [profile, game, sessions] = await Promise.all([
          this.state.storage.get("profile"),
          this.state.storage.get("game"),
          this.state.storage.get("sessions"),
        ]);
        const hasActiveSession = Array.isArray(sessions)
          && sessions.some((session) => session && session.expiresAt > now);
        if (!profile && !game && !hasActiveSession) {
          const salt = randomToken(16);
          account = {
            ...account,
            salt,
            passwordHash: await derivePassword(body.password, salt, PASSWORD_ITERATIONS),
            passwordIterations: PASSWORD_ITERATIONS,
          };
          await this.state.storage.put("account", account);
        }
      }

      const iterations = Number.isInteger(account.passwordIterations)
        ? account.passwordIterations
        : LEGACY_PASSWORD_ITERATIONS;
      const candidate = await derivePassword(body.password, account.salt, iterations);
      if (!constantTimeEqual(candidate, account.passwordHash)) {
        const failures = guard.failures + 1;
        const blockedUntil = failures >= 5 ? now + Math.min(300000, 30000 * Math.pow(2, failures - 5)) : 0;
        await this.state.storage.put("authGuard", { failures, blockedUntil });
        throw new ApiError("비밀번호가 맞지 않습니다.", 401, "INVALID_PASSWORD");
      }

      // Rehash a valid legacy account on the next successful login.
      if (iterations !== PASSWORD_ITERATIONS) {
        account.passwordHash = await derivePassword(body.password, account.salt, PASSWORD_ITERATIONS);
        account.passwordIterations = PASSWORD_ITERATIONS;
        await this.state.storage.put("account", account);
      }
    }

    await this.state.storage.delete("authGuard");
    const token = randomToken(32);
    const tokenHash = await sha256(token);
    const sessions = ((await this.state.storage.get("sessions")) || [])
      .filter((session) => session.expiresAt > now)
      .slice(0, MAX_SESSIONS - 1);
    sessions.unshift({ hash: tokenHash, createdAt: now, expiresAt: now + SESSION_TTL_MS });
    await this.state.storage.put("sessions", sessions);

    return json({
      ok: true,
      created,
      nickname: account.nickname,
      key: account.key,
      token,
      profile: (await this.state.storage.get("profile")) || null,
      game: (await this.state.storage.get("game")) || null,
    });
  }

  async authorize(request) {
    const token = request.headers.get("x-session-token") || "";
    if (!token) throw new ApiError("로그인이 필요합니다.", 401, "UNAUTHORIZED");
    const tokenHash = await sha256(token);
    const now = Date.now();
    const stored = (await this.state.storage.get("sessions")) || [];
    const active = stored.filter((session) => session.expiresAt > now);
    if (active.length !== stored.length) await this.state.storage.put("sessions", active);
    if (!active.some((session) => constantTimeEqual(session.hash, tokenHash))) {
      throw new ApiError("로그인 시간이 만료되었습니다.", 401, "SESSION_EXPIRED");
    }
    return { tokenHash, active };
  }

  async readState(request) {
    await this.authorize(request);
    const account = await this.state.storage.get("account");
    return json({
      ok: true,
      nickname: account.nickname,
      key: account.key,
      profile: (await this.state.storage.get("profile")) || null,
      game: (await this.state.storage.get("game")) || null,
    });
  }

  async writeState(request) {
    await this.authorize(request);
    const body = await readJson(request);
    const profile = sanitizeProfile(body.profile);
    const game = sanitizeGame(body.game);
    if (!profile) throw new ApiError("구단 정보가 올바르지 않습니다.", 400, "INVALID_PROFILE");
    await this.state.storage.put("profile", profile);
    if (game) await this.state.storage.put("game", game);
    else await this.state.storage.delete("game");
    return json({ ok: true, profile, game, savedAt: new Date().toISOString() });
  }

  async logout(request) {
    const { tokenHash, active } = await this.authorize(request);
    await this.state.storage.put(
      "sessions",
      active.filter((session) => !constantTimeEqual(session.hash, tokenHash)),
    );
    return json({ ok: true });
  }
}
