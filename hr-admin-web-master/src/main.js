import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'

import './style/index.less'
import eco from './eco'
import i18n from './locales'
import router from './router'
import App from './App.vue'
import './tailwind.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)
app.use(eco)
// 确保全局可访问
window.FILE_DOMAIN = import.meta.env.VITE_FILE_DOMAIN

// 挂载app
app.mount('#app')
