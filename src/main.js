import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import formCreate from '@form-create/element-ui'
import App from './App.vue'
import router from './router'

//import theme
import './theme/index.scss'

//import unocss
import 'uno.css'

//i18n
import { setupI18n } from '@/lang'

import '@/styles/index.scss' // global css

//svg-icon
import 'virtual:svg-icons-register'
import svgIcon from '@/icons/SvgIcon.vue'
import directive from '@/directives'

//import router intercept
import './permission.js'

//import element-plus
import 'element-plus/dist/index.css'

//import form-create styles
// Note: form-create styles are included in the component

//import element-plus svg icon
import ElSvgIcon from "@/lib/el-svg-icon"
const app = createApp(App)
app.use(ElSvgIcon)
app.use(formCreate)


//router
app.use(router)

//pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

//i18n
app.use(setupI18n)
app.component('SvgIcon', svgIcon)
directive(app)

//element-plus
app.use(ElementPlus)

app.mount('#app')
