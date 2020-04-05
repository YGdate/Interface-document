import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 导入字体图标
import "./assets/fonts/iconfont.css"
// 导入axios
import axios from 'axios'


//设置根路径
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`

// 给请求头设置拦截器,将token放入Authorization中，传入服务器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
// 挂载到vue的原型上
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')