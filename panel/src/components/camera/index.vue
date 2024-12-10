<template>
    <div class="p-3">
        <a-image :width="200" :src="modelValue" fallback="/user.png" />
        <div class="mt-3">
            <span class="text-blue-500 font-bold">拍摄:</span>
            <a-switch v-model:checked="isPhoto" checked-children="开" un-checked-children="关" />
        </div>
        <div v-if="isPhoto" class="mt-2">
            <div class="flex">
                <div class="publish" style="position: relative;">
                    <video ref="video" width="300" height="300"></video>
                    <div class="overlayer" ref="overlayer"></div>
                </div>
                <canvas style="display: none" id="canvasCamera" width="300" height="300"></canvas>
                <div v-if="imgSrc" class="img_bg_camera">
                    <img :src="imgSrc" class="tx_img" width="300" height="300" />
                </div>
                <div v-else class="ml-3">
                    <div class="bg-blue-200 text-white flex justify-center items-center"
                        style="width:300px;height:300px;">
                        显示区</div>
                </div>
                <div>
                    <section class="text-gray-400 ml-3">人脸照片</section>
                    <section class="text-gray-400 ml-3">对准圆形圈内位置拍照</section>
                </div>
            </div>

            <div class="mt-3 flex">
                <a-space>
                    <a-button type="primary" @click="OpenCamera">打开摄像头</a-button>
                    <a-button type="primary" danger @click="setImage">
                        <CameraOutlined />
                        拍照
                    </a-button>
                    <a-button type="primary" @click="uploadImg">
                        <CloudUploadOutlined />上传
                    </a-button>
                    <a-button danger type="link" @click="CloseCamera">关闭摄像头</a-button>
                </a-space>
            </div>
        </div>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { http } from '@/plugins/axios';
export default {
    props: {
        modelValue: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            mediaStreamTrack: {},
            video_stream: '', // 视频stream
            imgSrc: '', // 拍照图片
            canvas: null,
            context: null,
            formData: null,
            isOpen: false,
            // 拍摄
            isPhoto: false,
        };
    },
    methods: {
        // 调用打开摄像头功能
        getCamera() {
            // 获取 canvas 画布
            this.canvas = document.getElementById('canvasCamera');
            this.context = this.canvas.getContext('2d');
            // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }
            // 正常支持版本
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                })
                .then((stream) => {
                    // 摄像头开启成功,
                    this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                    // 设置视频流宽高为300*300
                    this.video_stream = stream;
                    this.$refs.video.srcObject = stream;
                    this.$refs.video.play();
                    this.$refs.video.width = 300; // 设置视频流宽度为300
                    this.$refs.video.height = 300; // 设置视频流高度为300
                    this.initOverlayer()
                    this.isOpen = true
                })
                .catch(err => {
                    console.log(err);
                    message.error("摄像头打开失败")
                });
        },
        //初始化蒙层
        initOverlayer() {
            const video = this.$refs.video;
            let overlayerHeight = video.height;
            let overlayerWidth = video.height;
            console.log(overlayerWidth, overlayerHeight)
            //设置位置偏移
            let overlayerLeft = (video.offsetWidth - overlayerWidth) / 2;
            let overlayerTop = (video.offsetHeight - overlayerHeight) / 2;
            this.$refs.overlayer.style.width = overlayerWidth + 'px';
            this.$refs.overlayer.style.height = overlayerHeight + 'px';
            this.$refs.overlayer.style.left = overlayerLeft + 'px';
            this.$refs.overlayer.style.top = overlayerTop + 'px';
            this.$refs.overlayer.style.position = 'absolute';
            this.$refs.overlayer.style.zIndex = 100;

            // 创建伪元素样式规则
            let beforeStyle = `
        .overlayer::before { 
            content: ""; 
            width: 100%; 
            height: 100%; 
            border-radius: 50%; 
            position: absolute; 
            left: 0; 
            top: 0; 
            background-color: rgba(0,0,0,0.5); /* before伪类内部设置半透明 */
            z-index: -1; 
            clip-path: circle(50% at 50% 50%); /* 设置圆形遮罩 */
        }`;

            // 创建新的 <style> 元素
            let styleElement = document.createElement('style');
            styleElement.type = 'text/css';

            // 将规则添加到 <style> 元素中
            if (styleElement.styleSheet) {
                // 适用于 IE 的方式
                styleElement.styleSheet.cssText = beforeStyle;
            } else {
                // 适用于其他浏览器的方式
                styleElement.appendChild(document.createTextNode(beforeStyle));
            }

            // 将 <style> 元素添加到文档头部
            document.head.appendChild(styleElement);
        },

        // 拍照 绘制图片
        setImage() {
            if (this.isOpen == false) {
                return message.error("请检查摄像头是否连接...")
            }
            console.log('拍照');
            const video = this.$refs.video;
            const canvas = this.canvas;

            // 设置画布尺寸为视频流的高度
            canvas.width = video.videoHeight;
            canvas.height = video.videoHeight;

            // 计算绘制图片的起始位置
            const x = (video.videoWidth - video.videoHeight) / 2;
            const y = 0;

            // 清空画布
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            // 绘制图片
            this.context.drawImage(
                video,
                x,
                y,
                video.videoHeight, // 使用视频流的高度作为正方形图片的边长
                video.videoHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );
            // 获取图片base64链接
            const image = canvas.toDataURL('image/png');
            this.imgSrc = image;
            // 从canvas获取图片的blob数据
            canvas.toBlob((blob) => {
                var formData = new FormData();
                formData.append('file', blob, 'image.png');
                this.formData = formData
            })
        },
        // 打开摄像头
        OpenCamera() {
            console.log('打开摄像头');
            this.getCamera();
        },
        // 关闭摄像头
        CloseCamera() {
            console.log('关闭摄像头');
            if (this.$refs.video.srcObject) {
                this.$refs.video.srcObject.getTracks()[0].stop();
            }
            this.$refs.overlayer.style = ""
        },
        async uploadImg() {
            if (!this.imgSrc) {
                message.error('请先拍照');
                return;
            }
            if (!this.formData) {
                message.error('请先拍照');
                return;
            }
            const baseUrl = import.meta.env.VITE_API_URL
            const { data } = await http.Upload(baseUrl + "/api/upload", this.formData)
            this.$emit('update:modelValue', baseUrl + "/upload/" + data.data)
        }
    },
};
</script>

<style lang="scss" scoped>
.publish {
    padding: 0 5px;
    border: 1px dashed #999;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
}

video {
    width: 300px;
    height: 300px;
}

canvas {
    width: 300px;
    height: 300px;
}

.img_bg_camera {
    img {
        width: 300px;
        height: 300px;
    }
}
</style>
