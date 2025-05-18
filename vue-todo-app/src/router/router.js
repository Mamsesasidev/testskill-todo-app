import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import TodosPage from '@/pages/TodosPage.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/todos' },
  { path: '/login', component: LoginPage },
  { 
    path: '/todos', 
    component: TodosPage,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && auth.isLoggedIn) {
    next('/todos')
  } else {
    next()
  }
})

export default router
