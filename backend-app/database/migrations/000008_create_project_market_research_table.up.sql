CREATE TABLE IF NOT EXISTS project_market_researches(
  project_id uuid NOT NULL,  
  market_characteristics TEXT,
  target_market  TEXT,
  principal_competition TEXT,
  service_description TEXT,
  product_strong_weak_points TEXT,
  commercial_process TEXT, 
  trademark_protection TEXT,
  business_placement TEXT,
  supply_chain TEXT,
  communication_strategy TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_id),
  CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects (project_id) ON DELETE CASCADE
);
