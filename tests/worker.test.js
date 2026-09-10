import assert from "node:assert/strict";
import test from "node:test";

import worker, { UserStore } from "../worker.js";

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  async get(key) {
    return structuredClone(this.values.get(key));
  }

  async put(key, value) {
    this.values.set(key, structuredClone(value));
  }

  async delete(key) {
    this.values.delete(key);
  }
}

class MemoryNamespace {
  constructor() {
    this.objects = new Map();
  }

  idFromName(name) {
    return name;
  }

  get(id) {
    if (!this.objects.has(id)) {
      this.objects.set(id, new UserStore({ storage: new MemoryStorage() }, {}));
    }
    return this.objects.get(id);
  }
}

function createEnvironment() {
  return {
    USERS: new MemoryNamespace(),
    ASSETS: { fetch: () => new Response("asset", { status: 200 }) },
  };
}

function apiRequest(path, method = "GET", body, cookie, origin = "https://game.example") {
  const headers = { origin };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers.cookie = cookie;
  return new Request("https://game.example" + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

test("account, session, save, reload, and logout flow", async () => {
  const env = createEnvironment();
  const authResponse = await worker.fetch(
    apiRequest("/api/auth", "POST", { nickname: "최선배", password: "test1234" }),
    env,
  );
  assert.equal(authResponse.status, 200);
  const auth = await authResponse.json();
  assert.equal(auth.created, true);
  const cookie = authResponse.headers.get("set-cookie").split(";")[0];

  const profile = {
    teamName: "블루수달",
    color: "#3366aa",
    mascot: "otter",
    wins: 2,
    losses: 1,
    draws: 0,
  };
  const game = {
    opponent: "레드폭스",
    eventIndex: 2,
    scores: { away: 1, home: 2 },
    inningScores: { away: [0, 1, 0, 0, 0, 0, 0, 0, 0], home: [0, 0, 2, 0, 0, 0, 0, 0, 0] },
    bases: [true, false, true],
    outs: 1,
    bullpen: 70,
    resolved: false,
    log: [],
    stats: { homeHits: 3, awayHits: 2, decisions: 2 },
  };
  const saveResponse = await worker.fetch(apiRequest("/api/state", "PUT", { profile, game }, cookie), env);
  assert.equal(saveResponse.status, 200);

  const reloadResponse = await worker.fetch(apiRequest("/api/session", "GET", undefined, cookie), env);
  assert.equal(reloadResponse.status, 200);
  const restored = await reloadResponse.json();
  assert.equal(restored.profile.teamName, "블루수달");
  assert.equal(restored.game.eventIndex, 2);
  assert.deepEqual(restored.game.scores, { away: 1, home: 2 });

  const wrongPasswordResponse = await worker.fetch(
    apiRequest("/api/auth", "POST", { nickname: "최선배", password: "wrong-password" }),
    env,
  );
  assert.equal(wrongPasswordResponse.status, 401);

  const logoutResponse = await worker.fetch(apiRequest("/api/logout", "POST", {}, cookie), env);
  assert.equal(logoutResponse.status, 200);
  const expiredResponse = await worker.fetch(apiRequest("/api/session", "GET", undefined, cookie), env);
  assert.equal(expiredResponse.status, 401);
});

test("state-changing requests reject a foreign origin", async () => {
  const env = createEnvironment();
  const response = await worker.fetch(
    apiRequest(
      "/api/auth",
      "POST",
      { nickname: "외부", password: "test1234" },
      undefined,
      "https://attacker.example",
    ),
    env,
  );
  assert.equal(response.status, 403);
});
