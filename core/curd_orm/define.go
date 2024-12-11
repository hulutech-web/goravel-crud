package curd_orm

import (
	"fmt"
	"github.com/goravel/framework/facades"
)

type TableInfo struct {
	TableCatalog   string `gorm:"column:TABLE_CATALOG" json:"table_catalog" form:"tableCatalog" comment:"表所属的目录"`
	TableSchema    string `gorm:"column:TABLE_SCHEMA" json:"table_schema" form:"tableSchema" comment:"表所在的数据库名称"`
	TableName      string `gorm:"column:TABLE_NAME" json:"table_name" form:"tableName" comment:"表名称"`
	TableType      string `gorm:"column:TABLE_TYPE" json:"table_type" form:"tableType" comment:"表类型"`
	Engine         string `gorm:"column:ENGINE" json:"engine" form:"engine" comment:"使用的存储引擎"`
	Version        string `gorm:"column:VERSION" json:"version" form:"version" comment:"表格式的版本号"`
	RowFormat      string `gorm:"column:ROW_FORMAT" json:"row_format" form:"rowFormat" comment:"行格式"`
	TableRows      string `gorm:"column:TABLE_ROWS" json:"table_rows" form:"tableRows" comment:"表中的行数"`
	AvgRowLength   string `gorm:"column:AVG_ROW_LENGTH" json:"avg_row_length" form:"avgRowLength" comment:"每行平均长度"`
	DataLength     string `gorm:"column:DATA_LENGTH" json:"data_length" form:"dataLength" comment:"数据文件长度"`
	MaxDataLength  string `gorm:"column:MAX_DATA_LENGTH" json:"max_data_length" form:"maxDataLength" comment:"最大数据文件长度"`
	IndexLength    string `gorm:"column:INDEX_LENGTH" json:"index_length" form:"indexLength" comment:"索引文件长度"`
	DataFree       string `gorm:"column:DATA_FREE" json:"data_free" form:"dataFree" comment:"分配但目前未使用的空间量"`
	AutoIncrement  string `gorm:"column:AUTO_INCREMENT" json:"auto_increment" form:"autoIncrement" comment:"下一个 AUTO_INCREMENT 值"`
	CreateTime     string `gorm:"column:CREATE_TIME" json:"create_time" form:"createTime" comment:"创建时间"`
	UpdateTime     string `gorm:"column:UPDATE_TIME" json:"update_time" form:"updateTime" comment:"上次更新时间"`
	CheckTime      string `gorm:"column:CHECK_TIME" json:"check_time" form:"checkTime" comment:"上次检查时间"`
	TableCollation string `gorm:"column:TABLE_COLLATION" json:"table_collation" form:"tableCollation" comment:"表字符集排序规则"`
	Checksum       string `gorm:"column:CHECKSUM" json:"checksum" form:"checksum" comment:"校验和"`
	CreateOptions  string `gorm:"column:CREATE_OPTIONS" json:"create_options" form:"createOptions" comment:"创建时的选项"`
	TableComment   string `gorm:"column:TABLE_COMMENT" json:"table_comment" form:"tableComment" comment:"表注释"`
}

type ColumnInfo struct {
	TableCatalog           string `json:"table_catalog,omitempty" form:"table_catalog,omitempty" gorm:"column:TABLE_CATALOG"`
	TableSchema            string `json:"table_schema,omitempty" form:"table_schema,omitempty" gorm:"column:TABLE_SCHEMA"`
	TableName              string `json:"table_name,omitempty" form:"table_name,omitempty" gorm:"column:TABLE_NAME"`
	ColumnName             string `json:"column_name,omitempty" form:"column_name,omitempty" gorm:"column:COLUMN_NAME"`
	OrdinalPosition        uint64 `json:"ordinal_position,omitempty" form:"ordinal_position,omitempty" gorm:"column:ORDINAL_POSITION"`
	ColumnDefault          string `json:"column_default,omitempty" form:"column_default,omitempty" gorm:"column:COLUMN_DEFAULT"`
	IsNullable             string `json:"is_nullable,omitempty" form:"is_nullable,omitempty" gorm:"column:IS_NULLABLE"`
	DataType               string `json:"data_type,omitempty" form:"data_type,omitempty" gorm:"column:DATA_TYPE"`
	CharacterMaximumLength string `json:"character_maximum_length,omitempty" form:"character_maximum_length,omitempty" gorm:"column:CHARACTER_MAXIMUM_LENGTH"`
	CharacterOctetLength   string `json:"character_octet_length,omitempty" form:"character_octet_length,omitempty" gorm:"column:CHARACTER_OCTET_LENGTH"`
	NumericPrecision       string `json:"numeric_precision,omitempty" form:"numeric_precision,omitempty" gorm:"column:NUMERIC_PRECISION"`
	NumericScale           string `json:"numeric_scale,omitempty" form:"numeric_scale,omitempty" gorm:"column:NUMERIC_SCALE"`
	DateTimePrecision      string `json:"datetime_precision,omitempty" form:"datetime_precision,omitempty" gorm:"column:Datetime_precision"`
	CharacterSet           string `json:"character_set_name,omitempty" form:"character_set_name,omitempty" gorm:"column:CHARACTER_SET_NAME"`
	CollationName          string `json:"collation_name,omitempty" form:"collation_name,omitempty" gorm:"column:COLLATION_NAME"`
	ColumnType             string `json:"column_type,omitempty" form:"column_type,omitempty" gorm:"column:COLUMN_TYPE"`
	ColumnKey              string `json:"column_key,omitempty" form:"column_key,omitempty" gorm:"column:COLUMN_KEY"`
	Extra                  string `json:"extra,omitempty" form:"extra,omitempty" gorm:"column:EXTRA"`
	Privileges             string `json:"privileges,omitempty" form:"privileges,omitempty" gorm:"column:PRIVILEGES"`
	ColumnComment          string `json:"column_comment,omitempty" form:"column_comment,omitempty" gorm:"column:COLUMN_COMMENT"`
}

func TableDefine() []TableInfo {
	var tableInfos []TableInfo
	db_name := facades.Config().Env("DB_DATABASE")
	querySql := fmt.Sprintf(`SELECT *
FROM information_schema.tables
WHERE table_schema = '%s';`, db_name)

	facades.Orm().Query().Raw(querySql).Scan(&tableInfos)
	return tableInfos
}

func TableSchema(tablename string) []ColumnInfo {
	var columnInfos []ColumnInfo
	db_name := facades.Config().Env("DB_DATABASE")
	querySql := fmt.Sprintf(`SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = '%s'
AND TABLE_SCHEMA = '%s';`, tablename, db_name)

	facades.Orm().Query().Raw(querySql).Scan(&columnInfos)
	return columnInfos
}
