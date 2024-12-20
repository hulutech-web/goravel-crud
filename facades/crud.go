package facades

import (
	"log"

	"goravel/packages/goravel-crud/contracts"
)

func Crud() contracts.Crud {
	instance, err := crud.App.Make(crud.Binding)
	if err != nil {
		log.Println(err)
		return nil
	}

	return instance.(contracts.Crud)
}
