<template>
  <div>
    <div>
      <a-button type="primary" shape="round" size="large" @click="openModal = true">
        <template #icon>
          <UserOutlined />
        </template>
        会员选择
      </a-button>
      <span class="text-md font-bold text-gray-500">
        【会员ID：{{ props.id }}
        <a-divider type="vertical" />
        姓名：{{ props.nickName }}】
      </span>
    </div>
    <div class="mt-1">
      <a-modal v-model:open="openModal" width="600px" title="选择会员" centered>
        <a-input-search v-model:value="name" enter-button @search="fillData" placeholder="请输入名字或手机号" />
        <div class="mt-3">
          <a-table :dataSource="dataSource" :columns="columns" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key == 'action'">
                <a-button type="primary" @click="selectOne(record)">
                  <CheckOutlined />
                选择
                </a-button>
              </template>
            </template>
          </a-table>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getUserSel } = useUser();
const dataSource = ref([]);
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  nickName: {
    type: String,
    default: "",
  },
});

const columns = [
  {
    dataIndex: "id",
    title: "会员ID",
    key: "id",
  },
  {
    dataIndex: "nick_name",
    title: "会员姓名",
    key: "nick_name",
  },
  {
    dataIndex: "mobile",
    title: "电话",
    key: "mobile",
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
  dataSource.value = await getUserSel(name.value);
};
const openModal = ref(false);
const emit = defineEmits(["update:id", "update:nickName"]);
const selectOne = (row) => {
  console.log(row)
  //提交数据到父组件
  emit("update:id", row.id);
  emit("update:nickName", row.nick_name);
  openModal.value = false;
};
</script>

<style scoped></style>