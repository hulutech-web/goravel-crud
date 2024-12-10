<template>
    <div>
        <div style="max-width:600px;border:2px dotted #f2f2f2;padding:10px;margin-bottom:10px">
            <a-descriptions size="small" :column="4" :title="personalcourse.name" layout="vertical" bordered>
                <a-descriptions-item label="价格">
                    {{ personalcourse.price }}
                </a-descriptions-item>
                <a-descriptions-item label="类型" v-if="personalcourse.course_type">
                    {{ personalcourse.course_type['name'] }}
                </a-descriptions-item>
                <a-descriptions-item label="时长">{{ personalcourse.duration }}分钟</a-descriptions-item>
                <a-descriptions-item label="授课老师">{{ personalcourse.Employee?.nick_name }}</a-descriptions-item>
                <a-descriptions-item label="海报">
                    <img :src="personalcourse.cover_image" style="width:120px" mode="widthFix" alt="">
                </a-descriptions-item>
                <a-descriptions-item label="详情">
                    <div class="table-container" v-html="personalcourse.introduction"></div>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </div>
</template>

<script setup lang="ts">

const { showPersonalcourse } = usePersonalcourse()
const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})
const personalcourse = ref({})
const init = async () => {
    if (props.id) {
        const { data } = await showPersonalcourse(props.id)
        personalcourse.value = data
    }
}
init();
</script>

<style>
.table-container table {
    border-collapse: collapse;
    width: 100%;
}

.table-container th,
.table-container td {
    border: 1px solid #000;
    padding: 8px;
}

.table-container th {
    background-color: #f2f2f2;
}
</style>