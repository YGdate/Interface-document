<template>
  <div class="z-bg">
    <span class="allproject-title">所有项目</span>
    <el-row class="create-project">
      <el-button type="primary" class="create-project-btn" @click="dialogVisible = true">新建</el-button>
    </el-row>
    <!-- 下面是所有项目的内容 -->
    <el-row class="projects-all" :gutter="20">
      <el-col :span="6" v-for="item in allpro" :key="item.id">
        <div class="project-one">
          <div
            class="project-one-top"
            @click="jumpproject(item.id,item.name)"
            style="cursor:pointer"
          >
            <div class="project-name">
              <span>{{item.name}}</span>
            </div>
          </div>
          <div class="project-one-bottom">
            <div class="project-one-bottom-content">
              <span>
                <i class="el-icon-download" @click="getword(item.id)"></i>
              </span>
              <el-tooltip class="item" effect="dark" :content="item.discribe" placement="bottom">
                <span>项目介绍</span>
              </el-tooltip>

              <span>
                <i class="el-icon-delete" @click="deleques(item.name,item.id)"></i>
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 下面是新建弹出框 -->
    <el-dialog
      title="添加项目"
      :visible.sync="dialogVisible"
      class="open-div"
      width="950px"
      ref="elDialog"
      @close="closeDialog"
    >
      <hr />
      <div class="add-project-content">
        <el-form :ref="form" :model="form" label-width="110px">
          <el-form-item label="项目名字" prop="ProjectDescription" >
            <el-input v-model="form.ProjectDescription" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="项目内容" prop="ProjectName">
            <el-input
              type="textarea"
              style="width:500px;"
              :rows="3"
              v-model.trim="form.ProjectName"
              placeholder="请输入申请理由"
            ></el-input>
          </el-form-item>

          <el-form-item label="需求文档" prop="RequirementDocument">
            <el-upload
              v-model="form.RequirementDocument"
              ref="upload1"
              class="upload-poster"
              :limit="4"
              accept=".doc, .docx"
              :action="uploadAction"
              :on-change="imgPreview1"
              :http-request="uploadFile1"
              :auto-upload="false"
            >
              <i class="el-icon-plus"></i>
              <el-dialog :visible.sync="dialogVisibleadd">
                <img width="100%" :src="picUrl" alt />
              </el-dialog>
            </el-upload>
          </el-form-item>

          <el-form-item label="原型图" prop="PrototypeMap">
            <el-upload
              v-model="form.PrototypeMap"
              ref="upload2"
              class="upload-poster"
              :limit="4"
              accept=".rp"
              :action="uploadAction"
              :on-change="imgPreview2"
              :http-request="uploadFile2"
              :auto-upload="false"
            >
              <i class="el-icon-plus"></i>
              <el-dialog :visible.sync="dialogVisibleadd">
                <img width="100%" :src="picUrl" alt />
              </el-dialog>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-button" @click="submitUpload(form)">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>

    <!-- 删除的弹出框 -->
    <el-dialog title="删除" :visible.sync="dialogVisible2" width="30%">
      <span>
        <!-- 确认删除项目 -->
        <span style="font-size:18px;color:orange">{{this.delearry.name}}</span>吗？
      </span>
      <div style="margin-top:20px;text-align:center">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="suredelete">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import global_ from '../../assets/js/global' //引用模块进来
export default {
  data() {
    return {
      // 弹出框的布尔值
      dialogVisible: false,
      // 删除时的内容数组
      delearry: {
        name: '',
        id: ''
      },
      // 删除弹出框的布尔值
      dialogVisible2: false,
      // 所有项目的信息兄弟们
      allpro: [],

      // 文件部分
      uploadAction: '',
      dialogVisibleadd: false,
      picUrl: '',
      uploadForm: new FormData(),
      form: {
        RequirementDocument: '',
        ProjectDescription: '',
        ProjectName: '',
        PrototypeMap: ''
      }
    }
  },
  created() {
    this.getallproject()
  },
  mounted() {
    this.$refs.elDialog.$el.firstChild.style.height = '550px'
  },
  methods: {
    // 关闭dialog
    closeDialog(){
      let newForm = {
        RequirementDocument: '',
        ProjectDescription: '',
        ProjectName: '',
        PrototypeMap: ''
      }
      this.form = newForm
    },
    // 项目详情的跳转
    jumpproject(id, name) {
      this.$router.push('/allProject/projectSet')
      window.sessionStorage.projectid = id
      window.sessionStorage.projectname = name
    },
    // 下载的按钮
    async getword(id) {
      window.open(global_.url + 'ProjectAdmin/getWord?projectid=' + id+'&token'+ window.sessionStorage.getItem('token'))
    },
    // 删除的点击函数
    deleques(name, id) {
      this.delearry.name = name
      this.delearry.id = id
      this.dialogVisible2 = true
    },
    // 确认删除按钮
    async suredelete() {
      var delete1 = await this.$http.delete(
        'ProjectAdmin/deleteProject/' + this.delearry.id
      )
      console.log(delete1)
      if (delete1.data.code == 200) {
        this.$message.success('删除成功！')
        this.dialogVisible2 = false
        this.getallproject()
      } else {
        this.$message.error('删除失败！')
        this.dialogVisible2 = false
      }
    },
    async getallproject() {
      var allp = await this.$http.get('ProjectAdmin/getAllProject')
      this.allpro = allp.data.data.data
      console.log(allp.data.data.data)
    },

    // 下面是杨罡的函数
    uploadFile1(file1) {
      if (!this.uploadForm.get('RequirementDocument'))
        this.uploadForm.append('RequirementDocument', file1.file)
    },
    uploadFile2(file) {
      if (!this.uploadForm.get('PrototyMap'))
        this.uploadForm.append('PrototyMap', file.file)
    },
    submitUpload(form) {
      if (
        this.form.RequirementDocument.length > 0 &&
        this.form.PrototypeMap.length > 0
      ) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.$refs.upload1.submit()
            this.$refs.upload2.submit()
            // 防止重复插入
            if (!this.uploadForm.get('ProjectDescription'))
              this.uploadForm.append(
                'ProjectDescription',
                this.form.ProjectDescription
              )
            if (!this.uploadForm.get('ProjectName'))
              this.uploadForm.append('ProjectName', this.form.ProjectName)
            console.log(this.uploadForm)
            console.log(this.form)
            this.$http
              .post('ProjectAdmin/addProject', this.uploadForm)
              .then(res => {
                console.log(res)
                if (res.data.code == 200) {
                  this.form.RequirementDocument = ''
                  this.form.ProjectDescription = ''
                  this.form.ProjectName = ''
                  this.form.PrototypeMap = ''
                  this.getallproject()
                  console.log(1)
                  this.dialogVisible = false
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                }
              })
          } else {
            return false
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请上传申请材料!'
        })
      }
    },
    imgPreview1(file1, fileList1) {
      let fileName = file1.name
      let regex = /(.docx|.doc)$/
      if (regex.test(fileName.toLowerCase())) {
        // console.log(fileList1);
        this.picUrl = URL.createObjectURL(file1.raw)
        this.form.RequirementDocument = fileList1
      } else {
        //移除最后一个元素
        fileList1.pop()
        this.$message.error('请选择文件')
      }
    },
    imgPreview2(file, fileList) {
      //  console.log(fileList);
      let fileName = file.name
      let regex = /(.rp)$/
      if (regex.test(fileName.toLowerCase())) {
        this.picUrl = URL.createObjectURL(file.raw)
        this.form.PrototypeMap = fileList
      } else {
        //移除最后一个元素
        fileList.pop()
        this.$message.error('请选择原型图文件')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.il {
  cursor: pointer !important;
}
.z-bg {
  background: rgba(239, 239, 239, 1);
  height: 100%;
  width: 100%;
}
.allproject-title {
  font-size: 20px;
  font-weight: 600;
}
// 项目描述的设置

.create-project {
  margin-top: 40px;
  .create-project-btn {
    width: 104px;
    font-size: 18px;
  }
}

// 所有项目的盒子
.projects-all {
  margin-top: 40px;
  // 里面每个盒子的内容
  .project-one {
    margin-bottom: 20px;
    width: 240px;
    height: 240px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.35);
    border-radius: 5px;
    .project-one-top:hover {
      background-image: url('../../assets/img/dong.gif');
    }
    .project-one-top {
      width: 240px;
      height: 180px;
      background: rgba(212, 227, 255, 1);
      border-radius: 5px 5px 0px 0px;
      text-align: center;
      background-image: url('../../assets/img/projectFace.png');
      background-repeat: no-repeat;
      background-position: center 30%;
      position: relative;
      padding-top: 140px;
      box-sizing: border-box;
      img {
        margin-top: 21px;
        margin-bottom: 15px;
      }
      .project-name {
        height: 24px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        letter-spacing: 2px;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .project-one-bottom {
      height: 62px;
      .project-one-bottom-content {
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
        font-size: 20px;
        span {
          position: relative;
          bottom: 5px;
          cursor: pointer;
        }
      }
    }
  }
}

// 弹出框的样式
// 弹出框主题内容样式
.open-div {
}
.add-project-content {
  width: 700px;
  height: 200px;
  margin: 0 auto;
  margin-top: 45px;
}

// 按钮
.add-save {
  margin: 20px auto 0;
  text-align: center;
}

.el-form{
  padding: 0;
  margin-left: 0;
}
.el-form-item{
  display: block;
}

</style>