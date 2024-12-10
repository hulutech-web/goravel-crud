
package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type CarRequest struct {
}

func (r *CarRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *CarRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CarRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CarRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *CarRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}

