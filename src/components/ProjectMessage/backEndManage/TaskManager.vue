<template>
  <div>
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt />
    <span class="title">任务管理</span>
    <div class="basiContainer">
      <template v-if="isBlock">
        <AddButton @click.native="handleAdd" name="新增人员"></AddButton>
        <BasicForm
          @edit-module="handleEdit"
          @handle-delete="handleDelete($event)"
          mode="任务管理"
          :data="formData"
          col1="开发人员"
          col2="接口名"
        ></BasicForm>
      </template>
      <template v-else>
        <EditTask
          :data-s="itemData"
          :mode="mode"
          @go-back="handleShow"
          @add-list="handleList($event)"
        ></EditTask>
      </template>
    </div>
    <div v-if="isBlock" class="pagination">
      <el-pagination
        @current-change="handleChange"
        :current-page="currentPage"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pagination {
  display: flex;
  justify-content: center;
}
.el-pagination {
  display: inline-block;
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
import AddButton from './AddButton'
import BasicForm from './BasicForm'
import EditTask from './EditTask'
import RemoteData from '../../../mixins/RemoteData'

export default {
  components: {
    AddButton,
    BasicForm,
    EditTask
  },
  mixins: [
    RemoteData({
      quest: 'task/getAllAssignments'
    })
  ],

  data() {
    return {
      isBlock: true,
      itemData: {}
    }
  },

  methods: {
    handleAdd() {
      this.handleShow()
      this.mode = 'add-task'
    },
    handleShow() {
      this.isBlock = !this.isBlock
    },
    handleEdit(rowInfo) {
      console.log(rowInfo)
      this.itemData = rowInfo
      this.mode = 'edit-task'
      this.handleShow()
    },
    handleDelete(e) {
      this.$http
        .get('task/deleteAssignment', {
          params: {
            asignments_id: e.row.asignments_id
          }
        })
        .then(() => {
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formData.splice(e.index, 1)
        })
    },
    handleList(e) {
      this.formData.push(e)
    },
    backPrevious() {
      this.$router.push('/myProject')
    }
  }
}
</script>