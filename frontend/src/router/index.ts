import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordPage.vue'),
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/ChangePasswordPage.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/service/:id',
      name: 'service',
      component: () => import('@/views/ServicePage.vue'),
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: () => import('@/views/UserInfoPage.vue'),
    },
    {
      path: '/add-connections',
      name: 'add-connections',
      component: () => import('@/views/AddConnections.vue'),
    },
    {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: () => import('@/views/AboutUsPage.vue'),
    },
  ],
})

export default router
