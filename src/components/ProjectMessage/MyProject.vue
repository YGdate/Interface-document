<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的项目</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card class="elCard-content">
      <el-row>
        <el-col>
          <el-row type="flex" :gutter="30" justify="space-around">
            <el-col :span="4" v-for="item in allProjectList" :key="item.id">
              <div class="project-item" @click="jumpComplte(item.type,item.id,item.position_code)">
                <div class="box-card-img">
                  <img src="../../assets/img/projectFace.png" alt="">
                  <div>{{item.name}}</div>
                </div>
                <div class="box-card-title">
                  <span>{{item.discribe}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 当前页
        current_page: 1,
        allProjectList: [{
          id: 0,
          name: "",
          discribe: "",
          type: 0,
          position_code: ''
        }]
      }
    },
    created() {
      this.getProjectList()
    },
    methods: {
      // 页面初始化
      async getProjectList() {
        const {
          data: res
        } = await this.$http.get('/QueryAllProject/getAllProject', {
            params: {
              page: this.current_page
            }
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
        if (res.code !== 200) this.$message.error(res.msg)
        else {
          console.log(res);
          this.allProjectList = res.data.data
        }
      },
      // 点击项目跳转函数，信息返回给父组件。
      jumpComplte(type, projectID, position_code) {
        //根据项目的权限id去跳转相应的页面
        if (type == 1) {
          // 后端负责人
          this.$router.push('/myProject/interfaceAudit4');
          window.sessionStorage.setItem("permission2", '-1')
        } else if ((position_code == 0 || position_code == 1) && type == 0) {
          // 前端，后端开发人员。
          this.$router.push('/myProject/interfaceInfo');
          window.sessionStorage.setItem("permission2", type)
        }
        window.sessionStorage.setItem("projectID", projectID)
        this.$emit('changeSidebar');
      }
    }
  }
</script>

<style lang='less' scoped>
  .elCard-content {
    margin-top: 20px;
    box-shadow: none !important;
    border: 1px solid rgba(0, 0, 0, 0.2)
  }

  .project-item {
    width: 240px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.35);
    border-radius: 5px;
    height: 240px;
    cursor: pointer;
  }

  .box-card-img {
    width: 100%;
    height: 180px;
    background: rgba(212, 227, 255, 1);
    border-radius: 5px 5px 0px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    img {
      width: 72px;
      height: 99px;
    }

    div {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
    }
  }

  .box-card-title {
    width: 100%;
    height: 24%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 400;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      padding: 5px;
      line-height: 20px;
      text-indent: 24px
    }
  }
</style>