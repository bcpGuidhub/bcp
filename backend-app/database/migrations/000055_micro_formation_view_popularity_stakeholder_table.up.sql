CREATE TABLE IF NOT EXISTS micro_formation_view_popularity_stakeholder (
  micro_formation_view_popularity_stakeholder_id uuid DEFAULT uuid_generate_v4(),
  micro_formation_id uuid NOT NULL,
  stakeholder_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (micro_formation_view_popularity_stakeholder_id),
  FOREIGN KEY (micro_formation_id) REFERENCES micro_formation(micro_formation_id),
  FOREIGN KEY (stakeholder_id) REFERENCES project_stakeholder(project_stakeholder_id) ON DELETE CASCADE
);
ALTER TABLE micro_formation_view_popularity_stakeholder 
ADD CONSTRAINT unique_micro_formation_view_popularity_stakeholder
UNIQUE(stakeholder_id, micro_formation_id);
