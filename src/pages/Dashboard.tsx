import { useEffect, useState, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from '../auth/AuthProvider';
import { Todo } from '../types/todo';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type FilterType = 'all' | 'completed' | 'incomplete';

type TodoFormData = {
  title: string;
  description: string;
};

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>();

  // Fetch todos from API
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/todos');
      setTodos(res.data);
    } catch {
      alert('Gagal memuat data todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Reset form saat editId berubah jadi null (batal edit atau selesai edit)
  useEffect(() => {
    if (editId === null) {
      reset();
    }
  }, [editId, reset]);

  async function onSubmit(data: TodoFormData) {
    try {
      setLoading(true);
      if (editId === null) {
        const res = await API.post('/todos', data);
        setTodos((prev) => [res.data, ...prev]);
      } else {
        const res = await API.put(`/todos/${editId}`, data);
        setTodos((prev) =>
          prev.map((todo) => (todo.id === editId ? res.data : todo))
        );
        setEditId(null);
      }
      reset();
    } catch {
      alert('Gagal menyimpan todo');
    } finally {
      setLoading(false);
    }
  }

  // startEdit dibuat async untuk menunggu setValue supaya form update benar
  async function startEdit(todo: Todo) {
    setEditId(todo.id);
    // Update form values dengan validasi dan dirty update supaya hookform update internal state
    setValue('title', todo.title, { shouldValidate: true, shouldDirty: true });
    setValue('description', todo.description, { shouldValidate: true, shouldDirty: true });
  }

  function cancelEdit() {
    setEditId(null);
    reset();
  }

  async function deleteTodo(id: number) {
    if (!window.confirm('Yakin ingin menghapus todo ini?')) return;
    try {
      await API.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert('Gagal menghapus todo');
    }
  }

  async function toggleComplete(todo: Todo) {
    try {
      const res = await API.patch(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? res.data : t))
      );
    } catch {
      alert('Gagal mengubah status todo');
    }
  }

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    })
    .filter((todo) =>
      [todo.title, todo.description].some((text) =>
        text.toLowerCase().includes(search.toLowerCase())
      )
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-blue-300 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            {/* Icon note */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v6a2 2 0 01-2 2z"
                />
        </svg>

            <h1 className="text-3xl font-bold">Todo Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
            <button
            onClick={() => {
                logout();
                navigate('/login');
            }}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-white"
            aria-label="Logout"
            >
            Logout
            </button>
        </div>
        </header>


      <main className="flex-grow container mx-auto px-4 py-6 max-w-3xl">
        {/* Gunakan key pada form agar reset form lebih reliable saat editId berubah */}
        <form
          key={editId ?? 'new'}
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 bg-white dark:bg-gray-800 p-6 rounded shadow"
        >
          <div className="mb-4">
            <input
              {...register('title', { required: 'Title wajib diisi' })}
              placeholder="Title"
              className={`w-full px-4 py-2 rounded border focus:outline-none focus:ring ${
                errors.title
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              autoFocus
              disabled={loading || isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          <div className="mb-4">
            <textarea
              {...register('description', { required: 'Description wajib diisi' })}
              placeholder="Description"
              rows={3}
              className={`w-full px-4 py-2 rounded border resize-y focus:outline-none focus:ring ${
                errors.description
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              disabled={loading || isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-white transition"
            >
              {editId === null ? 'Add Todo' : 'Update Todo'}
            </button>
            {editId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading || isSubmitting}
                className="px-5 py-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6 space-y-3 sm:space-y-0">
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            disabled={loading}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            disabled={loading}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {loading && (
          <p className="text-center mb-4 text-gray-600 dark:text-gray-400">Loading...</p>
        )}

        <ul className="space-y-3">
          {filteredTodos.length === 0 && !loading && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Tidak ada todo ditemukan.
            </p>
          )}
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 rounded border bg-white dark:bg-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-sm"
            >
              <div className="flex items-start sm:items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="mt-1 sm:mt-0 w-5 h-5 cursor-pointer"
                  aria-label={`Mark todo ${todo.title} as completed`}
                  disabled={loading}
                />
                <div>
                  <span
                    className={`font-semibold text-lg ${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <p
                    className={`text-sm mt-1 ${
                      todo.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {todo.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 space-x-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(todo)}
                  className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label={`Edit todo ${todo.title}`}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 border rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:hover:text-red-300 transition"
                  aria-label={`Delete todo ${todo.title}`}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
