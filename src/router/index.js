import { createRouter, createWebHistory } from "vue-router";
import { estaAutenticado } from "../utils/utilsAuth";

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
    path: "/auth/login",
    name: "login",
    component: () => import("../views/auth/login.vue"),
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

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !estaAutenticado()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
