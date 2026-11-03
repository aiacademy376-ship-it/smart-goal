const SESSION_COOKIE = "sg_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 100000;
const MAX_BODY_BYTES = 1024 * 1024;

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      ...headers
    }
  });

function cookieValue(request, name) {
  const source = request.headers.get("Cookie") || "";
  for (const part of source.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) {
      return part.slice(index + 1).trim();
    }
  }
  return "";
}

function cookieHeader(value, maxAge) {
  return SESSION_COOKIE + "=" + value +
    "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=" + maxAge;
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
}

async function sha256(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function hashPassword(password, saltBase64, iterations = PASSWORD_ITERATIONS) {
  const salt = saltBase64 ? base64ToBytes(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, material, 256
  );
  return {
    salt: saltBase64 || bytesToBase64(salt),
    hash: bytesToBase64(new Uint8Array(bits)),
    iterations
  };
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index++) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

async function readJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) throw new Error("So‘rov hajmi juda katta.");
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("So‘rov hajmi juda katta.");
  try {
    return JSON.parse(text || "{}");
  } catch {
    throw new Error("JSON formati noto‘g‘ri.");
  }
}

function validateOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",").map(value => value.trim()).filter(Boolean);
  return allowed.includes(origin);
}

async function enforceRateLimit(env, key, limit, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const row = await env.DB.prepare(
    "SELECT hits, window_start FROM rate_limits WHERE rate_key = ?"
  ).bind(key).first();

  if (row && row.window_start === windowStart && row.hits >= limit) return false;

  await env.DB.prepare(
    "INSERT INTO rate_limits (rate_key, window_start, hits) VALUES (?, ?, 1) " +
    "ON CONFLICT(rate_key) DO UPDATE SET " +
    "hits = CASE WHEN window_start = excluded.window_start THEN hits + 1 ELSE 1 END, " +
    "window_start = excluded.window_start"
  ).bind(key, windowStart).run();

  return true;
}

function clientKey(request, value) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  return sha256(ip + ":" + value);
}

async function createSession(env, userId) {
  const token = randomToken();
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  ).bind(tokenHash, userId, expiresAt, new Date().toISOString()).run();

  return token;
}

async function authenticatedUser(request, env) {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;

  const tokenHash = await sha256(token);
  const row = await env.DB.prepare(
    "SELECT u.id, u.name, u.username, u.email, u.birthdate, u.age_band, u.created_at " +
    "FROM sessions s JOIN users u ON u.id = s.user_id " +
    "WHERE s.token_hash = ? AND s.expires_at > ? LIMIT 1"
  ).bind(tokenHash, new Date().toISOString()).first();

  return row || null;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    ageBand: user.age_band,
    birthdate: user.birthdate || null,
    createdAt: user.created_at
  };
}

async function handleRegister(request, env) {
  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const username = String(body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const birthdate = body.birthdate ? String(body.birthdate) : null;
  const termsAccepted = body.termsAccepted === true;

  if (name.length < 2 || name.length > 60) return json({ success: false, message: "Ism 2–60 belgi bo‘lishi kerak." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ success: false, message: "Email manzil noto‘g‘ri." }, 400);
  if (!/^[a-z0-9_][a-z0-9_.]{2,19}$/.test(username)) return json({ success: false, message: "Username noto‘g‘ri." }, 400);
  if (password.length < 8 || password.length > 128) return json({ success: false, message: "Parol 8–128 belgi bo‘lishi kerak." }, 400);
  if (!birthdate || !/^\d{4}-\d{2}-\d{2}$/.test(birthdate) || Number.isNaN(Date.parse(birthdate + "T00:00:00Z")) || new Date(birthdate + "T00:00:00Z").toISOString().slice(0, 10) !== birthdate) return json({ success: false, message: "Tug‘ilgan sana noto‘g‘ri." }, 400);
  if (!termsAccepted) return json({ success: false, message: "Foydalanish shartlariga rozilik kerak." }, 400);
  const birth = new Date(birthdate + "T00:00:00Z");
  const nowDate = new Date();
  let age = nowDate.getUTCFullYear() - birth.getUTCFullYear();
  if (nowDate.getUTCMonth() < birth.getUTCMonth() || (nowDate.getUTCMonth() === birth.getUTCMonth() && nowDate.getUTCDate() < birth.getUTCDate())) age--;
  if (age < 0 || age > 120) return json({ success: false, message: "Tug‘ilgan sana yaroqsiz." }, 400);
  if (age < 13) return json({ success: false, message: "13 yoshgacha bo‘lgan foydalanuvchilar uchun ota-ona yoki qonuniy vakil roziligi jarayoni tayyorlanmoqda." }, 403);
  const ageBand = age < 16 ? "13_15" : age < 18 ? "16_17" : "adult";

  const rateKey = await clientKey(request, "register:" + email);
  if (!await enforceRateLimit(env, rateKey, 5, 3600)) {
    return json({ success: false, message: "Juda ko‘p urinish. Keyinroq qayta urinib ko‘ring." }, 429);
  }

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ? OR username = ?").bind(email, username).first();
  if (existing) return json({ success: false, message: "Bu email yoki username band." }, 409);

  const credentials = await hashPassword(password);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO users (id, name, username, email, password_hash, password_salt, password_iterations, birthdate, age_band, terms_accepted_at, created_at, updated_at) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, name, username, email, credentials.hash, credentials.salt, credentials.iterations, birthdate, ageBand, now, now, now).run();

  await env.DB.prepare(
    "INSERT INTO user_data (user_id, data_json, updated_at) VALUES (?, ?, ?)"
  ).bind(id, JSON.stringify({ profile: { name, username, email, birthdate, age, ageBand }, goals: [], tasks: [], habits: [], activity: [], achievements: [], inventory: [], notifications: [], memories: [] }), now).run();

  const token = await createSession(env, id);
  return json({ success: true, user: { id, name, username, email, birthdate, ageBand, createdAt: now } }, 201, {
    "set-cookie": cookieHeader(token, SESSION_TTL_SECONDS)
  });
}

async function handleLogin(request, env) {
  const body = await readJson(request);
  const identifier = String(body.identifier || body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!identifier || !password) return json({ success: false, message: "Username yoki email va parolni kiriting." }, 400);

  const rateKey = await clientKey(request, "login:" + identifier);
  if (!await enforceRateLimit(env, rateKey, 10, 900)) {
    return json({ success: false, message: "Juda ko‘p urinish. 15 daqiqadan keyin qayta urinib ko‘ring." }, 429);
  }

  const user = await env.DB.prepare(
    "SELECT id, name, username, email, birthdate, age_band, password_hash, password_salt, password_iterations, created_at " +
    "FROM users WHERE email = ? OR username = ? LIMIT 1"
  ).bind(identifier, identifier).first();

  if (!user) return json({ success: false, message: "Email yoki parol noto‘g‘ri." }, 401);

  const calculated = await hashPassword(password, user.password_salt, user.password_iterations);
  if (!safeEqual(calculated.hash, user.password_hash)) {
    return json({ success: false, message: "Email yoki parol noto‘g‘ri." }, 401);
  }

  const token = await createSession(env, user.id);
  return json({ success: true, user: publicUser(user) }, 200, {
    "set-cookie": cookieHeader(token, SESSION_TTL_SECONDS)
  });
}

async function handleLogout(request, env) {
  const token = cookieValue(request, SESSION_COOKIE);
  if (token) {
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  }
  return json({ success: true }, 200, { "set-cookie": cookieHeader("", 0) });
}

async function handleData(request, env, user) {
  if (request.method === "GET") {
    const row = await env.DB.prepare(
      "SELECT data_json, updated_at FROM user_data WHERE user_id = ?"
    ).bind(user.id).first();
    let data = {};
    try { data = row ? JSON.parse(row.data_json) : {}; } catch { data = {}; }
    return json({ success: true, data, updatedAt: row ? row.updated_at : null });
  }

  if (request.method === "PUT") {
    const body = await readJson(request);
    if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
      return json({ success: false, message: "Ma’lumot formati noto‘g‘ri." }, 400);
    }
    const serialized = JSON.stringify(body.data);
    if (serialized.length > MAX_BODY_BYTES) return json({ success: false, message: "Ma’lumot hajmi juda katta." }, 413);
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO user_data (user_id, data_json, updated_at) VALUES (?, ?, ?) " +
      "ON CONFLICT(user_id) DO UPDATE SET data_json = excluded.data_json, updated_at = excluded.updated_at"
    ).bind(user.id, serialized, now).run();
    return json({ success: true, updatedAt: now });
  }

  return json({ success: false, message: "Method qo‘llab-quvvatlanmaydi." }, 405, { allow: "GET, PUT" });
}

export default {
  async fetch(request, env) {
    try {
      if (!env.DB) return json({ success: false, message: "D1 binding DB sozlanmagan." }, 500);
      if (!validateOrigin(request, env)) return json({ success: false, message: "Origin ruxsat etilmagan." }, 403);

      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "") || "/";

      if (request.method === "GET" && path === "/") {
        return json({ success: true, name: "SmartGoal API", version: "3.0.0", api: "/api/health" });
      }
      if (request.method === "GET" && path === "/api/health") {
        return json({ success: true, message: "SmartGoal API ishlayapti", version: "3.0.0" });
      }
      if (request.method === "POST" && path === "/api/register") return await handleRegister(request, env);
      if (request.method === "POST" && path === "/api/login") return await handleLogin(request, env);
      if (request.method === "POST" && path === "/api/logout") return await handleLogout(request, env);

      if (request.method === "GET" && path === "/api/me") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);
        return json({ success: true, user: publicUser(user) });
      }

      if (request.method === "GET" && path === "/api/users/search") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);

        const username = String(url.searchParams.get("username") || "")
          .trim().toLowerCase().replace(/^@/, "");
        if (!/^[a-z0-9_][a-z0-9_.]{2,19}$/.test(username)) {
          return json({ success: false, message: "Qidirish uchun kamida 3 ta belgi kiriting." }, 400);
        }

        const rateKey = await clientKey(request, "community-search");
        if (!await enforceRateLimit(env, rateKey, 30, 60)) {
          return json({ success: false, message: "Qidiruv juda tez takrorlandi. Biroz kuting." }, 429);
        }

        const result = await env.DB.prepare(
          "SELECT id, name, username FROM users " +
          "WHERE username LIKE ? COLLATE NOCASE " +
          "ORDER BY username COLLATE NOCASE LIMIT 10"
        ).bind(username + "%").all();

        return json({
          success: true,
          users: (result.results || []).map(item => ({
            id: item.id,
            name: item.name,
            username: item.username
          }))
        });
      }

      if (request.method === "GET" && path === "/api/friends") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);
        const incoming = await env.DB.prepare(
          "SELECT fr.id, u.name, u.username, fr.created_at AS createdAt " +
          "FROM friend_requests fr JOIN users u ON u.id = fr.sender_id " +
          "WHERE fr.receiver_id = ? AND fr.status = 'pending' ORDER BY fr.created_at DESC LIMIT 100"
        ).bind(user.id).all();
        const outgoing = await env.DB.prepare(
          "SELECT fr.id, u.name, u.username, fr.created_at AS createdAt " +
          "FROM friend_requests fr JOIN users u ON u.id = fr.receiver_id " +
          "WHERE fr.sender_id = ? AND fr.status = 'pending' ORDER BY fr.created_at DESC LIMIT 100"
        ).bind(user.id).all();
        const friends = await env.DB.prepare(
          "SELECT u.name, u.username, fr.updated_at AS since " +
          "FROM friend_requests fr JOIN users u ON u.id = CASE WHEN fr.sender_id = ? THEN fr.receiver_id ELSE fr.sender_id END " +
          "WHERE (fr.sender_id = ? OR fr.receiver_id = ?) AND fr.status = 'accepted' " +
          "ORDER BY fr.updated_at DESC LIMIT 200"
        ).bind(user.id, user.id, user.id).all();
        return json({
          success: true,
          incoming: incoming.results || [],
          outgoing: outgoing.results || [],
          friends: friends.results || []
        });
      }

      if (request.method === "POST" && path === "/api/friends/request") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);
        const body = await readJson(request);
        const targetId = String(body.userId || "");
        if (!targetId || targetId === user.id) return json({ success: false, message: "O‘zingizga so‘rov yubora olmaysiz." }, 400);
        const target = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(targetId).first();
        if (!target) return json({ success: false, message: "Foydalanuvchi topilmadi." }, 404);
        const existing = await env.DB.prepare(
          "SELECT id, status, sender_id, receiver_id FROM friend_requests " +
          "WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) LIMIT 1"
        ).bind(user.id, targetId, targetId, user.id).first();
        if (existing) {
          if (existing.status === "accepted") return json({ success: false, message: "Siz allaqachon do‘stsiz." }, 409);
          if (existing.status === "pending" && existing.sender_id === user.id) return json({ success: false, message: "So‘rov allaqachon yuborilgan." }, 409);
          if (existing.status === "pending" && existing.receiver_id === user.id) {
            await env.DB.prepare("UPDATE friend_requests SET status = 'accepted', updated_at = ? WHERE id = ?")
              .bind(new Date().toISOString(), existing.id).run();
            return json({ success: true, message: "Do‘stlik so‘rovi o‘zaro tasdiqlandi." });
          }
          await env.DB.prepare("DELETE FROM friend_requests WHERE id = ?").bind(existing.id).run();
        }
        const now = new Date().toISOString();
        await env.DB.prepare(
          "INSERT INTO friend_requests (id, sender_id, receiver_id, status, created_at, updated_at) VALUES (?, ?, ?, 'pending', ?, ?)"
        ).bind(crypto.randomUUID(), user.id, targetId, now, now).run();
        return json({ success: true, message: "Do‘stlik so‘rovi yuborildi." }, 201);
      }

      if (request.method === "POST" && path === "/api/friends/respond") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);
        const body = await readJson(request);
        const requestId = String(body.requestId || "");
        const decision = String(body.decision || "");
        if (!requestId || !["accept", "decline"].includes(decision)) {
          return json({ success: false, message: "So‘rov yoki amal noto‘g‘ri." }, 400);
        }
        const pending = await env.DB.prepare(
          "SELECT id FROM friend_requests WHERE id = ? AND receiver_id = ? AND status = 'pending'"
        ).bind(requestId, user.id).first();
        if (!pending) return json({ success: false, message: "Kutilayotgan so‘rov topilmadi." }, 404);
        if (decision === "accept") {
          await env.DB.prepare("UPDATE friend_requests SET status = 'accepted', updated_at = ? WHERE id = ?")
            .bind(new Date().toISOString(), requestId).run();
          return json({ success: true, message: "Do‘stlik so‘rovi qabul qilindi." });
        }
        await env.DB.prepare("DELETE FROM friend_requests WHERE id = ?").bind(requestId).run();
        return json({ success: true, message: "Do‘stlik so‘rovi rad etildi." });
      }

      if (path === "/api/data") {
        const user = await authenticatedUser(request, env);
        if (!user) return json({ success: false, message: "Avtorizatsiya talab qilinadi." }, 401);
        return await handleData(request, env, user);
      }

      return json({ success: false, message: "API endpoint topilmadi." }, 404);
    } catch (error) {
      console.error("SmartGoal API error:", error);
      return json({ success: false, message: "Serverda xatolik yuz berdi." }, 500);
    }
  }
};
