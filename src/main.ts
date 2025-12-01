import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Test from './Test.vue'

const pinia = createPinia()
// const app = createApp(App)
const app = createApp(Test)
app.use(pinia)
app.mount('#app')
