<template>
    <div>
        <a-select v-model:value="eid" style="width: 200px" @change="change">
            <a-select-option :value="item.id" v-for="(item, ind) in salOpts" :key="ind">
                {{ item.name }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script setup lang="ts">
const { saleSel } = useSaleOpt()
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
    }
})
const emit = defineEmits(['update:modelValue'])
const eid = ref(props.modelValue)
const salOpts = ref([])
salOpts.value = await saleSel();
const change = (val) => {
    eid.value = val
    emit('update:modelValue', eid.value)
}
</script>

<style scoped></style>