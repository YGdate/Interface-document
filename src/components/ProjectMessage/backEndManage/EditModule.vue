<template>
  <div class="edit-module">
    <HeaderTitle :name="title"></HeaderTitle>

    <el-form :label-position="labelPosition" label-width="80px" :model="dataS">
      <el-form-item label="模块名">
        <el-input v-model="dataS.modules_name"></el-input>
      </el-form-item>
      <el-form-item label="类名">
        <el-input v-model="dataS.class_name"></el-input>
      </el-form-item>
      <el-form-item label="模块作用">
        <el-input v-model="dataS.utility"></el-input>
      </el-form-item>
      <el-form-item label="全类名">
        <el-input v-model="dataS.full_class_name"></el-input>
      </el-form-item>
    </el-form>

    <div class="module-operation">
      <el-button @click="handleUpdate" type="primary">{{button_name}}</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<style lang="less" scope>
.el-form {
  padding: 100px 10px;
  margin-left: 80px;
}
.el-form-item {
  display: inline-block;
  margin-right: 50px;
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
      if (this.mode == 'add-module') {
        return '添加模块'
      } else return '编辑模块'
    },
    button_name() {
      if (this.mode == 'add-module') {
        return '增加'
      } else return '修改'
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
        this.dataS.modules_name == '' ||
        this.dataS.class_name == '' ||
        this.dataS.utility == '' ||
        this.dataS.full_class_name == ''
      ) {
        this.$message.error({
          message: '请检查字段是否为空'
        })
      } else {
        if (this.mode == 'add-module') {
          this.$http
            .post('module/addModule', {
              modules_name: this.dataS.modules_name,
              utility: this.dataS.utility,
              class_name: this.dataS.class_name,
              full_class_name: this.dataS.full_class_name,
              project_id: sessionStorage.getItem('projectID')
            })
            .then(() => {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.$emit('add-list', {
                modules_name: this.dataS.modules_name,
                class_name: this.dataS.class_name,
                full_class_name: this.dataS.full_class_name
              })
              this.goBack()
            })
            .catch(() => {
              this.$message.error({
                message: '类名 必须在 4 到 100 个字符之间", "全类名 必须在 4 到 100 个字符之间'
              })
            })
        } else {
          this.$http
            .put('module/editModule/' + this.dataS.id, {
              modules_name: this.dataS.modules_name,
              utility: this.dataS.utility,
              class_name: this.dataS.class_name,
              full_class_name: this.dataS.full_class_name,
              project_id: this.dataS.project_id
            })
            .then(() => {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.goBack()
            })
            .catch(error => {
              this.$message.error({
                message: '类名 必须在 4 到 100 个字符之间", "全类名 必须在 4 到 100 个字符之间'
              })
            })
        }
      }
    }
  }
}
</script>