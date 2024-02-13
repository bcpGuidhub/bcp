CREATE TABLE IF NOT EXISTS project_directors(
  project_directors_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  percentage_equity_capital TEXT NOT NULL,
  director_acre TEXT NOT NULL,
  compensation_partition TEXT NOT NULL,
  net_compensation_year_1 TEXT NOT NULL,
  net_compensation_year_2 TEXT NOT NULL,
  net_compensation_year_3 TEXT NOT NULL,
  cotisations_sociales_year_1 TEXT,
  cotisations_sociales_year_2 TEXT,
  cotisations_sociales_year_3 TEXT,
  processing_cotisations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_directors_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

