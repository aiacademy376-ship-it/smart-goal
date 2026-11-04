ALTER TABLE users ADD COLUMN xp_balance INTEGER NOT NULL DEFAULT 0;

UPDATE users
SET xp_balance = COALESCE(
  (SELECT CAST(json_extract(data_json, '$.xp') AS INTEGER)
   FROM user_data WHERE user_id = users.id),
  0
);

CREATE TABLE IF NOT EXISTS xp_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  xp INTEGER NOT NULL CHECK(xp BETWEEN 0 AND 15),
  award_date TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_day
  ON xp_ledger(user_id, award_date);
