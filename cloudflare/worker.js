const COOKIE = "__Host-sg_session";
const TTL = 2592000;
const ITERATIONS = 310000;

function origins(env) {
  return (env.ALLOWED_ORIGINS || "https://aiacademy376-ship-it.github.io").split(",").map(x => x.trim()).filter(Boolean);
}
function cors(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || !origins(env).includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "Origin"
  };
}
function send(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, headers || {})
  });
}
function withCors(result, request, env) {
  const headers = new Headers(result.headers);
  Object.entries(cors(request, env)).forEach(([k, v]) => headers.set(k, v));
  return new Response(result.body, { status: result.status, headers });
}
function error(message, status) { return send({ success: false, message }, status || 400); }
function readCookie(request) {
  const all = request.headers.get("Cookie") || "";
  const item = all.split(";").map(x => x.trim()).find(x => x.startsWith(COOKIE + "="));
  return item ? item.slice(COOKIE.length + 1) : "";
}
function cookie(token, age) {
  return COOKIE + "=" + token + "; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=" + age;
}
function allowed(request, env) {
  const origin = request.headers.get("Origin");
  return !!origin && origins(env).includes(origin);
}
async function body(request) {
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) throw new Error("JSON format talab qilinadi.");
  const raw = await request.text();
  if (raw.length > 12000) throw new Error("So‘rov hajmi juda katta.");
  try { return JSON.parse(raw); } catch (_) { throw new Error("JSON ma’lumot noto‘g‘ri."); }
}
function email(value) { return String(value || "").trim().toLowerCase(); }
function validEmail(value) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function b64(bytes) {
  let s = "";
  bytes.forEach(x => { s += String.fromCharCode(x); });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function unb64(value) {
  const s = atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4));
  return Uint8Array.from(s, c => c.charCodeAt(0));
}
function randomToken() { return b64(crypto.getRandomValues(new Uint8Array(32))); }
async function digest(value) {
  return b64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}
async function passwordHash(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
  return "pbkdf2_sha256$" + ITERATIONS + "$" + b64(salt) + "$" + b64(new Uint8Array(bits));
}
async function verifyPassword(password, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256" || Number(parts[1]) !== ITERATIONS) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unb64(parts[2]), iterations: ITERATIONS }, key, 256);
  const actual = b64(new Uint8Array(bits));
  if (actual.length !== parts[3].length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual.charCodeAt(i) ^ parts[3].charCodeAt(i);
  return diff === 0;
}
async function limited(request, env, action) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await digest(action + ":" + ip);
  const row = await env.DB.prepare("INSERT INTO rate_limits (key, window_started_at, attempts) VALUES (?, unixepoch(), 1) ON CONFLICT(key) DO UPDATE SET attempts = CASE WHEN window_started_at < unixepoch() - 900 THEN 1 ELSE attempts + 1 END, window_started_at = CASE WHEN window_started_at < unixepoch() - 900 THEN unixepoch() ELSE window_started_at END RETURNING attempts").bind(key).first();
  return Number(row && row.attempts || 0) <= 8;
}
async function makeSession(userId, request, env) {
  const token = randomToken();
  await env.DB.prepare("INSERT INTO sessions (id_hash, user_id, expires_at, created_at, ip_hash, user_agent) VALUES (?, ?, unixepoch() + ?, unixepoch(), ?, ?)").bind(await digest(token), userId, TTL, await digest(request.headers.get("CF-Connecting-IP") || ""), (request.headers.get("User-Agent") || "").slice(0, 300)).run();
  return token;
}
async function me(request, env) {
  const token = readCookie(request);
  if (!token) return null;
  return await env.DB.prepare("SELECT u.id, u.name, u.email, u.birthdate, u.age_band, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id_hash = ? AND s.expires_at > unixepoch() AND u.status = 'active' LIMIT 1").bind(await digest(token)).first();
}
async function register(request, env) {
  if (!allowed(request, env)) return error("So‘rov manbasi ruxsat etilmagan.", 403);
  if (!(await limited(request, env, "register"))) return error("Juda ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring.", 429);
  let data;
  try { data = await body(request); } catch (e) { return error(e.message); }
  const name = String(data.name || "").trim();
  const mail = email(data.email);
  const birthdate = String(data.birthdate || "");
  const password = String(data.password || "");
  if (name.length < 2 || name.length > 80) return error("Ism 2–80 belgi oralig‘ida bo‘lishi kerak.");
  if (!validEmail(mail)) return error("Elektron pochta manzilini tekshiring.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate) || Number.isNaN(Date.parse(birthdate + "T00:00:00Z")) || new Date(birthdate + "T00:00:00Z").toISOString().slice(0, 10) !== birthdate) return error("Tug‘ilgan sanani to‘g‘ri kiriting.");
  if (data.termsAccepted !== true) return error("Foydalanish shartlariga rozilik kerak.");
  if (password.length < 10 || password.length > 128) return error("Parol 10–128 belgi oralig‘ida bo‘lishi kerak.");
  const now = new Date();
  const dob = new Date(birthdate + "T00:00:00Z");
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  if (now.getUTCMonth() < dob.getUTCMonth() || (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate())) age--;
  if (age < 0 || age > 120) return error("Tug‘ilgan sana yaroqsiz.");
  if (age < 13) return error("13 yoshgacha bo‘lgan foydalanuvchilar uchun ota-ona yoki qonuniy vakil roziligi jarayoni tayyorlanmoqda.", 403);
  const band = age < 16 ? "13_15" : age < 18 ? "16_17" : "adult";
  const found = await env.DB.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").bind(mail).first();
  if (found) return error("Bu elektron pochta bilan hisob mavjud.", 409);
  const id = crypto.randomUUID();
  const hash = await passwordHash(password);
  try {
    await env.DB.prepare("INSERT INTO users (id, name, email, birthdate, age_band, password_hash, terms_accepted_at, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, unixepoch(), 'active', unixepoch(), unixepoch())").bind(id, name, mail, birthdate, band, hash).run();
  } catch (e) {
    if (String(e).toLowerCase().includes("unique")) return error("Bu elektron pochta bilan hisob mavjud.", 409);
    throw e;
  }
  const token = await makeSession(id, request, env);
  return send({ success: true, user: { id, name, email: mail, ageBand: band } }, 201, { "set-cookie": cookie(token, TTL) });
}
async function login(request, env) {
  if (!allowed(request, env)) return error("So‘rov manbasi ruxsat etilmagan.", 403);
  if (!(await limited(request, env, "login"))) return error("Juda ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring.", 429);
  let data;
  try { data = await body(request); } catch (e) { return error(e.message); }
  const mail = email(data.email || data.identifier);
  const password = String(data.password || "");
  if (!validEmail(mail) || !password || password.length > 128) return error("Email yoki parol noto‘g‘ri.", 401);
  const user = await env.DB.prepare("SELECT id, name, email, age_band, password_hash FROM users WHERE email = ? AND status = 'active' LIMIT 1").bind(mail).first();
  const valid = user ? await verifyPassword(password, user.password_hash) : false;
  if (!valid) return error("Email yoki parol noto‘g‘ri.", 401);
  const token = await makeSession(user.id, request, env);
  return send({ success: true, user: { id: user.id, name: user.name, email: user.email, ageBand: user.age_band } }, 200, { "set-cookie": cookie(token, TTL) });
}
async function logout(request, env) {
  const token = readCookie(request);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE id_hash = ?").bind(await digest(token)).run();
  return send({ success: true }, 200, { "set-cookie": cookie("", 0) });
}
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (request.method === "OPTIONS") {
        const headers = cors(request, env);
        return Object.keys(headers).length ? new Response(null, { status: 204, headers }) : new Response(null, { status: 403 });
      }
      let result;
      if (request.method === "GET" && url.pathname === "/api/health") result = send({ success: true, service: "SmartGoal API", status: "ok" });
      else if (request.method === "POST" && url.pathname === "/api/register") result = await register(request, env);
      else if (request.method === "POST" && url.pathname === "/api/login") result = await login(request, env);
      else if (request.method === "GET" && url.pathname === "/api/me") {
        const user = await me(request, env);
        result = user ? send({ success: true, user }) : error("Sessiya topilmadi yoki muddati tugagan.", 401);
      } else if (request.method === "POST" && url.pathname === "/api/logout") result = await logout(request, env);
      else result = error("API endpoint topilmadi.", 404);
      return withCors(result, request, env);
    } catch (e) {
      console.error("SmartGoal API error", e);
      return withCors(error("Serverda ichki xatolik yuz berdi.", 500), request, env);
    }
  }
};