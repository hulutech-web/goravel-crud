export default [
    {
        path: '/admin',
        name: 'admin',//布局路由
        component: () => import('@/layouts/admin/index.vue'),
        children: [
            {
                path: "/error",//错误路由
                name: "error",
                component: () => import('@/layouts/error/index.vue'),
                children: [
                    {
                        path: "/admin/error/404",
                        name: "error.404",
                        component: () => import('@/views/admin/errors/404.vue')
                    }
                ]
            },
        ]
    },
    {
        path: '/auth',
        name: 'auth',//布局路由
        component: () => import('@/layouts/auth/index.vue'),
        redirect: "/auth/login",
        children: [
            {
                path: "/auth/login",
                name: "auth.login",
                component: () => import('@/views/auth/login.vue'),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/auth/login',
    }
] as RouteRecordRaw[];