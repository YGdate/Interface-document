<template>
  <div>
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt="">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的项目</el-breadcrumb-item>
      <el-breadcrumb-item>我的消息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <div v-if="permission2 == 0" slot="header" class="clearfix">
        <el-button type="primary" @click="addMassage" icon="el-icon-circle-plus-outline">新增消息</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%" size="small">
          <el-table-column prop="date" label="title">
            <template slot-scope="scope">
              <div class="interfaceName" @click="checkInterface(scope.row.id)">{{scope.row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型">
          </el-table-column>
          <el-table-column prop="nameFrom" label="from">
          </el-table-column>
          <el-table-column prop="nameTo" label="to">
          </el-table-column>
          <el-table-column prop="updated_at" label="update at">
          </el-table-column>
          <el-table-column prop="created_at" label="created at">
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


    <!-- 反馈弹框 -->
    <el-dialog title="反馈" :visible.sync="dialogFormVisible">
      <el-form :model="feedbackFormData" :rules="feedbackRules" ref="feedbackFormData">
        <el-form-item class="problemDescriptionTitle" label="[反馈标题]:" label-width="100px" style="width:850px;" prop="title" >
          <el-input placeholder="请输入标题" v-model="feedbackFormData.title">
          </el-input>
        </el-form-item>
        <el-form-item style="width:850px;" class="problemDescription" label="[问题描述]:" label-width="100px" prop="body">
          <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="feedbackFormData.body">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isShowDialog" type="primary" @click="submitFeedback">提交反馈</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 第二权限
        permission2: '',
        // 项目id
        projectID: '',
        // tabel数据
        tableData: [{
          id: '',
          title: '',
          type: '',
          nameFrom: '',
          nameTo: '',
          updated_at: '',
          created_at: ''
        }],
        // 总共条数
        totalNum: 1,
        // 当前页码
        currentPage: 1,
        // 弹窗显示
        dialogFormVisible: false,
        // 弹框数据
        feedbackFormData: {
          title: '',
          body: '',
          type:''
        },
        // 新增弹框的提交按钮显示与否
        isShowDialog: true,
        // 弹框的验证规则
        feedbackRules:{
          title:[
            { required: true, message: '请输入反馈标题', trigger: 'blur' },
          ],
          body:[
            { required: true, message: '请输入反馈内容', trigger: 'blur' },
          ]
        }
      }
    },
    created() {
      this.permission2 = window.sessionStorage.getItem('permission2')
      this.projectID = window.sessionStorage.getItem('projectID')
      // 初始化页面
      this.getMessage()
    },
    methods: {
      // 返回上一级
      backPrevious() {
        this.$router.push('/myProject')
      },
      // 页面初始化
      async getMessage() {
        const {
          data: res
        } = await this.$http.get('Message/showMessage', {
            params: {
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
        if (res.code !== 200) return this.$message.error(res.msg)
        else {
          this.tableData = res.data.data
          this.currentPage = res.data.current_page
          this.totalNum = res.data.total
        }
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        this.getMessage()
      },
      // 查看消息
      checkInterface(messageID) {
        this.dialogFormVisible = true
        this.isShowDialog = false
        this.$http.get('Message/viewFeedback', {
            params: {
              id: messageID
            }
          })
          .then(res => {
            this.feedbackFormData = res.data.data[0].content
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
      // 新增消息
      addMassage() {
        this.dialogFormVisible = true
        this.isShowDialog = true
        this.feedbackFormData.title = ''
        this.feedbackFormData.body = ''
      },
      // 提交反馈
      submitFeedback() {
        this.$http.post('SendMail_All_Back', {
            project_id: this.projectID,
            title: this.feedbackFormData.title,
            question: this.feedbackFormData.body
          })
          .then(res => {
            if(res.data.code !== 200) return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
            this.dialogFormVisible = false
            this.isShowDialog = false
            this.getMessage()
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
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

  // 分页
  .Pagination {
    text-align: center;
    margin-top: 20px;
  }

  // 名称样式

  // 接口名诚样式
  .interfaceName {
    cursor: pointer;
  }

  .interfaceName:hover {
    color: #409EFF;
  }

  // 问题反馈输入框
  .problemDescription {

    padding: 0 40px 0 0;
  }

  .problemDescriptionTitle {
    
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    padding: 30px 40px 0 0;
  }

  // 提交按钮
  .dialog-footer {
    text-align: center;
  }
  .el-form {
    padding:0;
    margin-left: 0;
}
</style>