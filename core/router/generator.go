package router

func Gen(modelName string) error {
	template := GenTemplate(modelName)
	err := CopyToRoutePath(modelName, template)
	return err
}
