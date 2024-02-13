BEGIN;

DROP TYPE IF EXISTS enum_status;
CREATE TYPE enum_status AS ENUM (
	'live',
	'pending_otp_validation',
	'closed'
);
ALTER TABLE users ADD COLUMN status enum_status;

COMMIT;