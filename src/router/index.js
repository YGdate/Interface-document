import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Registered from '../components/Registered.vue'
import AlertPassword from '../components/AlertPassword.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import AllProject from '../components/ProjectMessage/AllProject.vue'
import MyProject from '../components/ProjectMessage/MyProject.vue'
import PersonnelManage from '../components/superAdmin/PersonnelManage.vue'
import InterfaceInfo from '../components/ProjectMessage/frontEnd/InterfaceInfo.vue'
import ConfigFileDownload from '../components/ProjectMessage/frontEnd/ConfigFileDownload.vue'
import InterfaceCheck from '../components/ProjectMessage/backEndManage/InterfaceCheck.vue'
import InterfaceManage from '../components/ProjectMessage/frontEnd/InterfaceManage.vue'
import MyMessage from '../components/ProjectMessage/frontEnd/MyMessage.vue'
import Clock from '../components/clock'

// 后端负责人部分

import ModuleSetting from '../components/ProjectMessage/backEndManage/ModuleSetting'
import CodeSetting from '../components/ProjectMessage/backEndManage/CodeSetting'
import TaskManager from '../components/ProjectMessage/backEndManage/TaskManager'
import fileSetting from '../components/ProjectMessage/backEndManage/fileSetting'
import MessageInfo from '../components/ProjectMessage/backEndManage/MessageInfo'

// 项目负责人
import Projectset from '../components/ProjectMessage/projectManage/project-set.vue'
import Projectpeople from '../components/ProjectMessage/projectManage/project-people.vue'
import Projectmessage from '../components/ProjectMessage/projectManage/project-message.vue'
import ProjectJournal from '../components/ProjectMessage/projectManage/project-Journal.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    //登录
    path: '/login',
    component: Login
  },
  {
    //注册
    path: '/registered',
    component: Registered
  },
  {
    //修改密码
    path: '/alertPassword',
    component: AlertPassword
  },
  {
    //主页
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        //欢迎界面
        path: '/welcome',
        component: Welcome
      },
      {
        //超级管理员-人员管理
        path: '/personnelManage',
        component: PersonnelManage
      },
      {
        //消息通知
        path: '/clock',
        component: Clock
      },
      {
        //项目负责人-所有项目
        path: '/allProject',
        component: AllProject
      },
      {
        //
        path: '/allProject/projectSet',
        component: Projectset
      },
      {
        //
        path: '/allProject/projectpeople',
        component: Projectpeople
      },
      {
        //
        path: '/allProject/projectmessage',
        component: Projectmessage
      },
      {
        //
        path: '/allProject/projectjournal',
        component: ProjectJournal
      },
      
      {
        //后端负责人，前端开发，后端开发-我的项目
        path: '/myProject',
        component: MyProject
      },
      {
        //后端负责人->接口审核
        path: '/myProject/interfaceAudit4',
        component: InterfaceCheck
      },
      {
        // 后端负责人 -> 模块设置
        path: '/myProject/ModuleSetting',
        name: 'ModuleSetting',
        component: ModuleSetting
      },
      {
        // 后端负责人 -> 错误码设置
        path: '/myProject/CodeSetting',
        name: 'CodeSetting',
        component: CodeSetting
      },
      {
        // 后端负责人 -> 配置文件设置
        path: '/myProject/fileSetting',
        name: 'fileSetting',
        component: fileSetting
      },
      {
        // 后端负责人 -> 消息通知
        path: '/myProject/MessageInfo',
        name: 'MessageInfo',
        component: MessageInfo
      },
      {
        // 后端负责人 -> 任务管理
        path: '/myProject/TaskManager',
        name: 'TaskManager',
        component: TaskManager
      },

      {
        //前端开发人员->查看接口
        path: '/myProject/interfaceInfo',
        component: InterfaceInfo
      },
      {
        // 前端开发人员->项目配置文件
        path: '/myProject/configFileDownload',
        component: ConfigFileDownload
      },
      {
        // 前端开发人员->接口管理
        path: '/myProject/interfaceManage',
        component: InterfaceManage
      },
      {
        // 前端开发人员->消息通知
        path: '/myProject/myMessage',
        component: MyMessage
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
  if (to.path === '/login') return next()
  if (to.path === '/registered') return next()
  if (to.path === '/alertPassword') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router