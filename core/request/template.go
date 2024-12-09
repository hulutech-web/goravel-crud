package request

import (
	"fmt"
	"github.com/goravel/framework/support/path"
	"os"
	"strings"
)

var (
	tmpRequestStr = `
package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type UserRequest struct {
}

func (r *UserRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *UserRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *UserRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *UserRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *UserRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}

`
)

func GenTemplate(modelName string) string {
	// 使用 strings.ReplaceAll 来替换所有的 "User" 关键词为新的模型名称
	// 创建一个映射，用于指定需要替换的字符串和它们对应的替换值
	replacements := map[string]string{
		"User":  modelName,
		"Users": modelName + "s",
		"user":  strings.ToLower(modelName[:1]) + modelName[1:],
	}

	// 对每个键值对进行替换
	for old, newVal := range replacements {
		tmpRequestStr = strings.ReplaceAll(tmpRequestStr, old, newVal)
	}

	return tmpRequestStr
}

func CopyToRequestPath(modelName string, template string) error {
	requestPath := path.App("http/requests")
	//查看有没有这个目录，如果没有就创建这个目录
	if err := os.MkdirAll(requestPath, os.ModePerm); err != nil {
		return err
	}

	file_name := fmt.Sprintf("%s_request.go", strings.ToLower(modelName))
	//os创建这个文件，并写入template字符串
	_, err := os.Create(fmt.Sprintf("%s/%s", requestPath, file_name))
	if err != nil {
		return err
	}
	err = os.WriteFile(fmt.Sprintf("%s/%s", requestPath, file_name), []byte(template), 777)
	if err != nil {
		return err
	}
	return nil
}
