<script setup lang="ts">
import router from '@/plugins/router'
const route = router.currentRoute

</script>

<template>
  <div>
    <div class="flex justify-start items-center">
      <a-breadcrumb style="height:48px;line-height: 48px;padding: 0 20px;">
      <a-breadcrumb-item v-for="(r, index) of route?.matched" :key="index" v-show="r.meta.title">
        {{ r.meta.title }} 
      </a-breadcrumb-item>
    </a-breadcrumb>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
