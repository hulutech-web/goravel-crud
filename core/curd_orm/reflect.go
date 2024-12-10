package curd_orm

import (
	"reflect"
	"sync"
)

// 定义一个全局变量来保存所有模型
var registeredModels []interface{}
var registerMutex sync.Mutex

// RegisterModel 允许其他包注册他们的模型
func RegisterModel(model interface{}) {
	registerMutex.Lock()
	defer registerMutex.Unlock()

	// 确保只添加一次
	modelType := reflect.TypeOf(model)
	for _, m := range registeredModels {
		if reflect.TypeOf(m) == modelType {
			return
		}
	}

	registeredModels = append(registeredModels, model)
}

// GenModel 覆盖原来的模型定义并执行迁移
func GenModel(modelStr string) error {
	// 1. 如果有需要覆盖文件模型文件的操作，可以在这里实现

	// 2. 执行迁移
	var modelsToMigrate []interface{}
	for _, model := range registeredModels {
		modelsToMigrate = append(modelsToMigrate, reflect.New(reflect.TypeOf(model).Elem()).Interface())
	}

	// 假设 QueryIns 是已经初始化好的数据库连接实例
	err := QueryIns.AutoMigrate(modelsToMigrate...)
	if err != nil {
		return err
	}

	return nil
}
