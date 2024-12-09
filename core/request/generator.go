package request

func Gen(modelName string) error {
	template := GenTemplate(modelName)
	err := CopyToRequestPath(modelName, template)
	return err
}
