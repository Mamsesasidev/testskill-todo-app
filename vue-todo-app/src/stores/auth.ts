import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router/router'

interface LoginPayload {
  user_name: string
  user_password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userId: Number(localStorage.getItem('userId')) || null,
    username: localStorage.getItem('username') || '',
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(payload: LoginPayload) {
      try {
        const res = await axios.post('https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/users/login', payload)
        if (res.data.success) {
          this.token = res.data.token
          this.userId = res.data.userId
          this.username = res.data.username

          // Save to localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('userId', String(this.userId))
          localStorage.setItem('username', this.username)

          router.push('/todos')
        } else {
          throw new Error(res.data.message || 'Login failed')
        }
      } catch (error) {
        throw error
      }
    },
    logout() {
      this.token = ''
      this.userId = null
      this.username = ''
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      router.push('/login')
    }
  }
})
