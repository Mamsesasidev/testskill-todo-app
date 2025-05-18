import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [] as any[],
  }),
  actions: {
    async fetchTodos() {
      const auth = useAuthStore()
      if (!auth.token) return
      try {
        const res = await axios.get('https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/todos', {
          headers: { Authorization: auth.token }
        })
        this.todos = res.data
      } catch (e) {
        console.error('Failed fetch todos', e)
      }
    },
    async addTodo(payload: { title: string; description: string }) {
      const auth = useAuthStore()
      try {
        await axios.post('https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/todos', payload, {
          headers: { Authorization: auth.token }
        })
        await this.fetchTodos()
      } catch (e) {
        console.error('Failed add todo', e)
      }
    },
    async deleteTodo(id: number) {
      const auth = useAuthStore()
      try {
        await axios.delete(`https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/todos/${id}`, {
          headers: { Authorization: auth.token }
        })
        await this.fetchTodos()
      } catch (e) {
        console.error('Failed delete todo', e)
      }
    },
    async editTodo(id: number, payload: { title: string; description: string }) {
      const auth = useAuthStore()
      try {
        await axios.put(`https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api/todos/${id}`, payload, {
          headers: { Authorization: auth.token }
        })
        await this.fetchTodos()
      } catch (e) {
        console.error('Failed edit todo', e)
      }
    }
  }
})
