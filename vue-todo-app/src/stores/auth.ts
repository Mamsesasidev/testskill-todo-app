import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router/router'

interface LoginPayload {
  user_name: string
  user_password: string
}

interface AuthResponse {
  success: boolean
  token: string
  userId: number
  username: string
  message?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    username: localStorage.getItem('username') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(payload: LoginPayload) {
      try {
        const res = await axios.post<AuthResponse>(
          'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/users/login',
          payload
        )

        if (res.data.success && res.data.token) {
          this.setAuthData(res.data.token, res.data.userId, res.data.username)
          router.push('/todos')
        } else {
          throw new Error(res.data.message || 'Login failed')
        }
      } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Login error')
      }
    },

    logout() {
      this.clearAuthData()
      router.push('/login')
    },

    setAuthData(token: string, userId: number, username: string) {
      this.token = token
      this.userId = userId
      this.username = username

      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId.toString())
      localStorage.setItem('username', username)
    },

    clearAuthData() {
      this.token = ''
      this.userId = null
      this.username = ''

      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
    }
  }
})
