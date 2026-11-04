PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
 email TEXT NOT NULL COLLATE NOCASE UNIQUE,
 birthdate TEXT NOT NULL,
 age_band TEXT NOT NULL CHECK(age_band IN ('13_15','16_17','adult')),
 password_hash TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','deleted')),
 terms_accepted_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
 id_hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL,
 ip_hash TEXT,
 user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS rate_limits (
 key TEXT PRIMARY KEY,
 window_started_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS goals (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 160),
 description TEXT NOT NULL DEFAULT '',
 category TEXT NOT NULL DEFAULT 'personal',
 target_date TEXT,
 progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','archived')),
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS tasks (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 goal_id TEXT REFERENCES goals(id) ON DELETE SET NULL,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 160),
 due_date TEXT,
 priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low','medium','high')),
 completed_at INTEGER,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id, due_date);

CREATE TABLE IF NOT EXISTS habits (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 120),
 frequency TEXT NOT NULL DEFAULT 'daily',
 color TEXT NOT NULL DEFAULT 'violet',
 archived_at INTEGER,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS habit_logs (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
 log_date TEXT NOT NULL,
 completed INTEGER NOT NULL DEFAULT 1 CHECK(completed IN (0,1)),
 created_at INTEGER NOT NULL,
 UNIQUE(habit_id, log_date)
);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user ON habit_logs(user_id, log_date DESC);

CREATE TABLE IF NOT EXISTS user_settings (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 language TEXT NOT NULL DEFAULT 'uz' CHECK(language IN ('uz','ru','en')),
 theme TEXT NOT NULL DEFAULT 'system' CHECK(theme IN ('light','dark','system')),
 sound_enabled INTEGER NOT NULL DEFAULT 0 CHECK(sound_enabled IN (0,1)),
 motion_enabled INTEGER NOT NULL DEFAULT 1 CHECK(motion_enabled IN (0,1)),
 reminders_enabled INTEGER NOT NULL DEFAULT 0 CHECK(reminders_enabled IN (0,1)),
 updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 body TEXT NOT NULL DEFAULT '',
 kind TEXT NOT NULL DEFAULT 'system',
 read_at INTEGER,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS achievements (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 achievement_key TEXT NOT NULL,
 unlocked_at INTEGER NOT NULL,
 UNIQUE(user_id, achievement_key)
);

CREATE TABLE IF NOT EXISTS reward_points (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 delta INTEGER NOT NULL,
 reason TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reward_points_user ON reward_points(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY,
 user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
 event_type TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at DESC);