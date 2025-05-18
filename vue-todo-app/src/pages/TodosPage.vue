<template>
  <div>
    <!-- Header -->
    <header class="bg-[#42b883] text-white flex justify-between items-center p-4">
      <h1 class="text-lg font-semibold">Dashboard Todo Vue</h1>
      <button @click="logout" class="bg-white text-[#42b883] font-semibold px-4 py-1 rounded hover:bg-gray-200">Logout</button>
    </header>

    <!-- Content -->
    <div class="max-w-xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <!-- Add Todo Form -->
      <form @submit.prevent="addTodo" class="mb-6 space-y-3">
        <input
          v-model="newTitle"
          placeholder="Title"
          class="w-full border rounded px-3 py-2"
          required
        />
        <textarea
          v-model="newDescription"
          placeholder="Description"
          class="w-full border rounded px-3 py-2"
          rows="3"
          required
        ></textarea>
        <button type="submit" class="bg-[#42b883] text-white px-4 py-2 rounded hover:bg-[#369c6f]">Add Todo</button>
      </form>

      <!-- Todo List -->
      <ul class="space-y-4">
        <li v-for="todo in todosStore.todos" :key="todo.id" class="border rounded p-4">
          <div v-if="editingTodoId === todo.id" class="space-y-2">
            <input
              v-model="editingTitle"
              placeholder="Edit title"
              class="w-full border rounded px-2 py-1"
              required
            />
            <textarea
              v-model="editingDescription"
              placeholder="Edit description"
              class="w-full border rounded px-2 py-1"
              rows="2"
              required
            ></textarea>
            <div class="flex gap-2 justify-end">
              <button @click="cancelEdit" type="button" class="px-3 py-1 rounded border hover:bg-gray-100">Cancel</button>
              <button @click="saveEdit(todo.id)" type="button" class="px-3 py-1 rounded bg-[#42b883] text-white hover:bg-[#369c6f]">Save</button>
            </div>
          </div>
          <div v-else>
            <h3 class="font-semibold">{{ todo.title }}</h3>
            <p class="text-gray-600 mb-2">{{ todo.description }}</p>
            <div class="flex gap-4 justify-end text-sm">
              <button @click="startEdit(todo)" class="text-[#42b883] hover:underline">Edit</button>
              <button @click="deleteTodo(todo.id)" class="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodosStore } from '@/stores/todos'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const todosStore = useTodosStore()
const auth = useAuthStore()
const router = useRouter()

const newTitle = ref('')
const newDescription = ref('')

const editingTodoId = ref<number | null>(null)
const editingTitle = ref('')
const editingDescription = ref('')

onMounted(() => {
  todosStore.fetchTodos()
})

const addTodo = async () => {
  if (!newTitle.value.trim() || !newDescription.value.trim()) return

  try {
    // Asumsi store memiliki method addTodo yang menerima object {title, description}
    await todosStore.addTodo({
      title: newTitle.value.trim(),
      description: newDescription.value.trim()
    })
    // Setelah berhasil tambah, reset input
    newTitle.value = ''
    newDescription.value = ''
    // Update list (jika store tidak otomatis update)
    await todosStore.fetchTodos()
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

const deleteTodo = async (id: number) => {
  await todosStore.deleteTodo(id)
}

const startEdit = (todo: any) => {
  editingTodoId.value = todo.id
  editingTitle.value = todo.title
  editingDescription.value = todo.description
}

const cancelEdit = () => {
  editingTodoId.value = null
  editingTitle.value = ''
  editingDescription.value = ''
}

const saveEdit = async (id: number) => {
  if (!editingTitle.value.trim() || !editingDescription.value.trim()) return
  await todosStore.editTodo(id, {
    title: editingTitle.value.trim(),
    description: editingDescription.value.trim()
  })
  cancelEdit()
}

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>
