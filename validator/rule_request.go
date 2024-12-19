package validator

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type RuleField struct {
	ColumnName string `json:"column_name" form:"column_name"`
	RuleName   string `json:"rule_name" form:"rule_name"`
	RuleTitle  string `json:"rule_title" form:"rule_title"`
	RuleValue  string `json:"rule_value" form:"rule_value"`
}

type RuleRequest struct {
	RuleFields []RuleField `json:"rule_fields" form:"rule_fields"`
	Tablename  string      `json:"tablename" form:"tablename"`
}

func (r *RuleRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *RuleRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{
		"tablename":   "required",
		"rule_fields": "required",
	}
}

func (r *RuleRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *RuleRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *RuleRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}
