<script setup lang="ts">
import { ref } from 'vue'

const isFullScreen = ref<boolean>(false)
const fullScreen = () => {
  isFullScreen.value ? document.exitFullscreen() : document.documentElement.requestFullscreen()
  isFullScreen.value = !isFullScreen.value
}

document.addEventListener('fullscreenchange', (e) => {
  isFullScreen.value = Boolean(document.fullscreenElement)
})
</script>

<template>
  <div class="flex items-center cursor-pointer text-[#574b90] opacity-90">
    <fullscreen-exit-outlined  :style="{fontSize: '24px'}" v-if="isFullScreen"  @click="fullScreen"/>
    <fullscreen-outlined :style="{fontSize: '24px'}"  @click="fullScreen" v-else />
  </div>
</template>
