// api/todos.ts
import axios from 'axios'

const API_BASE = 'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api'

export const getTodos = async (token: string) =>
  await axios.get(`${API_BASE}/todos`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data)

export const addTodo = async (token: string, title: string) =>
  await axios.post(`${API_BASE}/todos`, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const deleteTodo = async (token: string, id: number) =>
  await axios.delete(`${API_BASE}/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

export const editTodo = async (token: string, id: number, title: string) =>
  await axios.put(`${API_BASE}/todos/${id}`, { title }, {
    headers: { Authorization: `Bearer ${token}` },
  })