<template>

    <a-form-item v-for="(item, index) in itemArr" :key="index" label="选项">
        <a-input v-model:value="item.name" placeholder="属性名" style="width: 60%; margin-right: 8px" />
        <a-upload v-model:file-list="fileList" name="file" list-type="picture" class="avatar-uploader" :max="1"
            :multiple="false"  :action="action" :before-upload="beforeUpload"
            @change="handleChange" @remove="handleRemove">
            <a-button>
                <upload-outlined></upload-outlined>
                Upload
            </a-button>
        </a-upload>
        <MinusCircleOutlined v-if="itemArr.length > 1" class="dynamic-delete-button" @click="removeItem(item)" />
    </a-form-item>
    <a-form-item>
        <a-button type="dashed" style="width: 60%" @click="addItem">
            <PlusOutlined />
            添加标签
        </a-button>
    </a-form-item>
    <a-form-item>
        <a-button type="primary" html-type="submit" @click="submitForm">保存</a-button>
    </a-form-item>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue';
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    action: {
        type: String,
        default: "/api/upload"
    },
})
const emit = defineEmits(['update:modelValue'])
const itemArr = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const addItem = () => {
    itemArr.value.push({
        name: "",
        value: "",
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
// 上传相关
const imageUrl = ref<string>('');
watch(() => props.modelValue, (newVal) => {
    imageUrl.value = newVal
}, {
    immediate: true
})

function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
}

const fileList = ref([]);
const loading = ref<boolean>(false);
const baseUrl = import.meta.env.VITE_API_URL;
const PORT = import.meta.env.VITE_API_PORT;

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        loading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
            imageUrl.value = base64Url;
            loading.value = false;
        });
        emit("update:modelValue", info.file.response ? baseUrl + "/upload/" + info.file.response.data : "");
    }
    if (info.file.status === 'error') {
        loading.value = false;
        message.error('upload error');
    }
};
const handleRemove = (file: UploadFile) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
    emit("update:modelValue", newFileList.map(item => {
        if (isReactive(item)) {
            return item.url
        } else {
            return item.response ? baseUrl + "/upload/" + item.response.data : ""
        }
    }));
}
const beforeUpload = (file: UploadProps['fileList'][number]) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

</script>
<style scoped>

</style>