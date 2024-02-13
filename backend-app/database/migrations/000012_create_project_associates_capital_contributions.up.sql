CREATE TABLE IF NOT EXISTS project_associates_capital_contributions(
  project_associates_capital_contributions_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,  
  type_of_operation TEXT,
  year_of_contribution_repayment TEXT,
  month_of_contribution_repayment TEXT,
	associate_capital_contribution_amount TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_associates_capital_contributions_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
