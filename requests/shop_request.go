
package requests

import (
	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/contracts/validation"
)

type ShopRequest struct {
}

func (r *ShopRequest) Authorize(ctx http.Context) error {
	return nil
}

func (r *ShopRequest) Rules(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *ShopRequest) Messages(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *ShopRequest) Attributes(ctx http.Context) map[string]string {
	return map[string]string{}
}

func (r *ShopRequest) PrepareForValidation(ctx http.Context, data validation.Data) error {
	return nil
}

