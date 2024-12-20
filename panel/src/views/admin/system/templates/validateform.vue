<template>
  <div>
    <HuluRules v-model="columnData" :ruleCallback="ruleCallback"/>
  </div>
</template>

<script setup>
import useTable from "@/composables/bus/useTable";
const props = defineProps({
  tablename:{
    type:String,
    required:true
  }
})
  const {getColumn,makeRequest} = useTable();
const columnData=ref([])
const init = async ()=>{
  let data =   await getColumn(props.tablename)
  //排除id,created_at,updated_at,deleted_at
  columnData.value = data.filter((item)=>item['column_name']!=='id'&&item['column_name']!=='created_at'&&item['column_name']!=='updated_at'&&item['column_name']!=='deleted_at')
}
init();
const ruleCallback = async (data)=>{
  await makeRequest({
    tablename: props.tablename,
    rule_fields:data
  })
}

</script>

<style lang="scss" scoped>

</style>