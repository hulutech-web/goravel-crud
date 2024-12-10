<template>
  <div>
    <div>
      <a-button type="primary" shape="round" @click="openModal = true">
        <template #icon> <ImportOutlined />课程选择 </template>
      </a-button>
      <span class="text-md font-bold text-red-500">
        课程：【{{ props.personalcourse_name }}】
        <a-divider type="vertical" />
        课程ID：【{{ props.personalcourse_id }}】
      </span>
    </div>
    <div class="mt-1">
      <a-modal v-model:open="openModal" title="选择课程" centered>
        <a-input-search
          v-model:value="name"
          enter-button
          @search="fillData"
          placeholder="请输入名字"
        />
        <a-table :dataSource="dataSource" :columns="columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'action'">
              <a-button type="primary" @click="selectOne(record)">
                <CheckOutlined />
                添加
              </a-button>
            </template>
            
          </template>
        </a-table>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getPersonalcourseSel } = usePersonalcourse();
const dataSource = ref([]);
const props = defineProps({
  personalcourse_id: {
    type: Number,
    default: 0,
  },
  personalcourse_name: {
    type: String,
    default: "",
  },
  employee_id:{
    type:Number,
    default:0
  }
});
const columns = [
  {
    dataIndex: "id",
    title: "课程ID",
    key: "id",
  },
  {
    dataIndex: "name",
    title: "课程名称",
    key: "name",
  },
  {
    dataIndex: "action",
    title: "操作",
    key: "action",
  },
];
const name = ref("");
onMounted(() => {
  fillData();
});
const fillData = async () => {
  dataSource.value = await getPersonalcourseSel(name.value);
};
const openModal = ref(false);
const emit = defineEmits(["update:personalcourse_id", "update:personalcourse_name","update:employee_id"]);
const selectOne = (row) => {
  console.log(row)
  //提交数据到父组件
  emit("update:personalcourse_id", row.id);
  emit("update:personalcourse_name", row.name);
  emit("update:employee_id", row.employee_id);
  openModal.value = false;
};
</script>

<style scoped></style>
