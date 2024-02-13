ALTER TABLE project_guide_landmarks 
ADD CONSTRAINT unique_landmark_on_guide
UNIQUE(project_guide_id, project_id, label);
