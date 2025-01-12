# goravel-crud懒人扩展包
### goravel gopher 实用的懒人API生成工具，告别996，效率提升10倍
#### 懒人面板
<p align="center">
  <img src="https://github.com/hulutech-web/goravel-crud/blob/master/images/preview.jpg?raw=true" width="300" />
</p>

#### 安装:clone该扩展包,放入packages/目录下

``git clone git@github.com:hulutech-web/goravel-crud.git && rm -rf .git``

#### 1. 安装依赖
``go get -u github.com/hulutech-web/http_result``  
``go install github.com/swaggo/swag/cmd/swag@latest``  
``go get -u github.com/swaggo/http-swagger``  
``go mod tidy``  
``swag init ``

##### 1.1 注册服务
```go
import	crud "goravel/packages/goravel-crud"

func init() {
"providers": []foundation.ServiceProvider{
	....
	&crud.ServiceProvider{},
 }
}

```
#### 2. 发布资源
#### 【注意】如生成新的代码逻辑，需重新发布后才能生效，发布命令如下：
```bash
go run . artisan vendor:publish --package=./packages/goravel-crud -f
```
#### 3. 注册路由
``route_service_provider.go``下全局注册路由
```go
func (receiver *RouteServiceProvider) Boot(app foundation.Application) {
	// Add HTTP middleware
	facades.Route().GlobalMiddleware(http.Kernel{}.Middleware()...)

	receiver.configureRateLimiting()

	// Add routes
	routes.Web()
	routes.Api()
	//curd业务路由
	routes.CrudApi()
}

```
#### 4. 资源说明：发布的资源包含以下几个方面
1. 配置文件：定义业务路由前缀，路由中间件``config/crud.go``
2. 业务路由：默认配置读取了配置文件中的内容，路由前缀作为业务分组v0,同时默认配置了jwt中间件，如需定制中间件，请修改相关资源
3. 面板路由：默认面板路由为web路由，路由地址为``panel``,访问该地址可以在面板中进行扩转包业务操作，详情见如下【扩转包路由】  
- 业务路由
```go
func CrudApi() {
    jwt_middleware_cbk := facades.Config().Get("crud.middleware").(func() http.Middleware)
    prefix := facades.Config().Get("crud.prefix").(string)
    facades.Route().Middleware(jwt_middleware_cbk()).Prefix(prefix).Group(func(router route.Router) {
    })
}

```
- 配置文件config/crud.go  
```go
config.Add("crud", map[string]any{
		"path":   "vue",
		"prefix": "v0",
		"middleware": func() contractshttp.Middleware {
			return func(ctx contractshttp.Context) {
				//获取header中的Authorization 为Bearer token
				token := ctx.Request().Header("Authorization", "")
				//如果token为空
				if token == "" {
					ctx.Request().AbortWithStatusJson(401, contractshttp.Json{
						"message": "无效的身份信息",
					})
					return
				}
				token = token[7:]

				_, err := facades.Auth(ctx).Parse(token)
				//fmt.Println(payload)
				if err != nil {
					ctx.Request().AbortWithStatusJson(401, contractshttp.Json{
						"message": "身份失效",
					})
					return
				}
				is := errors.Is(err, auth.ErrorTokenExpired)
				if is {
					ctx.Request().AbortWithStatusJson(401, contractshttp.Json{
						"message": "登录失效",
					})
					return
				}
				ctx.Request().Next()
			}
		},
	})
```
- 扩展包路由
```go
router.Prefix("/crud").Group(func(r route.Router) {
		ctrl := controller.NewCRUDController()
		// 1-生成迁移文件（适配goravelv1.15后废除）
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

#### 5. 访问面板
http://localhost:3000/panel  

#### 6. 功能介绍
- 控制器，默认生成swag注解，方便对接前端
- 路由，自定义路由前缀和，路由中间件，如需定制可前往config/crud.go中修改
- 验证request，懒人面板中直接根据goravel验证规则，一键生成

#### API swag接口文件，默认支持swag前端对接更省事，每生成新的控制后需要执行swag init，生成swag文件并生效，前端openapi需重新生成

#### 业务说明
业务路由在routes/crud.go路由中，前缀默认为v0,路由应该有如下结构，如需定制，请完成代码生成后自行修改：

- 将发生如下事情
  - 自动生成迁移文件
  - 自动生成控制器（index,store,show,update,destroy,list,option)7个方法，非常方便
  - 自动生成路由
  - 自动生成验证器

- 你只需要
  - 完善迁移文件
  - 完善验证文件字段
  - 完善控制器操作字段
  - 执行命令 ``go run . artisan migrate``
  - swag路由 ``swag init``

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

#### 重点：🏆💎前端对接，swagger自动生成代码后，前端也同样自动生成代码使用三方库``umijs/openapi``，这样前端就不需要再频繁的写api接口
- 前端自动代码生成：swag接口自动生成，配合前端openapi，直接对接swagger，方便一键获取。  
  前端``openapi.config.ts``的js代码如下：
  packages.json中`` "openapi": "npx tsx openapi.config.ts",``
  前端终端命令：``pnpm openapi``
```js
import { generateService } from '@umijs/openapi';
import type { RequestOptions } from './src/utils/request';

const re = /controller[-_ .](\w)/gi;

// swagger-typescript-api
generateService({
  schemaPath: 'http://127.0.0.1:3000/swagger/doc.json',
  serversPath: './src/api/backend',
  requestOptionsType: 'RequestOptions',
  // 自定义网络请求函数路径
  requestImportStatement: `
  /**
   * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
   * */

  import { request, type RequestOptions } from "@/utils/request";
  `,
  hook: {
    afterOpenApiDataInited(openAPIData) {
      const schemas = openAPIData.components?.schemas;
      if (schemas) {
        Object.values(schemas).forEach((schema) => {
          if ('$ref' in schema) {
            return;
          }
          if (schema.properties) {
            Object.values(schema.properties).forEach((prop) => {
              if ('$ref' in prop) {
                return;
              }
              // 匡正文件上传的参数类型
              if (prop.format === 'binary') {
                prop.type = 'object';
              }
            });
          }
        });
      }
      return openAPIData;
    },
    // @ts-ignore
    customFunctionName(operationObject) {
      const { operationId } = operationObject;
      return operationId.charAt(0).toUpperCase() + operationId.slice(1); // 方法名首字母大写
    },
    // @ts-ignore
    customFunctionName(operationObject) {
      const { operationId, tags } = operationObject;
    
      if (!operationId || !tags || !tags[0]) {
        console.warn('[Warning] no operationId or tags', operationObject);
        return;
      }
    
      // 获取控制器名称，例如 "MenuController" 或 "UserController"
      const controllerName = tags[0].replace(/Controller$/, ''); // 去掉 "Controller" 后缀
    
      // 移除 operationId 中的控制器前缀（例如 "Menu"、"User" 等）
      let funcName = operationId.replace(new RegExp(`^${controllerName}`, 'i'), ''); 
    
      // 将首字母小写
      funcName = funcName.charAt(0).toLowerCase() + funcName.slice(1);
    
      return funcName;
    },
    customType(schemaObject, namespace, defaultGetType) {
      const type = defaultGetType(schemaObject, namespace);
      // 提取出 data 的类型
      const regex = /API\.ResOp & { 'data'\?: (.+); }/;
      return type.replace(regex, '$1');
    },
    
    customOptionsDefaultValue(data): RequestOptions {
      const { summary } = data;

      if (summary?.startsWith('创建') || summary?.startsWith('新增')) {
        return { successMsg: '创建成功' };
      } else if (summary?.startsWith('更新')) {
        return { successMsg: '更新成功' };
      } else if (summary?.startsWith('删除')) {
        return { successMsg: '删除成功' };
      }

      return {};
    },
  },
});


```
前端自动生成的代码如下:
```js
// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from "@/utils/request";

/** 管理员登录 登录，管理员通过提交 JSON 格式数据进行登录。 POST /api/admin/login */
export async function adminLogin(
  body: API.UserLoginRequest,
  options?: RequestOptions
) {
  return request<API.SuccessResponse>("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员退出 管理员退出。 GET /api/admin/logout */
export async function adminLogout(options?: RequestOptions) {
  return request<API.SuccessResponse>("/api/admin/logout", {
    method: "GET",
    ...(options || {}),
  });
}

/** 小程序登录 登录，管理员通过提交 JSON 格式数据进行登录。 POST /api/mini/login */
export async function miniLogin(
  body: API.MiniLoginRequest,
  options?: RequestOptions
) {
  return request<API.SuccessResponse>("/api/mini/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

```

### 最后，祝君按时下班。🎉🎉🎉🎉🎉🎊🎊