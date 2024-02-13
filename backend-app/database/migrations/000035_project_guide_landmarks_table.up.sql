CREATE TABLE IF NOT EXISTS project_guide_landmarks (
  project_guide_landmarks_id uuid DEFAULT uuid_generate_v4(),
  project_guide_id uuid NOT NULL,
	project_id uuid NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_guide_landmarks_id),
  FOREIGN KEY (project_guide_id) REFERENCES project_guides(project_guide_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);
BEGIN;
DROP TYPE IF EXISTS enum_guide_landmark_status;
CREATE TYPE enum_guide_landmark_status AS ENUM (
	'running',
  'finished'
);
ALTER TABLE project_guide_landmarks ADD COLUMN status enum_guide_landmark_status;
COMMIT;
