import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts';
import './assets/css/tailwind.css';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.css';


const app = createApp(App);

app.use(router);
app.mount('#app');
