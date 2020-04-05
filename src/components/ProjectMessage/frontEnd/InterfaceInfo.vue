<template>
  <div>
    <img class="return-icon" @click="backPrevious" src="../../../assets/img/returnUp.png" alt="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的项目</el-breadcrumb-item>
      <el-breadcrumb-item>接口分配</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input placeholder="请输入内容" v-model="searchInfo" @keyup.enter.native="searchContent" class="input-with-select"
          style="width:300px;">
          <el-button slot="append" icon="el-icon-search" @click="searchContent"></el-button>
        </el-input>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" size="small">
          <el-table-column width="100" prop="developer_name" label="开发人员">
          </el-table-column>
          <el-table-column width="280" prop="module_name" label="模块名">
          </el-table-column>
          <el-table-column width="280" prop="class_name" label="类名">
          </el-table-column>
          <el-table-column prop="full_class_name" label="全类名">
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 分页 -->
    <div class="Pagination">
      <el-pagination center :hide-on-single-page="true" background @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalNum">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // tabel数据
        tableData: [{
          id: 1,
          developer_name: "开发人员姓名",
          module_name: "模块名",
          class_name: "类名",
          full_class_name: "全类名",
        }],
        // 总共条数
        totalNum: 20,
        // 当前页码
        currentPage: 1,
        projectID: '',
        searchInfo: ''
      }
    },
    created() {
      this.projectID = window.sessionStorage.getItem("projectID")
      // 初始化接口
      this.getInterfaceDistribute();

    },
    methods: {
      // 获取所有接口分配
      async getInterfaceDistribute() {
        const {
          data: res
        } = await this.$http.get('frontend/interface_distribute', {
            params: {
              project_id: this.projectID,
              page: this.currentPage
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
        if (res.code !== 200) return this.$message.error(res.data.msg)
        else {
          console.log(res);
          this.tableData = res.data.data
          this.currentPage = res.data.current_page
          this.totalNum = res.data.total
        }

      },
      // 筛选人员
      searchContent() {
        this.$http.get('backend/interface_screen', {
            params: {
              id: this.projectID,
              info: this.searchInfo
            }
          })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            else if (res.data.data.data.length == 0) {
              this.tableData = []
              return this.$message.error('没有搜索内容！')
            } else {
              this.tableData = res.data.data.data
              this.currentPage = res.data.data.current_page
              this.totalNum = res.data.data.total
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


      },

      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        if (this.searchInfo == '') {
          this.getInterfaceDistribute()
        } else {
          this.searchContent()
        }
      },
      // 返回上一级
      backPrevious() {
        this.$router.push('/myProject')
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

  // 下拉框
  .el-select {
    margin: 0 100px 0 20px;
  }

  // 分页
  .Pagination {
    text-align: center;
    margin-top: 20px;
  }
</style>