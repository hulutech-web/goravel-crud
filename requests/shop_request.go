package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type TableRequest struct {
	Name string `form:"name" json:"name"`
	Sql  string `form:"sql" json:"sql"`
}

func (r *TableRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *TableRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"name": "required",
		"sql":  "required",
	}
}

func (r *TableRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{
		"name.required": "表名不能为空",
		"sql.required":  "sql语句不能为空",
	}
}

func (r *TableRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *TableRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
