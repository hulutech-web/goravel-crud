package migration

import (
	"fmt"
	"github.com/goravel/framework/facades"
)

func GenTemplate(modelName string) {
	call_cmd := fmt.Sprintf("make:migration create_%ss_table", modelName)
	facades.Artisan().Call(call_cmd)
}
