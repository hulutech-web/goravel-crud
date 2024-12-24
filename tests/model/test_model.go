package model

import (
	"github.com/goravel/framework/database/orm"
)

type TestModel struct {
	orm.Model
	Username string `gorm:"column:username" form:"username" json:"username"`
	Password string `gorm:"column:password" form:"password" json:"password"`
	orm.SoftDeletes
}
