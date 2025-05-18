import axios from 'axios'

const API_BASE = 'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api'

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/login`, {
    email,
    password,
  })
  return response.data
}
