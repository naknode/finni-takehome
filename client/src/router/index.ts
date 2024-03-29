import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PatientPage from '../views/PatientPage.vue'
import PatientCreate from '../views/PatientCreate.vue'
import DashboardView from '../views/DashboardView.vue'

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
    },
    {
      path: '/patient/:uuid',
      name: 'patient',
      component: PatientPage,
      props: true,
      meta: { layout: 'DefaultLayout' }
    },
    {
      path: '/patient/create',
      name: 'patient-create',
      component: PatientCreate,
      props: true,
      meta: { layout: 'DefaultLayout' }
    }
  ]
})

export default router
