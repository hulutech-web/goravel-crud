package controller

func Gen(modelName string) error {
	template := GenTemplate(modelName)
	err := CopyToCtrlPath(modelName, template)
	return err
}
