import { createRouter, createWebHashHistory } from 'vue-router'
import http from '@/api/http'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',         name: 'home',     component: () => import('@/pages/HomePage.vue') },
    { path: '/catalog',  name: 'catalog',  component: () => import('@/pages/CatalogPage.vue') },
    { path: '/catalog/:id', name: 'product', component: () => import('@/pages/ProductPage.vue') },
    { path: '/cart',     name: 'cart',     component: () => import('@/pages/CartPage.vue') },
    { path: '/profile',  name: 'profile',  component: () => import('@/pages/ProfilePage.vue') },
    { path: '/contacts', name: 'contacts', component: () => import('@/pages/ContactsPage.vue') },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/AdminPage.vue'),
      beforeEnter: async () => {
        try {
          const { data } = await http.get<{ admin: boolean }>('/admin/me')
          if (data.admin) return true
        } catch {
          /* not admin */
        }
        return '/'
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
