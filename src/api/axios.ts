import axios from 'axios';

const API = axios.create({
  baseURL: 'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
