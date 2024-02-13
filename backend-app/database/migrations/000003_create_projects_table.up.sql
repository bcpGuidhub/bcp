CREATE TABLE IF NOT EXISTS projects(
  project_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  project_name TEXT NOT NULL,
  type_project TEXT NOT NULL,
  searchable_address TEXT NOT NULL, 
  activity_sector TEXT NOT NULL, 
  project_advancement_stage TEXT NOT NULL,
  expected_turnover TEXT NOT NULL,
  hiring BOOLEAN NOT NULL,
  project_budget TEXT NOT NULL,
  personal_contributions_budget TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP, 
  deleted_at TIMESTAMP, 
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
