import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)

app.use(createPinia()).use(router)
app.use(Vue3Toastify, {
  autoClose: 3000
} as ToastContainerOptions)

app
  .use(
    createAuth0({
      domain: 'finni.us.auth0.com',
      clientId: 'NykEDjuqusTEx8fYe8RrdtVInKoBWGgd',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  )
  .mount('#app')
