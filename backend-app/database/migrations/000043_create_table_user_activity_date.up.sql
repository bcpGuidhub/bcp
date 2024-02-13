CREATE TABLE IF NOT EXISTS user_activity_date(
  user_activity_date_id uuid DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  access_count INT,
  access_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (user_activity_date_id),
  FOREIGN KEY (user_id) REFERENCES user_activity (user_id) ON DELETE CASCADE
);

