package goravel_crud

import (
	"github.com/goravel/framework/contracts/foundation"
	"goravel/packages/goravel-crud/routes"
)

const Binding = "crud"

var App foundation.Application

type ServiceProvider struct {
}

func (receiver *ServiceProvider) Register(app foundation.Application) {
	App = app

	app.Bind(Binding, func(app foundation.Application) (any, error) {
		return nil, nil
	})
}

func (receiver *ServiceProvider) Boot(app foundation.Application) {
	routes.CRUD(app)
	app.Publishes("./packages/goravel-crud", map[string]string{
		"config/crud.go":        app.ConfigPath(""),
		"routes/crud_api.go":    app.BasePath("routes"),
		"panel/dist":            app.PublicPath("dist"),
		"panel/dist/index.html": app.BasePath("resources/views/index.html"),
	})
}
