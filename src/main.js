import { createApp } from 'vue'
import App from './App.vue'
import { setupAnalytics } from './plugins/gtag.js'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'

const app = createApp(App)

// Configura o Google Analytics
setupAnalytics(app)

app.mount('#app')
