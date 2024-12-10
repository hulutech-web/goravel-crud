export default {
  path: "/",
  component: () => import("@/layouts/admin/index.vue"),
  redirect: "/admin/query",
};
