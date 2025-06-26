import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import { getTokenFromLocalStorage } from '@/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/Principal.vue'),
      children: [
        {
          path: 'productos',
          name: 'productos',
          component: () => import('../views/ProductoView.vue'),
        },
        {
          path: 'clientes',
          name: 'clientes',
          component: () => import('../views/ClienteView.vue'),
        },
        {
          path: 'distribuidoras',
          name: 'distribuidoras',
          component: () => import('../views/DistribuidoraView.vue'),
        },
        {
          path: 'inventarios',
          name: 'inventarios',
          component: () => import('../views/InventarioView.vue'),
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: () => import('../views/VentaView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const publicPages = ['/','/login']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
