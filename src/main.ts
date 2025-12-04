import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import piniaPluginStoreToFile from './util/piniaStoreToFile'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
pinia.use(piniaPluginStoreToFile)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
