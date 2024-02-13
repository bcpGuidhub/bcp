BEGIN;

ALTER TABLE projects DROP COLUMN status;
DROP TYPE enum_project_status;

COMMIT;