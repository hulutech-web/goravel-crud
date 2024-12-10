export default {
  path: '/auth',
  component: () => import('@/layouts/auth/index.vue'),
  redirect: "/auth/login",
  meta: { noPrefix: true },
  children: [
    {
      path: 'login',
      name: 'auth.login',
      component: () => import('@/views/auth/login.vue'),
    },
    {
      path: 'register',
      name: 'auth.register',
      component: () => import('@/views/auth/register.vue'),
    },
    {
      path: 'forgot_password',
      name: 'auth.forgot_password',
      component: () => import('@/views/auth/forgot_password.vue'),
    },
  ],
} as RouteRecordRaw
