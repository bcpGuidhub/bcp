CREATE TABLE IF NOT EXISTS project_director_renumeration_year(
  project_director_renumeration_year_id uuid DEFAULT uuid_generate_v4(),
  project_directors_id uuid NOT NULL,
  year TEXT NOT NULL,
  month_1_amount TEXT NOT NULL,
  month_2_amount TEXT NOT NULL,
  month_3_amount TEXT NOT NULL,
  month_4_amount TEXT NOT NULL,
  month_5_amount TEXT NOT NULL,
  month_6_amount TEXT NOT NULL,
  month_7_amount TEXT NOT NULL,
  month_8_amount TEXT NOT NULL,
  month_9_amount TEXT NOT NULL,
  month_10_amount TEXT NOT NULL,
  month_11_amount TEXT NOT NULL,
  month_12_amount TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (project_director_renumeration_year_id),
  FOREIGN KEY (project_directors_id) REFERENCES project_directors(project_directors_id) ON DELETE CASCADE
);




