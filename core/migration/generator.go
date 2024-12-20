package migration

func Gen(modelName string) error {
	GenTemplate(modelName)
	return nil
}
