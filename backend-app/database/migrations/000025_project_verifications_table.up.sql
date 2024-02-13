CREATE TABLE IF NOT EXISTS project_verifications (
  project_verifications_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  label TEXT NOT NULL,
  visible BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_verifications_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

