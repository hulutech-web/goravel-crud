<script setup lang="ts">
import Table from "./templates/table.vue"

const route = useRoute();
const table_name = ref(route.params.id)
const step = ref(0)
</script>

<template>
  <div>
    <a-card :title="`你正在操作${table_name}表`">
      <template #extra>

        <a-button type="primary" @click="step++" v-if="step<1">下一步</a-button>
        <a-button type="primary" @click="step--" v-if="step>0">上一步</a-button>

      </template>
      <a-steps
          size="small"
          :current="step"
          :items="[
      {
        title: '字段设计',
        subTitle:'操作结构体字段与数据sql',
      },
      {
        title: '表单验证xxxRequest',
        subTitle:'字段验证',
      },
    ]"
      ></a-steps>
      <div v-if="step==0" style="margin-top:12px">
        <Table :tablename="table_name"/>
      </div>
    </a-card>
  </div>
</template>

<style scoped>

</style>