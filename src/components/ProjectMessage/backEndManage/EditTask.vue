<template>
  <div>
    <HeaderTitle :name="title"></HeaderTitle>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="开发人员">
        <el-select v-model="form.user_id">
          <el-option
            v-for="person of allProjectMember"
            :key="person.user_id"
            :label="person.name"
            :value="person.user_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模块名">
        <el-select v-model="form.module_id">
          <el-option
            v-for="module of allProjectModule"
            :key="module.id"
            :label="module.class_name"
            :value="module.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="module-operation">
      <el-button @click="handleUpdate" type="primary">{{button_name}}</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
  data() {
    return {
      form: {
        user_id: '',
        module_id: '',
        asignments_id: 0
      },
      allProjectModule: '',
      allProjectMember: ''
    }
  },
  created() {
    this.$http
      .get('task/getTwoPm', {
        params: {
          project_id: sessionStorage.getItem('projectID')
        }
      })
      .then(res => {
        console.log(res)
        this.allProjectModule = res.data.data.allProjectModule
        this.allProjectMember = res.data.data.allProjectMember
      })
    if (this.dataS !== '') {
      this.form.module_id = this.dataS.class_name
      this.form.user_id = this.dataS.name
      this.form.asignments_id = this.dataS.asignments_id
    }
  },

  props: {
    dataS: {
      type: Object
    },
    mode: {
      type: String
    }
  },
  computed: {
    title() {
      if (this.mode == 'add-task') return '新增人员分配'
      else return '编辑人员分配'
    },
    button_name() {
      if (this.mode == 'add-task') return '增加'
      else return '修改'
    }
  },
  methods: {
    goBack() {
      this.$emit('go-back')
    },
    handleUpdate() {
      if (this.allProjectModule == '' || this.allProjectMember == '') {
        this.$message.error({
          message: '请检查字段是否为空'
        })
      } else {
        if (this.mode == 'add-task') {
          this.$http
            .post('task/addAssignment', {
              user_id: this.form.user_id,
              module_id: this.form.module_id
            })
            .then(() => {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.$emit('add-list', {
                user_id: this.form.user_id,
                module_id: this.form.module_id
              })
              this.goBack()
            })
            .catch(() => {
              this.$message.error({
                message:
                  '请确保字段输入正确'
              })
            })
        }
        if (this.mode == 'edit-task') {
          this.$http
            .post('task/updateAssignment', {
              user_id: this.form.user_id,
              module_id: this.form.module_id,
              asignments_id: this.form.asignments_id
            })
            .then(() => {
              this.goBack()
              this.$message({
                message: '成功',
                type: 'success'
              })
            }).catch(() => {
              this.$message.error({
                message:
                  '请确保字段输入正确'
              })
            })
        }
      }
    }
  }
}
</script>