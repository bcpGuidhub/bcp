BEGIN;
ALTER TABLE project_guide_landmarks DROP COLUMN status;
DROP TYPE enum_guide_landmark_status;
COMMIT;
DROP TABLE IF EXISTS project_guide_landmarks;

