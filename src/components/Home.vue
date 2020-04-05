<template>
  <el-container class="home-container">
    <el-header>
      <div class="home_header">
        <img src="../assets/img/logo.png" alt="">
        <span>API文档管理系统</span>
      </div>

      <div>
        <el-badge :value="20" :max="9" class="item">
          <i class="iconfont icon-tongzhi"></i>
        </el-badge>
        <i class="iconfont icon-yonghu"></i>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            Admin
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" :split-button="true">
            <el-dropdown-item @click="alertPassword" command="修改密码">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout" command="退出">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="istoggleCollapse ? '64px':'225px'">
        <!-- 折叠栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单选项 -->
        <el-menu router :collapse="istoggleCollapse" :collapse-transition="false" 
          background-color="rgba(0,0,0,0.2)" text-color="#fff" active-text-color="#fff" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-menu-item :index="item.path+''" v-for="item in menulist" :key="item.id" @click="saveNavState(item.path)"
            :class="item.path === activePath ? 'iscolor' : 'nocolor'">
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧主题部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view @changeSidebar="changeSidebar"></router-view>
        
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    // 组件私有数据
    data() {
      return {
        // 存放侧边栏数据
        menulist: [],
        // 侧边栏图标显示
        iconsObj: {
          '1': 'iconfont icon-xiangmu',
          '2': 'iconfont icon-xiangmu',
          '3': 'iconfont icon-xiangmu',
          '4': 'iconfont icon-xiangmu',
          '5': 'iconfont icon-xiangmu',
          '6': 'iconfont icon-xiangmu',
          '7': 'iconfont icon-xiangmu',
          '8': 'iconfont icon-xiangmu',
          '9': 'iconfont icon-xiangmu',
          '10': 'iconfont icon-xiangmu',
          '11': 'iconfont icon-xiangmu',
          '12': 'iconfont icon-xiangmu',
          '13': 'iconfont icon-xiangmu',
          '14': 'iconfont icon-xiangmu',
        },
        // 是否折叠
        istoggleCollapse: false,
        // 权限1
        permission1: '',
        // 权限2
        permission2: '',
        // 保存当前页面
        activePath: '',
        // 激活的当前页面颜色
      }
    },
    // 生命周期函数
    created() {
      this.permission2 = window.sessionStorage.getItem('permission2')
      this.activePath = window.sessionStorage.getItem('activePath')
      this.getPermission()
    },
    methods: {
      // 获取个人权限
      getPermission() {
      this.$http.post('oAuth/info')
          .then(res => {
            if (res.data.code !== 200) this.$message.error('请重新登录')
            else {
              //  获取一级权限
              this.permission1 = res.data.data[0].access_code
              // 将以及权限存入sessionStorage
              window.sessionStorage.setItem("permission1", res.data.data[0].access_code)

              if (this.activePath == '/personnelManage' || this.activePath == '/allProject' ||
                this.activePath == null || this.activePath == '/myProject' || this.activePath == '/welcome' || this
                .activePath == '') {
                // 初始化页面
                this.getMeunList()
              } else {
                this.changeSidebar()
              }
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.msg)
          })
      },
      logout() {
        // 退出，清空token 跳转登录页面
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      // 修改密码
      alertPassword() {
        this.$router.push('/alertPassword')
      },
      getMeunList() {
        //通过sessionStorage里面的权限来判断显示的页面
        if (this.permission1 == 1) {
          console.log(111);
          //超级管理员
          this.menulist = [{
            id: 1,
            path: '/personnelManage',
            name: '人员管理'
          }]
        } else if (this.permission1 == -1) {
          //项目管理员
          this.menulist = [{
            id: 2,
            path: '/allProject',
            name: '所有项目'
          }, ]
        } else if (this.permission1 == 0) {
          //普通开发人员
          this.menulist = [{
            id: 2,
            path: '/myProject',
            name: '我的项目'
          }, ]
        } else {
          this.$message.error('没有权限！无法访问');
        }
      },
      //折叠左边菜单函数
      toggleCollapse() {
        this.istoggleCollapse = !this.istoggleCollapse
      },

      //点击一级标题，高亮
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath
      },

      // 点击下拉菜单事件
      handleCommand(command) {
        // 清空token 跳转修页面
        window.sessionStorage.clear()
        if (command === '修改密码') {
          this.$router.push('/alertPassword')
        } else this.$router.push('/login')
      },

      // 点击每个项目，改变左边侧边栏。
      changeSidebar() {
        // 获取二级权限,改变侧边栏
        if (this.permission1 == -1) {
        // 如果为 “0” 为项目管理员。
        this.menulist = [
          {
            id: 3,
            path: '/allProject/projectSet',
            name: '项目设置'
          },
          {
            id: 4,
            path: '/allProject/projectpeople',
            name: '人员管理'
          },
          {
            id: 5,
            path: '/allProject/projectmessage',
            name: '消息通知'
          }
        ]
      } else if (this.permission2 == -1) {
          // 后端负责人
          this.menulist = [{
              id: 6,
              path: '/myProject/ModuleSetting',
              name: '模块设置'
            },
            {
              id: 7,
              path: '/myProject/CodeSetting',
              name: '错误码设置'
            },
            {
              id: 8,
              path: '/myProject/fileSetting',
              name: '配置文件设置'
            },
            {
              id: 9,
              path: '/myProject/TaskManager',
              name: '任务管理',
            },
            {
              id: 10,
              path: '/myProject/interfaceAudit4',
              name: '接口审核'
            },
            {
              id: 5,
              path: '/myProject/MessageInfo',
              name: '消息通知'
            }
          ]
        } else if (this.permission2 == 0 || this.permission2 == 1) {
          // 前后端开发人员
          this.menulist = [{
              id: 11,
              path: '/myProject/interfaceInfo',
              name: '接口分配'
            },
            {
              id: 12,
              path: '/myProject/configFileDownload',
              name: '项目配置文件'
            },
            {
              id: 13,
              path: '/myProject/interfaceManage',
              name: '接口管理'
            },
            {
              id: 14,
              path: '/myProject/myMessage',
              name: '我的消息'
            }
          ]
        }
      },

    },
    // 监听路由改变
    watch: {
      '$route.path': function () {
        this.permission2 = window.sessionStorage.getItem('permission2')
        this.activePath = this.$route.path
        window.sessionStorage.setItem('activePath', this.$route.path)
        if (this.activePath == '/personnelManage' || this.activePath == '/allProject' || this.activePath ==
          '/myProject' || this.activePath == null ||
          this.activePath == '/welcome' || this.activePath == '') {
          // 初始化页面
          this.getMeunList()
        } else {
          this.changeSidebar()
        }
      }
    }

  }
</script>
<style lang="less" scoped>
  // 是否是选中的一级标题
  .iscolor {
    background: linear-gradient(90deg, rgba(37, 117, 236, 1), rgba(116, 171, 253, 1));
  }

  .nocolor {
    background: rgba(0, 0, 0, 0);
  }

  .home-container {
    height: 100%;
    width: 100%;
  }

  .el-header {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    padding: 0 20px;
    z-index: 1000;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2) !important;

    >div {
      display: flex;
      align-items: center;
    }

    span {
      margin-left: 15px;
    }

    .item {
      margin-right: 40px;
      margin-top: 5px;

      i {
        font-size: 25px;
        margin-right: 0px;
        margin-top: -5px;
      }
    }

    // 登录退出下拉框
    .el-dropdown-link {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.9);
    }

    .el-icon-arrow-down {
      font-size: 12px;
    }

    .el-dropdown {
      font-size: 18px;
    }
  }

  // 用户头像
  .icon-yonghu {
    font-size: 25px;
  }

  .el-aside {
    background: url('../assets/img/侧边.png') no-repeat;
    background-size: cover;

    .el-menu {
      border-right: none;
      background: rgba(0, 0, 0, 0) !important;
    }

    .el-menu-item {
      margin-bottom: 10px;
      padding-left: 30px;
      font-size: 18px;
    }

    .el-menu-item:hover {
      background: linear-gradient(90deg, rgba(37, 117, 236, 1), rgba(116, 171, 253, 1));
    }
  }

  .el-main {
    background: #eaedf1;
  }

  .iconfont {
    margin-right: 15px;
  }

  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;

    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>