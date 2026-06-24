import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import AdminPage from '@/pages/AdminPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
