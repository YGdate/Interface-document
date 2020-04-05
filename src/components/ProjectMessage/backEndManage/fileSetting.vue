<template>
  <div>
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt />
    <span class="title">配置文件设置</span>
    <div class="basiContainer">
      <HeaderTitle name="配置文件设置"></HeaderTitle>
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="github地址">
          <el-input v-model="form.github_address"></el-input>
        </el-form-item>

        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://api.myxy99.cn/api/task/uploadConfigurationFile"
          :on-success="uploadFile"
          :on-change="handleChange"
          name="file"
          :headers="{
          Authorization: token
        }"
          :auto-upload="true"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
        </el-upload>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.basiContainer {
  max-height: 660px;
  position: relative;
  width: 900px;
  margin: 70px auto;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
}

.basiContainer .el-button {
  margin-left: 40px;
}

.upload-demo {
  margin-left: 85px;
}
.return-icon {
  margin-bottom: 10px;
  cursor: pointer;
  display: inline-block !important;
}
.title {
  vertical-align: top;
  margin-left: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      form: {
        github_address: ''
      },
      Storage_url: '',
      token: sessionStorage.getItem('token'),
      fileList: [],
      project_id: sessionStorage.getItem('projectID') || null,
      num: 0
    }
  },
  created() {
    this.$http
      .get('task/getConfigurationFileSetting', {
        params: {
          project_id: sessionStorage.getItem('projectID')
        }
      })
      .then(res => {
        this.form.github_address = res.data.data.github_address
        this.Storage_url = res.data.data.Storage_url
      })
  },
  methods: {
    submitUpload() {
      console.log(this.$http.defaults.baseURL)
      this.$http
        .post('task/updateConfigurationFileSetting', {
          project_id: sessionStorage.getItem('projectID'),
          github_address: this.form.github_address,
          project_sql: this.Storage_url
        })
        .then(res => {
          console.log(res)
          if (res.data.code !== 200) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
        })
    },
    handleChange() {
      if (this.num == 0) {
        console.log(222)
        this.$refs.upload.submit()
      }
      console.log(this.num)
      this.num++
      if (this.num >= 2) this.num = 0
    },
    uploadFile(res) {
      if (this.num == 0) {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.Storage_url = res.data.Storage_url
      }
    },
    backPrevious() {
      this.$router.push('/myProject')
    }
  }
}
</script>