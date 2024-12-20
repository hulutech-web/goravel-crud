import { RouteEnum } from '@/enum/RouteEnum'
import Translation from "@/views/admin/Translation.vue";
export default {
  path: '/error',
  component: Translation,
  meta: { order: 3, menu: { title: '错误页面', icon: "ErrorComputer" } },
  children: [
    {
      name: RouteEnum.NOT_FOUND,
      path: '404',
      component: () => import('@/views/errors/404.vue'),
      meta: { menu: { title: '404页面', blank: true } },
    },
    {
      path: '/:any(.*)',
      name: 'notFound',
      component: () => import('@/views/errors/404.vue'),
    },
  ],
} as RouteRecordRaw
