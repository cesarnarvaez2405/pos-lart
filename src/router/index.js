import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "inicio",
    component: () => import("../views/introduccion/index.vue"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/caja",
    name: "caja",
    component: () => import("../views/caja/index.vue"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: () => ({ name: "inicio" }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
