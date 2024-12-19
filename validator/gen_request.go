package validator

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type Field struct {
	Column     string `json:"column" form:"column"`
	TypeName   string `json:"type_name" form:"type_name"`
	NotNull    string `json:"not_null" form:"not_null"`
	Unique     string `json:"unique" form:"unique"`
	PrimaryKey bool   `json:"primary_key" form:"primary_key"`
}

type GenRequest struct {
	Sql       string  `json:"sql" form:"sql"`
	Tablename string  `json:"tablename" form:"tablename"`
	Fields    []Field `json:"fields" form:"fields"`
}

func (r *GenRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *GenRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"column":    "required",
		"type_name": "required",
		"fields":    "required",
	}
}

func (r *GenRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *GenRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *GenRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
