CREATE TABLE IF NOT EXISTS project_guides(
  project_guide_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_guide_id),
  FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);
BEGIN;

DROP TYPE IF EXISTS enum_guide_status;
CREATE TYPE enum_guide_status AS ENUM (
	'paused',
	'running',
	'closed',
  'finished'
);
ALTER TABLE project_guides ADD COLUMN status enum_guide_status;
COMMIT;
