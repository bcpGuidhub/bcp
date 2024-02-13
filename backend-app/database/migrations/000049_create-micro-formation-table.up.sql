CREATE TABLE IF NOT EXISTS micro_formation (
  micro_formation_id uuid DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (micro_formation_id)
);
ALTER TABLE micro_formation 
ADD CONSTRAINT unique_micro_formation
UNIQUE(title, category);

