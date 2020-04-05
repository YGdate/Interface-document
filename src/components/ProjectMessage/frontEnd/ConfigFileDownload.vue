<template>
  <div>
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的项目</el-breadcrumb-item>
      <el-breadcrumb-item>项目配置文件</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目配置文件下载:</span>
      </div>
      <div>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="6">
            <img src="../../../assets/img/logo.png" alt="">
            <div>原型图</div>
            <el-button type="primary" @click="prototypeFigure"  icon="el-icon-download">下载</el-button>
          </el-col>
          <el-col :span="6">
            <img src="../../../assets/img/logo.png" alt="">
            <div>需求文档</div>
            <el-button type="primary" @click="RequireDocument"  icon="el-icon-download">下载</el-button>
          </el-col>
          <el-col :span="6">
            <img src="../../../assets/img/logo.png" alt="">
            <div>数据库设计</div>
            <el-button type="primary" @click="downloadSqlFile" icon="el-icon-download">下载</el-button>
          </el-col>
        </el-row>
        <el-row class="address-github">
          <el-col>
            <span>gitHub地址:</span>
            <el-link  :href="githubAddress">{{githubAddress}}</el-link>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 项目id
        project_id:1,
        // 原型图路径
        map_path:'',
        // 文档路径
        file_path:'',
        // SQL文件路径
        sql_path:'',
        // github 地址
        githubAddress:'http://www.github.com'
      }
    },
    created(){
      //获取权限
      this.project_id = window.sessionStorage.getItem("projectID")
      // 获取文件地址
      // this.showConfigFile()
    },
    methods: {
       // 返回上一级
      backPrevious(){
        this.$router.push('/myProject')
      },
      // 显示项目配置文件
      async showConfigFile(){
        const {
          data: res
        } = await this.$http.get('/frontend/getConfigFile?project_id='+this.project_id)
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
        if (res.code !== 200)  return this.$message.error(res.data.msg)
        else {
          console.log(res);
          this.sql_path = res.data[0].sql_path
          this.map_path = res.data[1].map_path
          this.file_path = res.data[2].file_path
          this.githubAddress = res.data[3].github_url
        }
      },
      // 下载原型图
      prototypeFigure(){
       window.location.href = 'http://api.myxy99.cn/api'+ this.map_path; 
      },
      // 下载需求文档
      RequireDocument(){
         window.location.href = 'http://api.myxy99.cn/api'+ this.file_path; 
      },
      // 下载sql_path文档
      downloadSqlFile(){
         window.location.href = 'http://api.myxy99.cn/api'+ this.sql_path; 
      }
    }
  }

</script>

<style lang='less' scoped>
  // 退出按钮
  .return-icon {
    margin-bottom: 10px;
    cursor: pointer;
    display: inline-block !important;
  }

  .title {
    display: inline-block;
    vertical-align: top;
    margin: 5px 0 0 20px;
  }


  // 卡片试图
  .el-card {
    margin: 0 186px;
    padding: 0 50px 20px 50px;
  }

  // 图片区域
  .row-bg {
    display: flex;
    height: 350px;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
    img {
      margin-bottom: 20px;
      width: 160px;
      height: 128px;
    }
    .el-button {
      margin-top: 20px;
    }
  }
  .address-github{
    text-align: center;
    font-size: 18px;
    margin-bottom: 50px;
    .el-link{
      font-size: 18px !important;
      margin-left: 20px;
      vertical-align: top;
      border-bottom: 2px solid rgba(0,0,0,0.5);
    }
  }
</style>