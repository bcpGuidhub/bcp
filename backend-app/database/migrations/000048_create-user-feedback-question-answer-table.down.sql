ALTER TABLE user_feedback_question_answer
DROP CONSTRAINT IF EXISTS unique_user_feedback,
DROP TABLE IF EXISTS user_feedback_question_answer;
