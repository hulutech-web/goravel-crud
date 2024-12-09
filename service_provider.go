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
	app.Publishes("./packages/crud", map[string]string{
		"panel.html": app.BasePath("resources/views/panel.html"),
		"assets":     app.PublicPath("panel/assets"),
	})
}
