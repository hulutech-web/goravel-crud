<template>
  <div>
    <vxe-toolbar>
      <template #buttons>
        <vxe-button status="primary" @click="insertEvent()">新增</vxe-button>
        <vxe-button status="danger" @click="removeSelectEvent()">删除</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table border show-overflow ref="tableRef" max-height="400" :column-config="{ resizable: true }"
               :data="tableData" :edit-config="{ trigger: 'click', mode: 'row' }"
               @edit-activated="editActivatedEvent">
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column field="column_name" title="列名" :edit-render="{ name: 'input' }">
      </vxe-column>
      <vxe-column field="rule_title" title="规则名称" :edit-render="{ name: 'input' }">
      </vxe-column>
      <vxe-column field="rule_name" title="规则类型" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-select v-model="row.rule_name" clearable transfer @change="selectRowChange(row)">
            <vxe-option v-for="item in roleList" :key="item.label" :value="item.value"
                        :label="item.label"></vxe-option>
          </vxe-select>
        </template>
      </vxe-column>

      <vxe-column field="rule_value" title="规则值" :edit-render="{}">
        <template #edit="{ row }">
          <vxe-input  v-model="row.rule_value"
                     type="text"></vxe-input>
        </template>
      </vxe-column>
    </vxe-table>
    <div class="mt-3">
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, ref, watch} from 'vue';
import useTable from "@/composables/bus/useTable";
const {makeRequest} = useTable();
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  ruleCallback: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['update:modelValue'])

interface RowVO {
  rule_title: string
  rule_name: string
  rule_value: string
}

const tableRef = ref<VxeTableInstance<RowVO>>()
const tableData = ref<RowVO[]>(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  if (newVal == null || newVal.length == 0) {
    tableData.value = []
    return;
  } else {
    tableData.value = newVal
    // 从新加载一下数据
    const $table = tableRef.value
    if ($table) {
      //设置table为可编辑状态
      $table.setEditCell(row => {
        return row.rule_name == 'required'
      })
      $table.updateData();
    }
  }
}, {
  deep: true,
  immediate: true
})

const roleList = ref([
  {title: '必填', label: '必填', value: 'required', disabled: true},
  {title: '字符串', label: '字符串', value: 'string'},
  {title: '邮箱', label: '邮箱', value: 'email'},
  {title: '数字', label: '数字', value: 'uint', disabled: true},
  {title: '日期', label: '日期', value: 'date', disabled: true},
  {title: '最小长度', label: '最小长度', value: 'min_len'},
  {title: '最大长度', label: '最大长度', value: 'max_len'},
  {title: '最大值', label: '最大值', value: 'max'},
  {title: '最小值', label: '最小值', value: 'min'},
  {title: '不等于', label: '不等于', value: 'ne'},
  {title: '文件', label: '文件', value: 'slice', disabled: true},
  {title: '图片', label: '图片', value: 'image', disabled: true},
  {title: '数字大于0', label: '数字大于0', value: 'number', disabled: true},
])

const removeSelectEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.removeCheckboxRow()
  }
}

const insertEvent = () => {
  const $table = tableRef.value
  if ($table) {
    const record: RowVO = {rule_title: '', rule_name: '', rule_value: ''}
    $table.insert(record)
  }
}

const selectRowChange = (row: RowVO) => {
  addTitleHandle(row)
}

const addTitleHandle = (row: RowVO) => {
  switch (row.rule_name) {
    case 'required':
      row.rule_title = '必填'
      break
    case 'string':
      row.rule_title = '字符串'
      break
    case 'email':
      row.rule_title = '邮箱'
      break
    case 'uint':
      row.rule_title = '数字'
      break
    case 'date':
      row.rule_title = '日期'
      break
    case 'min_len':
      row.rule_title = '最小长度'
      break
    case 'max_len':
      row.rule_title = '最大长度'
      break
    case 'max':
      row.rule_title = '最大值'
      break
    case 'min':
      row.rule_title = '最小值'
      break
    case 'ne':
      row.rule_title = '不等于'
      break
    case 'file':
      row.rule_title = '文件'
      break
    case 'image':
      row.rule_title = '图片'
      break
    case 'number':
      row.rule_title = '数字大于0'
      break
    default:
      row.rule_title = '未知'
      break
  }
}


const editActivatedEvent = async () => {
  // 获取表格数据
  const $table = tableRef.value
  const {fullData} = $table.getTableData()
  emit('update:modelValue', fullData)

}



const submitState=ref([])
const onSubmit = () => {
  const $table = tableRef.value
  if ($table) {
    const {fullData} = $table.getTableData()
    submitState.value = fullData.map(item=>{
      return {
        rule_title: item.rule_title,
        rule_name: item.rule_name,
        column_name: item.column_name,
        rule_value: item.rule_value?item.rule_value:'',
      }
    })
    props.ruleCallback(submitState.value)
  }
}
</script>
