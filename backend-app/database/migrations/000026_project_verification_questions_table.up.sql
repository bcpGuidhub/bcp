CREATE TABLE IF NOT EXISTS project_verification_questions (
  project_verification_questions_id uuid DEFAULT uuid_generate_v4(),
  project_verification_id uuid NOT NULL,
  label TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_verification_questions_id),
  FOREIGN KEY (project_verification_id) REFERENCES project_verifications(project_verifications_id) ON DELETE CASCADE
);


