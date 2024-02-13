package database

import (
	"testing"

	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func TestSync(t *testing.T) {
	// Run migrations
	if ok := Sync("./migrations"); ok != nil {
		t.Errorf("Failed to run migration: %s", ok.Error())
	}
}
