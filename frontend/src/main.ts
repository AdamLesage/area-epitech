import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts';
import './assets/css/tailwind.css';

const app = createApp(App);

app.use(router);
app.mount('#app');
