<template>
  <div style="width: 600px">
    <a-select v-model:value="employee_id" :disabled="disabled" style="width: 100%" @change="change">
      <a-select-option
        v-for="item in selEmployees"
        :key="item.ID"
        :value="item.ID"
      >
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script setup lang="ts">
const { getEmployeeSel } = useEmployee();
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  disabled:{
    type:Boolean,
    default:false
  }
});
const employee_id = ref(props.modelValue);
const selEmployees = ref([]);
const { data } = await getEmployeeSel();
selEmployees.value = data;

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      employee_id.value = newValue;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
const change = (val) => {
  console.log("change",val);
  emit("update:modelValue",val);
};
</script>

<style scoped></style>
