import {useTitle} from '@vueuse/core'
import config from '@/config'
import {message} from 'ant-design-vue'

let isInit = false
export default (router: Router) => {
    router.beforeEach(beforeEach)
}

//路由守卫
async function beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    await init()
    const {isLogin} = useAuth()
    // if (to.meta.auth && !isLogin()) {
    //     setTimeout(() => {
    //         message.error("尚未登录或登录已过期")
    //         return {name: "auth.login"}
    //     }, 300)
    // }
    //
    // if (to.meta.guest && isLogin()) {
    //     setTimeout(() => {
    //         message.error("尚未登录或登录已过期")
    //         return '/auth/login'
    //     }, 300)
    // }

    if (to.meta.title) useTitle(to.meta.title)
}

//清空表单验证store数据
async function init() {
    await Promise.all(config.middleware.map((middleware) => middleware()))
}
