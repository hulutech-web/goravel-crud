<template>
  <div>
    <a-row :gutter="[32,4]">
      <a-col :span="12">
        字段设计
        <a-form
            ref="formRef"
            :model="dynamicValidateForm"
        >
          <a-space
              v-for="(column,ind) in dynamicValidateForm.columns"
              :key="ind"
              style="display: flex; margin-bottom: 8px"
              align="baseline"
          >
            <a-form-item
                label="英文列名"
                :name="['column']"
                :rules="[
                ruleStore.getRule('column')
                  ? ruleStore.getRule('column')
                  : { required: false },
              ]"
            >
              <a-input style="width:120px;" v-model:value="column.column" placeholder="列名"/>
            </a-form-item>

            <a-form-item
                label="字段类型"
                :name="['type_name']"
                :rules="[
                ruleStore.getRule('type_name')
                  ? ruleStore.getRule('type_name')
                  : { required: false },
              ]"
            >
              <a-select style="width:140px;" v-model:value="column.type_name" :options="fieldOption"
                        placeholder="字段类型"></a-select>
            </a-form-item>

            <a-form-item
                label="唯一"
                :name="['unique']"
                :rules="[
                ruleStore.getRule('unique')
                  ? ruleStore.getRule('unique')
                  : { required: false },
              ]"
            >
              <a-radio-group size="small" v-model:value="column.unique" button-style="solid">
                <a-radio-button value="1">是</a-radio-button>
                <a-radio-button value="0">否</a-radio-button>
              </a-radio-group>
            </a-form-item>

            <a-form-item
                label="为空"
                :name="['not_null']"
                :rules="[
                ruleStore.getRule('not_null')
                  ? ruleStore.getRule('not_null')
                  : { required: false },
              ]"
            >
              <a-radio-group size="small" v-model:value="column.not_null" button-style="solid">
                <a-radio-button value="1">是</a-radio-button>
                <a-radio-button value="0">否</a-radio-button>
              </a-radio-group>
            </a-form-item>

            <a-form-item
                label="主键"
                :name="['primary']"
                :rules="[
                ruleStore.getRule('primary')
                  ? ruleStore.getRule('primary')
                  : { required: false },
              ]"
            >
              <a-radio-group size="small" v-model:value="column.primary_key" button-style="solid">
                <a-radio-button :value="true">是</a-radio-button>
                <a-radio-button :value="false">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <MinusCircleOutlined @click="removeColumn(column)"/>
          </a-space>
          <a-form-item>
            <a-button type="dashed" block @click="addColumn">
              <PlusOutlined/>
              添加列
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="onSubmit" style="width:100px;">提交</a-button>
              <a-button type="primary" @click="onPreview" ghost>预览sql</a-button>
              <a-button type="primary" @click="resetSubmit" danger>清空</a-button>
            </a-space>
          </a-form-item>
        </a-form>
        预览
        <Codemirror width="100%" v-model:value="previewSql" :options="cmOption" border ref="cmRef" height="400">
        </Codemirror>
      </a-col>
      <a-col :span="12">
        <div>
          <div style="margin-bottom: 10px;">
            <a-button type="primary" @click="fresh">刷新</a-button>
          </div>
          <vxe-table
              border
              size="small"
              :data="columnData">
            <vxe-column field="column_name" title="列名称" width="150" :tooltip="true" header-popover="列的名称"></vxe-column>
            <vxe-column field="data_type" title="数据类型" width="150" :tooltip="true" header-popover="列的数据类型"></vxe-column>
            <vxe-column field="column_type" title="完整类型定义" width="200" :tooltip="true" header-popover="列的完整类型定义"></vxe-column>
            <vxe-column field="ordinal_position" title="列位置" width="80" :tooltip="true" header-popover="列在表中的位置（从1开始）"></vxe-column>
            <vxe-column field="column_default" title="默认值" width="150" :tooltip="true" header-popover="列的默认值"></vxe-column>
            <vxe-column field="column_comment" title="列注释" width="200" :tooltip="true" header-popover="对列的描述或备注信息"></vxe-column>
            <vxe-column field="column_key" title="索引标志" width="100" :tooltip="true" header-popover="列是否是主键、唯一索引或非唯一索引 (PRI 主键, UNI 唯一索引, MUL 非唯一)"></vxe-column>
            <vxe-column field="is_nullable" title="允许NULL" width="100" :tooltip="true" header-popover="列是否允许NULL值（YES 或 NO）"></vxe-column>
            <vxe-column field="character_maximum_length" title="最大长度" width="150" :tooltip="true" header-popover="字符数据类型的字符最大长度"></vxe-column>
            <vxe-column field="character_octet_length" title="最大长度" width="150" :tooltip="true" header-popover="字符数据类型的字节最大长度"></vxe-column>
            <vxe-column field="numeric_precision" title="数值精度" width="100" :tooltip="true" header-popover="数值数据类型的精度"></vxe-column>
            <vxe-column field="character_set_name" title="字符集名称" width="150" :tooltip="true" header-popover="列使用的字符集名称"></vxe-column>
            <vxe-column field="extra" title="额外信息" width="150" :tooltip="true" header-popover="额外信息 (例如 auto_increment)"></vxe-column>
          </vxe-table>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import {fieldOption} from "./field";
const {execMigrate} = useTable()
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css' // 引入 dracula 主题样式
import 'codemirror/mode/sql/sql' // 引入 SQL 语法模式
import {generateCreateTableSQL} from "./gen"
import useRuleStore from "@/store/useRulesStore";
import useTable from "@/composables/bus/useTable";
const props = defineProps({
  tablename: {
    type: String,
    default:""
  }
})
const cmOption=ref({
  mode: 'text/x-mysql', // 设置为 MySQL 模式
  theme: 'dracula', // 使用 dracula 主题
  lineNumbers: true, // 显示行号
  styleActiveLine: true, // 当前行高亮
  matchBrackets: true, // 匹配括号
  readOnly: false, // 是否只读
  tabSize: 4, // Tab 大小
  indentWithTabs: true, // 使用 Tab 进行缩进
  smartIndent: true, // 智能缩进
  foldGutter: true, // 折叠代码块
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // 添加行号和折叠边栏
})
const ruleStore = useRuleStore();

const previewSql = ref("")


// form部分
const formRef = ref();
const dynamicValidateForm = reactive({
  columns: [],
});
const removeColumn = item => {
  const index = dynamicValidateForm.columns.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.columns.splice(index, 1);
  }
};
const addColumn = () => {
  dynamicValidateForm.columns.push({
    column: '',
    type_name: '',
    not_null: '',
    unique: false,
    primary_key: false,
  });
};
const submitForm=ref({
  name:props.tablename,
  sql:""
})
const onPreview = () => {
  console.log(dynamicValidateForm.columns)
  previewSql.value=""
  previewSql.value = generateCreateTableSQL(props.tablename, dynamicValidateForm.columns)
}

const onSubmit = async values => {
  await execMigrate(props.tablename,previewSql.value,dynamicValidateForm.columns)
};

const resetSubmit=()=>{
  dynamicValidateForm.columns=[]
  previewSql.value=""
}

// 列信息
const {getColumn} = useTable();

const columnData  = ref([])

const fresh=()=>{
  init()
}
const init = async ()=>{
  columnData.value=   await getColumn(props.tablename)
}
init();

</script>

<style scoped>

</style>