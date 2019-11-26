<template>
  <el-container class="home-container">
    <el-header>
      <div class="home_header">
        <!-- <img src="../assets/img/logo.png" alt /> -->
        <span>接口文档管理</span>
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
            <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
            <el-dropdown-item command="退出">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="info" @click="logout">退出</el-button> -->
      </div>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="istoggleCollapse ? '64px':'200px'">
        <!-- 折叠栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单选项 -->
        <el-menu
          router
          :collapse="istoggleCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-menu-item
            :index="item.path+''"
            v-for="item in menulist"
            :key="item.id"
            @click="saveNavState(item.path)"
          >
            <i :class="iconsObj[item.id]"></i>
            <span>{{item.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧主题部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
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
        '2': 'iconfont icon-rrenyuanguanli-',
        '3': 'iconfont icon-xiaoxitongzhi1',
        '4': 'iconfont icon-zoom-in',
        '5': 'iconfont icon-zoom-out'
      },
      // 是否折叠
      istoggleCollapse: false,
      // 权限1
      permission1: '',
      // 保存当前页面
      activePath: ''
    }
  },
  // 生命周期函数
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.permission1 = window.sessionStorage.getItem('permission1')
    this.getMeunList()
  },
  methods: {
    logout() {
      // 清空token 跳转登录页面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMeunList() {
      //通过sessionStorage里面的权限来判断显示的页面
      if (this.permission1 == 1) {
        //项目管理员
        this.menulist = [
          {
            id: 1,
            path: '/allProject',
            name: '所有项目'
          },
          {
            id: 2,
            path: '/personManage',
            name: '人员管理'
          },
          {
            id: 3,
            path: '/notification',
            name: '消息通知'
          }
        ]
      } else if (this.permission1 == 2) {
        //项目管理员
        this.menulist = [
          {
            id: 1,
            path: '/myProject',
            name: '项目管理'
          },
          {
            id: 2,
            path: '/personManage',
            name: '任务管理'
          },
          {
            id: 3,
            path: '/notification',
            name: '审核接口'
          }
        ]
      }
    },
    toggleCollapse() {
      //折叠左边菜单函数
      this.istoggleCollapse = !this.istoggleCollapse
    },
    saveNavState(activePath) {
      //点击一级标题，高亮
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 点击下拉菜单事件
    handleCommand(command) {
     
      if (command === '修改密码') {
        this.$router.push('/alertPassword') 
      }
      else this.$router.push('/dropOut')
       // 清空token 跳转修改密码页面
      window.sessionStorage.clear()
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  width: 100%;
}

.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  padding: 0 20px;

  > div {
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
    color: #ffffff;
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
  background: #333744;

  .el-menu {
    border-right: none;
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