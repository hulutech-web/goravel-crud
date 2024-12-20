interface Model{
    name:string
    field_type:string
    gorm:string
    form:string
    json:string
}
//fieldArr 为Model的数组类型
const createModel = (modelName: string, fieldArr: Model[]): string => {
    let templateModelStr = `package models

import (
	"github.com/goravel/framework/database/orm"
	"goravel/packages/goravel-crud/core/curd_orm"
)

type ${toUpperCamelCase(modelName)} struct {
	orm.Model`;

    // 如果需要支持软删除，请添加这一行
    // templateModelStr += `
    // orm.SoftDeletes`;

    fieldArr.forEach(field => {
        const fieldName = toCamelCase(field.name);
        const fieldType = field.field_type;
        const tags = `gorm:"${field.gorm}" form:"${field.form}" json:"${field.json}"`;
        templateModelStr += `
	${fieldName} ${fieldType} \`${
            tags
        }\``;
    });


    templateModelStr += `
}`;
    let regist_model=`
    func init() {
   curd_orm.RegisterModel(&User{})
}`
    templateModelStr+=regist_model
    return templateModelStr;
};

function toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
}

// 将字符串转换为大驼峰命名（upper camel case）
function toUpperCamelCase(str: string): string {
    const lowerCamel = toLowerCamelCase(str);
    return lowerCamel.charAt(0).toUpperCase() + lowerCamel.slice(1);
}

// 将字符串转换为小驼峰命名（lower camel case）
function toLowerCamelCase(str: string): string {
    return str
        .toLowerCase() // 确保一致性，先全部转为小写
        .replace(/([-_][a-z])/gi, ($1) =>
            $1.toUpperCase().replace('-', '').replace('_', '') // 将'-x'或'_x'转为'X'
        )
        .replace(/^./, (str) => str.toLowerCase()); // 确保第一个字符是小写
}

export {
    createModel
}

