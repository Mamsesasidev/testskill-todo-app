import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../auth/AuthProvider';
import { Todo } from '../types/todo';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchTodos = async () => {
    const res = await API.get('/todos');
    setTodos(res.data.todos);
  };

  const addTodo = async () => {
    await API.post('/todos', { title, description: desc });
    setTitle('');
    setDesc('');
    fetchTodos();
  };

  const toggleComplete = async (todo: Todo) => {
    await API.put(`/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded text-white">
          Logout
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Tambah Todo</h2>
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded text-black"
        />
        <textarea
          placeholder="Deskripsi"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 mb-2 border rounded text-black"
        />
        <button onClick={addTodo} className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </div>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`p-4 rounded shadow flex justify-between items-center ${
              todo.completed ? 'bg-green-100 dark:bg-green-800' : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <p>{todo.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleComplete(todo)}
                className={`px-3 py-1 rounded ${
                  todo.completed ? 'bg-yellow-600' : 'bg-green-600'
                } text-white`}
              >
                {todo.completed ? 'Belum Selesai' : 'Selesai'}
              </button>
              <button onClick={() => deleteTodo(todo.id)} className="bg-red-600 px-3 py-1 rounded text-white">
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
