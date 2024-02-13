CREATE TABLE IF NOT EXISTS user_feedback_question_answer (
  user_feedback_question_answer_id uuid DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  user_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (user_feedback_question_answer_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
ALTER TABLE user_feedback_question_answer 
ADD CONSTRAINT unique_user_feedback
UNIQUE(user_id, type, label, question);
