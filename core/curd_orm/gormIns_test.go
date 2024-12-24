package curd_orm

import (
	"testing"
)

func TestBootMS(t *testing.T) {
	db := BootMS()
	if db == nil {
		t.Error("Expected a valid database instance")
	}
} 