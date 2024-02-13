CREATE TABLE IF NOT EXISTS micro_formation_view_count (
  micro_formation_view_count_id uuid DEFAULT uuid_generate_v4(),
  view_count integer NOT NULL,
  micro_formation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (micro_formation_view_count_id),
  FOREIGN KEY (micro_formation_id) REFERENCES micro_formation(micro_formation_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
ALTER TABLE micro_formation_view_count 
ADD CONSTRAINT unique_micro_formation_view_count
UNIQUE(user_id, micro_formation_id);

