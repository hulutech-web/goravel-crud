package model

import (
	"fmt"
	"github.com/goravel/framework/support/path"
	"os"
	"strings"
)

var (
	tmpModelStr = `
package models

import (
	"github.com/goravel/framework/database/orm"
)

type User struct {
	orm.Model
	orm.SoftDeletes
}

`
)

func GenTemplate(modelName string) string {
	// 使用 strings.ReplaceAll 来替换所有的 "User" 关键词为新的模型名称
	// 创建一个映射，用于指定需要替换的字符串和它们对应的替换值
	replacements := map[string]string{
		"User":  modelName,
		"Users": modelName + "s",
	}

	// 对每个键值对进行替换
	for old, newVal := range replacements {
		tmpModelStr = strings.ReplaceAll(tmpModelStr, old, newVal)
	}

	return tmpModelStr
}

func CopyToModelPath(modelName string, template string) error {
	modelPath := path.App("models")
	//转小写
	strings.ToLower(modelName)
	file_name := fmt.Sprintf("%s.go", strings.ToLower(modelName))
	//os创建这个文件，并写入template字符串
	_, err := os.Create(fmt.Sprintf("%s/%s", modelPath, file_name))
	if err != nil {
		return err
	}
	err = os.WriteFile(fmt.Sprintf("%s/%s", modelPath, file_name), []byte(template), 777)
	if err != nil {
		return err
	}
	return nil
}
