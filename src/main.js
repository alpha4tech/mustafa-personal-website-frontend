
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { Icon } from '@iconify/vue'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import './styles/colors.css'

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import './assets/styles.css'

import './assets/css/bootstrap.css'


import './assets/vendors/bootstrap-icons/bootstrap-icons.css'

library.add(fas, far, fab)

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common["Accept"] = "application/json"

AOS.init({
  duration: 800,
  once: true,
  offset: 100
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

app.component('Icon', Icon)
export default axios;





