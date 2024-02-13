CREATE TABLE IF NOT EXISTS user_activity(
  user_id uuid NOT NULL,
  resource_name TEXT NOT NULL,
  resource_id uuid NOT NULL,
  message TEXT NOT NULL,
  event TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

