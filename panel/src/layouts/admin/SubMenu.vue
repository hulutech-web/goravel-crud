<template>
  <a-sub-menu :key='menuInfo.name'>
    <template #icon>
      <component :is='menuInfo.meta?.menu.icon' />
    </template>
    <template #title>{{ menuInfo.meta?.title }}</template>
    <div v-for='item in menuInfo.children' :key='item.name'>
      <a-menu-item :key='item.name' v-if="!item.children">
        {{ item.meta.menu?.title }}
      </a-menu-item>
      <sub-menu v-else :menu-info='item' />
    
    </div>
  </a-sub-menu>
</template>

<script lang='ts'>
// 递归定义子菜单
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {  }
  },
})
</script>

<style scoped>

</style>