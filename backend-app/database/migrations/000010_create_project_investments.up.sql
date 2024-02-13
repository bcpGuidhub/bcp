CREATE TABLE IF NOT EXISTS project_investments(
  project_investment_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,  
  investment_type TEXT,
  investment_name TEXT,
  investment_amount_tax_included TEXT,
  year_of_purchase TEXT,
  month_of_purchase TEXT,
  duration TEXT,
  vat_rate_on_investment TEXT,
  contribution TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_investment_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
