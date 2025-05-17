import axios from 'axios';

const API = axios.create({
  baseURL: 'https://squirrel-fitting-wasp.ngrok-free.app/test-todo-api',
});
const fetchTodos = async () => {
  try {
    const res = await API.get('/todos');
    console.log('Fetch todos response:', res.data);
    setTodos(res.data || []);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
  }
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
function setTodos(arg0: any) {
    throw new Error('Function not implemented.');
}

