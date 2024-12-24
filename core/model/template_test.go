package model

import (
	"testing"
)

func TestGenTemplate(t *testing.T) {
	modelName := "TestModel"
	expectedTemplate := `
package models

import (
	"github.com/goravel/framework/database/orm"
)

type TestModel struct {
	orm.Model
	orm.SoftDeletes
}

`
	// Generate the template
	template := GenTemplate(modelName)

	// Check if the generated template matches the expected template
	if template != expectedTemplate {
		t.Errorf("Expected template:\n%s\nGot:\n%s", expectedTemplate, template)
	}
} 