import { createRouter, createWebHashHistory } from 'vue-router'
import auth from '@/middleware/auth';

import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import ServicePage from '@/views/ServicePage.vue';
import CardPage from '@/views/CardPage.vue';
import CategoryPage from '@/views/CategoryPage.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
import TermsPage from '@/views/TermsPage.vue';
import MentionsPage from '@/views/MentionsPage.vue';
import Cook from '@/views/CookPage.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
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
      component: HomePage,
    },
    {
      path: '/service/:id',
      name: 'service',
      component: ServicePage,
    },
    {
      path: '/service/:id/category/:category',
      name: 'service-category',
      component: CategoryPage,
    },
    {
      path: '/service/:id/category/:category/:type/:card',
      name: 'service-card',
      component: CardPage,
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: () => import('@/views/UserInfoPage.vue'),
      beforeEnter: auth,
    },
    {
      path: '/add-connections',
      name: 'add-connections',
      component: () => import('@/views/AddConnections.vue'),
      beforeEnter: auth,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardPage.vue'),
      beforeEnter: auth,
    },
    {
      path: '/auth-callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackPage.vue'),
    },
    {
      path: '/workshop',
      name: 'workshop',
      component: () => import('@/views/WorkshopPage.vue'),
      beforeEnter: auth,
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('@/views/ExplorePage.vue'),
    },
    {
      path: '/not-authorized',
      name: 'not-authorized',
      component: () => import('@/views/NotAuthorizedPage.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPage,
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsPage,
    },
    {
      path: '/mentions',
      name: 'mentions',
      component: MentionsPage,
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: Cook,

    },
    {
      // Catch-all route
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue'),
    },
  ],
})

export default router
