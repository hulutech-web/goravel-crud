package routes

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/route"
	"github.com/goravel/framework/facades"
)

func CrudApi() {
	jwt_middleware_cbk := facades.Config().Get("crud.middleware").(func() http.Middleware)
	prefix := facades.Config().Get("crud.prefix").(string)
	facades.Route().Middleware(jwt_middleware_cbk()).Prefix(prefix).Group(func(router route.Router) {
	})
}
