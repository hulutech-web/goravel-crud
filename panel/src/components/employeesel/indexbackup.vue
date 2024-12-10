<template>
    <div style="width:600px">
        <a-modal v-model:open="open" centered width="700px" title="教练选择" :footer="false">
            <a-table :rowSelection="{ selectedRowKeys: state.selectedRowKeys1, onChange: onSelectChange1 }"
                :dataSource="selEmployees" :columns="columns1">
            </a-table>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </a-modal>
        <a-table :rowSelection="{ selectedRowKeys: state.selectedRowKeys2, onChange: onSelectChange2 }"
            :dataSource="pData" :columns="columns2" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'action'">
                    <a-popconfirm title="确认删除吗？" ok-text="是" cancel-text="否" @confirm="del(record)">
                        <a-button type="link" danger>删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
        <div>
            <div class="text-center">
                <a-button type="primary" ghost style="width: 60%" @click="addCoach">
                    <PlusOutlined />
                    添加教练
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { getEmployeeSel } = useEmployee()
const selEmployees = ref([])
const pData = ref([])
const addCoach = async () => {
    open.value = true;
}

const initData = async () => {
    //1、
    const { data } = await getEmployeeSel()
    selEmployees.value = data
    // 2、
    findSameData()
}
initData()
const open = ref(false)

const props = defineProps({
    // modelValue可以是一个数组，也可以是一个数字
    // 数组：代表多选，数字：代表单选
    modelValue: {
        type: Array,
        default:[]
    }
})

watch(()=>props.modelValue,(newVal)=>{
    if(newVal&&newVal.length>0){
        findSameData()
    }
})
const findSameData = () => {
    if (Array.isArray(props.modelValue)&&props.modelValue.length > 0) {
        pData.value = props.modelValue.map(item => {
            const sameData = selEmployees.value.find(item2 => item2.ID == item)
            if (sameData) {
                return sameData
            }
        })
        // console.log("+pData",pData.value)
    }
}
const emit = defineEmits(['update:modelValue'])
const columns1 = [
    {
        title: "ID",
        dataIndex: "ID",
        key: "ID"
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '等级',
        dataIndex: 'level_id',
        key: 'level_id',
    },
    {
        title: '工作性质',
        dataIndex: 'nature_id',
        key: 'nature_id',
    },

]
const columns2 = [
    {
        title: "ID",
        dataIndex: "ID",
        key: "ID"
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '等级',
        dataIndex: 'level_id',
        key: 'level_id',
    },
    {
        title: '工作性质',
        dataIndex: 'nature_id',
        key: 'nature_id',
    },
    {
        title: '操作',
        key: 'action',
    },
]

const onSubmit = () => {
    //
    if (typeof props.modelValue == 'number') {
        return
    }
    let rIds = modalData.value.map(item => item.ID.toString())
    emit('update:modelValue', rIds)
    pData.value = modalData.value
    open.value = false;
}
const modalData = ref([])
const state = reactive({
    selectedRowKeys1: [],
    selectedRowKeys2: []
})

// 模态
const onSelectChange1 = (selectedRowKeys, selectedRows) => {
    state.selectedRowKeys1 = selectedRowKeys;
    modalData.value = selEmployees.value.filter(item => selectedRowKeys.includes(item.key))
}
// 显示
const onSelectChange2 = (selectedRowKeys, selectedRows) => {
    // console.log('selectedRowKeys2: ', selectedRowKeys);
    state.selectedRowKeys2 = selectedRowKeys;
}

const del = (record) => {
    let index =
        pData.value.findIndex((item) => item.key === record.key);
    pData.value.splice(index, 1);
    let rIds = pData.value.map(item => item.ID.toString())
    emit('update:modelValue', rIds)
    //再来处理
    state.selectedRowKeys1 = pData.value.map(item => item.key)
}
</script>

<style scoped></style>