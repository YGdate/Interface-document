<template>
  <div class="edit-module">
    <headerTitle :name="title"></headerTitle>

    <el-form :label-position="labelPosition" label-width="120px" :model="dataS">
      <el-form-item label="错误码">
        <el-input v-model="dataS.error_code"></el-input>
      </el-form-item>
      <el-form-item label="错误码说明">
        <el-input v-model="dataS.error_info"></el-input>
      </el-form-item>
      <el-form-item label="HTTP状态码">
        <el-input v-model="dataS.http_code"></el-input>
      </el-form-item>
    </el-form>

    <div class="module-operation">
      <el-button @click="handleUpdate" type="primary">{{button_name}}</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<style lang="less" scope>
.el-form-item {
  position: relative;
}
.el-form-item__content {
  width: 250px;
}

.module-operation {
  display: flex;
  justify-content: center;
}
.module-operation .el-button {
  margin-right: 20px;
}
</style>

 <script>
export default {
  props: {
    dataS: {
      type: Object,
      default: Object
    },
    mode: {
      type: String
    }
  },
  computed: {
    title() {
      if (this.mode == 'add-error') return '新增错误码'
      else return '编辑错误码'
    },
    button_name() {
      if (this.mode == 'add-error') return '新增'
      else return '修改'
    }
  },
  data() {
    return {
      labelPosition: 'right',
      initData: {}
    }
  },
  methods: {
    goBack() {
      this.$emit('go-back')
    },
    handleUpdate() {
      if (
        this.dataS.error_code == '' ||
        this.dataS.error_info == '' ||
        this.dataS.http_code == ''
      ) {
        this.$message.error({
          message: '请检查字段是否为空'
        })
      } else {
        if (this.mode == 'add-error') {
          this.$http
            .post('errCode/addErrorCode', {
              error_code: this.dataS.error_code,
              error_info: this.dataS.error_info,
              http_code: this.dataS.http_code,
              project_id: sessionStorage.getItem('projectID')
            })
            .then(() => {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.$emit('add-list', {
                error_code: this.dataS.error_code,
                error_info: this.dataS.error_info,
                http_code: this.dataS.http_code
              })
              this.goBack()
            })
            .catch(error => {
              this.$message.error({
                message: '请确保字段输入正确'
              })
            })
        } else {
          this.$http
            .put('errCode/editErrorCode/' + this.dataS.id, {
              error_code: this.dataS.error_code,
              error_info: this.dataS.error_info,
              http_code: this.dataS.http_code,
              project_id: sessionStorage.getItem('projectID')
            })
            .then(() => {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.$emit('add-list', {
                error_code: this.dataS.error_code,
                error_info: this.dataS.error_info,
                http_code: this.dataS.http_code
              })
              this.goBack()
            })
            .catch(error => {
              this.$message.error({
                message: '请确保字段输入正确'
              })
            })
        }
      }
    }
  }
}
</script>