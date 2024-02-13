package helpers

import (
	"crypto/sha256"
	"fmt"
	"time"
)

func GenerateToken(id string, ti time.Time) string {
	val := fmt.Sprintf("%s%s", id, ti.String())
	sum := sha256.Sum256([]byte(val))
	return fmt.Sprintf("%x", sum)
}
