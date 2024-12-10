import { setup as dayjs } from './dayjs'
import { setup as antdvue } from './antdvue'
import { setup as tailwindcss } from './tailwindcss'
import { setup as pinia } from './pinia'
import { setup as router } from './router'
import { setup as antIcons } from './antIcons'
import { setup as loading } from './provider'
import { setup as VXETable } from './vxe-table'
import { setup as Codemirror } from './codemirror'

const modules = [pinia, antIcons,dayjs,  tailwindcss,antdvue, router,  loading, VXETable,Codemirror]

export default function register(app: App) {
  modules.map((setup) => setup(app))
}
