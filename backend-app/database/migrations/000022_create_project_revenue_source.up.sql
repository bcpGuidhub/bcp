CREATE TABLE IF NOT EXISTS project_revenue_sources(
  project_revenue_sources_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,  
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  amount_excluding_taxes TEXT NOT NULL,
  year TEXT NOT NULL,
  month TEXT NOT NULL,
  vat_rate TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_revenue_sources_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);


