function generateCreateTableSQL(tableName, columns) {
    // 默认添加的字段定义（不包括 id）
    const defaultColumns = [
        { column: 'created_at', type_name: 'datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)', index: true },
        { column: 'updated_at', type_name: 'datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)', index: true },
        { column: 'deleted_at', type_name: 'datetime(3) DEFAULT NULL' }
    ];

    // 定义 id 字段
    const idColumn = {
        column: 'id',
        type_name: 'bigint(20) unsigned NOT NULL AUTO_INCREMENT',
        primary_key: true
    };

    // 构建用户提供的字段定义字符串
    const userColumns = columns.map(col => ({
        ...col,
        def: `${col.column} ${col.type_name}${col.not_null === "1" ? ' NOT NULL' : ''}${col.default !== undefined && col.default !== null ? ` DEFAULT ${col.default}` : ''}${col.unique === "1" ? ' UNIQUE' : ''}`
    }));

    // 确保只有一个主键并且是 id
    const hasPrimaryKey = userColumns.some(col => col.primary_key === "1");
    if (hasPrimaryKey) {
        console.warn('Primary key should only be set for the "id" field.');
        userColumns.forEach(col => delete col.primary_key); // 移除用户设置的主键属性
    }

    // 构建字段定义字符串，先放 id 字段，再放用户字段，最后放默认字段
    const columnDefs = [
        `${idColumn.column} ${idColumn.type_name}`,
        ...userColumns.map(col => col.def),
        ...defaultColumns.map(col => `${col.column} ${col.type_name}`)
    ].join(',\n  ');

    // 构建索引定义字符串
    const indexDefs = defaultColumns.filter(col => col.index).map(col => `KEY idx_${tableName}_${col.column} (${col.column})`).join(',\n  ');

    // 添加主键定义
    const primaryKeyDef = idColumn.primary_key ? `PRIMARY KEY (id)` : '';

    // 构建最终的 SQL 语句
    const sql = `
CREATE TABLE ${tableName} (
  ${columnDefs}
  ${primaryKeyDef ? `, ${primaryKeyDef}` : ''}
  ${indexDefs ? `, ${indexDefs}` : ''}
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

    return sql.trim().replace(/\n\s*,\s*\n/g, '\n  ').replace(/,\s*$/, '');
}

export {
    generateCreateTableSQL
}