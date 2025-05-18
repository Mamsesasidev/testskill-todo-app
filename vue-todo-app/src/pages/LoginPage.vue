<template>
  <div class="min-h-screen flex items-center justify-center bg-[#42b883] px-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-semibold text-center mb-8 text-gray-800">Login</h2>
      <form @submit.prevent="submitLogin" class="space-y-6">
        <input
          v-model="user_name"
          type="email"
          placeholder="Email"
          class="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#42b883]"
          required
        />
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="user_password"
            placeholder="Password"
            class="w-full border border-gray-300 rounded-md px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#42b883]"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-[#42b883]"
            tabindex="-1"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.964 9.964 0 012.292-6.025m1.78 1.78A5.978 5.978 0 0012 7a5.978 5.978 0 002.25-.45m2.67-2.67a9.968 9.968 0 013.087 2.07m.008 4.5a10.05 10.05 0 01-3.2 3.2m-2.67 2.67a5.978 5.978 0 01-2.25.45 5.978 5.978 0 01-2.25-.45M3 3l18 18"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          class="w-full bg-[#42b883] text-white py-3 rounded-md hover:bg-[#369c6f] transition-colors duration-300"
        >
          Login
        </button>
        <p v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const user_name = ref('')
const user_password = ref('')
const error = ref('')
const showPassword = ref(false)

const submitLogin = async () => {
  error.value = ''
  try {
    await auth.login({ user_name: user_name.value, user_password: user_password.value })
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  }
}
</script>
