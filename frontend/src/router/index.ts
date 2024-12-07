import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Here you put the different routes of the application
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignUpPage.vue'),
    },
    {
      path: '/signup/user-details',
      name: 'user-details',
      component: () => import('@/views/UserDetailsPage.vue'),
    },
    {
      path: '/email-verification',
      name: 'email-verification',
      component: () => import('@/views/EmailVerificationPage.vue'),
    }
  ],
})

export default router
