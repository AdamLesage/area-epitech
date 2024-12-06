import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Here you put the different routes of the application
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
  ],
})

export default router
