package routes

import (
	"github.com/goravel/framework/contracts/foundation"
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/route"
	"goravel/packages/goravel-crud/controller"
)

func CRUD(app foundation.Application) {
	router := app.MakeRoute()

	//操作面板面板静态资源路由
	router.Static("/panel", "./public/panel")

	//操作面板
	router.Get("/panel", func(ctx http.Context) http.Response {
		return ctx.Response().View().Make("panel.html")
	})

	router.Prefix("/crud").Group(func(r route.Router) {
		ctrl := controller.NewCRUDController()
		//migration_crt
		r.Post("migration_make", ctrl.Migration)

		//	模型
		r.Post("model_make", ctrl.Model)

		//  路由
		r.Post("router_make", ctrl.Router)

		//	控制器(包含了index store show update destroy list option)
		r.Post("controller_make", ctrl.Controller)

		// 请求
		r.Post("request_make", ctrl.Request)

		r.Post("entity_all", ctrl.All)
	})

	// swagger
	swaggerController := controller.NewSwaggerController()
	router.Get("/swagger/*any", swaggerController.Index)

}
