<script setup lang="ts">
import Table from "./templates/table.vue"
import ValidateForm from "./templates/validateform.vue"
import useTable from "@/composables/bus/useTable";

const {makeRouter, makeController} = useTable();
const route = useRoute();
const table_name = ref(route.params.id)
const step = ref(0)
const ruleData = ref([])
const mkRouter = async () => {
  await makeRouter({tablename: table_name.value})
}
const mkControl = async () => {
  await makeController({tablename: table_name.value})
}
</script>

<template>
  <div>
    <a-card :title="`你正在操作${table_name}表`">
      <template #extra>
        <a-space>

          <a-button type="primary" @click="step--" v-if="step>0">上一步</a-button>
          <a-button type="primary" @click="step++" v-if="step<3">下一步</a-button>
        </a-space>

      </template>
      <a-steps
          size="small"
          :current="step"
          :items="[
      {
        title: '表单验证xxxRequest',
        subTitle:'字段验证',
      },
       {
        title: '控制器',
        subTitle:'控制器验证',
      },
      {
        title: '路由',
        subTitle:'路由配置',
      },
    ]"
      ></a-steps>

      <div v-if="step==0" style="margin-top:12px">
        <ValidateForm :tablename="table_name"/>
      </div>
      <div v-if="step==1" style="margin-top:12px">
        <a-button type="primary" @click="mkControl">生成控制器</a-button>
      </div>
      <div v-if="step==2" style="margin-top:12px">
        <a-button type="primary" @click="mkRouter">生成路由</a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>

</style>