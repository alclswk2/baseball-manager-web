"use strict";

const ACCOUNT_KEY = "baseball-manager-accounts-v1";
const SESSION_KEY = "baseball-manager-session-v1";
const PROFILE_KEY_PREFIX = "baseball-manager-profile-v1:";
const GAME_KEY_PREFIX = "baseball-manager-game-v1:";

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
  { name: "김도윤", role: "선발", handedness: "우완", stuff: 80, control: 77, stamina: 91 },
  { name: "한도윤", role: "셋업맨", handedness: "우완", stuff: 78, control: 72, stamina: 64 },
  { name: "류시원", role: "마무리", handedness: "좌완", stuff: 86, control: 76, stamina: 58 },
];

const OPPONENT_BATTERS = [
  { name: "강현우", position: "좌익수", handedness: "좌타", contact: 74, power: 69 },
  { name: "배성준", position: "유격수", handedness: "우타", contact: 79, power: 51 },
  { name: "노진호", position: "4번타자", handedness: "우타", contact: 70, power: 89 },
  { name: "조민석", position: "포수", handedness: "좌타", contact: 67, power: 72 },
];

const OPPONENT_PITCHER = {
  name: "윤태성",
  role: "선발",
  handedness: "우완",
  stuff: 78,
  control: 72,
  stamina: 81,
};

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
      { id: "fly", label: "희생플라이", description: "외야로 공을 보내 최소 한 점을 확실하게 노립니다.", tag: "최소 1점" },
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
    beforeText: "6회초, 상대 중심타선의 적시타로 다시 한 점 차가 됐습니다.",
    backgroundRuns: { away: 1, home: 0 },
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
    pitcher: OPPONENT_PITCHER,
    leverage: "LATE INNING",
    options: [
      { id: "aggressive", label: "초구 강공", description: "상대 불펜이 올라온 직후 적극적으로 배트를 냅니다.", tag: "빠른 승부" },
      { id: "steal", label: "더블 스틸", description: "주자들의 스피드로 수비를 흔들고 득점권을 만듭니다.", tag: "대담한 작전" },
      { id: "smallball", label: "번트 대기", description: "주자를 진루시켜 한 점을 먼저 확실하게 노립니다.", tag: "동점 우선" },
      { id: "pinch", label: "대타 승부", description: "남은 대타 카드를 걸고 역전을 노립니다.", tag: "마지막 카드" },
    ],
  },
];

const dom = {
  authScreen: document.querySelector("#auth-screen"),
  authForm: document.querySelector("#auth-form"),
  authNickname: document.querySelector("#auth-nickname"),
  authPassword: document.querySelector("#auth-password"),
  authError: document.querySelector("#auth-error"),
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
  momentTitle: document.querySelector("#moment-title"),
  momentDescription: document.querySelector("#moment-description"),
  leverageChip: document.querySelector("#leverage-chip"),
  situationRole: document.querySelector("#situation-role"),
  outCount: document.querySelector("#out-count"),
  pitchCount: document.querySelector("#pitch-count"),
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
  decisionTitle: document.querySelector("#decision-title"),
  decisionNumber: document.querySelector("#decision-number"),
  decisionActions: document.querySelector("#decision-actions"),
  decisionResult: document.querySelector("#decision-result"),
  continueButton: document.querySelector("#continue-button"),
  playByPlay: document.querySelector("#play-by-play"),
  logStatus: document.querySelector("#log-status"),
  overviewTeamName: document.querySelector("#overview-team-name"),
  overviewBadge: document.querySelector("#overview-badge"),
  teamRecord: document.querySelector("#team-record"),
  bullpenValue: document.querySelector("#bullpen-value"),
  bullpenMeter: document.querySelector("#bullpen-meter"),
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

let session = loadSession();
let profile = loadProfile();
let game = null;

function normalizeNickname(nickname) {
  return nickname.trim().toLocaleLowerCase("ko-KR");
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

function profileStorageKey() {
  return PROFILE_KEY_PREFIX + encodeURIComponent(currentUserKey());
}

function gameStorageKey() {
  return GAME_KEY_PREFIX + encodeURIComponent(currentUserKey());
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

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem(profileStorageKey()));
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
  return {
    teamName: "블루스톰",
    color: "#f0445e",
    mascot: DEFAULT_MASCOT,
    wins: 0,
    losses: 0,
    draws: 0,
  };
}

function saveProfile() {
  localStorage.setItem(profileStorageKey(), JSON.stringify(profile));
}

function loadSavedGame() {
  if (!session) return null;
  try {
    const stored = JSON.parse(localStorage.getItem(gameStorageKey()));
    return stored && !stored.finished ? stored : null;
  } catch (error) {
    console.warn("저장된 경기를 불러오지 못했습니다.", error);
    return null;
  }
}

function saveGameState() {
  if (!session || !game || game.finished) return;
  const snapshot = Object.assign({}, game);
  delete snapshot.current;
  localStorage.setItem(gameStorageKey(), JSON.stringify(snapshot));
}

function clearSavedGame() {
  if (session) localStorage.removeItem(gameStorageKey());
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
  const passwordHash = await hashPassword(password);
  const existing = accounts[key];

  if (existing && existing.passwordHash !== passwordHash) {
    showAuthError("비밀번호가 맞지 않습니다.");
    return;
  }

  if (!existing) {
    accounts[key] = { nickname: nickname, passwordHash: passwordHash };
    saveAccounts(accounts);
  }

  session = { key: key, nickname: existing ? existing.nickname : nickname };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  profile = loadProfile();
  dom.authPassword.value = "";
  showAuthError("");
  showAuthenticatedApp();
}

function showAuthenticatedApp() {
  dom.authScreen.hidden = true;
  dom.setupScreen.hidden = false;
  dom.gameScreen.hidden = true;
  dom.logoutButton.hidden = false;
  applyProfileToSetup();
  dom.saveStatus.textContent = session.nickname + " · " + profile.teamName;
  updateResumeCard();
}

function showLoggedOutApp() {
  dom.authScreen.hidden = false;
  dom.setupScreen.hidden = true;
  dom.gameScreen.hidden = true;
  dom.logoutButton.hidden = true;
  dom.saveStatus.textContent = "닉네임으로 접속해주세요";
  dom.authForm.reset();
  showAuthError("");
}

function updateResumeCard() {
  const saved = loadSavedGame();
  if (!saved) {
    dom.resumeGameCard.hidden = true;
    return;
  }

  const progress = Math.min(saved.eventIndex + 1, MOMENTS.length + 1);
  dom.resumeGameLabel.textContent = saved.opponent + "전 · 승부처 " + progress + "/" + (MOMENTS.length + 1);
  dom.resumeGameCard.hidden = false;
}

function resumeSavedGame() {
  const saved = loadSavedGame();
  if (!saved) {
    updateResumeCard();
    return;
  }

  game = saved;
  game.current = game.eventIndex === MOMENTS.length ? getLateMoment() : MOMENTS[game.eventIndex];
  dom.setupScreen.hidden = true;
  dom.gameScreen.hidden = false;
  dom.finalCard.hidden = true;
  dom.logStatus.textContent = "LIVE";
  dom.decisionActions.hidden = false;
  dom.decisionResult.hidden = true;
  dom.continueButton.hidden = true;
  applyProfileToGame();
  updateRecord();
  renderLineup();
  renderPlayByPlay();
  renderGame();
  renderDecisionOptions(game.current);

  if (game.resolved && game.lastResult) {
    showDecisionResult(game.lastResult.title, game.lastResult.description);
    dom.decisionActions.querySelectorAll("button").forEach(function (button) {
      button.disabled = true;
    });
    dom.continueButton.hidden = false;
    dom.continueButton.textContent = game.eventIndex === MOMENTS.length
      ? "경기 결과 보기 →"
      : "다음 승부처로 →";
  }
}

function logout() {
  saveGameState();
  session = null;
  game = null;
  localStorage.removeItem(SESSION_KEY);
  showLoggedOutApp();
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
  dom.homeTeamName.textContent = profile.teamName;
  dom.overviewTeamName.textContent = profile.teamName;
  dom.homeBadge.textContent = mascot.emoji;
  dom.homeBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.overviewBadge.textContent = mascot.emoji;
  dom.overviewBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.finalHomeName.textContent = profile.teamName;
  setAccent(profile.color);
  dom.saveStatus.textContent = (session ? session.nickname + " · " : "") + "자동 저장됨 · " + profile.teamName;
}

function updateRecord() {
  dom.teamRecord.textContent = profile.wins + "승 " + profile.losses + "패 " + profile.draws + "무";
}

function formatInning(moment) {
  return moment.inning + "회" + (moment.half === "top" ? "초" : "말");
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
    bases: [false, false, false],
    outs: 0,
    bullpen: 88,
    usedPinchHit: false,
    resolved: false,
    finished: false,
    lastResult: null,
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
  renderLineup();
  addLog("경기 시작. 오늘의 상대는 " + game.opponent + "입니다.", "시작");
  prepareNextMoment();
}

function getLateMoment() {
  const homeAhead = game.scores.home > game.scores.away;
  if (homeAhead) {
    return {
      id: "late",
      inning: 9,
      half: "top",
      role: "defense",
      outs: 2,
      bases: [false, true, false],
      beforeText: "8회까지 한 점 차 리드. 이제 마지막 세 개의 아웃만 남았습니다.",
      backgroundRuns: { away: 0, home: 0 },
      title: "9회초, 마지막 아웃",
      description: "2사 2루. 마무리 류시원을 올려 승리를 지킬까요, 아니면 투수를 아낄까요?",
      batterIndex: 2,
      pitcher: PITCHERS[2],
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
      : "한 점 뒤진 9회말. 주자를 홈으로 불러들이면 승부를 뒤집을 수 있습니다.",
    batterIndex: 0,
    pitcher: OPPONENT_PITCHER,
    leverage: "LAST CHANCE",
    options: [
      { id: "aggressive", label: "초구 강공", description: "첫 공부터 장타를 노려 경기를 끝낼 기회를 만듭니다.", tag: "끝내기" },
      { id: "pinch", label: "대타 승부", description: "강민재를 내보내 마지막 공격 카드를 사용합니다.", tag: "마지막 카드" },
      { id: "smallball", label: "번트 대기", description: "주자를 득점권으로 보내 한 점 승부를 준비합니다.", tag: "동점 우선" },
      { id: "patient", label: "볼을 고른다", description: "출루를 만들어 다음 타자에게 기회를 넘깁니다.", tag: "연결" },
    ],
  };
}

function prepareNextMoment() {
  if (!game || game.finished) {
    return;
  }
  if (game.eventIndex > MOMENTS.length) {
    finishGame();
    return;
  }

  const blueprint = game.eventIndex === MOMENTS.length
    ? getLateMoment()
    : MOMENTS[game.eventIndex];

  game.current = blueprint;
  game.resolved = false;
  game.lastResult = null;
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
  game.scores.away += runs.away;
  game.scores.home += runs.home;
  if (runs.away) game.stats.awayHits += 1;
  if (runs.home) game.stats.homeHits += 1;
  addLog(blueprint.beforeText, formatInning(blueprint));
}

function renderGame() {
  const moment = game.current;
  const isOffense = moment.role === "offense";
  const batter = isOffense
    ? PLAYER_LINEUP[moment.batterIndex]
    : OPPONENT_BATTERS[moment.batterIndex % OPPONENT_BATTERS.length];
  const pitcher = isOffense ? moment.pitcher : getCurrentPitcher(moment);

  dom.awayTeamName.textContent = game.opponent;
  dom.awayBadge.textContent = initials(game.opponent);
  dom.homeTeamName.textContent = profile.teamName;
  const mascot = getMascot(profile.mascot);
  dom.homeBadge.textContent = mascot.emoji;
  dom.homeBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.overviewTeamName.textContent = profile.teamName;
  dom.overviewBadge.textContent = mascot.emoji;
  dom.overviewBadge.setAttribute("aria-label", mascot.name + " 마스코트");
  dom.awayScore.textContent = game.scores.away;
  dom.homeScore.textContent = game.scores.home;
  dom.gamePhase.textContent = isOffense ? "공격" : "수비";
  dom.inningLabel.textContent = formatInning(moment);
  dom.gameCount.textContent = (game.eventIndex + 1) + "번째 승부처";
  dom.momentTitle.textContent = moment.title;
  dom.momentDescription.textContent = moment.description;
  dom.leverageChip.textContent = moment.leverage;
  dom.situationRole.textContent = isOffense ? "공격" : "수비";
  dom.outCount.textContent = moment.outs + "사";
  dom.pitchCount.textContent = getCount(moment);
  dom.baseSummary.textContent = baseSummary(moment.bases);

  setPlayerCard(dom.batterAvatar, dom.batterName, dom.batterDetail, dom.batterRatingLabel, dom.batterRating, batter, "batter");
  setPlayerCard(dom.pitcherAvatar, dom.pitcherName, dom.pitcherDetail, dom.pitcherRatingLabel, dom.pitcherRating, pitcher, "pitcher");
  renderBases(moment.bases);
  renderBullpen();
  updateRecord();
  dom.managerTip.textContent = TIPS[game.eventIndex % TIPS.length];
}

function getCurrentPitcher(moment) {
  if (moment.id === "late") return PITCHERS[2];
  return moment.pitcher || PITCHERS[0];
}

function getCount(moment) {
  if (moment.outs === 0) return "1 - 1";
  if (moment.outs === 1) return "2 - 1";
  return "1 - 2";
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

function renderDecisionOptions(moment) {
  dom.decisionActions.innerHTML = "";
  dom.decisionNumber.textContent = String(game.eventIndex + 1).padStart(2, "0") + " / 06";
  dom.decisionTitle.textContent = moment.role === "offense"
    ? "어떤 공격을 지시하시겠습니까?"
    : "어떻게 위기를 막겠습니까?";

  moment.options.forEach(function (option) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "decision-button";
    button.dataset.optionId = option.id;
    const isPinchDisabled = option.id === "pinch" && game.usedPinchHit;
    const isBullpenDisabled = option.id === "bullpen" && game.bullpen < 30;
    button.disabled = isPinchDisabled || isBullpenDisabled;
    button.innerHTML =
      "<strong>" + option.label + (isPinchDisabled ? " (사용 완료)" : "") + "</strong>" +
      "<span>" + option.description + "</span>" +
      "<small class=\"decision-tag\">" + option.tag + "</small>";
    button.addEventListener("click", function () {
      resolveDecision(option.id);
    });
    dom.decisionActions.appendChild(button);
  });
}

function resolveDecision(optionId) {
  if (!game || game.resolved) return;
  const moment = game.current;
  const option = moment.options.find(function (candidate) {
    return candidate.id === optionId;
  });
  if (!option) return;

  game.resolved = true;
  game.stats.decisions += 1;
  dom.decisionActions.querySelectorAll("button").forEach(function (button) {
    button.disabled = true;
  });

  const result = moment.role === "offense"
    ? resolveOffense(optionId, moment)
    : resolveDefense(optionId, moment);
  game.lastResult = result;
  addLog(result.log, formatInning(moment), true);
  showDecisionResult(result.title, result.description);
  renderGame();
  dom.continueButton.hidden = false;
  dom.continueButton.textContent = game.eventIndex === MOMENTS.length
    ? "경기 결과 보기 →"
    : "다음 승부처로 →";
  saveGameState();
}

function resolveOffense(optionId, moment) {
  const batter = PLAYER_LINEUP[moment.batterIndex];
  const contact = batter.contact / 100;
  const power = batter.power / 100;
  let chance = 0.4;
  let runs = 0;
  let scores = false;
  let title = "공격이 막혔습니다";
  let description = "상대 투수가 위기에서 낮은 공을 던졌고, 타구가 야수 정면으로 향했습니다.";
  let log = batter.name + "의 타구가 수비 정면으로 향합니다.";

  if (optionId === "aggressive" || optionId === "power") {
    chance = 0.28 + power * 0.34 + contact * 0.1;
    if (Math.random() < chance) {
      scores = true;
      runs = Math.random() < 0.24 + power * 0.2 ? 2 : 1;
      title = runs > 1 ? "장타 폭발!" : "적시타 성공!";
      description = batter.name + "이(가) 빠른 공을 정확히 받아쳤습니다. " + runs + "명의 주자가 홈을 밟습니다.";
      log = batter.name + "의 " + (runs > 1 ? "2루타" : "적시타") + "! " + runs + "점이 들어옵니다.";
    } else {
      title = Math.random() < 0.5 ? "헛스윙 삼진" : "빗맞은 타구";
      description = "공격적으로 노렸지만 상대 투수의 결정구를 이겨내지 못했습니다.";
      log = batter.name + ", 공격적인 승부 끝에 득점 없이 물러납니다.";
    }
  } else if (optionId === "smallball" || optionId === "fly") {
    chance = 0.51 + contact * 0.17;
    if (Math.random() < chance) {
      scores = true;
      runs = 1;
      title = "작전 성공";
      description = "주자를 안전하게 진루시키는 타구가 나왔고, 3루 주자가 홈을 밟습니다.";
      log = batter.name + "의 작전 수행. 1점으로 흐름을 이어갑니다.";
    } else {
      title = "한 점이 아쉽습니다";
      description = "주자는 움직였지만 수비가 빠르게 처리하며 홈을 내주지 않았습니다.";
      log = batter.name + "의 작전 타구, 수비가 먼저 잡아냅니다.";
    }
  } else if (optionId === "patient") {
    chance = 0.42 + contact * 0.19;
    if (Math.random() < chance) {
      scores = true;
      runs = 1;
      title = "기다린 보람";
      description = "볼을 골라낸 끝에 가운데로 몰린 공을 놓치지 않았습니다.";
      log = batter.name + "이(가) 출루를 만들고 1점이 들어옵니다.";
    } else {
      title = "승부가 길어졌습니다";
      description = "볼을 기다렸지만 카운트가 불리해졌고, 결국 범타로 끝났습니다.";
      log = batter.name + ", 긴 승부 끝에 범타로 물러납니다.";
    }
  } else if (optionId === "steal") {
    chance = 0.43 + (batter.speed || 65) / 100 * 0.27;
    if (Math.random() < chance) {
      scores = true;
      runs = moment.bases[2] ? 1 : 0;
      title = "대담한 주루";
      description = runs
        ? "더블 스틸이 완벽하게 맞아떨어지며 3루 주자가 홈을 훔칩니다."
        : "주자들이 한 베이스씩 진루하며 득점권을 만들었습니다.";
      log = runs
        ? "더블 스틸 성공! 홈까지 파고들어 1점이 들어옵니다."
        : "더블 스틸 성공. 주자들이 한 베이스씩 진루합니다.";
    } else {
      title = "주루사가 나왔습니다";
      description = "상대 포수가 정확하게 송구했고, 흐름이 끊겼습니다.";
      log = "도루 시도 실패. 포수가 주자를 잡아냅니다.";
    }
  } else if (optionId === "pinch") {
    game.usedPinchHit = true;
    const pinch = BENCH[0];
    chance = 0.52 + pinch.contact / 100 * 0.2;
    if (Math.random() < chance) {
      scores = true;
      runs = Math.random() < 0.25 ? 2 : 1;
      title = "대타 카드 적중!";
      description = pinch.name + "이(가) 벤치에서 나와 " + runs + "타점 타구를 만들었습니다.";
      log = "대타 " + pinch.name + "의 적시타! " + runs + "점이 들어옵니다.";
    } else {
      title = "대타가 침묵했습니다";
      description = "상대 투수가 대타 타이밍을 읽고 바깥쪽 승부로 헛스윙을 이끌어냈습니다.";
      log = "대타 " + pinch.name + ", 아쉽게 삼진으로 물러납니다.";
    }
  }

  if (scores) {
    game.scores.home += runs;
    game.stats.homeHits += 1;
  }
  return { title: title, description: description, log: log };
}

function resolveDefense(optionId, moment) {
  const batter = OPPONENT_BATTERS[moment.batterIndex % OPPONENT_BATTERS.length];
  const pitcher = optionId === "bullpen"
    ? (moment.inning >= 8 ? PITCHERS[2] : PITCHERS[1])
    : getCurrentPitcher(moment);
  let outChance = 0.4 + pitcher.stuff / 100 * 0.18;
  let runChance = 0.42;
  let title = "위기를 넘겼습니다";
  let description = "내야 수비가 침착하게 타구를 처리하며 주자를 묶어뒀습니다.";
  let log = pitcher.name + "이(가) 위기에서 범타를 유도합니다.";

  if (optionId === "attack") {
    outChance += 0.06;
    runChance -= 0.08;
  } else if (optionId === "breaking") {
    outChance += 0.13;
    runChance += 0.04;
  } else if (optionId === "walk") {
    outChance += 0.16;
    runChance += 0.15;
  } else if (optionId === "bullpen") {
    game.bullpen = clamp(game.bullpen - 16, 0, 100);
    outChance += 0.14;
    runChance -= 0.1;
  } else if (optionId === "hold") {
    outChance -= 0.03;
    runChance += 0.06;
  }

  if (optionId === "walk" && Math.random() < 0.42) {
    game.scores.away += 1;
    game.stats.awayHits += 1;
    title = "밀어내기 실점";
    description = "만루 작전이 완성되기 전에 스트라이크를 잡지 못했고, 밀어내기 볼넷이 나왔습니다.";
    log = batter.name + "에게 고의사구. 이어진 타석에서 밀어내기 1실점입니다.";
  } else if (Math.random() < outChance) {
    title = optionId === "bullpen" ? "불펜 투입 성공" : "수비 성공";
    description = optionId === "bullpen"
      ? pitcher.name + "이(가) 올라오자마자 결정구로 헛스윙을 끌어냈습니다."
      : pitcher.name + "이(가) 낮은 공으로 타자의 타이밍을 빼앗았습니다.";
    log = pitcher.name + "의 위기 탈출. " + batter.name + "이(가) 범타로 물러납니다.";
  } else if (Math.random() < runChance) {
    const runs = moment.bases[2] ? 1 : Math.random() < 0.25 ? 2 : 1;
    game.scores.away += runs;
    game.stats.awayHits += 1;
    title = "상대 적시타";
    description = batter.name + "이(가) 끈질긴 승부 끝에 타점을 만들었습니다.";
    log = batter.name + "의 적시타. " + runs + "점이 들어옵니다.";
  } else {
    title = "주자를 묶었습니다";
    description = "안타성 타구였지만 외야 수비가 빠르게 처리해 추가 진루를 막았습니다.";
    log = batter.name + "의 타구를 수비가 처리합니다. 추가 실점은 없습니다.";
  }

  return { title: title, description: description, log: log };
}

function showDecisionResult(title, description) {
  dom.decisionResult.hidden = false;
  dom.decisionResult.innerHTML = "<strong>" + title + "</strong><span>" + description + "</span>";
}

function proceedToNext() {
  if (!game || !game.resolved) return;
  game.eventIndex += 1;
  prepareNextMoment();
}

function finishGame() {
  if (!game || game.finished) return;
  game.finished = true;
  game.resolved = true;
  const home = game.scores.home;
  const away = game.scores.away;
  let resultTitle = "무승부";
  let resultDescription = "9회까지 승부를 가리지 못했습니다. 다음 경기에서 결판을 내보세요.";

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
  dom.finalTitle.textContent = resultTitle;
  dom.finalDescription.textContent = resultDescription;
  dom.finalAwayName.textContent = game.opponent;
  dom.finalHomeName.textContent = profile.teamName;
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
  game = null;
  dom.gameScreen.hidden = true;
  dom.setupScreen.hidden = false;
  dom.saveStatus.textContent = (session ? session.nickname + " · " : "") + "새 구단을 만들어보세요";
  applyProfileToSetup();
  updateResumeCard();
}

dom.authForm.addEventListener("submit", handleAuthSubmit);
dom.teamForm.addEventListener("submit", startGame);
dom.continueButton.addEventListener("click", proceedToNext);
dom.newGameButton.addEventListener("click", resetToSetup);
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

renderMascotOptions();
if (session) {
  showAuthenticatedApp();
} else {
  showLoggedOutApp();
}
