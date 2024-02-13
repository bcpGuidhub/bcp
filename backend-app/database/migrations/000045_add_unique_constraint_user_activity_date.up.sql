ALTER TABLE user_activity_date 
ADD CONSTRAINT unique_user_access_date
UNIQUE(user_id, access_date);
