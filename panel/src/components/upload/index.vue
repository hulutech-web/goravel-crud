<template>
    <div style="width:200px;height: 200px;">
        <a-upload v-model:file-list="fileList" name="file" list-type="picture-card" class="avatar-uploader"
            :show-upload-list="false" :action="action" :before-upload="beforeUpload" @change="handleChange"
            @remove="handleRemove">
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 200px;height:200px;"/>
            <div v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">上传</div>
            </div>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

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
const emit = defineEmits(["update:modelValue"]);
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
        emit("update:modelValue", info.file.response?baseUrl + "/upload/" + info.file.response.data:"");
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

<style>
.ant-upload-select-picture-card {
    width:200px;
    height: 200px;
}
.avatar-uploader > .ant-upload {
  width: 200px !important;
  height: 200px !important;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999 !important;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px ;
  color: #666 !important;
}
</style>