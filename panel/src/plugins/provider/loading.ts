import { h, render } from 'vue'
import { Spin } from 'ant-design-vue'

//申明makeSpin函数类型
const makeSpin = (app: App, loading?: boolean) => {
  return (loading: any) => {
    if (loading) {
      //添加到id为app的元素下查找id为admin_content的元素
      const GlobalApp = document.querySelector('#app')
      nextTick(() => {
        //申明元素类型
        const adminContent = GlobalApp?.querySelector('#spin')
        if (adminContent) {
          // adminContent文字不可选，防止用户误操作
          // @ts-ignore
          adminContent.style.userSelect = 'none'
          //整体颜色设置为磨砂黑
          const spinDiv = adminContent.querySelector('#spinDiv')

          const div = document.createElement('div')
          //设置div在其父组件内水平垂直居中
          div.id = 'admin_content_loading'
          div.style.position = 'absolute'
          //背景全透明
          div.style.background = 'rgba(255,255,255,0)'
          div.style.top = '50%'
          div.style.left = '50%'
          div.style.transform = 'translate(-50%, -50%)'

          // 创建Spin组件
          const spin = h(Spin, { size: 'large', tip: '加载中...' })
          // 将Spin组件渲染到div上
          render(spin, div)
          // 3、将div添加到spinDiv中
          spinDiv?.appendChild(div)
        }
      })
    } else {
      nextTick(() => {
        //添加到id为app的元素下查找id为admin_content的元素
        const GlobalApp = document.querySelector('#app')
        const adminContent = GlobalApp?.querySelector('#spin')
        if (adminContent) {
          // @ts-ignore
          adminContent.style.userSelect = 'text'
          const divWrap = adminContent.querySelector('#spinDiv')
          // 查找divWrap下的div元素
          if (divWrap) {
            const div = divWrap.querySelector('div')
            if (div) {
              div.remove()
            }
          }
        }
      })
    }
  }
}

//singleSpin为全局变量，函数类型

let singleSpin: any
export default (app: App) => {
  //provide第二个参数申明为函数类型
  app.provide('Spin', makeSpin(app, true))
  singleSpin = makeSpin(app)
}

export { singleSpin }

/**
 * 使用方式
 * import { inject } from 'vue'
 *
 * let Spin = inject('Spin')
 * Spin(true)
 * setTimeout(() => {
 *   Spin(false)
 * }, 5000)
 */