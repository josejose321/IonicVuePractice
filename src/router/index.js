import { createRouter, createWebHistory } from '@ionic/vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import TabsPage from '../views/TabsPage.vue';
import authMiddleware from './middleware';
const routes = [
  {
    path: '/',
    redirect: '/auth/dashboard'
  },
  {
    path: '/auth/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/auth/dashboard',
        meta: { requiresAuth: true } 
      },
      {
        path: 'dashboard',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: 'pokemon',
        component: () => import('@/views/Pokemon.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: 'about',
        component: () => import('@/views/About.vue'),
        meta: { requiresAuth: true } 
      },
      {
        path: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: { requiresAuth: true } 
      }
    ]
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/register',
    component:Register
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(authMiddleware);

export default router
