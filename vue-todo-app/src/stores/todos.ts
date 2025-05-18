import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

interface Todo {
  id: number
  title: string
  description: string
}

interface TodoPayload {
  title: string
  description: string
}

const BASE_URL = 'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/todos'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as Todo[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    getAuthHeaders() {
      const auth = useAuthStore()
      if (!auth.token) {
        this.error = 'Unauthorized'
        throw new Error('Unauthorized: No token found')
      }

      return {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }
    },

    async fetchTodos() {
      this.setLoading(true)
      try {
        const res = await axios.get<Todo[]>(BASE_URL, this.getAuthHeaders())
        this.todos = res.data
      } catch (e: any) {
        this.handleAuthError(e, 'Failed to fetch todos')
      } finally {
        this.setLoading(false)
      }
    },

    async addTodo(payload: TodoPayload) {
      this.setLoading(true)
      try {
        await axios.post(BASE_URL, payload, this.getAuthHeaders())
        await this.fetchTodos()
      } catch (e: any) {
        this.handleAuthError(e, 'Failed to add todo')
      } finally {
        this.setLoading(false)
      }
    },

    async deleteTodo(id: number) {
      this.setLoading(true)
      try {
        await axios.delete(`${BASE_URL}/${id}`, this.getAuthHeaders())
        await this.fetchTodos()
      } catch (e: any) {
        this.handleAuthError(e, 'Failed to delete todo')
      } finally {
        this.setLoading(false)
      }
    },

    async editTodo(id: number, payload: TodoPayload) {
      this.setLoading(true)
      try {
        await axios.put(`${BASE_URL}/${id}`, payload, this.getAuthHeaders())
        await this.fetchTodos()
      } catch (e: any) {
        this.handleAuthError(e, 'Failed to edit todo')
      } finally {
        this.setLoading(false)
      }
    },

    setLoading(value: boolean) {
      this.loading = value
      if (value) this.error = null
    },

    handleAuthError(error: any, fallbackMsg: string) {
      const auth = useAuthStore()

      // Jika token tidak valid atau expired
      if (error?.response?.status === 401) {
        this.error = 'Session expired. Please log in again.'
        auth.logout()
      } else {
        this.error = error?.response?.data?.message || error.message || fallbackMsg
      }

      console.error(fallbackMsg, error)
    }
  }
})
