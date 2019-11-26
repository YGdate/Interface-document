import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import AlertPassword from '../components/AlertPassword.vue'
import DropOut from '../components/DropOut.vue'
import AllProject from '../components/ProjectMessage/AllProject.vue'
import Notification from '../components/ProjectMessage/Notification.vue'
import PersonManage from '../components/ProjectMessage/PersonManage.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/alertPassword',
    component: AlertPassword
  },
  {
    path: '/dropOut',
    component: DropOut
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/allProject',
        component: AllProject
      },
      {
        path: '/personManage',
        component: PersonManage
      },
      {
        path: '/notification',
        component: Notification
      }
    ]
  }
]

// 路由拦截
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从那个路径跳转而来
  //next 是一个函数，表示放行
  // next() 放行 next('/login') 强制跳转

  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router