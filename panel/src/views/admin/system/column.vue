<script setup lang="ts">
import Table from "./templates/table.vue"

const route = useRoute();
const table_name = ref(route.params.id)
const step = ref(0)
const description = 'This is a description.';
</script>

<template>
  <div>
    <a-card>
      <p>你正在操作{{ table_name }}表</p>
      <a-space
          style="display: flex;justify-content: center; margin-bottom: 8px"
          align="baseline"
      >
        <a-button type="primary" @click="step++" v-if="step<1">下一步</a-button>
        <a-button type="primary" @click="step--" v-if="step>0">上一步</a-button>
      </a-space>
      <a-steps
          :current="step"
          :items="[
      {
        title: '字段设计',
        subTitle:'操作结构体字段与数据sql',
        description:'将替换掉迁移文件xxxx_create_xxxs_table.up.sql down.sql',
      },
      {
        title: '表单验证xxxRequest',
        description,
      },
    ]"
      ></a-steps>
      <a-divider>sql建表方式</a-divider>
      <div v-if="step==0">
        <Table :tablename="table_name"/>
      </div>
    </a-card>
  </div>
</template>

<style scoped>

</style>