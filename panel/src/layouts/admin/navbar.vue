<script setup lang="ts">
import FullScreen from '@/components/fullscreen/index.vue'
import Breadcrumb from '@/components/breadcrumb/index.vue'
import useMenuStore from '@/store/useMenuStore'
import router from '@/plugins/router'
const menuStore = useMenuStore()
const { open } = useUtil()
const keyword = ref("")
const onSearch = () => {
  console.log(keyword.value)
}
const storage = useStorage()
const user = JSON.parse(storage.get("user"))
const logout = () => {
  localStorage.clear();
  router.push({ name: "auth.login" })
}
</script>

<template>
  <div class="flex justify-between  h-full items-stretch bg-white">
    <div class="text-lg font-bold" style="line-height: 64px;">
        懒人面板
      </div>
    <div class="flex justify-end items-center relative" style="width:300px;">
      <a-space :size="24">
        <a-dropdown :trigger="['hover']" placement="bottom" arrow>
          <a class="ant-dropdown-link" @click.prevent>
            <a-avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="logout" key="1">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>

    </div>
  </div>
</template>