# goravel-crud懒人扩展包
### goravel gopher 实用的懒人API生成工具，告别996
#### 懒人面板
<p align="center">
  <img src="https://github.com/hulutech-web/goravel-crud/blob/master/images/preview.png?raw=true" width="750" />
</p>

#### 安装:clone该扩展包,放入packages/目录下
``git clone git@github.com:hulutech-web/goravel-crud.git``

#### 安装依赖
``go get -u github.com/hulutech-web/http_result``  
``go install github.com/swaggo/swag/cmd/swag@latest``  
``go get -u github.com/swaggo/http-swagger``  
``go mod tidy``
#### 注册服务
```go
import	crud "goravel/packages/goravel-crud"

func init() {
"providers": []foundation.ServiceProvider{
	....
	&crud.ServiceProvider{},
 }
}

```
#### 常用功能，一键生成
- 模型
- 控制器
- 路由
- 验证request
- 迁移文件，migration


#### API swag接口文件，默认支持swag 前端对接更省事,项目二阶段将出前端脚手架的API对接面板，方便管理API接口

#### 路由说明
api路由应该有如下结构，如需定制，请完成代码生成后自行修改：
```go
facades.Route().Prefix("/api").Group(func(router route.Router) {
		
})
```
路由地址  
``goravel-crud/routes/crud.go``
- 通过发送请求执行自动化命令，post请求地址，路由：``curd/entity_all ``
```json
{
  "name": "user" //模型的名字
}
```
- 将发生如下事情
  - 自动生成模型
  - 自动生成迁移文件
  - 自动生成控制器（index,store,show,update,destroy,list,option)7个方法，非常方便
  - 自动生成路由
  - 自动生成验证器

- 你只需要
  - 完善模型字段
  - 完善迁移文件
  - 完善验证文件字段
  - 完善控制器操作字段
  - 执行命令 ``go run . artisan migrate``
  - swag路由 ``swag init``

#### 其他路由
```go
router.Prefix("/crud").Group(func(r route.Router) {
		ctrl := controller.NewCRUDController()
		// 1-生成迁移文件
		r.Post("migration_make", ctrl.Migration)

		//	2-生成模型
		r.Post("model_make", ctrl.Model)

		//  3-路由
		r.Post("router_make", ctrl.Router)

		//	4-控制器(包含了index store show update destroy list option)
		r.Post("controller_make", ctrl.Controller)

		// 5-请求验证
		r.Post("request_make", ctrl.Request)

		// 1-5全部
		r.Post("entity_all", ctrl.All)
	})
```
#### 懒人控制器方法一览，如下方法将自动生成
```go
package controllers

import (
  "github.com/goravel/framework/contracts/http"
  "github.com/goravel/framework/facades"
  httpfacade "github.com/hulutech-web/http_result"
  "goravel/app/http/requests"
  "goravel/app/models"
)

type UserController struct {
  //Dependent services
}

func NewUserController() *UserController {
  return &UserController{
    //Inject services
  }
}

// Index 分页查询，支持搜索，路由参数?name=xxx&pageSize=1&currentPage=1&sort=xxx&order=xxx,等其他任意的查询参数
// @Summary      分页查询
// @Description  分页查询
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserIndex
// @Security ApiKeyAuth
// @Param Authorization header string false "Bearer 用户令牌"
// @Param  name  query  string  false  "name"
// @Param  pageSize  query  string  false  "pageSize"
// @Param  currentPage  query  string  false  "currentPage"
// @Param  sort  query  string  false  "sort"
// @Param  order  query  string  false  "order"
// @Success 200 {string} json {}
// @Router       /api/user [get]
func (r *UserController) Index(ctx http.Context) http.Response {
  users := []models.User{}
  queries := ctx.Request().Queries()
  res, err := httpfacade.NewResult(ctx).SearchByParams(queries, nil).ResultPagination(&users)
  if err != nil {
    return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, "", err.Error())
  }
  return res
}

// List 列表查询
// @Summary      列表查询
// @Description  列表查询
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserList
// @Security ApiKeyAuth
// @Param Authorization header string false "Bearer 用户令牌"
// @Success 200 {string} json {}
// @Router       /api/user/list [get]
func (r *UserController) List(ctx http.Context) http.Response {
  users := []models.User{}
  queries := ctx.Request().Queries()
  return httpfacade.NewResult(ctx).SearchByParams(queries, nil).Success("", users)
}
func (r *UserController) Show(ctx http.Context) http.Response {
  id := ctx.Request().RouteInt("id")
  user := models.User{}
  facades.Orm().Query().Model(&models.User{}).Where("id = ?", id).First(&user)
  return httpfacade.NewResult(ctx).Success("", user)
}

// Store 新增
// @Summary      新增
// @Description  新增
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserStore
// @Security ApiKeyAuth
// @Param Authorization header string false "Bearer 用户令牌"
// @Param userData body requests.UserRequest true "用户数据"
// @Success 200 {string} json {}
// @Router       /api/admin/user [post]
func (r *UserController) Store(ctx http.Context) http.Response {
  var userRequest requests.UserRequest
  errors, err := ctx.Request().ValidateRequest(&userRequest)
  if err != nil {
    return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, "数据错误", err.Error())
  }
  if errors != nil {
    return httpfacade.NewResult(ctx).ValidError("", errors.All())
  }
  user := models.User{}
  //todo add request values
  facades.Orm().Query().Model(&models.User{}).Create(&user)
  return httpfacade.NewResult(ctx).Success("创建成功", nil)
}

// Update
// @Summary      更新
// @Description  更新
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserUpdate
// @Security ApiKeyAuth
// @Param Authorization header string false "Bearer 用户令牌"
// @Param userData body requests.UserRequest true "用户数据"
// @Success 200 {string} json {}
// @Router       /api/admin/user/{id} [put]
func (r *UserController) Update(ctx http.Context) http.Response {
  id := ctx.Request().Route("id")
  user := models.User{}
  facades.Orm().Query().Model(&models.User{}).Where("id=?", id).Find(&user)
  var userRequest requests.UserRequest
  errors, err := ctx.Request().ValidateRequest(&userRequest)
  if err != nil {
    return httpfacade.NewResult(ctx).Error(http.StatusInternalServerError, "数据错误", err.Error())
  }
  if errors != nil {
    return httpfacade.NewResult(ctx).ValidError("", errors.All())
  }
  //todo add request values
  facades.Orm().Query().Model(&models.User{}).Where("id=?", id).Save(&user)
  return httpfacade.NewResult(ctx).Success("修改成功", nil)
}

// Destroy 删除
// @Summary      删除
// @Description  删除
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserDestroy
// @Security ApiKeyAuth
// @Success 200 {string} json {}
// @Router       /api/admin/user/{id} [delete]
func (r *UserController) Destroy(ctx http.Context) http.Response {
  id := ctx.Request().Route("id")
  facades.Orm().Query().Model(&models.User{}).Delete(&models.User{}, id)
  return httpfacade.NewResult(ctx).Success("删除成功", nil)
}

// Option 选项
// @Summary      选项
// @Description  选项
// @Tags         UserController
// @Accept       json
// @Produce      json
// @Id UserOption
// @Security ApiKeyAuth
// @Success 200 {string} json {}
// @Router       /api/admin/user/option [get]
func (r *UserController) Option(ctx http.Context) http.Response {
  users := []models.User{}
  queries := ctx.Request().Queries()
  res, _ := httpfacade.NewResult(ctx).SearchByParams(queries, nil).List(&users)
  return res
}
```