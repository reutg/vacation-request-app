import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/ValidatorView.vue'),
    },
    {
      path: '/request',
      name: 'request',
      component: () => import('@/views/RequestsView.vue'),
    },
  ],
})

export default router
