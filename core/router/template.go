package router

import (
	"fmt"
	"github.com/goravel/framework/support/path"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strings"
)

var (
	tmpRouterStr = `
userCtrl := controllers.NewUserController()
router.Resource("user", userCtrl)
router.Get("user/list", userCtrl.List)
router.Get("user/option", userCtrl.Option)
`
)

func GenTemplate(modelName string) string {
	// 使用 strings.ReplaceAll 来替换所有的 "User" 关键词为新的模型名称
	// 创建一个映射，用于指定需要替换的字符串和它们对应的替换值
	replacements := map[string]string{
		"User":  modelName,
		"Users": modelName + "s",
		"user":  strings.ToLower(modelName[:1]) + modelName[1:],
	}

	// 对每个键值对进行替换
	for old, newVal := range replacements {
		tmpRouterStr = strings.ReplaceAll(tmpRouterStr, old, newVal)
	}

	return tmpRouterStr
}

// EnsureImport checks if the given import path exists in the file's import section.
// If it does not exist, it adds the import to the import block.
func EnsureImport(filePath, importPath string) error {
	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	content := string(fileContent)

	// Check if the import already exists
	if strings.Contains(content, fmt.Sprintf(`"%s"`, importPath)) {
		fmt.Println("导入已存在:", importPath)
		return nil // Import already exists, do nothing
	}

	// Find the end of the existing import block
	importBlockEndIndex := strings.Index(content, ")\n")
	if importBlockEndIndex == -1 {
		return fmt.Errorf("无法找到导入块的结束位置")
	}

	// Insert the new import before the closing parenthesis and add a newline for formatting
	newContent := content[:importBlockEndIndex] + fmt.Sprintf("\n\t\"%s\"", importPath) + content[importBlockEndIndex:]

	// Write the updated content back to the file
	err = os.WriteFile(filePath, []byte(newContent), 0777)
	if err != nil {
		return err
	}

	fmt.Println("成功添加导入:", importPath)
	return nil
}

func CopyToRoutePath(modelName string, template string) error {
	routePath := path.Base("routes")
	file_name := "api.go"
	file_path := fmt.Sprintf("%s/%s", routePath, file_name)

	// 将文件内容转换为字符串并按行分割

	err := EnsureImport(file_path, "goravel/app/http/controllers")
	if err != nil {
		return err
	}
	//os读取这个文件的内容
	routeByte, err := os.ReadFile(file_path)
	if err != nil {
		return err
	}
	lines := strings.Split(string(routeByte), "\n")

	//初始化路由结构，
	// 原始代码
	code := string(routeByte)

	// 正则表达式模式
	pattern := `facades\.Route\(\)\.Prefix\("/api"\)\.Group\(func\(router route\.Router\) \{`
	re := regexp.MustCompile(pattern)

	// 查找匹配项
	if re.FindString(code) == "" {
		// 如果没有匹配项，则添加
		code = fmt.Sprintf("%s\nfacades.Route().Prefix(\"/api\").Group(func(router route.Router) {\n})\n", code)
	}
	orginRouteStr := `facades\.Route\(\)\.Prefix\("/api"\)\.Group\(func\(router route\.Router\) \{
}`
	ioutil.WriteFile(file_path, []byte(orginRouteStr), 0777)
	newCode := GenTemplate(modelName)
	// 查找 func Api() { } 的结束位置
	var insertIndex int
	for i, line := range lines {
		if strings.Contains(line, "facades.Route().Prefix(\"/api\").Group(func(router route.Router) {") {
			// 找到函数定义后继续遍历直到找到对应的闭括号
			for j := i + 1; j < len(lines); j++ {
				if strings.TrimSpace(lines[j]) == "})" {
					insertIndex = j - 1 // 在闭括号前一行插入新代码
					break
				}
			}
			break
		}
	}

	// 如果找到了插入点，则进行插入
	if insertIndex > 0 {
		lines = append(lines[:insertIndex+1], append([]string{newCode}, lines[insertIndex+1:]...)...)
	} else {
		log.Fatalf("facades.Route().Prefix(\"/api\").Group(func(router route.Router) {} 没有找到")
	}

	// 将更新后的行重新组合成一个字符串
	newContent := strings.Join(lines, "\n")

	// 写入文件
	err = ioutil.WriteFile(file_path, []byte(newContent), 0777)
	if err != nil {
		log.Fatalf("写入文件失败: %v", err)
		return err
	}

	fmt.Println("成功更新文件")

	return nil
}
