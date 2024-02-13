CREATE TABLE IF NOT EXISTS project_finance_capacity (
  project_id uuid NOT NULL,  
  declarations TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_id),
  CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

