"use strict";

const ACCOUNT_KEY = "baseball-manager-accounts-v1";
const SESSION_KEY = "baseball-manager-session-v1";
const PROFILE_KEY_PREFIX = "baseball-manager-profile-v1:";
const GAME_KEY_PREFIX = "baseball-manager-game-v1:";
const THEME_KEY = "baseball-manager-theme-v1";
const SERVER_SAVE_DELAY = 350;
const MAX_INNINGS = 11;

const PLAYER_LINEUP = [
  { name: "박준혁", position: "중견수", handedness: "좌타", contact: 78, power: 61, speed: 84 },
  { name: "이도현", position: "2루수", handedness: "우타", contact: 82, power: 57, speed: 72 },
  { name: "김태윤", position: "1루수", handedness: "우타", contact: 74, power: 82, speed: 48 },
  { name: "최강민", position: "좌익수", handedness: "좌타", contact: 71, power: 88, speed: 52 },
  { name: "정우진", position: "포수", handedness: "우타", contact: 68, power: 69, speed: 35 },
  { name: "오현석", position: "3루수", handedness: "우타", contact: 75, power: 64, speed: 44 },
  { name: "윤시후", position: "유격수", handedness: "좌타", contact: 69, power: 48, speed: 77 },
  { name: "한지훈", position: "우익수", handedness: "우타", contact: 66, power: 59, speed: 63 },
  { name: "문성호", position: "지명타자", handedness: "우타", contact: 73, power: 75, speed: 28 },
];

const BENCH = [
  { name: "강민재", position: "대타", handedness: "좌타", contact: 79, power: 70 },
  { name: "서지환", position: "대주자", handedness: "우타", contact: 61, power: 38, speed: 91 },
];

const PITCHERS = [
  {
    name: "김도윤",
    role: "선발",
    handedness: "우완",
    stuff: 80,
    control: 77,
    stamina: 91,
    trait: "낮게 떨어지는 포크볼로 땅볼과 헛스윙을 함께 노립니다.",
    pitches: [
      { name: "포크볼", rating: 85, type: "breaking" },
      { name: "직구", rating: 82, type: "fastball" },
      { name: "슬라이더", rating: 77, type: "breaking" },
    ],
  },
  {
    name: "한도윤",
    role: "셋업맨",
    handedness: "우완",
    stuff: 82,
    control: 72,
    stamina: 64,
    trait: "우타자 바깥쪽 슬라이더가 강합니다. 짧은 이닝에 구위가 올라갑니다.",
    pitches: [
      { name: "슬라이더", rating: 87, type: "breaking" },
      { name: "투심", rating: 81, type: "fastball" },
      { name: "체인지업", rating: 75, type: "offspeed" },
    ],
  },
  {
    name: "류시원",
    role: "마무리",
    handedness: "좌완",
    stuff: 88,
    control: 76,
    stamina: 58,
    trait: "강한 직구로 카운트를 잡고 포크볼을 결정구로 사용합니다.",
    pitches: [
      { name: "직구", rating: 92, type: "fastball" },
      { name: "포크볼", rating: 87, type: "breaking" },
      { name: "커브", rating: 78, type: "breaking" },
    ],
  },
];

const OPPONENT_BATTERS = [
  { name: "강현우", position: "좌익수", handedness: "좌타", contact: 74, power: 69 },
  { name: "배성준", position: "유격수", handedness: "우타", contact: 79, power: 51 },
  { name: "노진호", position: "4번타자", handedness: "우타", contact: 70, power: 89 },
  { name: "조민석", position: "포수", handedness: "좌타", contact: 67, power: 72 },
];

const OPPONENT_PITCHERS = [
  {
    name: "윤태성",
    role: "선발",
    handedness: "우완",
    stuff: 80,
    control: 78,
    stamina: 84,
    trait: "투심과 체인지업의 높이를 바꾸며 땅볼을 유도하는 제구형 선발입니다.",
    counterOptions: ["patient", "smallball"],
    pitches: [
      { name: "투심", rating: 85, type: "fastball" },
      { name: "체인지업", rating: 82, type: "offspeed" },
      { name: "커브", rating: 76, type: "breaking" },
    ],
  },
  {
    name: "이재현",
    role: "셋업맨",
    handedness: "우완",
    stuff: 84,
    control: 73,
    stamina: 61,
    trait: "빠른 슬라이더로 우타자의 배트 중심을 피하는 불펜 투수입니다.",
    counterOptions: ["aggressive", "power"],
    pitches: [
      { name: "슬라이더", rating: 88, type: "breaking" },
      { name: "직구", rating: 85, type: "fastball" },
      { name: "포크볼", rating: 78, type: "offspeed" },
    ],
  },
  {
    name: "박준서",
    role: "마무리",
    handedness: "좌완",
    stuff: 89,
    control: 75,
    stamina: 55,
    trait: "150km대 직구와 포크볼 조합으로 삼진을 노리는 마무리입니다.",
    counterOptions: ["aggressive", "power", "pinch"],
    pitches: [
      { name: "직구", rating: 93, type: "fastball" },
      { name: "포크볼", rating: 88, type: "breaking" },
      { name: "슬라이더", rating: 80, type: "breaking" },
    ],
  },
];

const OPPONENT_PITCHER = OPPONENT_PITCHERS[0];

const OPPONENTS = ["레드폭스", "화이트울브스", "그린자이언츠", "골든호크스"];

const DEFAULT_MASCOT = "otter";

const MASCOTS = [
  { id: "otter", name: "수달", emoji: "🦦" },
  { id: "fox", name: "여우", emoji: "🦊" },
  { id: "wolf", name: "늑대", emoji: "🐺" },
  { id: "tiger", name: "호랑이", emoji: "🐯" },
  { id: "bear", name: "곰", emoji: "🐻" },
  { id: "eagle", name: "독수리", emoji: "🦅" },
  { id: "shark", name: "상어", emoji: "🦈" },
  { id: "whale", name: "고래", emoji: "🐋" },
  { id: "lion", name: "사자", emoji: "🦁" },
  { id: "rabbit", name: "토끼", emoji: "🐰" },
  { id: "panda", name: "판다", emoji: "🐼" },
  { id: "raccoon", name: "너구리", emoji: "🦝" },
];

const TIPS = [
  "모든 선택에는 성공 확률과 대가가 있습니다. 좋은 선택보다 상황에 맞는 선택을 찾아보세요.",
  "득점권에서는 한 번의 장타보다 주자를 홈까지 보내는 방법이 더 중요할 때도 있습니다.",
  "불펜은 강력하지만 자주 쓰면 다음 경기의 체력이 줄어듭니다.",
  "상대 중심타선이 나올 때는 고의사구로 승부를 피하는 것도 감독의 선택입니다.",
];

const MOMENTS = [
  {
    inning: 2,
    half: "bottom",
    role: "offense",
    outs: 1,
    bases: [true, false, false],
    beforeText: "1회는 양 팀 선발이 안정적으로 막아냈습니다.",
    backgroundRuns: { away: 0, home: 0 },
    title: "첫 득점권 진입",
    description: "1사 1루. 상대 선발의 제구가 흔들리며 볼넷을 내줬습니다. 초반부터 압박할까요?",
    batterIndex: 2,
    pitcher: OPPONENT_PITCHER,
    leverage: "RUNNER ON",
    options: [
      { id: "aggressive", label: "강공", description: "장타를 노린다. 큰 점수도 가능하지만 삼진 위험이 큽니다.", tag: "고위험" },
      { id: "smallball", label: "작전 야구", description: "주자를 진루시켜 다음 타석의 득점 확률을 높입니다.", tag: "안정적" },
      { id: "patient", label: "기다리기", description: "상대 투수가 더 흔들리기를 기다리며 출루를 노립니다.", tag: "선구안" },
      { id: "steal", label: "도루 작전", description: "투수의 큰 동작을 읽고 2루를 먼저 노립니다.", tag: "주루" },
    ],
  },
  {
    inning: 4,
    half: "top",
    role: "defense",
    outs: 1,
    bases: [true, true, false],
    beforeText: "2~3회에 상대가 빈틈을 놓치지 않고 1점을 먼저 가져갔습니다.",
    backgroundRuns: { away: 1, home: 0 },
    title: "병살을 노릴 것인가",
    description: "1사 1·2루, 상대 4번 타자가 들어섭니다. 한 점을 감수하고 병살을 노릴 수도 있습니다.",
    batterIndex: 2,
    pitcher: PITCHERS[0],
    leverage: "DANGER ZONE",
    options: [
      { id: "attack", label: "정면 승부", description: "스트라이크를 먼저 잡고 타자를 압박합니다.", tag: "정면승부" },
      { id: "breaking", label: "유인구 승부", description: "헛스윙과 병살타를 동시에 노립니다.", tag: "변화구" },
      { id: "walk", label: "고의사구", description: "주자를 채우고 다음 타자와 병살 승부를 준비합니다.", tag: "계산된 위험" },
      { id: "bullpen", label: "불펜 조기 투입", description: "불펜 체력을 소모해 지금의 위기를 끊습니다.", tag: "교체" },
    ],
  },
  {
    inning: 5,
    half: "bottom",
    role: "offense",
    outs: 2,
    bases: [false, true, true],
    beforeText: "4회말, 우리 팀이 희생플라이로 한 점을 따라붙었습니다.",
    backgroundRuns: { away: 0, home: 1 },
    title: "2사 2·3루, 타석의 선택",
    description: "두 점을 더하면 흐름을 가져올 수 있습니다. 대타 카드를 쓸 타이밍일까요?",
    batterIndex: 4,
    pitcher: OPPONENT_PITCHER,
    leverage: "SCORING CHANCE",
    options: [
      { id: "pinch", label: "대타 투입", description: "벤치의 강민재를 기용해 컨택 능력을 높입니다.", tag: "카드 사용" },
      { id: "contact", label: "컨택 승부", description: "2사에서 짧게 끊어 치며 안타 하나로 주자를 부릅니다.", tag: "정교함" },
      { id: "power", label: "장타 승부", description: "한 번에 경기를 뒤집을 수 있는 타구를 노립니다.", tag: "빅이닝" },
      { id: "patient", label: "볼을 고른다", description: "볼넷까지 열어두고 다음 타자에게 연결합니다.", tag: "인내" },
    ],
  },
  {
    inning: 7,
    half: "top",
    role: "defense",
    outs: 0,
    bases: [true, false, true],
    beforeText: "6회는 양 팀 모두 득점 없이 지나갔습니다.",
    backgroundRuns: { away: 0, home: 0 },
    title: "7회, 선발을 내릴 시간",
    description: "무사 1·3루. 선발의 투구 수가 늘어나고 있습니다. 지금 승부를 걸까요?",
    batterIndex: 3,
    pitcher: PITCHERS[0],
    leverage: "BULLPEN CALL",
    options: [
      { id: "hold", label: "선발 유지", description: "위기에서도 에이스를 믿고 계속 맡깁니다.", tag: "체력 절약" },
      { id: "bullpen", label: "셋업맨 투입", description: "한도윤을 올려 삼진으로 흐름을 끊습니다.", tag: "승부수" },
      { id: "walk", label: "고의사구", description: "만루를 만들고 병살 가능성을 높입니다.", tag: "만루 작전" },
      { id: "attack", label: "낮은 공 승부", description: "땅볼을 유도해 홈 승부와 병살을 모두 준비합니다.", tag: "땅볼" },
    ],
  },
  {
    inning: 8,
    half: "bottom",
    role: "offense",
    outs: 1,
    bases: [true, true, false],
    beforeText: "7회는 양 팀 모두 추가 득점 없이 지나갔습니다.",
    backgroundRuns: { away: 0, home: 0 },
    title: "8회말, 흐름을 되찾아라",
    description: "1사 1·2루. 한 점이면 동점, 두 점이면 역전입니다. 가장 원하는 공격을 선택하세요.",
    batterIndex: 3,
    pitcher: OPPONENT_PITCHERS[1],
    leverage: "LATE INNING",
    options: [
      { id: "aggressive", label: "초구 강공", description: "상대 불펜이 올라온 직후 적극적으로 배트를 냅니다.", tag: "빠른 승부" },
      { id: "steal", label: "더블 스틸", description: "주자들의 스피드로 수비를 흔들고 득점권을 만듭니다.", tag: "대담한 작전" },
      { id: "smallball", label: "번트 대기", description: "주자를 진루시켜 한 점을 먼저 확실하게 노립니다.", tag: "동점 우선" },
      { id: "pinch", label: "대타 승부", description: "남은 대타 카드를 걸고 역전을 노립니다.", tag: "마지막 카드" },
    ],
  },
];

const POST_REGULATION_PHASES = new Set([
  "ninth-bottom",
  "extra-10-top",
  "extra-10-bottom",
  "extra-11-top",
  "extra-11-bottom",
]);

const dom = {
  authScreen: document.querySelector("#auth-screen"),
  authForm: document.querySelector("#auth-form"),
  authNickname: document.querySelector("#auth-nickname"),
  authPassword: document.querySelector("#auth-password"),
  authError: document.querySelector("#auth-error"),
  authSubmit: document.querySelector("#auth-form button[type='submit']"),
  setupScreen: document.querySelector("#setup-screen"),
  gameScreen: document.querySelector("#game-screen"),
  teamForm: document.querySelector("#team-form"),
  teamNameInput: document.querySelector("#team-name"),
  teamColorInput: document.querySelector("#team-color"),
  colorValue: document.querySelector("#color-value"),
  mascotOptions: document.querySelector("#mascot-options"),
  setupMascotPreview: document.querySelector("#setup-mascot-preview"),
  setupTeamPreview: document.querySelector("#setup-team-preview"),
  setupMascotName: document.querySelector("#setup-mascot-name"),
  resumeGameCard: document.querySelector("#resume-game-card"),
  resumeGameLabel: document.querySelector("#resume-game-label"),
  resumeButton: document.querySelector("#resume-button"),
  saveStatus: document.querySelector("#save-status"),
  themeToggle: document.querySelector("#theme-toggle"),
  logoutButton: document.querySelector("#logout-button"),
  newGameButton: document.querySelector("#new-game-button"),
  playAgainButton: document.querySelector("#play-again-button"),
  homeTeamName: document.querySelector("#home-team-name"),
  awayTeamName: document.querySelector("#away-team-name"),
  homeScore: document.querySelector("#home-score"),
  awayScore: document.querySelector("#away-score"),
  homeBadge: document.querySelector("#home-badge"),
  awayBadge: document.querySelector("#away-badge"),
  gamePhase: document.querySelector("#game-phase"),
  inningLabel: document.querySelector("#inning-label"),
  gameCount: document.querySelector("#game-count"),
  lineAwayRow: document.querySelector("#line-away-row"),
  lineHomeRow: document.querySelector("#line-home-row"),
  lineAwayName: document.querySelector("#line-away-name"),
  lineHomeName: document.querySelector("#line-home-name"),
  momentTitle: document.querySelector("#moment-title"),
  momentDescription: document.querySelector("#moment-description"),
  leverageChip: document.querySelector("#leverage-chip"),
  situationRole: document.querySelector("#situation-role"),
  sboBalls: document.querySelector("#sbo-balls"),
  sboStrikes: document.querySelector("#sbo-strikes"),
  sboOuts: document.querySelector("#sbo-outs"),
  baseSummary: document.querySelector("#base-summary"),
  batterAvatar: document.querySelector("#batter-avatar"),
  batterName: document.querySelector("#batter-name"),
  batterDetail: document.querySelector("#batter-detail"),
  batterRatingLabel: document.querySelector("#batter-rating-label"),
  batterRating: document.querySelector("#batter-rating"),
  pitcherAvatar: document.querySelector("#pitcher-avatar"),
  pitcherName: document.querySelector("#pitcher-name"),
  pitcherDetail: document.querySelector("#pitcher-detail"),
  pitcherRatingLabel: document.querySelector("#pitcher-rating-label"),
  pitcherRating: document.querySelector("#pitcher-rating"),
  pitcherTrait: document.querySelector("#pitcher-trait"),
  pitcherPitches: document.querySelector("#pitcher-pitches"),
  decisionTitle: document.querySelector("#decision-title"),
  decisionNumber: document.querySelector("#decision-number"),
  decisionActions: document.querySelector("#decision-actions"),
  decisionChallenge: document.querySelector("#decision-challenge"),
  challengeTitle: document.querySelector("#challenge-title"),
  challengeBonusLabel: document.querySelector("#challenge-bonus-label"),
  challengeInstruction: document.querySelector("#challenge-instruction"),
  challengeStage: document.querySelector("#challenge-stage"),
  challengeStartButton: document.querySelector("#challenge-start-button"),
  challengeSkipButton: document.querySelector("#challenge-skip-button"),
  challengeFeedback: document.querySelector("#challenge-feedback"),
  decisionResult: document.querySelector("#decision-result"),
  continueButton: document.querySelector("#continue-button"),
  playByPlay: document.querySelector("#play-by-play"),
  logStatus: document.querySelector("#log-status"),
  overviewTeamName: document.querySelector("#overview-team-name"),
  overviewBadge: document.querySelector("#overview-badge"),
  teamRecord: document.querySelector("#team-record"),
  bullpenValue: document.querySelector("#bullpen-value"),
  bullpenMeter: document.querySelector("#bullpen-meter"),
  pitcherRoster: document.querySelector("#pitcher-roster"),
  lineupList: document.querySelector("#lineup-list"),
  managerTip: document.querySelector("#manager-tip"),
  finalCard: document.querySelector("#final-card"),
  finalTitle: document.querySelector("#final-title"),
  finalDescription: document.querySelector("#final-description"),
  finalAwayName: document.querySelector("#final-away-name"),
  finalHomeName: document.querySelector("#final-home-name"),
  finalAwayScore: document.querySelector("#final-away-score"),
  finalHomeScore: document.querySelector("#final-home-score"),
};

const rememberedSession = loadSession();
let session = null;
let profile = loadProfile(rememberedSession ? rememberedSession.key : "guest");
let game = null;
let serverReady = false;
let saveTimer = null;
let serverSaveChain = Promise.resolve();
let activeChallenge = null;
let challengeInterval = null;
let challengeTimeout = null;

function normalizeNickname(nickname) {
  return nickname.trim().toLocaleLowerCase("ko-KR");
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  if (!document.documentElement.dataset) document.documentElement.dataset = {};
  document.documentElement.dataset.theme = nextTheme;
  const isDark = nextTheme === "dark";
  dom.themeToggle.textContent = isDark ? "☀" : "☾";
  dom.themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  dom.themeToggle.setAttribute("title", isDark ? "라이트 모드" : "다크 모드");
}

function initializeTheme() {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "light";
  } catch (_error) {
    savedTheme = "light";
  }
  applyTheme(savedTheme);
}

function loadSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (stored && stored.key && stored.nickname) return stored;
  } catch (error) {
    console.warn("세션을 불러오지 못했습니다.", error);
  }
  return null;
}

function currentUserKey() {
  return session ? session.key : "guest";
}

function profileStorageKey(userKey) {
  return PROFILE_KEY_PREFIX + encodeURIComponent(userKey || currentUserKey());
}

function gameStorageKey(userKey) {
  return GAME_KEY_PREFIX + encodeURIComponent(userKey || currentUserKey());
}

function loadAccounts() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY));
    return stored && typeof stored === "object" ? stored : {};
  } catch (error) {
    console.warn("계정 목록을 불러오지 못했습니다.", error);
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
}

async function hashPassword(password) {
  if (window.crypto && window.crypto.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return "sha256-" + Array.from(new Uint8Array(digest), function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }

  let hash = 2166136261;
  for (let index = 0; index < password.length; index += 1) {
    hash ^= password.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return "fallback-" + (hash >>> 0).toString(16);
}

function defaultProfile() {
  return {
    teamName: "블루스톰",
    color: "#f0445e",
    mascot: DEFAULT_MASCOT,
    wins: 0,
    losses: 0,
    draws: 0,
  };
}

function loadProfile(userKey) {
  try {
    const stored = JSON.parse(localStorage.getItem(profileStorageKey(userKey)));
    if (stored && stored.teamName) {
      return {
        teamName: stored.teamName,
        color: stored.color || "#f0445e",
        mascot: stored.mascot || DEFAULT_MASCOT,
        wins: Number(stored.wins) || 0,
        losses: Number(stored.losses) || 0,
        draws: Number(stored.draws) || 0,
      };
    }
  } catch (error) {
    console.warn("프로필을 불러오지 못했습니다.", error);
  }
  return defaultProfile();
}

function saveProfile() {
  localStorage.setItem(profileStorageKey(), JSON.stringify(profile));
  queueServerSave();
}

function loadSavedGame(userKey) {
  const key = userKey || (session && session.key);
  if (!key) return null;
  try {
    const stored = JSON.parse(localStorage.getItem(gameStorageKey(key)));
    return stored && !stored.finished ? stored : null;
  } catch (error) {
    console.warn("저장된 경기를 불러오지 못했습니다.", error);
    return null;
  }
}

function saveGameState() {
  if (!session || !game || game.finished) return;
  const snapshot = gameSnapshot();
  localStorage.setItem(gameStorageKey(), JSON.stringify(snapshot));
  queueServerSave();
}

function clearSavedGame() {
  if (session) localStorage.removeItem(gameStorageKey());
  queueServerSave();
}

function gameSnapshot() {
  if (!game || game.finished) return null;
  const snapshot = Object.assign({}, game);
  delete snapshot.current;
  return snapshot;
}

function cacheServerState() {
  if (!session) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(profileStorageKey(), JSON.stringify(profile));
  const snapshot = gameSnapshot();
  if (snapshot) localStorage.setItem(gameStorageKey(), JSON.stringify(snapshot));
  else localStorage.removeItem(gameStorageKey());
}

async function apiRequest(path, options) {
  const settings = options || {};
  const headers = Object.assign({}, settings.headers || {});
  if (settings.body !== undefined) headers["content-type"] = "application/json";
  let response;
  try {
    response = await fetch(path, {
      method: settings.method || "GET",
      headers: headers,
      body: settings.body === undefined ? undefined : JSON.stringify(settings.body),
      credentials: "same-origin",
      keepalive: Boolean(settings.keepalive),
    });
  } catch (_error) {
    const networkError = new Error("서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.");
    networkError.status = 0;
    throw networkError;
  }

  const contentType = response.headers.get("content-type") || "";
  let data = null;
  if (contentType.indexOf("application/json") >= 0) {
    data = await response.json();
  }
  if (!response.ok) {
    const requestError = new Error(data && data.error ? data.error : "서버 요청을 처리하지 못했습니다.");
    requestError.status = response.status;
    requestError.code = data && data.code;
    throw requestError;
  }
  if (!data) {
    const formatError = new Error("서버 응답 형식이 올바르지 않습니다.");
    formatError.status = response.status;
    throw formatError;
  }
  return data;
}

function queueServerSave() {
  if (!serverReady || !session) return;
  window.clearTimeout(saveTimer);
  dom.saveStatus.textContent = session.nickname + " · 서버 저장 중…";
  saveTimer = window.setTimeout(function () {
    flushServerState().catch(function () {});
  }, SERVER_SAVE_DELAY);
}

function flushServerState(options) {
  if (!serverReady || !session) return Promise.resolve();
  window.clearTimeout(saveTimer);
  saveTimer = null;
  const settings = options || {};
  const payload = { profile: profile, game: gameSnapshot() };
  serverSaveChain = serverSaveChain.catch(function () {}).then(async function () {
    try {
      await apiRequest("/api/state", {
        method: "PUT",
        body: payload,
        keepalive: Boolean(settings.keepalive),
      });
      dom.saveStatus.textContent = session.nickname + " · 서버 저장됨 · " + profile.teamName;
    } catch (error) {
      dom.saveStatus.textContent = session.nickname + " · 로컬 백업됨 · 서버 저장 재시도 필요";
      throw error;
    }
  });
  return serverSaveChain;
}

function applyRemoteState(data, fallbackProfile, fallbackGame) {
  session = { key: data.key, nickname: data.nickname };
  profile = data.profile || fallbackProfile || defaultProfile();
  game = data.game || fallbackGame || null;
  serverReady = true;
  cacheServerState();
}

function showAuthError(message) {
  dom.authError.textContent = message;
  dom.authError.hidden = !message;
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const nickname = dom.authNickname.value.trim();
  const password = dom.authPassword.value;
  if (!nickname || password.length < 4) {
    showAuthError("닉네임과 4자 이상의 비밀번호를 입력해주세요.");
    return;
  }

  const key = normalizeNickname(nickname);
  const accounts = loadAccounts();
  const existing = accounts[key];
  const passwordHash = existing ? await hashPassword(password) : null;

  if (existing && existing.passwordHash !== passwordHash) {
    showAuthError("비밀번호가 맞지 않습니다.");
    return;
  }

  const hasLocalProfile = localStorage.getItem(profileStorageKey(key)) !== null;
  const localProfile = loadProfile(key);
  const localGame = loadSavedGame(key);
  dom.authSubmit.disabled = true;
  dom.saveStatus.textContent = "서버 계정 확인 중…";
  showAuthError("");

  let data;
  try {
    data = await apiRequest("/api/auth", {
      method: "POST",
      body: { nickname: nickname, password: password },
    });
  } catch (error) {
    showAuthError(error.message || "접속하지 못했습니다.");
    dom.saveStatus.textContent = "서버에 연결하지 못했습니다";
    dom.authSubmit.disabled = false;
    return;
  }

  const shouldMigrateLocalState = !data.profile && hasLocalProfile;
  applyRemoteState(
    data,
    shouldMigrateLocalState ? localProfile : defaultProfile(),
    data.game || (shouldMigrateLocalState ? localGame : null),
  );

  if (existing) {
    delete accounts[key];
    saveAccounts(accounts);
  }

  dom.authPassword.value = "";
  dom.authSubmit.disabled = false;
  showAuthError("");
  showAuthenticatedApp();

  if (!data.profile) {
    flushServerState().catch(function () {});
  }
}

function showAuthenticatedApp() {
  dom.authScreen.hidden = true;
  dom.logoutButton.hidden = false;
  applyProfileToSetup();
  dom.saveStatus.textContent = session.nickname + " · " + profile.teamName;

  if (loadSavedGame()) {
    resumeSavedGame();
    return;
  }

  dom.setupScreen.hidden = false;
  dom.gameScreen.hidden = true;
  updateResumeCard();
}

function showLoggedOutApp(prefillNickname) {
  hideDecisionChallenge();
  dom.authScreen.hidden = false;
  dom.setupScreen.hidden = true;
  dom.gameScreen.hidden = true;
  dom.logoutButton.hidden = true;
  dom.saveStatus.textContent = "닉네임으로 접속해주세요";
  dom.authForm.reset();
  if (prefillNickname) dom.authNickname.value = prefillNickname;
  showAuthError("");
}

function updateResumeCard() {
  const saved = loadSavedGame();
  if (!saved) {
    dom.resumeGameCard.hidden = true;
    return;
  }

  const phaseLabels = {
    "ninth-bottom": "9회말",
    "extra-10-top": "연장 10회초",
    "extra-10-bottom": "연장 10회말",
    "extra-11-top": "연장 11회초",
    "extra-11-bottom": "연장 11회말",
  };
  const progress = Math.min(saved.eventIndex + 1, MOMENTS.length + 1);
  const progressLabel = phaseLabels[saved.phase] || "승부처 " + progress + "/" + (MOMENTS.length + 1);
  dom.resumeGameLabel.textContent = saved.opponent + "전 · " + progressLabel;
  dom.resumeGameCard.hidden = false;
}

function resumeSavedGame() {
  const saved = loadSavedGame();
  if (!saved) {
    updateResumeCard();
    return;
  }

  hideDecisionChallenge();
  game = saved;
  ensureGameShape();
  game.current = getCurrentMomentBlueprint();
  dom.setupScreen.hidden = true;
  dom.gameScreen.hidden = false;
  dom.finalCard.hidden = true;
  dom.logStatus.textContent = "LIVE";
  dom.decisionActions.hidden = false;
  dom.decisionResult.hidden = true;
  dom.continueButton.hidden = true;
  applyProfileToGame();
  updateRecord();
  renderPitcherRoster();
  renderLineup();
  renderPlayByPlay();
  renderGame();
  renderDecisionOptions(game.current);

  if (game.resolved && game.lastResult) {
    showDecisionResult(game.lastResult.title, game.lastResult.description, game.lastResult);
    dom.decisionActions.querySelectorAll("button").forEach(function (button) {
      button.disabled = true;
    });
    dom.continueButton.hidden = false;
    dom.continueButton.textContent = getAdvanceState().label;
  }
}

async function logout() {
  saveGameState();
  try {
    await flushServerState();
  } catch (_error) {
    // 로컬 백업은 이미 끝났으므로 로그아웃은 계속 진행합니다.
  }
  try {
    await apiRequest("/api/logout", { method: "POST", body: {} });
  } catch (_error) {
    // 만료된 세션도 로컬에서는 정상적으로 로그아웃합니다.
  }
  serverReady = false;
  session = null;
  game = null;
  localStorage.removeItem(SESSION_KEY);
  showLoggedOutApp();
}

async function initializeServerSession() {
  dom.authSubmit.disabled = true;
  dom.saveStatus.textContent = "서버 저장 확인 중…";
  try {
    const data = await apiRequest("/api/session");
    const localProfile = loadProfile(data.key);
    const localGame = loadSavedGame(data.key);
    const shouldMigrateLocalState = !data.profile && localStorage.getItem(profileStorageKey(data.key)) !== null;
    applyRemoteState(
      data,
      shouldMigrateLocalState ? localProfile : defaultProfile(),
      data.game || (shouldMigrateLocalState ? localGame : null),
    );
    showAuthenticatedApp();
    if (!data.profile) flushServerState().catch(function () {});
  } catch (error) {
    serverReady = false;
    session = null;
    game = null;
    profile = defaultProfile();
    showLoggedOutApp(rememberedSession ? rememberedSession.nickname : "");
    if (error.status !== 401) {
      showAuthError("서버 저장 연결을 확인하지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  } finally {
    dom.authSubmit.disabled = false;
  }
}

function initials(name) {
  return name ? name.slice(0, 1) : "?";
}

function getMascot(id) {
  return MASCOTS.find(function (mascot) {
    return mascot.id === id;
  }) || MASCOTS[0];
}

function renderMascotOptions() {
  dom.mascotOptions.innerHTML = "";
  MASCOTS.forEach(function (mascot) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mascot-choice";
    button.dataset.mascot = mascot.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", mascot.name + " 마스코트 선택");
    button.innerHTML =
      '<span class="mascot-emoji" aria-hidden="true">' + mascot.emoji + "</span>" +
      '<span class="mascot-name">' + mascot.name + "</span>";
    dom.mascotOptions.appendChild(button);
  });
}

function selectMascot(id) {
  const mascot = getMascot(id);
  profile.mascot = mascot.id;
  dom.mascotOptions.querySelectorAll("[data-mascot]").forEach(function (button) {
    const selected = button.dataset.mascot === mascot.id;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateSetupPreview();
}

function updateSetupPreview() {
  const mascot = getMascot(profile.mascot);
  const name = dom.teamNameInput.value.trim() || "블루스톰";
  dom.setupMascotPreview.textContent = mascot.emoji;
  dom.setupMascotPreview.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.setupTeamPreview.textContent = name;
  dom.setupMascotName.textContent = mascot.name + " 마스코트";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initializeLineScore() {
  [dom.lineAwayRow, dom.lineHomeRow].forEach(function (row) {
    if (!row || row.querySelector("[data-inning-index]")) return;
    for (let inning = 0; inning < MAX_INNINGS; inning += 1) {
      const cell = document.createElement("td");
      cell.dataset.inningIndex = String(inning);
      cell.textContent = "–";
      row.appendChild(cell);
    }

    const runsCell = document.createElement("td");
    runsCell.className = "line-score-total";
    runsCell.dataset.lineTotal = "runs";
    runsCell.textContent = "0";
    row.appendChild(runsCell);

    const hitsCell = document.createElement("td");
    hitsCell.dataset.lineTotal = "hits";
    hitsCell.textContent = "0";
    row.appendChild(hitsCell);
  });
}

function ensureGameShape() {
  if (!game) return;
  game.scores = game.scores || { away: 0, home: 0 };
  game.stats = Object.assign({ homeHits: 0, awayHits: 0, decisions: 0 }, game.stats || {});
  game.currentPitcherName = game.currentPitcherName || null;
  game.phase = POST_REGULATION_PHASES.has(game.phase) ? game.phase : null;

  if (!game.inningScores) {
    game.inningScores = {
      away: Array(MAX_INNINGS).fill(0),
      home: Array(MAX_INNINGS).fill(0),
    };

    const currentInning = game.current && game.current.inning
      ? game.current.inning
      : 1;
    const fallbackIndex = clamp(currentInning - 2, 0, MAX_INNINGS - 1);
    game.inningScores.away[fallbackIndex] = Number(game.scores.away) || 0;
    game.inningScores.home[fallbackIndex] = Number(game.scores.home) || 0;
  }

  ["away", "home"].forEach(function (side) {
    if (!Array.isArray(game.inningScores[side])) {
      game.inningScores[side] = Array(MAX_INNINGS).fill(0);
    }
    while (game.inningScores[side].length < MAX_INNINGS) game.inningScores[side].push(0);
    game.inningScores[side] = game.inningScores[side].slice(0, MAX_INNINGS).map(function (runs) {
      return Number(runs) || 0;
    });
  });
}

function addRuns(side, runs, inning) {
  const scored = Math.max(0, Number(runs) || 0);
  if (!scored) return;
  ensureGameShape();
  const inningIndex = clamp((Number(inning) || 1) - 1, 0, MAX_INNINGS - 1);
  game.scores[side] += scored;
  game.inningScores[side][inningIndex] += scored;
}

function shadeColor(color, percent) {
  const normalized = color.replace("#", "");
  const number = parseInt(normalized, 16);
  const red = clamp((number >> 16) + percent, 0, 255);
  const green = clamp(((number >> 8) & 0x00ff) + percent, 0, 255);
  const blue = clamp((number & 0x0000ff) + percent, 0, 255);
  return "#" + (0x1000000 + red * 0x10000 + green * 0x100 + blue).toString(16).slice(1);
}

function setAccent(color) {
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty("--accent-deep", shadeColor(color, -25));
}

function applyProfileToSetup() {
  dom.teamNameInput.value = profile.teamName;
  dom.teamColorInput.value = profile.color;
  dom.colorValue.textContent = profile.color.toUpperCase();
  setAccent(profile.color);
  selectMascot(profile.mascot || DEFAULT_MASCOT);
}

function applyProfileToGame() {
  const mascot = getMascot(profile.mascot);
  dom.homeTeamName.textContent = getManagedTeamName();
  dom.overviewTeamName.textContent = profile.teamName;
  dom.homeBadge.textContent = mascot.emoji;
  dom.homeBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.overviewBadge.textContent = mascot.emoji;
  dom.overviewBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.finalHomeName.textContent = getManagedTeamName();
  setAccent(profile.color);
  dom.saveStatus.textContent = (session ? session.nickname + " · " : "") + "서버 자동 저장 · " + profile.teamName;
}

function updateRecord() {
  dom.teamRecord.textContent = profile.wins + "승 " + profile.losses + "패 " + profile.draws + "무";
}

function formatInning(moment) {
  return moment.inning + "회" + (moment.half === "top" ? "초" : "말");
}

function getMomentDescription(moment) {
  if (moment.inning === 8 && moment.half === "bottom") {
    const difference = game.scores.home - game.scores.away;
    if (difference > 0) {
      return "1사 1·2루. " + difference + "점 앞선 상황에서 승부를 굳힐 추가점을 노립니다.";
    }
    if (difference === 0) {
      return "1사 1·2루 동점. 안타 하나면 경기 막판의 주도권을 가져올 수 있습니다.";
    }
    return "1사 1·2루. " + Math.abs(difference) + "점 뒤진 상황에서 추격 또는 역전을 노립니다.";
  }
  return moment.description;
}

function startGame(event) {
  event.preventDefault();
  profile.teamName = dom.teamNameInput.value.trim() || "블루스톰";
  profile.color = dom.teamColorInput.value || "#f0445e";
  profile.mascot = getMascot(profile.mascot).id;
  saveProfile();
  clearSavedGame();

  game = {
    opponent: OPPONENTS[randomBetween(0, OPPONENTS.length - 1)],
    eventIndex: 0,
    scores: { away: 0, home: 0 },
    inningScores: { away: Array(MAX_INNINGS).fill(0), home: Array(MAX_INNINGS).fill(0) },
    bases: [false, false, false],
    outs: 0,
    bullpen: 88,
    usedPinchHit: false,
    resolved: false,
    finished: false,
    lastResult: null,
    currentPitcherName: null,
    phase: null,
    log: [],
    stats: { homeHits: 0, awayHits: 0, decisions: 0 },
  };

  dom.setupScreen.hidden = true;
  dom.gameScreen.hidden = false;
  dom.finalCard.hidden = true;
  dom.playByPlay.innerHTML = "";
  dom.logStatus.textContent = "LIVE";
  applyProfileToGame();
  updateRecord();
  renderPitcherRoster();
  renderLineup();
  addLog("경기 시작. 오늘의 상대는 " + game.opponent + "입니다.", "시작");
  prepareNextMoment();
}

function getLateMoment() {
  const homeAhead = game.scores.home > game.scores.away;
  if (homeAhead) {
    const lead = game.scores.home - game.scores.away;
    return {
      id: "late",
      inning: 9,
      half: "top",
      role: "defense",
      outs: 2,
      bases: [false, true, false],
      beforeText: "8회까지 " + lead + "점 차 리드. 이제 마지막 세 개의 아웃만 남았습니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "9회초, 마지막 아웃",
      description: "2사 2루. 마무리 류시원을 올려 승리를 지킬까요, 아니면 투수를 아낄까요?",
      batterIndex: 2,
      pitcher: PITCHERS[1],
      leverage: "CLOSE THE GAME",
      options: [
        { id: "bullpen", label: "마무리 투입", description: "류시원의 결정구로 마지막 타자를 압박합니다.", tag: "클로저" },
        { id: "hold", label: "현재 투수 유지", description: "남은 아웃 하나를 현재 투수에게 맡깁니다.", tag: "체력 절약" },
        { id: "breaking", label: "유인구 승부", description: "헛스윙을 유도해 경기를 끝냅니다.", tag: "결정구" },
        { id: "walk", label: "고의사구", description: "다음 타자와 더 유리한 카운트에서 승부합니다.", tag: "계산된 위험" },
      ],
    };
  }

  return {
    id: "late",
    inning: 9,
    half: "bottom",
    role: "offense",
    outs: 1,
    bases: [true, false, false],
    beforeText: "8회까지 접전이 이어졌습니다. 홈팀의 마지막 공격이 시작됩니다.",
    backgroundRuns: { away: 0, home: 0 },
    title: "9회말, 마지막 기회",
    description: game.scores.home === game.scores.away
      ? "동점으로 맞은 9회말. 끝내기 주자가 1루에 있습니다."
      : (game.scores.away - game.scores.home) + "점 뒤진 9회말. 남은 한 번의 선택으로 추격해야 합니다.",
    batterIndex: 0,
    pitcher: OPPONENT_PITCHERS[2],
    leverage: "LAST CHANCE",
    options: [
      { id: "aggressive", label: "초구 강공", description: "첫 공부터 장타를 노려 경기를 끝낼 기회를 만듭니다.", tag: "끝내기" },
      { id: "pinch", label: "대타 승부", description: "강민재를 내보내 마지막 공격 카드를 사용합니다.", tag: "마지막 카드" },
      { id: "contact", label: "히트 앤드 런", description: "주자를 먼저 움직여 단타에도 홈까지 노릴 길을 만듭니다.", tag: "연결 플레이" },
      { id: "patient", label: "볼을 고른다", description: "출루를 만들어 다음 타자에게 기회를 넘깁니다.", tag: "연결" },
    ],
  };
}

function getPostRegulationMoment(phase) {
  const difference = game.scores.away - game.scores.home;
  const scoreText = difference > 0
    ? difference + "점 뒤진 상황"
    : difference < 0
      ? Math.abs(difference) + "점 앞선 상황"
      : "동점 상황";

  if (phase === "ninth-bottom") {
    return {
      id: phase,
      inning: 9,
      half: "bottom",
      role: "offense",
      outs: 1,
      bases: [true, true, false],
      beforeText: "9회초 수비가 끝났습니다. 홈팀에 마지막 정규이닝 공격 기회가 남았습니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "9회말, 응답할 시간",
      description: scoreText + ". 득점하지 못하면 경기가 끝납니다.",
      batterIndex: 3,
      pitcher: OPPONENT_PITCHERS[2],
      leverage: "LAST RESPONSE",
      options: [
        { id: "aggressive", label: "초구 강공", description: "주자 두 명을 불러들일 장타를 노립니다.", tag: "끝내기" },
        { id: "contact", label: "컨택 승부", description: "수비 사이를 노려 우선 한 점부터 만듭니다.", tag: "추격" },
        { id: "power", label: "장타 승부", description: "큰 스윙으로 경기를 한 번에 뒤집습니다.", tag: "고위험" },
        { id: "patient", label: "볼을 고른다", description: "마무리 투수의 제구 흔들림을 기다립니다.", tag: "선구안" },
      ],
    };
  }

  if (phase === "extra-10-top") {
    return {
      id: phase,
      inning: 10,
      half: "top",
      role: "defense",
      outs: 1,
      bases: [true, false, true],
      beforeText: "9회까지 승부를 가리지 못해 연장전에 들어갑니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "연장 10회초, 실점 위기",
      description: "1사 1·3루. 한 점도 치명적인 연장 승부입니다.",
      batterIndex: 2,
      pitcher: PITCHERS[1],
      leverage: "EXTRA INNING",
      options: [
        { id: "bullpen", label: "마무리 투입", description: "류시원에게 연장 첫 위기를 맡깁니다.", tag: "승부수" },
        { id: "attack", label: "정면 승부", description: "강한 공으로 삼진과 얕은 타구를 노립니다.", tag: "구위" },
        { id: "breaking", label: "변화구 유도", description: "낮은 변화구로 병살타를 유도합니다.", tag: "병살" },
        { id: "walk", label: "만루 작전", description: "1루를 채워 홈 승부 가능성을 만듭니다.", tag: "계산" },
      ],
    };
  }

  if (phase === "extra-10-bottom") {
    return {
      id: phase,
      inning: 10,
      half: "bottom",
      role: "offense",
      outs: 1,
      bases: [true, false, true],
      beforeText: "10회초 수비를 마치고 홈팀의 공격이 시작됩니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "연장 10회말, 끝내기 기회",
      description: scoreText + ". 여기서 앞서면 끝내기 승리입니다.",
      batterIndex: 5,
      pitcher: OPPONENT_PITCHERS[2],
      leverage: "WALK-OFF CHANCE",
      options: [
        { id: "aggressive", label: "초구 강공", description: "첫 공부터 외야 깊숙한 타구를 노립니다.", tag: "끝내기" },
        { id: "contact", label: "컨택 승부", description: "3루 주자를 홈으로 부를 타구를 만듭니다.", tag: "정교함" },
        { id: "smallball", label: "스퀴즈 번트", description: "3루 주자의 스타트에 맞춰 한 점을 짜냅니다.", tag: "한 점" },
        { id: "patient", label: "볼을 고른다", description: "상대 마무리의 실투를 기다립니다.", tag: "인내" },
      ],
    };
  }

  if (phase === "extra-11-top") {
    return {
      id: phase,
      inning: 11,
      half: "top",
      role: "defense",
      outs: 2,
      bases: [false, true, false],
      beforeText: "10회에도 동점이 이어졌습니다. 이제 마지막 연장 이닝입니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "연장 11회초, 마지막 수비",
      description: "2사 2루. 마지막 공격 기회를 지키기 위한 승부입니다.",
      batterIndex: 3,
      pitcher: PITCHERS[2],
      leverage: "FINAL INNING",
      options: [
        { id: "attack", label: "직구 승부", description: "가장 강한 공으로 마지막 아웃을 노립니다.", tag: "정면승부" },
        { id: "breaking", label: "포크볼 승부", description: "결정구로 헛스윙을 끌어냅니다.", tag: "결정구" },
        { id: "hold", label: "마무리 신뢰", description: "현재 배터리의 사인을 그대로 믿습니다.", tag: "신뢰" },
        { id: "walk", label: "고의사구", description: "강타자를 피하고 다음 타자와 승부합니다.", tag: "회피" },
      ],
    };
  }

  if (phase === "extra-11-bottom") {
    return {
      id: phase,
      inning: 11,
      half: "bottom",
      role: "offense",
      outs: 1,
      bases: [true, true, false],
      beforeText: "11회초 수비가 끝났습니다. 이 공격이 경기의 마지막입니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "연장 11회말, 최후의 선택",
      description: scoreText + ". 동점으로 끝나면 경기는 무승부가 됩니다.",
      batterIndex: 2,
      pitcher: OPPONENT_PITCHERS[2],
      leverage: "FINAL CHANCE",
      options: [
        { id: "aggressive", label: "초구 강공", description: "마지막 기회에 가장 강한 스윙을 주문합니다.", tag: "승부" },
        { id: "contact", label: "컨택 승부", description: "주자를 불러들일 정확한 타구를 노립니다.", tag: "연결" },
        { id: "power", label: "끝내기 장타", description: "장타 한 방으로 승부를 끝냅니다.", tag: "끝내기" },
        { id: "patient", label: "끝까지 고르기", description: "볼넷과 실투를 모두 열어두고 기다립니다.", tag: "선구안" },
      ],
    };
  }

  return null;
}

function getCurrentMomentBlueprint() {
  if (!game) return null;
  if (game.phase) return getPostRegulationMoment(game.phase);
  if (game.eventIndex === MOMENTS.length) return getLateMoment();
  return MOMENTS[game.eventIndex] || null;
}

function getAdvanceState() {
  if (!game || !game.current) return { finish: true, phase: null, label: "경기 결과 보기 →" };
  const tied = game.scores.home === game.scores.away;

  if (game.phase === "ninth-bottom") {
    return tied
      ? { finish: false, phase: "extra-10-top", label: "연장 10회초로 →" }
      : { finish: true, phase: null, label: "경기 결과 보기 →" };
  }
  if (game.phase === "extra-10-top") {
    return { finish: false, phase: "extra-10-bottom", label: "10회말로 →" };
  }
  if (game.phase === "extra-10-bottom") {
    return tied
      ? { finish: false, phase: "extra-11-top", label: "11회초로 →" }
      : { finish: true, phase: null, label: "경기 결과 보기 →" };
  }
  if (game.phase === "extra-11-top") {
    return { finish: false, phase: "extra-11-bottom", label: "11회말로 →" };
  }
  if (game.phase === "extra-11-bottom") {
    return { finish: true, phase: null, label: "경기 결과 보기 →" };
  }

  if (game.eventIndex < MOMENTS.length) {
    return { finish: false, phase: null, label: "다음 승부처로 →" };
  }
  if (game.current.inning === 9 && game.current.half === "top") {
    return game.scores.home > game.scores.away
      ? { finish: true, phase: null, label: "경기 결과 보기 →" }
      : { finish: false, phase: "ninth-bottom", label: "9회말로 →" };
  }
  if (game.current.inning === 9 && game.current.half === "bottom") {
    return tied
      ? { finish: false, phase: "extra-10-top", label: "연장 10회초로 →" }
      : { finish: true, phase: null, label: "경기 결과 보기 →" };
  }
  return { finish: true, phase: null, label: "경기 결과 보기 →" };
}

function prepareNextMoment() {
  hideDecisionChallenge();
  if (!game || game.finished) {
    return;
  }

  const blueprint = getCurrentMomentBlueprint();
  if (!blueprint) {
    finishGame();
    return;
  }

  game.current = blueprint;
  game.resolved = false;
  game.lastResult = null;
  game.currentPitcherName = null;
  game.bases = blueprint.bases.slice();
  game.outs = blueprint.outs;
  applyBackground(blueprint);
  renderGame();
  renderDecisionOptions(blueprint);
  dom.continueButton.hidden = true;
  dom.decisionResult.hidden = true;
  dom.decisionActions.hidden = false;
  addLog(formatInning(blueprint) + " · " + blueprint.title, "승부처", true);
  saveGameState();
}

function applyBackground(blueprint) {
  const runs = blueprint.backgroundRuns;
  const scoringInning = Math.max(1, blueprint.inning - 1);
  addRuns("away", runs.away, scoringInning);
  addRuns("home", runs.home, scoringInning);
  if (runs.away) game.stats.awayHits += 1;
  if (runs.home) game.stats.homeHits += 1;
  addLog(blueprint.beforeText, formatInning(blueprint));
}

function renderGame() {
  ensureGameShape();
  const moment = game.current;
  const isOffense = moment.role === "offense";
  const batter = isOffense
    ? PLAYER_LINEUP[moment.batterIndex]
    : OPPONENT_BATTERS[moment.batterIndex % OPPONENT_BATTERS.length];
  const pitcher = isOffense ? moment.pitcher : getCurrentPitcher(moment);

  dom.awayTeamName.textContent = game.opponent;
  dom.awayBadge.textContent = initials(game.opponent);
  dom.homeTeamName.textContent = getManagedTeamName();
  const mascot = getMascot(profile.mascot);
  dom.homeBadge.textContent = mascot.emoji;
  dom.homeBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.overviewTeamName.textContent = profile.teamName;
  dom.overviewBadge.textContent = mascot.emoji;
  dom.overviewBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.awayScore.textContent = game.scores.away;
  dom.homeScore.textContent = game.scores.home;
  renderLineScore();
  dom.gamePhase.textContent = isOffense ? "공격" : "수비";
  dom.inningLabel.textContent = formatInning(moment);
  dom.gameCount.textContent = (game.eventIndex + 1) + "번째 승부처";
  dom.momentTitle.textContent = moment.title;
  dom.momentDescription.textContent = getMomentDescription(moment);
  dom.leverageChip.textContent = moment.leverage;
  dom.situationRole.textContent = isOffense ? "공격" : "수비";
  renderSbo(moment);
  dom.baseSummary.textContent = baseSummary(moment.bases);

  setPlayerCard(dom.batterAvatar, dom.batterName, dom.batterDetail, dom.batterRatingLabel, dom.batterRating, batter, "batter");
  setPlayerCard(dom.pitcherAvatar, dom.pitcherName, dom.pitcherDetail, dom.pitcherRatingLabel, dom.pitcherRating, pitcher, "pitcher");
  renderPitcherReport(pitcher);
  renderBases(moment.bases);
  renderBullpen();
  updateRecord();
  dom.managerTip.textContent = TIPS[game.eventIndex % TIPS.length];
}

function getCurrentPitcher(moment) {
  if (game && game.currentPitcherName) {
    const selectedPitcher = PITCHERS.find(function (pitcher) {
      return pitcher.name === game.currentPitcherName;
    });
    if (selectedPitcher) return selectedPitcher;
  }
  return moment.pitcher || PITCHERS[0];
}

function renderLineScore() {
  if (!game || !game.current) return;
  ensureGameShape();
  dom.lineAwayName.textContent = game.opponent;
  dom.lineHomeName.textContent = getManagedTeamName();

  [[dom.lineAwayRow, "away"], [dom.lineHomeRow, "home"]].forEach(function (entry) {
    const row = entry[0];
    const side = entry[1];
    row.querySelectorAll("[data-inning-index]").forEach(function (cell) {
      const inningIndex = Number(cell.dataset.inningIndex);
      const inning = inningIndex + 1;
      const isAway = side === "away";
      const hasStarted = isAway
        ? inning <= game.current.inning
        : inning < game.current.inning || (inning === game.current.inning && game.current.half === "bottom");
      const didNotBat = game.finished && side === "home" && inning === game.current.inning &&
        game.current.half === "top" && game.scores.home > game.scores.away;

      cell.textContent = didNotBat ? "X" : hasStarted ? game.inningScores[side][inningIndex] : "–";
      cell.classList.toggle("is-future", !hasStarted && !didNotBat);
      cell.classList.toggle("is-current", hasStarted && inning === game.current.inning);
    });

    row.querySelector('[data-line-total="runs"]').textContent = game.scores[side];
    row.querySelector('[data-line-total="hits"]').textContent = side === "away"
      ? game.stats.awayHits
      : game.stats.homeHits;
  });
}

function getManagedTeamName() {
  return profile.teamName + (session && session.nickname ? " · " + session.nickname + " 감독" : "");
}

function getCountState(moment) {
  if (moment.outs === 0) return { balls: 1, strikes: 1, outs: 0 };
  if (moment.outs === 1) return { balls: 2, strikes: 1, outs: 1 };
  return { balls: 1, strikes: 2, outs: 2 };
}

function setSboLights(container, count, label) {
  if (!container) return;
  container.querySelectorAll("i").forEach(function (light, index) {
    light.classList.toggle("is-on", index < count);
  });
  container.setAttribute("aria-label", label + " " + count + "개");
}

function renderSbo(moment) {
  const count = getCountState(moment);
  setSboLights(dom.sboBalls, count.balls, "볼");
  setSboLights(dom.sboStrikes, count.strikes, "스트라이크");
  setSboLights(dom.sboOuts, count.outs, "아웃");
}

function setPlayerCard(avatar, name, detail, ratingLabel, rating, player, type) {
  avatar.textContent = initials(player.name);
  name.textContent = player.name;
  if (type === "pitcher") {
    detail.textContent = player.handedness + " · " + player.role;
    ratingLabel.textContent = "구위";
    rating.textContent = player.stuff;
    avatar.className = "player-avatar pitcher-avatar";
  } else {
    detail.textContent = player.position + " · " + player.handedness;
    ratingLabel.textContent = "장타력";
    rating.textContent = player.power;
    avatar.className = "player-avatar batter-avatar";
  }
}

function renderPitcherReport(pitcher) {
  dom.pitcherTrait.textContent = pitcher.trait || "구종 조합으로 타자의 타이밍을 빼앗습니다.";
  dom.pitcherPitches.innerHTML = "";
  (pitcher.pitches || []).forEach(function (pitch) {
    const item = document.createElement("span");
    item.className = "pitch-chip" + (pitch.rating >= 87 ? " is-elite" : "");
    const name = document.createElement("b");
    name.textContent = pitch.name;
    const rating = document.createElement("em");
    rating.textContent = pitch.rating;
    item.appendChild(name);
    item.appendChild(rating);
    dom.pitcherPitches.appendChild(item);
  });
}

function renderBases(bases) {
  document.querySelectorAll("[data-base]").forEach(function (base) {
    const index = Number(base.dataset.base);
    base.classList.toggle("is-occupied", Boolean(bases[index]));
  });
}

function baseSummary(bases) {
  const labels = ["1루", "2루", "3루"];
  const occupied = labels.filter(function (_, index) {
    return bases[index];
  });
  return occupied.length ? occupied.join(" · ") : "주자 없음";
}

function getBestPitch(pitcher) {
  const pitches = pitcher && Array.isArray(pitcher.pitches) ? pitcher.pitches : [];
  return pitches.reduce(function (best, pitch) {
    return !best || pitch.rating > best.rating ? pitch : best;
  }, null);
}

function getPitchRating(pitcher, types) {
  const pitches = pitcher && Array.isArray(pitcher.pitches) ? pitcher.pitches : [];
  const matches = pitches.filter(function (pitch) {
    return types.indexOf(pitch.type) >= 0;
  });
  return matches.length
    ? Math.max.apply(null, matches.map(function (pitch) { return pitch.rating; }))
    : pitcher.stuff;
}

function getDefensePitcher(moment, optionId) {
  if (optionId === "bullpen") return moment.inning >= 8 ? PITCHERS[2] : PITCHERS[1];
  return moment.pitcher || PITCHERS[0];
}

function estimateOffenseChance(optionId, moment) {
  const batter = optionId === "pinch" ? BENCH[0] : PLAYER_LINEUP[moment.batterIndex];
  const pitcher = moment.pitcher || OPPONENT_PITCHER;
  const contact = batter.contact || 65;
  const power = batter.power || 55;
  const speed = batter.speed || 62;
  let chance = 40;

  if (optionId === "aggressive" || optionId === "power") {
    chance = 27 + power * 0.34 + contact * 0.1 - pitcher.stuff * 0.22;
  } else if (optionId === "smallball") {
    chance = 40 + contact * 0.16 + speed * 0.08 - pitcher.control * 0.18;
    if (moment.bases[2]) chance += 5;
  } else if (optionId === "contact" || optionId === "fly") {
    chance = 33 + contact * 0.24 + power * 0.05 - pitcher.stuff * 0.16;
    if (moment.outs === 2) chance += 4;
  } else if (optionId === "patient") {
    chance = 31 + contact * 0.16 + (100 - pitcher.control) * 0.28;
    if (pitcher.control < 74) chance += 4;
  } else if (optionId === "steal") {
    chance = 26 + speed * 0.37 - pitcher.control * 0.12;
    if (moment.bases.filter(Boolean).length > 1) chance += 4;
  } else if (optionId === "pinch") {
    chance = 36 + contact * 0.2 + power * 0.06 - pitcher.stuff * 0.18;
  }

  if (Array.isArray(pitcher.counterOptions) && pitcher.counterOptions.indexOf(optionId) >= 0) {
    chance -= 6;
  }
  return clamp(Math.round(chance), 26, 58);
}

function estimateDefenseChance(optionId, moment) {
  const batter = OPPONENT_BATTERS[moment.batterIndex % OPPONENT_BATTERS.length];
  const pitcher = getDefensePitcher(moment, optionId);
  let chance = 25 + pitcher.stuff * 0.24 + pitcher.control * 0.16 -
    batter.contact * 0.1 - batter.power * 0.07;

  if (optionId === "attack") {
    chance += 2 + (getPitchRating(pitcher, ["fastball"]) - 78) * 0.25;
  } else if (optionId === "breaking") {
    chance += 2 + (getPitchRating(pitcher, ["breaking", "offspeed"]) - 78) * 0.28;
  } else if (optionId === "bullpen") {
    chance += 8;
    if (game.bullpen < 60) chance -= (60 - game.bullpen) * 0.18;
  } else if (optionId === "hold") {
    chance += (pitcher.stamina - 75) * 0.12 - (moment.inning >= 7 ? 7 : 2);
  } else if (optionId === "walk") {
    chance = 32 + pitcher.control * 0.08 - batter.power * 0.03;
  }

  return clamp(Math.round(chance), 24, 60);
}

function estimateDecisionChance(moment, optionId) {
  return moment.role === "offense"
    ? estimateOffenseChance(optionId, moment)
    : estimateDefenseChance(optionId, moment);
}

function challengeBonusForChance(chance) {
  if (chance <= 30) return 4;
  if (chance <= 38) return 3;
  if (chance <= 48) return 2;
  return 1;
}

function challengeDifficultyForChance(chance) {
  return clamp(Math.ceil((62 - chance) / 7), 1, 5);
}

function getChallengePitchOptions(moment, optionId) {
  const pitcher = moment.role === "offense"
    ? (moment.pitcher || OPPONENT_PITCHER)
    : getDefensePitcher(moment, optionId);
  const fallback = ["직구", "슬라이더", "포크볼"];
  const names = (pitcher.pitches || []).map(function (pitch) {
    return pitch.name;
  }).concat(fallback);
  return names.filter(function (name, index, list) {
    return list.indexOf(name) === index;
  }).slice(0, 3);
}

function stopChallengeTimers() {
  if (challengeInterval !== null) {
    window.clearInterval(challengeInterval);
    challengeInterval = null;
  }
  if (challengeTimeout !== null) {
    window.clearTimeout(challengeTimeout);
    challengeTimeout = null;
  }
}

function hideDecisionChallenge() {
  stopChallengeTimers();
  activeChallenge = null;
  dom.decisionChallenge.hidden = true;
  dom.challengeStage.innerHTML = "";
  dom.challengeFeedback.textContent = "";
  dom.challengeFeedback.className = "challenge-feedback";
  dom.challengeStartButton.hidden = false;
  dom.challengeStartButton.disabled = false;
  dom.challengeSkipButton.disabled = false;
}

function openDecisionChallenge(optionId) {
  if (!game || game.resolved || activeChallenge) return;
  const moment = game.current;
  const option = moment.options.find(function (candidate) {
    return candidate.id === optionId;
  });
  if (!option) return;
  if (optionId === "pinch" && game.usedPinchHit) return;
  if (optionId === "bullpen" && game.bullpen < 30) return;

  const baseChance = estimateDecisionChance(moment, optionId);
  const bonus = challengeBonusForChance(baseChance);
  const difficulty = challengeDifficultyForChance(baseChance);
  activeChallenge = {
    optionId: optionId,
    optionLabel: option.label,
    role: moment.role,
    baseChance: baseChance,
    bonus: bonus,
    difficulty: difficulty,
    started: false,
    finished: false,
  };

  dom.decisionActions.querySelectorAll("button").forEach(function (button) {
    button.disabled = true;
  });
  dom.decisionChallenge.hidden = false;
  dom.challengeTitle.textContent = moment.role === "offense" ? "타격 타이밍" : "포수 사인 기억";
  dom.challengeBonusLabel.textContent = "성공 시 +" + bonus + "%p";
  dom.challengeInstruction.textContent = moment.role === "offense"
    ? "시작 후 흰 마커가 초록 구역에 들어올 때 ‘타격!’을 누르세요."
    : "잠깐 공개되는 구종 순서를 기억한 뒤 같은 순서로 누르세요.";
  dom.challengeStartButton.textContent = "도전 시작";
  dom.challengeStartButton.hidden = false;
  dom.challengeStartButton.disabled = false;
  dom.challengeSkipButton.textContent = "미니게임 없이 실행";
  dom.challengeSkipButton.disabled = false;
  dom.challengeFeedback.textContent = "난이도 " + difficulty + " / 5 · " + option.label;
  dom.challengeFeedback.className = "challenge-feedback";

  if (moment.role === "offense") {
    const preview = document.createElement("div");
    preview.className = "challenge-ready";
    preview.textContent = "타이밍 게이지 준비";
    dom.challengeStage.replaceChildren(preview);
  } else {
    const preview = document.createElement("div");
    preview.className = "challenge-ready";
    preview.textContent = "사인 순서 준비";
    dom.challengeStage.replaceChildren(preview);
  }
  if (typeof dom.decisionChallenge.scrollIntoView === "function") {
    dom.decisionChallenge.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function startDecisionChallenge() {
  if (!activeChallenge || activeChallenge.started || activeChallenge.finished) return;
  activeChallenge.started = true;
  dom.challengeFeedback.textContent = "";
  if (activeChallenge.role === "offense") {
    startTimingChallenge();
  } else {
    startMemoryChallenge();
  }
}

function startTimingChallenge() {
  if (!activeChallenge) return;
  const targetWidth = clamp(36 - activeChallenge.difficulty * 4, 16, 32);
  const targetLeft = Math.round(12 + Math.random() * (76 - targetWidth));
  const meter = document.createElement("div");
  const zone = document.createElement("span");
  const marker = document.createElement("span");
  meter.className = "challenge-meter";
  meter.setAttribute("role", "img");
  meter.setAttribute("aria-label", "움직이는 타격 타이밍 게이지");
  zone.className = "challenge-target";
  marker.className = "challenge-marker";
  zone.style.left = targetLeft + "%";
  zone.style.width = targetWidth + "%";
  marker.style.left = "0%";
  meter.appendChild(zone);
  meter.appendChild(marker);
  dom.challengeStage.replaceChildren(meter);

  activeChallenge.targetLeft = targetLeft;
  activeChallenge.targetWidth = targetWidth;
  activeChallenge.markerPosition = 0;
  activeChallenge.markerDirection = 1;
  dom.challengeStartButton.textContent = "타격!";

  const step = 1.15 + activeChallenge.difficulty * 0.25;
  challengeInterval = window.setInterval(function () {
    if (!activeChallenge || activeChallenge.finished) return;
    activeChallenge.markerPosition += step * activeChallenge.markerDirection;
    if (activeChallenge.markerPosition >= 98) {
      activeChallenge.markerPosition = 98;
      activeChallenge.markerDirection = -1;
    } else if (activeChallenge.markerPosition <= 0) {
      activeChallenge.markerPosition = 0;
      activeChallenge.markerDirection = 1;
    }
    marker.style.left = activeChallenge.markerPosition + "%";
  }, 30);

  challengeTimeout = window.setTimeout(function () {
    finishDecisionChallenge(false, "타이밍을 놓쳤습니다.");
  }, 6500);
}

function completeTimingChallenge() {
  if (!activeChallenge || activeChallenge.role !== "offense" || !activeChallenge.started) return;
  const markerCenter = activeChallenge.markerPosition + 1;
  const success = markerCenter >= activeChallenge.targetLeft &&
    markerCenter <= activeChallenge.targetLeft + activeChallenge.targetWidth;
  finishDecisionChallenge(success, success ? "정확한 타이밍!" : "타이밍이 벗어났습니다.");
}

function startMemoryChallenge() {
  if (!activeChallenge || !game) return;
  const choices = getChallengePitchOptions(game.current, activeChallenge.optionId);
  const sequenceLength = clamp(2 + Math.ceil(activeChallenge.difficulty / 2), 3, 5);
  const sequence = Array.from({ length: sequenceLength }, function () {
    return choices[randomBetween(0, choices.length - 1)];
  });
  activeChallenge.choices = choices;
  activeChallenge.sequence = sequence;
  activeChallenge.input = [];

  const preview = document.createElement("div");
  preview.className = "challenge-memory-preview";
  sequence.forEach(function (pitch, index) {
    const card = document.createElement("span");
    card.textContent = (index + 1) + ". " + pitch;
    preview.appendChild(card);
  });
  dom.challengeStage.replaceChildren(preview);
  dom.challengeStartButton.hidden = true;
  dom.challengeFeedback.textContent = "순서를 기억하세요";

  const previewDuration = clamp(1050 - activeChallenge.difficulty * 90, 600, 960);
  challengeTimeout = window.setTimeout(function () {
    challengeTimeout = null;
    renderMemoryInput();
  }, previewDuration);
}

function renderMemoryInput() {
  if (!activeChallenge || activeChallenge.role !== "defense" || activeChallenge.finished) return;
  const wrap = document.createElement("div");
  wrap.className = "challenge-memory-input";
  activeChallenge.choices.forEach(function (pitch) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "challenge-pitch-button";
    button.textContent = pitch;
    button.addEventListener("click", function () {
      handleMemoryChoice(pitch);
    });
    wrap.appendChild(button);
  });
  dom.challengeStage.replaceChildren(wrap);
  dom.challengeFeedback.textContent = "입력 0 / " + activeChallenge.sequence.length;
  challengeTimeout = window.setTimeout(function () {
    finishDecisionChallenge(false, "사인 입력 시간이 끝났습니다.");
  }, 10000);
}

function handleMemoryChoice(pitch) {
  if (!activeChallenge || activeChallenge.finished || !activeChallenge.sequence) return;
  const index = activeChallenge.input.length;
  if (pitch !== activeChallenge.sequence[index]) {
    finishDecisionChallenge(false, "구종 순서가 달랐습니다.");
    return;
  }
  activeChallenge.input.push(pitch);
  dom.challengeFeedback.textContent = "입력 " + activeChallenge.input.length + " / " + activeChallenge.sequence.length;
  if (activeChallenge.input.length === activeChallenge.sequence.length) {
    finishDecisionChallenge(true, "사인이 정확합니다!");
  }
}

function finishDecisionChallenge(success, message) {
  if (!activeChallenge || activeChallenge.finished) return;
  stopChallengeTimers();
  activeChallenge.finished = true;
  const completed = {
    optionId: activeChallenge.optionId,
    bonus: activeChallenge.bonus,
    success: Boolean(success),
  };
  dom.challengeStage.querySelectorAll("button").forEach(function (button) {
    button.disabled = true;
  });
  dom.challengeStartButton.disabled = true;
  dom.challengeSkipButton.disabled = true;
  dom.challengeFeedback.textContent = message + (success ? " 성공률 +" + completed.bonus + "%p" : " 기본 확률로 진행합니다.");
  dom.challengeFeedback.className = "challenge-feedback " + (success ? "is-success" : "is-failure");
  challengeTimeout = window.setTimeout(function () {
    hideDecisionChallenge();
    resolveDecision(completed.optionId, success ? completed.bonus : 0, {
      attempted: true,
      success: Boolean(success),
    });
  }, 650);
}

function renderDecisionOptions(moment) {
  hideDecisionChallenge();
  dom.decisionActions.innerHTML = "";
  dom.decisionNumber.textContent = game.phase
    ? String(game.eventIndex + 1).padStart(2, "0") + " · " + formatInning(moment)
    : String(game.eventIndex + 1).padStart(2, "0") + " / 06";
  dom.decisionTitle.textContent = moment.role === "offense"
    ? "어떤 공격을 지시하시겠습니까?"
    : "어떻게 위기를 막겠습니까?";

  moment.options.forEach(function (option) {
    const wrapper = document.createElement("div");
    wrapper.className = "decision-option";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "decision-button";
    button.dataset.optionId = option.id;
    const isPinchDisabled = option.id === "pinch" && game.usedPinchHit;
    const isBullpenDisabled = option.id === "bullpen" && game.bullpen < 30;
    const chance = estimateDecisionChance(moment, option.id);
    button.disabled = isPinchDisabled || isBullpenDisabled;
    button.innerHTML =
      "<strong>" + option.label + (isPinchDisabled ? " (사용 완료)" : "") + "</strong>" +
      "<span>" + option.description + "</span>" +
      "<small class=\"decision-odds\">예상 성공률 " + chance + "%</small>" +
      "<small class=\"decision-tag\">" + option.tag + "</small>";
    button.addEventListener("click", function () {
      resolveDecision(option.id, 0, null);
    });

    const challengeButton = document.createElement("button");
    challengeButton.type = "button";
    challengeButton.className = "challenge-button";
    challengeButton.disabled = isPinchDisabled || isBullpenDisabled;
    challengeButton.textContent = "미니게임 · 성공 시 +" + challengeBonusForChance(chance) + "%p";
    challengeButton.addEventListener("click", function () {
      openDecisionChallenge(option.id);
    });

    wrapper.appendChild(button);
    wrapper.appendChild(challengeButton);
    dom.decisionActions.appendChild(wrapper);
  });
}

function resolveDecision(optionId, challengeBonus, challengeResult) {
  if (!game || game.resolved) return;
  const moment = game.current;
  const option = moment.options.find(function (candidate) {
    return candidate.id === optionId;
  });
  if (!option) return;
  if (optionId === "pinch" && game.usedPinchHit) return;
  if (optionId === "bullpen" && game.bullpen < 30) return;

  hideDecisionChallenge();
  const appliedBonus = clamp(Number(challengeBonus) || 0, 0, 4);

  game.resolved = true;
  game.stats.decisions += 1;
  dom.decisionActions.querySelectorAll("button").forEach(function (button) {
    button.disabled = true;
  });

  const result = moment.role === "offense"
    ? resolveOffense(optionId, moment, appliedBonus)
    : resolveDefense(optionId, moment, appliedBonus);
  if (challengeResult && challengeResult.attempted) {
    result.challengeAttempted = true;
    result.challengeSuccess = Boolean(challengeResult.success);
    result.challengeBonus = challengeResult.success ? appliedBonus : 0;
  }
  game.lastResult = result;
  addLog(result.log, formatInning(moment), true);
  showDecisionResult(result.title, result.description, result);
  renderGame();
  dom.continueButton.hidden = false;
  dom.continueButton.textContent = getAdvanceState().label;
  saveGameState();
}

function resolveOffense(optionId, moment, challengeBonus) {
  const batter = optionId === "pinch" ? BENCH[0] : PLAYER_LINEUP[moment.batterIndex];
  const pitcher = moment.pitcher || OPPONENT_PITCHER;
  const bestPitch = getBestPitch(pitcher);
  const baseChance = estimateOffenseChance(optionId, moment);
  const chance = clamp(baseChance + (Number(challengeBonus) || 0), 0, 95);
  const success = Math.random() * 100 < chance;
  const occupiedRunners = moment.bases.filter(Boolean).length;
  let runs = 0;
  let hit = false;
  let title = "작전 실패";
  let description = pitcher.name + "의 " + (bestPitch ? bestPitch.name : "결정구") + "를 이겨내지 못했습니다.";
  let log = batter.name + "이(가) 득점 없이 물러납니다.";

  if (optionId === "pinch") game.usedPinchHit = true;

  if (success && (optionId === "aggressive" || optionId === "power")) {
    hit = true;
    const extraBaseHit = Math.random() < 0.2 + (batter.power || 60) / 250;
    runs = extraBaseHit ? Math.min(2, Math.max(1, occupiedRunners)) : 1;
    title = extraBaseHit ? "장타 폭발!" : "적시타 성공!";
    description = batter.name + "이(가) 빠른 공을 받아쳐 " + runs + "점을 만들었습니다.";
    log = batter.name + "의 " + (extraBaseHit ? "장타" : "적시타") + ". " + runs + "점이 들어옵니다.";
  } else if (success && optionId === "smallball") {
    runs = moment.bases[2] ? 1 : 0;
    title = runs ? "작전 야구 성공" : "진루 작전 성공";
    description = runs
      ? "정확한 번트로 3루 주자가 홈을 밟았습니다."
      : "타자는 아웃됐지만 주자를 다음 베이스로 보냈습니다.";
    log = runs ? "번트 작전 성공. 1점이 들어옵니다." : "번트 성공. 주자가 한 베이스 진루합니다.";
  } else if (success && (optionId === "contact" || optionId === "fly")) {
    hit = true;
    runs = moment.bases[1] || moment.bases[2] ? 1 : Math.random() < 0.28 ? 1 : 0;
    title = "컨택 승부 성공";
    description = runs
      ? batter.name + "이(가) 수비 사이로 타구를 보내 1점을 불렀습니다."
      : batter.name + "이(가) 짧은 안타로 공격을 이어갑니다.";
    log = runs ? batter.name + "의 적시타. 1점이 들어옵니다." : batter.name + "의 안타로 기회가 이어집니다.";
  } else if (success && optionId === "patient") {
    hit = Math.random() < 0.34;
    runs = moment.bases.every(Boolean) ? 1 : hit && (moment.bases[1] || moment.bases[2]) ? 1 : 0;
    title = hit ? "실투를 놓치지 않았습니다" : "볼넷 출루";
    description = runs
      ? "긴 승부 끝에 주자 한 명이 홈을 밟았습니다."
      : "공을 끝까지 골라 다음 타자에게 기회를 연결했습니다.";
    log = runs ? "긴 승부 끝에 1득점입니다." : batter.name + "이(가) 출루에 성공합니다.";
  } else if (success && optionId === "steal") {
    runs = moment.bases[2] ? 1 : 0;
    title = "대담한 주루 성공";
    description = runs
      ? "투수의 큰 동작을 읽고 홈까지 파고들었습니다."
      : "주자들이 한 베이스씩 진루해 득점권을 만들었습니다.";
    log = runs ? "더블 스틸 성공. 1점이 들어옵니다." : "도루 성공. 득점권에 주자가 들어갑니다.";
  } else if (success && optionId === "pinch") {
    hit = true;
    runs = Math.random() < 0.3 && occupiedRunners > 1 ? 2 : 1;
    title = "대타 카드 적중!";
    description = "대타 " + batter.name + "이(가) " + runs + "타점 타구를 만들었습니다.";
    log = "대타 " + batter.name + "의 적시타. " + runs + "점이 들어옵니다.";
  } else if (!success) {
    if (optionId === "steal") {
      title = "주루사";
      description = "상대 배터리가 움직임을 읽었습니다. 송구가 먼저 도착해 주자가 아웃됩니다.";
      log = "도루 시도 실패. 공격 흐름이 끊깁니다.";
    } else if (optionId === "smallball") {
      title = "번트 작전 실패";
      description = "번트가 뜨면서 선행 주자까지 잡힐 위기에 놓였습니다.";
      log = batter.name + "의 번트가 수비 정면으로 향합니다.";
    } else if (optionId === "pinch") {
      title = "대타가 침묵했습니다";
      description = pitcher.name + "이(가) 대타 타이밍을 읽고 " + (bestPitch ? bestPitch.name : "결정구") + "로 삼진을 잡았습니다.";
      log = "대타 " + batter.name + ", 삼진으로 물러납니다.";
    } else if (optionId === "aggressive" || optionId === "power") {
      title = Math.random() < 0.55 ? "헛스윙 삼진" : "병살성 타구";
      description = "큰 타구를 노렸지만 " + (bestPitch ? bestPitch.name : "결정구") + "의 움직임을 따라가지 못했습니다.";
      log = batter.name + ", 공격적인 승부 끝에 득점 없이 물러납니다.";
    } else {
      title = "타이밍을 빼앗겼습니다";
      log = batter.name + "의 타구가 야수 정면으로 향합니다.";
    }
  }

  addRuns("home", runs, moment.inning);
  if (hit) game.stats.homeHits += 1;
  return { title: title, description: description, log: log, success: success, chance: chance, baseChance: baseChance };
}

function resolveDefense(optionId, moment, challengeBonus) {
  const batter = OPPONENT_BATTERS[moment.batterIndex % OPPONENT_BATTERS.length];
  const pitcher = getDefensePitcher(moment, optionId);
  const bestPitch = getBestPitch(pitcher);
  const baseChance = estimateDefenseChance(optionId, moment);
  const chance = clamp(baseChance + (Number(challengeBonus) || 0), 0, 95);
  const success = Math.random() * 100 < chance;
  let runs = 0;
  let title;
  let description;
  let log;

  game.currentPitcherName = pitcher.name;
  if (optionId === "bullpen") game.bullpen = clamp(game.bullpen - 18, 0, 100);

  if (success) {
    title = optionId === "bullpen" ? "불펜 투입 성공" : optionId === "walk" ? "만루 작전 성공" : "위기 탈출";
    description = optionId === "walk"
      ? "승부를 피한 뒤 다음 타자를 병살타로 처리했습니다."
      : pitcher.name + "이(가) " + (bestPitch ? bestPitch.name : "결정구") + "로 " + batter.name + "의 타이밍을 빼앗았습니다.";
    log = pitcher.name + "의 위기 탈출. 득점을 허용하지 않습니다.";
  } else {
    const multiRun = (batter.power >= 85 || optionId === "walk") && Math.random() < 0.32;
    runs = multiRun ? 2 : 1;
    title = optionId === "walk" ? "만루 작전 실패" : optionId === "bullpen" ? "교체 카드가 빗나갔습니다" : "상대 적시타";
    description = batter.name + "이(가) " + (bestPitch ? bestPitch.name : "결정구") + "를 받아쳐 " + runs + "점을 만들었습니다.";
    log = batter.name + "의 적시타. 상대가 " + runs + "점을 추가합니다.";
    addRuns("away", runs, moment.inning);
    game.stats.awayHits += 1;
  }

  return { title: title, description: description, log: log, success: success, chance: chance, baseChance: baseChance };
}

function showDecisionResult(title, description, outcome) {
  dom.decisionResult.hidden = false;
  dom.decisionResult.innerHTML = "";
  dom.decisionResult.classList.toggle("is-success", Boolean(outcome && outcome.success));
  dom.decisionResult.classList.toggle("is-failure", Boolean(outcome && outcome.success === false));

  const heading = document.createElement("div");
  heading.className = "decision-result-heading";
  const resultTitle = document.createElement("strong");
  resultTitle.textContent = title;
  heading.appendChild(resultTitle);
  if (outcome && Number.isFinite(outcome.chance)) {
    const badge = document.createElement("small");
    let badgeText = (outcome.success ? "성공" : "실패") + " · 적용 " + outcome.chance + "%";
    if (outcome.challengeAttempted) {
      badgeText += outcome.challengeSuccess
        ? " · 보정 +" + outcome.challengeBonus + "%p"
        : " · 보정 실패";
    }
    badge.textContent = badgeText;
    heading.appendChild(badge);
  }

  const resultDescription = document.createElement("span");
  resultDescription.textContent = description;
  dom.decisionResult.appendChild(heading);
  dom.decisionResult.appendChild(resultDescription);
}

function proceedToNext() {
  if (!game || !game.resolved) return;
  const advance = getAdvanceState();
  if (advance.finish) {
    finishGame();
    return;
  }
  game.eventIndex += 1;
  game.phase = advance.phase;
  prepareNextMoment();
}

function finishGame() {
  if (!game || game.finished) return;
  hideDecisionChallenge();
  game.finished = true;
  game.resolved = true;
  const home = game.scores.home;
  const away = game.scores.away;
  let resultTitle = "무승부";
  let resultDescription = game.current && game.current.inning >= 11
    ? "연장 11회말까지 승부를 가리지 못해 무승부로 끝났습니다."
    : "정규이닝까지 승부를 가리지 못했습니다.";

  if (home > away) {
    profile.wins += 1;
    resultTitle = "승리!";
    resultDescription = profile.teamName + "이(가) 승부처를 잡고 " + game.opponent + "을(를) 꺾었습니다.";
  } else if (home < away) {
    profile.losses += 1;
    resultTitle = "아쉬운 패배";
    resultDescription = "몇 번의 선택은 빛났지만, 마지막 고비를 넘지 못했습니다.";
  } else {
    profile.draws += 1;
  }

  saveProfile();
  updateRecord();
  renderLineScore();
  dom.finalTitle.textContent = resultTitle;
  dom.finalDescription.textContent = resultDescription;
  dom.finalAwayName.textContent = game.opponent;
  dom.finalHomeName.textContent = getManagedTeamName();
  dom.finalAwayScore.textContent = away;
  dom.finalHomeScore.textContent = home;
  dom.finalCard.hidden = false;
  dom.logStatus.textContent = "FINAL";
  dom.continueButton.hidden = true;
  dom.decisionActions.hidden = true;
  dom.decisionResult.hidden = true;
  addLog("경기 종료. 최종 스코어 " + game.opponent + " " + away + " : " + home + " " + profile.teamName, "종료", true);
  clearSavedGame();
  updateResumeCard();
}

function renderPitcherRoster() {
  dom.pitcherRoster.innerHTML = "";
  PITCHERS.forEach(function (pitcher) {
    const item = document.createElement("li");
    const top = document.createElement("div");
    top.className = "pitcher-roster-top";
    const identity = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = pitcher.name;
    const role = document.createElement("span");
    role.textContent = pitcher.role + " · " + pitcher.handedness;
    identity.appendChild(name);
    identity.appendChild(role);

    const arsenal = document.createElement("div");
    arsenal.className = "pitcher-roster-arsenal";
    pitcher.pitches.slice(0, 2).forEach(function (pitch) {
      const chip = document.createElement("b");
      chip.textContent = pitch.name + " " + pitch.rating;
      arsenal.appendChild(chip);
    });
    top.appendChild(identity);
    top.appendChild(arsenal);

    const trait = document.createElement("p");
    trait.textContent = pitcher.trait;
    item.appendChild(top);
    item.appendChild(trait);
    dom.pitcherRoster.appendChild(item);
  });
}

function renderLineup() {
  dom.lineupList.innerHTML = "";
  PLAYER_LINEUP.forEach(function (player) {
    const item = document.createElement("li");
    item.innerHTML = "<strong>" + player.name + "</strong><span>" + player.position + "</span>";
    dom.lineupList.appendChild(item);
  });
}

function renderBullpen() {
  const percentage = clamp(game ? game.bullpen : 88, 0, 100);
  dom.bullpenValue.textContent = percentage + "%";
  dom.bullpenMeter.style.width = percentage + "%";
  dom.bullpenMeter.style.background = percentage < 35 ? "#c98734" : "var(--success)";
}

function addLog(message, timeLabel, highlight) {
  if (!game) return;
  const item = { message: message, timeLabel: timeLabel, highlight: Boolean(highlight) };
  game.log.push(item);
  appendLogEntry(item);
  saveGameState();
}

function appendLogEntry(item) {
  const entry = document.createElement("div");
  entry.className = "log-entry" + (item.highlight ? " is-highlight" : "");
  entry.innerHTML = "<time>" + item.timeLabel + "</time><span>" + item.message + "</span>";
  dom.playByPlay.appendChild(entry);
  dom.playByPlay.scrollTop = dom.playByPlay.scrollHeight;
}

function renderPlayByPlay() {
  dom.playByPlay.innerHTML = "";
  if (!game || !Array.isArray(game.log)) return;
  game.log.forEach(appendLogEntry);
}

function resetToSetup() {
  hideDecisionChallenge();
  game = null;
  clearSavedGame();
  dom.gameScreen.hidden = true;
  dom.setupScreen.hidden = false;
  dom.saveStatus.textContent = (session ? session.nickname + " · " : "") + "새 구단을 만들어보세요";
  applyProfileToSetup();
  updateResumeCard();
}

dom.authForm.addEventListener("submit", handleAuthSubmit);
dom.teamForm.addEventListener("submit", startGame);
dom.continueButton.addEventListener("click", proceedToNext);
dom.challengeStartButton.addEventListener("click", function () {
  if (!activeChallenge) return;
  if (!activeChallenge.started) {
    startDecisionChallenge();
    return;
  }
  if (activeChallenge.role === "offense") completeTimingChallenge();
});
dom.challengeSkipButton.addEventListener("click", function () {
  if (!activeChallenge || !game || game.resolved) return;
  const optionId = activeChallenge.optionId;
  hideDecisionChallenge();
  resolveDecision(optionId, 0, null);
});
dom.newGameButton.addEventListener("click", resetToSetup);
dom.themeToggle.addEventListener("click", function () {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (_error) {
    // 저장이 제한된 브라우저에서도 현재 화면의 테마 전환은 유지합니다.
  }
});
dom.resumeButton.addEventListener("click", resumeSavedGame);
dom.logoutButton.addEventListener("click", logout);
dom.playAgainButton.addEventListener("click", function () {
  dom.finalCard.hidden = true;
  dom.logStatus.textContent = "LIVE";
  startGame({ preventDefault: function () {} });
});
dom.teamColorInput.addEventListener("input", function () {
  dom.colorValue.textContent = dom.teamColorInput.value.toUpperCase();
  setAccent(dom.teamColorInput.value);
});
dom.teamNameInput.addEventListener("input", updateSetupPreview);
dom.mascotOptions.addEventListener("click", function (event) {
  const button = event.target.closest("[data-mascot]");
  if (button) selectMascot(button.dataset.mascot);
});

initializeLineScore();
renderMascotOptions();
initializeTheme();
const initializationPromise = initializeServerSession();

window.addEventListener("pagehide", function () {
  if (!serverReady || !session) return;
  fetch("/api/state", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ profile: profile, game: gameSnapshot() }),
    credentials: "same-origin",
    keepalive: true,
  }).catch(function () {});
});
