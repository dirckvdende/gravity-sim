import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Test from './Test.vue'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import piniaPluginStoreToFile from './util/piniaStoreToFile'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
pinia.use(piniaPluginStoreToFile)

// const app = createApp(App)
const app = createApp(Test)
app.use(pinia)
app.mount('#app')
