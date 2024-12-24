package model

import (
	"fmt"
)

func Gen(modelName string) error {
	template := GenTemplate(modelName)
	err := CopyToModelPath(modelName, template)
	if err != nil {
		return fmt.Errorf("failed to copy to model path: %w", err)
	}
	return nil
}
