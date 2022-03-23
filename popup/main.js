import { createApp } from 'vue'
import App from './Popup.vue'
import router from './router'

import 'virtual:windi.css'
import '@fontsource/roboto';
import '~/assets/styles/global.scss'

const app = createApp(App)
app.use(router);
app.mount('#app')
