//平移组件
import Translation from "@/views/admin/Translation.vue";
export default [
  {
    path: "/admin",
    redirect: "/admin/query",
    component: () => import("@/layouts/admin/index.vue"),
    children: [
      {
        name: "admin.query",
        path: "query",
        component: () => import("@/views/admin/dashboard/query.vue"),
        meta: {
          title: "首页统计",
          menu: { title: "首页统计", icon: "BarChartOutlined", order: 1000 },
        },
        children: [],
      },
      {
        name: "admin.system",
        path: "system",
        component: Translation,
        meta: {
          auth: true,
          title: "系统管理",
          menu: { title: "系统管理", icon: "SettingOutlined", order: 200 },
        },
        children: [
          {
            name: "admin.system.index",
            path: "/admin/system/index",
            component: () => import("@/views/admin/system/index.vue"),
            meta: {
              auth: true,
              title: "系统管理",
              menu: { title: "系统管理", icon: "HomeOutlined", order: 201 },
            },
          },
          {
            name: "admin.system.column",
            path: "/admin/system/:id/column",
            component: () => import("@/views/admin/system/column.vue"),
            meta: {
              auth: true,
              title: "系统管理",
              menu: { title: "系统管理", icon: "HomeOutlined", order: 201,show:false },
            },
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[];
