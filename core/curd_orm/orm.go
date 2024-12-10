package curd_orm

import (
	"fmt"
	"github.com/goravel/framework/facades"
	"github.com/goravel/framework/support/path"
	"log"
	"os"
	"path/filepath"
	"reflect"
	"regexp"
)

// 覆盖原来的模型定义
func GormModel(modelStr string) error {
	//1、覆盖文件模型文件
	//2、执行迁移
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

// 其实有2种方式，一是采用sql语句建表，2是使用gorm的AutoMigrate来做
// 覆盖原来的建表语句
func GenSql(sql string) error {
	tbPath := path.Database("migrations")
	//扫描文件路径下的文件，查找关键字create_tables_table
	pattern := `^\d{14}_create_(\w+)_table\.up\.sql$` // 匹配指定格式的文件名
	files, keywords := findFilesAndExtractKeyword(tbPath, pattern)
	for i, file := range files {
		fmt.Printf("File: %s, Keyword: %s\n", file, keywords[i])
	}
	//	找到这个文件后，用sql覆盖其中的内容
	sqlByte := []byte(sql)
	err_ := os.WriteFile(files[0], sqlByte, 0644)
	if err_ != nil {
		return err_
	}
	//尝试执行建表语句
	tx, _ := facades.Orm().Query().Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	_, err := tx.Exec(sql)
	if err != nil {
		tx.Rollback()
		return err
	}
	// 如果一切顺利，回滚事务以避免实际更改
	tx.Commit()
	return nil
}

func findFilesAndExtractKeyword(rootDir, pattern string) (files []string, keywords []string) {
	// 编译正则表达式
	re := regexp.MustCompile(pattern)

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			baseName := filepath.Base(path)
			matches := re.FindStringSubmatch(baseName)
			if matches != nil && len(matches) > 1 {
				files = append(files, path)
				keywords = append(keywords, matches[1]) // 提取第一个捕获组
			}
		}
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	return files, keywords
}
