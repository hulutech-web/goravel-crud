<template>
    <Vue3Lottie :animationData="props.animationData" :height="props.height" :width="props.width" />
</template>
<script setup lang="ts">
import { Vue3Lottie } from 'vue3-lottie'
import animation from './Animation-person.json'
const props = defineProps({
    animationData: {
        type: Object,
        default: animation,
    },
    width: {
        type: Number,
        default: 300
    },
    height: {
        type: Number,
        default: 500
    }
})

</script>