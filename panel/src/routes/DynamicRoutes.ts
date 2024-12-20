//定义一个生成动态路由的方法，传递参数为数组类型
const generateDynamicRoutes = (routes: any[]) => {
    const res = []
    // 定义路由中需要的自定名
    const keys = ['name', 'path', 'children', 'meta']
    // 遍历路由数组去重组可用的路由，不再使用import.meta.globEager
    // let modules = import.meta.globEager('@/views/admin/**/*.vue')
    let modules = import.meta.glob('@/views/admin/**/*.vue', { eager: true })
    //modules中的key为/src/views/admin/address/Index.vue，值中的default为组件

    routes.forEach(item => {
        //定义路由类型的变量
        const newItem = {
            path: "",
            name: "",
            component: null,
            children: [],
            meta: {},
        }

        if (item.component) {

            let newComp = modules[`/src/views/${item.component}.vue`]
            if (newComp) {
                // @ts-ignore
                newItem.component = newComp.default
            }
        }

        for (const key in item) {
            if (keys.includes(key)) {
                newItem[key] = item[key]
            }
        }
        if (newItem.children && newItem.children.length > 0) {
            newItem.children = generateDynamicRoutes(item.children)
        }
        res.push(newItem)
    })
    return res
};

export default generateDynamicRoutes