package config

import (
	"github.com/goravel/framework/facades"
)

func init() {
	config := facades.Config()
	config.Add("crud", map[string]any{
		"path": "vue",
	})
}
