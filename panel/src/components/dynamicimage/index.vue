<template>
    <div class="mx-3 w-96">
        <a-form-item v-for="(item, index) in itemArr" :key="index" label="标题">
        <a-input v-model:value="item.name" placeholder="标题" style="width: 60%; margin-right: 8px" />
        <div class="mt-2">
            <Upload v-model="item.url"/>
        </div>
        <MinusCircleOutlined v-if="itemArr.length > 1" class="dynamic-delete-button" @click="removeItem(item)" />
    </a-form-item>
    <a-form-item>
        <a-button type="dashed" style="width: 60%" @click="addItem">
            <PlusOutlined />
            添加内容
        </a-button>
    </a-form-item>
    <a-form-item>
        <a-button type="primary" html-type="submit" @click="submitForm">保存</a-button>
    </a-form-item>
    </div>
    
</template>
<script lang="ts" setup>
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:modelValue'])
const itemArr = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const addItem = () => {
    itemArr.value.push({
        name: "",
        url: "",
    })
}
const submitForm = () => {
    console.log(itemArr.value)
}
const removeItem = (item: any) => {
    let index = itemArr.value.indexOf(item)
    if (index !== -1) {
        itemArr.value.splice(index, 1)
    }
}
</script>
<style scoped>
.dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 4px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
}

.dynamic-delete-button:hover {
    color: #777;
}

.dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>