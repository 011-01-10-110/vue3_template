import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/HomeIndex.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginIndex.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/TestIndex.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
