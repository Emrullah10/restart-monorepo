CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  recycle BOOLEAN NOT NULL DEFAULT true,
  marketplace BOOLEAN NOT NULL DEFAULT true,
  rewards BOOLEAN NOT NULL DEFAULT true,
  system BOOLEAN NOT NULL DEFAULT true
);
