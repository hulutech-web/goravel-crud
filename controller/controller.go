package controller

import (
	"fmt"
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
	httpfacade "github.com/hulutech-web/http_result"
	"goravel/packages/goravel-crud/core/controller"
	"goravel/packages/goravel-crud/core/curd_orm"
	"goravel/packages/goravel-crud/core/migration"
	"goravel/packages/goravel-crud/core/model"
	"goravel/packages/goravel-crud/core/request"
	"goravel/packages/goravel-crud/core/router"
	"strings"
)

type CRUDController struct {
	//Dependent services
}

func NewCRUDController() *CRUDController {
	return &CRUDController{
		//Inject services
	}
}

func capitalizeFirstLetter(s string) string {
	if len(s) == 0 {
		return s
	}
	return strings.ToUpper(string(s[0])) + s[1:]
}
func (r *CRUDController) Model(ctx http.Context) http.Response {
	name := capitalizeFirstLetter(ctx.Request().Input("name"))
	//首字母转大写

	err := model.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("模型生成成功", nil)
}

func (r *CRUDController) Controller(ctx http.Context) http.Response {
	name := capitalizeFirstLetter(ctx.Request().Input("name"))
	err := controller.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("控制器生成成功", nil)
}

func (r *CRUDController) Migration(ctx http.Context) http.Response {
	name := ctx.Request().Input("name")
	err := migration.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("迁移文件生成成功", nil)
}

func (r *CRUDController) Request(ctx http.Context) http.Response {
	name := capitalizeFirstLetter(ctx.Request().Input("name"))
	err := request.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("请求生成成功", nil)
}

func (r *CRUDController) Router(ctx http.Context) http.Response {
	name := capitalizeFirstLetter(ctx.Request().Input("name"))
	err := router.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("路由生成成功", nil)
}

func (r *CRUDController) All(ctx http.Context) http.Response {
	name := ctx.Request().Input("name")
	upper_name := capitalizeFirstLetter(name)
	err := model.Gen(upper_name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), err.Error())
	}

	err = migration.Gen(name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), err.Error())
	}

	err = request.Gen(upper_name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), err.Error())
	}

	err = controller.Gen(upper_name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), err.Error())
	}

	err = router.Gen(upper_name)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), err.Error())
	}

	return httpfacade.NewResult(ctx).Success("生成成功", nil)
}

func (r *CRUDController) Tables(ctx http.Context) http.Response {
	tbs := curd_orm.TableDefine()
	return httpfacade.NewResult(ctx).Success("", tbs)
}

func (r *CRUDController) TableColumn(ctx http.Context) http.Response {
	tbname := ctx.Request().Input("table_name")
	tbs := curd_orm.TableSchema(tbname)
	return httpfacade.NewResult(ctx).Success("", tbs)
}

func (r *CRUDController) Migrate(ctx http.Context) http.Response {
	sql := ctx.Request().Input("sql")
	tablename := ctx.Request().Input("tablename")
	//删除该表
	delTableSql := fmt.Sprintf("drop table %s", tablename)
	facades.Orm().Query().Exec(delTableSql)
	err := curd_orm.GenSql(sql)
	if err != nil {
		return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, err.Error(), nil)
	}
	return httpfacade.NewResult(ctx).Success("建表成功", nil)
}
