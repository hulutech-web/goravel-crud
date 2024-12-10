<template>
    <div>
        <a-card>
            <div class="wrap">
                <div class="header">
                    <div class="header-item">
                        购买节数
                    </div>
                    <div class="header-item">
                        售卖价格范围
                    </div>
                    <div class="header-item">
                        转让手续费
                    </div>
                    <div class="header-item">
                        操作
                    </div>
                </div>
                <div class="add-btn">
                    <a-button type="primary" ghost style="width: 60%" @click="addPrice">
                        <PlusOutlined />
                        新增梯度
                    </a-button>
                    <a-button type="primary" style="width: 10%;margin-left:10px;" @click="checkout">
                        <CheckOutlined />
                        检查
                    </a-button>

                </div>

                <div class="price-list" :class="`bling-${cp.uid}`" v-for="(cp, index) in coursePrices" :key="index">
                    <div class="price-list-item">
                        <a-input-number v-model:value="cp.amount" :min="1" style="width:80px" />
                        <span class="ml-2">节及以上</span>
                    </div>
                    <div class="price-list-item">
                        <a-input-number v-model:value="cp.price" :min="1" style="width:80px" />
                        <span class="ml-2">元/节</span>
                    </div class="price-list-item">
                    <div class="price-list-item">
                        <a-input-number v-model:value="cp.transfer_fee" :min="1" style="width:80px" />
                        <span class="ml-2">%</span>
                    </div>
                    <div class="price-list-item">
                        <a-button type="link" @click="delCp(cp)">删除</a-button>
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import {message} from 'ant-design-vue'
interface CoursePrice {
    uuid: string,
    ID: number,
    personalcourse_id: number,
    amount: number,
    price: number,
    transfer_fee: number
}
const getUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const props = defineProps({
    modelValue: {
        type: Array as () => CoursePrice[],
        default: () => []
    }
})
const coursePrices = ref<CoursePrice[]>([
    {
        uid: getUuid(),
        ID: null,
        personalcourse_id: null,
        amount: undefined,
        price: undefined,
        transfer_fee: undefined
    }
])

coursePrices.value = props.modelValue.map(item => {
    return {
        uid: getUuid(),
        amount: item.amount.toString(),
        price: item.amount.toString(),
        transfer_fee: item.transfer_fee?item.transfer_fee.toString():"",
    }
})
const emit = defineEmits(['update:modelValue'])


const addPrice = () => {
    let newPrice = {
        uid: getUuid(),
        ID: null,
        personalcourse_id: undefined,
        amount: undefined,
        price: undefined,
        transfer_fee: undefined
    }
    coursePrices.value.push(newPrice)
}

const checkout = () => {
    if(coursePrices.value.length==0){
        return false;
    }
    let isOk = coursePrices.value.every(item => !!item.amount && !!item.price && !!item.transfer_fee);
    let notOks = coursePrices.value.filter(item => !item.amount || !item.price || !item.transfer_fee);
    // 给这些元素加上样式bling-action,一秒钟后删除
    notOks.forEach(item => {
        let ele = document.querySelector(`.bling-${item.uid}`)
        ele.classList.add('bling-action');
        setTimeout(() => {
            ele.classList.remove('bling-action');
        }, 300);
    })
    return isOk;
}


const delCp = (cp: CoursePrice) => {
    coursePrices.value = coursePrices.value.filter(p => p.uid !== cp.uid)
}

//监听coursePrices变化
watch(() => coursePrices.value, (newVal) => {
    if (newVal.length > 0) {
        emit('update:modelValue', newVal)
    }
}, {
    deep: true
})

// 对外暴露checkout方法
defineExpose({
    checkout
})
</script>

<style scoped lang="scss">
.wrap {
    width: 860px;
    border: 1px solid #ddd;
}

.header {
    @apply bg-gray-100 p-4 text-gray-800 flex;

    .header-item {
        @apply flex-1 text-center;
        width: 215px;

        &::before {
            content: "*";
            color: red;
        }
    }
}

.add-btn {
    @apply my-4 text-center;
}

.price-list {
    @apply bg-gray-100 p-4 text-gray-950 flex mt-3;

    .price-list-item {
        @apply flex flex-1 justify-center items-center;
        width: 215px;

    }
}

.bling-action {
    @apply bg-red-600 opacity-90;
    transition: all 0.1s;
    z-index: 3000;
}
</style>