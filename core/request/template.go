package request

import (
	"fmt"
	"github.com/goravel/framework/support/path"
	"goravel/packages/goravel-crud/validator"
	"os"
	"strings"
	"text/template"
	"unicode"
)

var tmpRequestStr = `
package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type {{.ModelName}}Request struct {
{{range .Fields}}
	{{TitleCaseFirst .ColumnName}} string ` + "`json:\"{{.ColumnName}}\" form:\"{{.ColumnName}}\"`" + `
{{end}}
}

func (r *{{.ModelName}}Request) Authorize(ctx http.Context) error {
	return nil
}

func (r *{{.ModelName}}Request) Rules(ctx http.Context) map[string]string {
	return map[string]string{
{{range .Fields}}
		"{{.ColumnName}}": "{{.RuleName}}{{if .RuleValue}}:{{.RuleValue}}{{end}}",
{{end}}
	}
}

func (r *{{.ModelName}}Request) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *{{.ModelName}}Request) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *{{.ModelName}}Request) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
`

// TitleCaseFirst 将给定字符串的第一个字母转换为大写。
func TitleCaseFirst(s string) string {
	if s == "" {
		return ""
	}
	runes := []rune(s)
	return string([]rune{unicode.ToUpper(runes[0])}) + string(runes[1:])
}
func GenTemplate(modelName string, fields []validator.RuleField) string {
	type TemplateData struct {
		ModelName string
		Fields    []struct {
			ColumnName string
			RuleName   string
			RuleValue  string
		}
	}

	data := TemplateData{
		ModelName: modelName,
		Fields:    make([]struct{ ColumnName, RuleName, RuleValue string }, len(fields)),
	}

	for i, field := range fields {
		data.Fields[i] = struct {
			ColumnName string
			RuleName   string
			RuleValue  string
		}{
			ColumnName: field.ColumnName,
			RuleName:   field.RuleName,
			RuleValue:  field.RuleValue,
		}
	}

	tmpl, err := template.New("requestTemplate").Funcs(template.FuncMap{
		"TitleCaseFirst": TitleCaseFirst,
	}).Parse(tmpRequestStr)
	if err != nil {
		fmt.Println("Error parsing template:", err)
		return ""
	}

	var result strings.Builder
	err = tmpl.Execute(&result, data)
	if err != nil {
		fmt.Println("Error executing template:", err)
		return ""
	}

	return result.String()
}

func CopyAndFillRuleToRequestPath(modelName string, template string) error {
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
