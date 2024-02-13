package database

import (
	"testing"

	_ "github.com/lib/pq"
)

func TestConnect(t *testing.T) {
	_, err := ConnectPostgres()
	if err != nil {
		t.Errorf("Failed to open db: %s", err.Error())
	}
}
