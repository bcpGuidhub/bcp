CREATE TABLE IF NOT EXISTS stakeholder_tokens (
  project_stakeholder_id uuid NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (project_stakeholder_id),
  CONSTRAINT fk_project_stakeholder_id FOREIGN KEY (project_stakeholder_id) REFERENCES project_stakeholder (project_stakeholder_id) ON DELETE CASCADE
);