package database

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/golang-migrate/migrate"
	"github.com/golang-migrate/migrate/database/postgres"
	// "github.com/golang-migrate/migrate/v4"
	// "github.com/golang-migrate/migrate/v4/database/postgres"
)

const (
	seedFile       = "../database/seeds/db.sql"
	migrationsFile = "../database/migrations"
)

// SeedDB seeds the test database
func SeedDB(db *sql.DB) error {
	err := dropTables(db, migrationsFile)
	if err != nil {
		return err
	}
	ok := Sync(migrationsFile)
	if ok != nil {
		return ok
	}
	errOk := seed(db, seedFile)
	if errOk != nil {
		return errOk
	}
	return nil
}

// dropTables runs migrations to update remote database.
func dropTables(db *sql.DB, file string) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s", file),
		"postgres", driver)

	if err != nil {
		return err
	}
	if err := m.Drop(); err != nil && err != migrate.ErrNoChange {
		return err
	}
	return nil
}

// seed the test database with the
// given sql file.
func seed(db *sql.DB, file string) error {
	s, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}
	lines := strings.Split(string(s), ";")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if _, err := db.Exec(line); err != nil {
			fmt.Println(line)
			return err
		}
	}
	return nil
}
