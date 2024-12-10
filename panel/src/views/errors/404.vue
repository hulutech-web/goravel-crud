<template>
  <a-result status="404" title="404" sub-title="页面不存在">
    <template #extra>
      <a-button type="primary" @click="toHome">返回首页</a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">

const router = useRouter()
const toHome = () => {
  router.push({ path: `/admin/query` })
}
</script>