BEGIN;

DROP TYPE IF EXISTS enum_project_status;
CREATE TYPE enum_project_status AS ENUM (
	'registered',
	'pending',
	'closed'
);
ALTER TABLE projects ADD COLUMN status enum_project_status;

COMMIT;