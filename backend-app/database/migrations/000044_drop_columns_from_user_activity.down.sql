ALTER TABLE user_activity
ADD COLUMN resource_name TEXT,
ADD COLUMN resource_id uuid,
ADD COLUMN message TEXT,
ADD COLUMN event TEXT;

