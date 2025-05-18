import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router'     // cukup './router/router' karena dari src/main.ts
import App from './App.vue'
import '@/assets/tailwindcss.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
