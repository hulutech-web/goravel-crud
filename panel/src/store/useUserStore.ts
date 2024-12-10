import { ApiEnum } from '@/enum/ApiEnum'
import { http } from '@/plugins/axios'
import { defineStore } from 'pinia'

export default defineStore('user', {
  state: () => {
    return {
      user: undefined as UserModel | undefined,
    }
  },
  actions: {
    getCacheUser() {
      // 获取LocalStorage中的用户信息
      return useStorage().get(CacheKey.USER_INFO)
    },
  },
})