CREATE TABLE IF NOT EXISTS micro_formation_view_popularity (
  micro_formation_view_popularity_id uuid DEFAULT uuid_generate_v4(),
  micro_formation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (micro_formation_view_popularity_id),
  FOREIGN KEY (micro_formation_id) REFERENCES micro_formation(micro_formation_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
ALTER TABLE micro_formation_view_popularity 
ADD CONSTRAINT unique_micro_formation_view_popularity
UNIQUE(user_id, micro_formation_id);

