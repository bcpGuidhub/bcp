CREATE TABLE IF NOT EXISTS project_services(
  project_services_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  meta_label TEXT[] NOT NULL,
  meta_description TEXT, 
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP, 
  deleted_at TIMESTAMP, 
  CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

