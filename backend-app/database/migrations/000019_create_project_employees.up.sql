CREATE TABLE IF NOT EXISTS project_employees(
  project_employees_id uuid DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  post TEXT NOT NULL,
  salary_brute_year_1 TEXT NOT NULL,
  salary_brute_year_2 TEXT NOT NULL,
  salary_brute_year_3 TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  contract_duration TEXT NOT NULL,
  gross_monthly_remuneration TEXT NOT NULL,
  year_of_hire TEXT NOT NULL,
  date_of_hire TEXT NOT NULL,  
  net_monthly_remuneration TEXT,
  employer_contributions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_employees_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);


