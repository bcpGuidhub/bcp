CREATE TABLE IF NOT EXISTS user_profile_image(
  user_id uuid NOT NULL,
  content_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  bucket TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

