import { createApp } from 'vue'
import App from './Dashboard.vue'
import router from './router'

import 'virtual:windi.css';
import '@fontsource/roboto';
import '~/assets/styles/global.scss';
import 'element-plus/dist/index.css';

const app = createApp(App)
app.use(router);
app.mount('#app')
