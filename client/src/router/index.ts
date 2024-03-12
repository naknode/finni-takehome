import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import EmptyLayout from '../layouts/EmptyLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { layout: 'EmptyLayout' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { layout: 'DefaultLayout' }
    }
  ]
})

export default router
