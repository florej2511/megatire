import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

// @ts-ignore
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard/admin',
      name: 'admin-login',
      component: () => {
        // @ts-ignore
        return import('@/views/LoginAdmin.vue');
      },
      alias: '/login'
    },
    {
      path: '/dashboard/',
      name: 'admin-dashboard',
      component: () => {
        // @ts-ignore
        return import('@/views/HomeView.vue');
      },
      alias: '/dashboard'
    },
    {
      path: '/dashboard/clientes',
      name: 'admin-clientes',
      component: () => {
        // @ts-ignore
        return import('@/views/ClientsView.vue');
      },
      alias: '/dashboard'
    },
    {
      path: '/dashboard/vehicles',
      name: 'admin-vehicles',
      component: () => {
        // @ts-ignore
        return import('@/views/VehiclesView.vue');
      },
      alias: '/dashboard'
    },
    {
      path: '/dashboard/messages',
      name: 'admin-messages',
      component: () => {
        // @ts-ignore
        return import('@/views/MessagesView.vue');
      },
      alias: '/dashboard'
    },
    {
      path: '/clientes',
      name: 'clients-app',
      component: () => {
        // @ts-ignore
        return import('@/views/ClientsSearch.vue')
      }
    }
  ]
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const auth = useAuthStore();
  if(!Object.keys(auth.user).length){
    auth.retrieve()
  }

  console.log('keys', Object.keys(auth.user).length)
  if(Object.keys(auth.user).length == 0 && to.path != '/dashboard/admin'){
    return {
      path: '/dashboard/admin'
    }
  }

  if(to.path == '/dashboard/admin'){
    return true
  }

  return true
})

export default router
