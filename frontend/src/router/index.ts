import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/UserLogin.vue';
import Register from '../pages/UserRegister.vue';
import UserHomes from '../pages/UserHome.vue';
import UserDetails from '../pages/UserDetails.vue';

const routes = [
  {
    path: '/',
    component: UserHomes,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/user_details',
    component: UserDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
