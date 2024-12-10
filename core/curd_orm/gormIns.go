package curd_orm

import (
	"fmt"
	"github.com/goravel/framework/facades"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"sync"
)

var QueryIns *gorm.DB
var (
	once sync.Once
)

func BootMS() *gorm.DB {
	once.Do(func() {
		DB_HOST := facades.Config().Env("DB_HOST")
		DB_PORT := facades.Config().Env("DB_PORT")
		DB_DATABASE := facades.Config().Env("DB_DATABASE")
		DB_USERNAME := facades.Config().Env("DB_USERNAME")
		DB_PASSWORD := facades.Config().Env("DB_PASSWORD")
		//root:Dazhouquxian2012.@tcp(127.0.0.1:3306)/goravel-workflow?charset=utf8&parseTime=True&loc=Local
		ins, err := gorm.Open(mysql.New(mysql.Config{
			DSN:                       fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE), // DSN data source name
			DefaultStringSize:         256,                                                                                                                               // string 类型字段的默认长度
			DisableDatetimePrecision:  true,                                                                                                                              // 禁用 datetime 精度，MySQL 5.6 之前的数据库不支持
			DontSupportRenameIndex:    true,                                                                                                                              // 重命名索引时采用删除并新建的方式，MySQL 5.7 之前的数据库和 MariaDB 不支持重命名索引
			DontSupportRenameColumn:   true,                                                                                                                              // 用 `change` 重命名列，MySQL 8 之前的数据库和 MariaDB 不支持重命名列
			SkipInitializeWithVersion: false,                                                                                                                             // 根据当前 MySQL 版本自动配置
		}), &gorm.Config{})
		if err != nil {
			panic(err)
		}
		QueryIns = ins
	})
	return QueryIns
}
