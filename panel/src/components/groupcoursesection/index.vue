<template>
    <div>
        <div style="max-width:600px;border:2px dotted #f2f2f2;padding:10px;margin-bottom:10px">
            <a-descriptions size="small" :title="groupcourse.name" layout="vertical" bordered>
                <a-descriptions-item label="价格">
                    {{ groupcourse.price }}
                </a-descriptions-item>
                <a-descriptions-item label="课卡颜色">{{ groupcourse.color }}</a-descriptions-item>
                <a-descriptions-item label="类型" v-if="groupcourse.course_type">
                    {{ groupcourse.course_type['name'] }}
                </a-descriptions-item>
                <a-descriptions-item label="消耗热量">{{ groupcourse.calorie }}</a-descriptions-item>
                <a-descriptions-item label="时长">{{ groupcourse.duration }}分钟</a-descriptions-item>
                <a-descriptions-item label="训练强度">{{ groupcourse.intensity }}</a-descriptions-item>
                <a-descriptions-item label="海报" :span="3">
                    <img :src="groupcourse.cover_image" style="width:120px" mode="widthFix" alt="">
                </a-descriptions-item>
                <a-descriptions-item label="详情" :span="3">
                    <div class="table-container" v-html="groupcourse.introduction"></div>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </div>
</template>

<script setup lang="ts">

const { showGroupcourse } = useGroupcourse()
const props = defineProps({
    id: {
        type: Number,
        required: true
    }
})
const groupcourse = ref({})
const init = async () => {
    if (props.id) {
        const { data } = await showGroupcourse(props.id)
        groupcourse.value = data
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
.table-container img{
    width:400px;
    height:auto;
}
</style>