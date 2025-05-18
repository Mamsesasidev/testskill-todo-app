import axios from 'axios';

export const getTodos = async () => {
  const res = await axios.get('/todos');
  return res.data;
};

export const updateTodo = async (todo) => {
  return axios.put(`/todos/${todo.id}`, todo);
};
