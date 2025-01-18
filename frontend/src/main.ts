import './assets/css/tailwind.css'
import { StatusBar } from '@capacitor/status-bar';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

StatusBar.setOverlaysWebView({ overlay: true });
StatusBar.hide();

app.use(createPinia())
app.use(router)

app.mount('#app')
