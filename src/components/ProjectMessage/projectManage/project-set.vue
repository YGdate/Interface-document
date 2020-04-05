<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/allProject' }">所有项目</el-breadcrumb-item>
      <el-breadcrumb-item>项目设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="project-set-content">
      <span>项目设置</span>
      <hr />
      <div class="set-content">
        <el-form :model="promessage" label-width="100px" ref="refFormData">
          <el-form-item label="项目名称：" prop="name" style="width:800px;">
            <el-input style="width:800px;" v-model="promessage.name"></el-input>
          </el-form-item>
          <el-form-item label="项目描述：" prop="discribe" style="width:800px;">
            <el-input type="textarea" style="width:800px;" class="project-about" v-model="promessage.discribe">
            </el-input>
          </el-form-item>
          <!-- 第一个文件上传 -->
          <el-form-item label="需求文档：" prop="wordname" style="width:800px;">
            <el-upload v-model="promessage.wordname" style="width:800px;" ref="upload1" class="upload-poster" :limit='4'
              accept=".doc,.docx" :action='uploadAction' :on-change="imgPreview1" :http-request="uploadFile1"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="picUrl" alt="">
              </el-dialog>
            </el-upload>
            <span>当前文件：{{promessage.RequirementDocumentName}}</span>
          </el-form-item>

          <!-- 第二个文件上传 -->
          <el-form-item label="原型图：" prop="rpname">
            <el-upload v-model="promessage.rpname" ref="upload2" class="upload-poster" :limit='4' accept=".rp"
              :action='uploadAction' :on-change="imgPreview2" :http-request="uploadFile2" :auto-upload="false">
              <i class="el-icon-plus"></i>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="picUrl" alt="">
              </el-dialog>
            </el-upload>
            <span>当前文件：{{promessage.PrototypeMapName}}</span>
          </el-form-item>
        </el-form>
        <div style="text-align:center">
          <el-button type="primary" @click="submitUpload(promessage)">保存并修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    created() {
      this.messagered();
    },
    data() {
      return {
        // 存放本页面id
        id: '',
        uploadAction: '',
        dialogVisible: false,
        picUrl: '',
        uploadForm: new FormData(),
        // 页面里面保存的数据
        promessage: {
          name: '',
          discribe: '',
          wordname: '',
          rpname: '',
          RequirementDocumentName: '',
          PrototypeMapName: ''
        },
      }
    },
    methods: {
      // 最开始请求数据
      async messagered() {
        this.id = window.sessionStorage.projectid;
        var pmessage = await this.$http.get('ProjectAdmin/getProject/' + this.id)
        this.promessage.name = pmessage.data.data.name;
        this.promessage.discribe = pmessage.data.data.discribe;
        this.promessage.RequirementDocumentName = pmessage.data.data.word_path;
        this.promessage.PrototypeMapName = pmessage.data.data.rp_path;
        this.promessage.RequirementDocumentName = this.promessage.RequirementDocumentName.replace(
          "/storage/app/public/word/", "")
        this.promessage.PrototypeMapName = this.promessage.PrototypeMapName.replace("/storage/app/public/rp/", "")
        console.log(pmessage.data.data)
      },
      //传文件过多
      handleExceed() {
        this.$message.warning("只能上传一个文件！");
      },
      // 上传成功
      successload(val) {
        this.$message.warning("只能上传一个Ⅰ文件！");
        console.log(val)
      },
      // 保存按钮的点击
      save() {

      },
      // 第一个文件上传的函数
      uploadFile1(file1) {
        if (!this.uploadForm.get("RequirementDocument")) this.uploadForm.append('RequirementDocument', file1.file);
      },
      uploadFile2(file) {
        if (!this.uploadForm.get("PrototyMap")) this.uploadForm.append('PrototyMap', file.file);
      },
      submitUpload() {
        if (this.promessage.wordname.length > 0 && this.promessage.rpname.length > 0) {
          this.$refs.refFormData.validate((valid) => {
            if (valid) {
              this.$refs.upload1.submit();
              this.$refs.upload2.submit();
              // 防止重复插入
              console.log(this.uploadForm.get("PrototyMap"))
              if (!this.uploadForm.get("ProjectDescription")) this.uploadForm.append('ProjectDescription', this
                .promessage.discribe);
              if (!this.uploadForm.get("ProjectName")) this.uploadForm.append('ProjectName', this.promessage.name);
              this.$http.post('ProjectAdmin/setProject/1', this.uploadForm).then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  });
                  this.messagered();

                }
              })
            } else {
              return false;
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '完成项目配置!'
          });
        }
      },
      imgPreview1(file1, fileList1) {
        let fileName = file1.name;
        let regex = /(.docx|.doc)$/;
        if (regex.test(fileName.toLowerCase())) {
          // console.log(fileList1);
          this.picUrl = URL.createObjectURL(file1.raw);
          this.promessage.wordname = fileList1;
        } else {
          //移除最后一个元素
          fileList1.pop();
          this.$message.error('请选择文件');
        }
      },
      imgPreview2(file, fileList) {
        //  console.log(fileList);
        // 规则验证
        let fileName = file.name;
        let regex = /(.rp)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.picUrl = URL.createObjectURL(file.raw);
          this.promessage.rpname = fileList;
        } else {
          //移除最后一个元素
          fileList.pop();
          this.$message.error('请选择原型图文件');
        }
      },
    }
  }
</script>

<style scoped>
  .project-set-content {
    width: 1200px;
    min-height: 460px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
    margin: 60px auto 0;
    padding: 20px;
  }

  .set-content {
    margin: 40px auto 0;
    width: 70%;
  }

  .el-form {
    padding: 0;
    margin-left: 0;
  }
</style>