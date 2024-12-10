<template>
    <div>
        <div>
            <a-upload v-model:file-list="fileList" :max-count="1" :before-upload="beforeUpload">
                <a-button>
                    <upload-outlined></upload-outlined>
                    上传
                </a-button>
            </a-upload>
            <span class="text-yellow-600">请做好图片裁剪，滚轮缩放图片，以便适应手机端显示</span>
        </div>
        <div class="container">
            <div>
                <div class="content-box">
                    <vue-cropper :autoCrop="true" :outputSize="1" :enlarge="10" ref="cropper" :high="false"
                        :img="imageUrl" :fixed="true" :fixedNumber="props.fixedNumber">
                    </vue-cropper>
                </div>
                <a-space>
                    <a-button :loading="loading" type="primary" @click="click">裁切</a-button>
                </a-space>
            </div>
            <div class="preview-box">
                <img :src="cutImg" alt="" mode="widthFix" style="width:280px;">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { createVNode, h, watch } from 'vue'
import { Modal, message } from 'ant-design-vue';
import { http } from '@/plugins/axios'

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    uploadUrl:{
        type:String,
        default:"/api/upload"
    },
    fixedNumber:{
        type:Array,
        default:()=>{
            return [16,9]
        }
    }
})
const fileList = ref([])
const imageUrl = ref("")
const emit = defineEmits(["update:modelValue"])
// 监听fileList
// 获取env变量
const baseUrl = import.meta.env.VITE_API_URL
// 监听fileList

watch(
    () => fileList.value,
    (newVal) => {
        if (newVal[0]['response']) {
            imageUrl.value = baseUrl + "/upload/" + newVal[0]['response']["data"]
        }
    })

const cutImg = ref("")
// 监听props重点的modelValue
watch(
    () => props.modelValue,
    (newProps) => {
        cutImg.value = newProps
    }, {
    immediate: true
}
);

const beforeUpload = (file) => {
    let img = new Image()
    //将文件转换成png格式
    img.crossOrigin = 'anonymous'
    img.src = URL.createObjectURL(file)
    img.onload = function () {
        imageUrl.value = img.src
    }
    return false;
}
const cropper = ref()
const loading = ref(false)
const click = () => {
    if (imageUrl.value === "") {
        return message.error("请先上传图片")
    }
    loading.value = true;
    cropper.value.getCropBlob(data => {
        // do something
        open(data)
    })
}

const updateCut = (img: string) => {
    emit("update:modelValue", img)
}
const open = (blob) => {
    //将blob转换为图片
    let img = new Image();
    img.src = URL.createObjectURL(blob);
    Modal.confirm({
        title: '确定裁切吗？',
        centered: true,
        width: 600,
        maskClosable: false,
        icon: createVNode(ExclamationCircleOutlined),
        content: h(
            'div',
            { style: 'color:red;' },
            h('img', {
                src: img.src,
                style: 'width:100%;',
                id: "cropimg",
                mode: "widthFix"
            })
        ),
        okText: '保存',
        cancelText: '取消',
        onOk: async () => {
            cutImg.value = img.src
            loading.value = false;
            // 将blob转换为文件
            const file = new File([blob], 'cropped.png', { type: 'image/png' })
            const formData = new FormData()
            formData.append('file', file)
            //发送网络请求上传图片
            const { data } = await http.Upload(baseUrl + props.uploadUrl, formData)
            const cropperedUrl = baseUrl + "/upload/" + data.data
            updateCut(cropperedUrl)
        },
        onCancel() {
            loading.value = false
        }
    });
}



</script>

<style lang="scss" scoped>
.container {
    padding: 10px;
    box-sizing: border-box;
    width: auto;
    height: auto;
    display: flex;
}

.content-box {
    height: 280px;
    width: 280px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #ededed;
    margin: 5px;
    box-shadow: 1px 1px 1px #ededed;
}

.preview-box {
    width: 300px;
    height:  300px;
    background-color: #74b9ff;
    padding: 10px;
    border: 1px dotted #ededed;
    box-sizing: border-box;
    margin: 5px;
    box-shadow: 1px 1px 1px #ededed;
    .pre-box {
        width: 280px;
        text-align: center;
    }
}

.ant-upload {
    width: 200px;
    height: 200px;
}

.ant-upload-select {
    width: 200px;
    height: 200px;
}

.ant-upload-select-text {
    width: 200px;
    height: 200px;
}
</style>