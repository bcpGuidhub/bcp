CREATE TABLE IF NOT EXISTS guides_case_study (
  guide_id uuid NOT NULL,
	project_id uuid NOT NULL,
  cases TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (guide_id),
  FOREIGN KEY (guide_id) REFERENCES project_guides(project_guide_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);

