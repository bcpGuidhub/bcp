BEGIN;
ALTER TABLE project_guides DROP COLUMN status;
DROP TYPE enum_guide_status;
COMMIT;

DROP TABLE IF EXISTS project_guides;
