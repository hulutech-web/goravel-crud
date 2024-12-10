<template>
    <div>
        <a-upload v-model:file-list="fileList" list-type="picture" :action="action"
            :accept="'.mp4, .avi, .wmv, .mov, .mkv'" @remove="handleRemove" @change="handleChange">
            <a-button>
                <VideoCameraOutlined />
                上传
            </a-button>
        </a-upload>
    </div>
</template>
<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';
import { isReactive } from 'vue';
const props = defineProps({
    action: {
        type: String,
        default: "/api/upload"
    },
    modelValue: {
        type: String,
        default: ""
    }
})
const fileList = ref([])
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');
watch(() => props.modelValue, (newVal) => {
    if (newVal && newVal.length > 0) {
        let fileObj = {}
        let reg = new RegExp("(.*)(\\.(mp4|mov))$")
        let name = newVal.match(reg)[1]
        fileObj = {
            uid: Math.random().toString(36).substr(2, 9),
            //正则找到文件名
            name: name,
            status: 'done',
            url: newVal
        }
        fileList.value = [fileObj]
    }
}, {
    immediate: true
})

const emit = defineEmits(["update:modelValue"])
function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};
const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const baseUrl = import.meta.env.VITE_API_URL;
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
        const url = import.meta.env.VITE_API_URL + "/upload/"+ info.file.response.data
        emit("update:modelValue", url);
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

</script>