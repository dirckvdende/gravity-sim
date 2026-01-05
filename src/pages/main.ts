import { createApp } from 'vue'
import App from './Main.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)
if (import.meta.env.VITE_MEASURE_PERFORMANCE == "true")
    app.config.performance = true
app.use(pinia)
app.mount('#app')
