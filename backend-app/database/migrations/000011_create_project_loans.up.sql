CREATE TABLE IF NOT EXISTS project_loans(
  project_loans_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,  
  bank_loan_name TEXT,
  year_of_loan_disbursement TEXT,
  month_of_loan_disbursement TEXT,
  loan_rate TEXT,
	loan_duration TEXT,
	amount_monthly_payments TEXT,
	type_of_external_fund  TEXT,
	amount_loan TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_loans_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
