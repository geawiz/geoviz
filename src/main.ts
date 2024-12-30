import './styles/style.css'
import './styles/global.scss'
import { createApp } from "vue";
import createVuetify from './plugins/vuetify.ts'
import VueMaplibreGl from '@indoorequal/vue-maplibre-gl'
import App from './App.vue'

const app = createApp(App)
app.use(createVuetify)
app.use(VueMaplibreGl)
app.mount('#app')
