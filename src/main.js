import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Message from 'element-ui'
// 引入全局样式
import './assets/css/global.css'
import './assets/css/gStyle.css'
import './globalComponents'

// 导入字体图标
import "./assets/fonts/iconfont.css"
// 导入axios
import axios from 'axios'
// 导入qs
import qs from 'qs'

//设置根路径
axios.defaults.baseURL = `http://api.myxy99.cn/api/`

// 挂载到vue的原型上
Vue.prototype.$http = axios
// 挂载qs到全局
Vue.prototype.$qs = qs



// 给请求头设置拦截器,将token放入Authorization中，传入服务器
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在post请求发送出去之前，对其进行编码

    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    return config

  }, err => {
    // 设置请求出错的信息。
    return Promise.reject(err.response.data)
  })

// 给响应头设置拦截器。
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    var config1 = error.config
    var backoff
    // 设置token失效
    if (error.response.status == 401) {

      backoff = new Promise(function (resolve) {
        setTimeout(function () {
          resolve()
        }, 1500)
      })
      /*在此处判断token过期，以及其他状态码设置跳转页面*/
      axios
        .post('oAuth/refresh')
        .then(res => {
          if (res.data.code !== 200) Message.error('获取token失败')
          //1.将登陆之后的token，保存到客户端的sessionStorage中
          window.sessionStorage.setItem(
            'token',
            'Bearer ' + res.data.data.token
          )
        })
        .catch(err => {
          Message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: eval('(' + err.response.data + ')').data.join(
              '<br><br>跳转登录页面'
            ),
            type: 'error'
          })
          // this.$router.push('/login')
        })
      return backoff.then(function () {
        return axios(config1)
      })
    }
    /*在这里设置token过期的跳转*/
    return Promise.reject(error)
  });
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// 创建link标签


