package controller

import (
	"fmt"
	"github.com/goravel/framework/contracts/http"
	httpSwagger "github.com/swaggo/http-swagger"
	_ "goravel/docs"
	"net/url"
	_ "net/url"
)

type SwaggerController struct {
	//Dependent services
}

func NewSwaggerController() *SwaggerController {
	return &SwaggerController{
		//Inject services
	}
}

// @title Swagger Example API
// @version 1.0
// @description This is a sample server Petstore server.
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host petstore.swagger.io
// @BasePath /v2
func (r *SwaggerController) Index(ctx http.Context) http.Response {
	// 配置 Swagger UI
	uri, _ := url.Parse("http://localhost:3000/api")
	handler := httpSwagger.Handler(
		httpSwagger.URL("http://localhost:3000/swagger/doc.json"),
		httpSwagger.BeforeScript(`const UrlMutatorPlugin = (system) => ({
  rootInjects: {
    setScheme: (scheme) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const schemes = Array.isArray(scheme) ? scheme : [scheme];
      const newJsonSpec = Object.assign({}, jsonSpec, { schemes });

      return system.specActions.updateJsonSpec(newJsonSpec);
    },
    setHost: (host) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const newJsonSpec = Object.assign({}, jsonSpec, { host });

      return system.specActions.updateJsonSpec(newJsonSpec);
    },
    setBasePath: (basePath) => {
      const jsonSpec = system.getState().toJSON().spec.json;
      const newJsonSpec = Object.assign({}, jsonSpec, { basePath });

      return system.specActions.updateJsonSpec(newJsonSpec);
    }
  }
});`),
		httpSwagger.Plugins([]string{"UrlMutatorPlugin"}),
		httpSwagger.UIConfig(map[string]string{
			"onComplete": fmt.Sprintf(`() => {
    window.ui.setScheme('%s');
    window.ui.setHost('%s');
    window.ui.setBasePath('%s');
  }`, uri.Scheme, uri.Host, uri.Path),
		}),
	)

	// 返回 Swagger UI 页面
	handler(ctx.Response().Writer(), ctx.Request().Origin())
	return nil
}
