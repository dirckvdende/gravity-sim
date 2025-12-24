import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App)
app.config.performance = true
app.use(pinia)
app.mount('#app')
