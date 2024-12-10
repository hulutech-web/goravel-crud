import  * as antIcon  from '@ant-design/icons-vue'
let antIcons: any = antIcon;
const setup = (app: App) => {
    Object.keys(antIcons).forEach(key => {
        app.component(key, antIcons[key])
    })
    app.config.globalProperties.$antIcons = antIcons
}
export { setup }
