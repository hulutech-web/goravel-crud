import { defineStore } from 'pinia'
import router from '@/plugins/router'
export default defineStore('permissions', {
    state: () => {
        return {
            routes: undefined as any,
        }
    },
    actions: {
        GenerateRoutes(routes: RouteRecordRaw[]) {
            routes.forEach((route: any) => {
                //在admin下添加动态路由
                router.addRoute("admin", route)
            })
        },
    },
})
