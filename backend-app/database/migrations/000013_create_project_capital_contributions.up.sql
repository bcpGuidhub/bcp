CREATE TABLE IF NOT EXISTS project_capital_contributions(
  project_capital_contributions_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  type_capital_contribution TEXT NOT NULL,
  contribution_amount TEXT NOT NULL,
  year_of_contribution TEXT NOT NULL,
  month_of_contribution TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_capital_contributions_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
