package controller

import (
	"testing"
)

func TestGenTemplate(t *testing.T) {
	modelName := "TestModel"
	template := GenTemplate(modelName)
	if template == "" {
		t.Error("Expected non-empty template")
	}
} 