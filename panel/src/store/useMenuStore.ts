import { defineStore } from 'pinia'
import router from '@/plugins/router'
export default defineStore('adminMenu', {
  state: () => {
    return {
      menus: [],
      selectedKeys: [],//二级菜单
      openKeys: [],//一级菜单
    }
  },
  actions: {
    routeTo(activeKey: string) {
      this.selectedKeys = [activeKey]
      // 路由跳转
      if (activeKey!="") {
        router.push({ name: activeKey })
      }
    }
  },
}
)
