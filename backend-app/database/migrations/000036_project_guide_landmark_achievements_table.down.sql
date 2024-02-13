BEGIN;
ALTER TABLE project_guide_landmark_achievements DROP COLUMN status;
DROP TYPE enum_guide_landmark_achievement_status;
COMMIT;
DROP TABLE IF EXISTS project_guide_landmark_achievements;

