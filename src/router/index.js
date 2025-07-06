import { createRouter, createWebHistory } from "vue-router";
import { esAdministrador, estaAutenticado } from "../utils/utilsAuth";

const routes = [
  {
    path: "/",
    name: "inicio",
    component: () => import("../views/introduccion/index.vue"),
    meta: {
      requireAuth: false,
      requiereAdmin: false,
    },
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/auth/login.vue"),
    meta: {
      requireAuth: false,
      requiereAdmin: false,
    },
  },
  {
    path: "/caja",
    name: "caja",
    component: () => import("../views/caja/index.vue"),
    meta: {
      requireAuth: false,
      requiereAdmin: false,
    },
  },
  {
    path: "/config",
    name: "configuracion",
    component: () => import("../views/configuracion/index.vue"),
    meta: {
      requireAuth: true,
      requiereAdmin: true,
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

  if (to.meta.requiereAdmin && !esAdministrador()) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
