import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/UserLogin.vue';
import Register from '../views/UserRegister.vue';
import UserHomes from '../views/UserHome.vue';

const routes = [
  {
    path: '/',
    name: 'UserHomes',
    component: UserHomes,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
