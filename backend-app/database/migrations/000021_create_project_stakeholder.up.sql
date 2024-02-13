CREATE TABLE IF NOT EXISTS project_stakeholder(
  project_stakeholder_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,  
  first_name   TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email   TEXT NOT NULL,
  role TEXT NOT NULL,
  role_details TEXT NOT NULL,
  status INT NOT NULL, 
  otp TEXT,
  password TEXT ,
  log_in_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_stakeholder_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

