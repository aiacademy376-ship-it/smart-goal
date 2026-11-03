CREATE TABLE IF NOT EXISTS friend_requests (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK(status IN ('pending','accepted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK(sender_id <> receiver_id),
  UNIQUE(sender_id, receiver_id)
);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver_status
  ON friend_requests(receiver_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender_status
  ON friend_requests(sender_id, status, created_at);
