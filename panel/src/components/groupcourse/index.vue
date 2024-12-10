<template>
  <div>
    <div>
      <a-button type="primary" shape="round" @click="openModal = true">
        <template #icon> <ImportOutlined />课程选择 </template>
      </a-button>
      <span class="text-md font-bold text-red-500">
        课程：【{{ props.groupcourse_name }}】
        <a-divider type="vertical" />
        课程ID：【{{ props.groupcourse_id }}】
      </span>
    </div>
    <div class="mt-1">
      <a-modal v-model:open="openModal" title="选择课程" centered width="800px">
        <a-input-search
          v-model:value="name"
          enter-button
          @search="fillData"
          class="mb-2"
          placeholder="请输入名字"
        />
        <a-table :dataSource="dataSource" :columns="columns" bordered>
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
const { getGroupcourseSel } = useGroupcourse();
const dataSource = ref([]);
const props = defineProps({
  groupcourse_id: {
    type: Number,
    default: 0,
  },
  groupcourse_name: {
    type: String,
    default: "",
  },
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
  dataSource.value = await getGroupcourseSel(name.value);
};
const openModal = ref(false);
const emit = defineEmits(["update:groupcourse_id", "update:groupcourse_name"]);
const selectOne = (row) => {
  console.log(row)
  //提交数据到父组件
  emit("update:groupcourse_id", row.id);
  emit("update:groupcourse_name", row.name);
  openModal.value = false;
};
</script>

<style scoped></style>
