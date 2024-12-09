package model

func Gen(modelName string) error {
	template := GenTemplate(modelName)
	err := CopyToModelPath(modelName, template)
	return err
}
