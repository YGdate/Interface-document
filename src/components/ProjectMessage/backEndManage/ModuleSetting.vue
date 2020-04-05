<template>
  <div class="container">
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt />
    <span class="title">模块设置</span>

    <div class="basiContainer">
      <template v-if="isBlock">
        <AddButton @click.native="handleAdd" name="新建模块"></AddButton>
        <BasicForm
          mode="模块设置"
          @edit-module="handleEdit($event)"
          @handle-delete="handleDelete($event)"
          :data="formData"
          col1="模块名"
          col2="类名"
          col3="全类名"
        ></BasicForm>
      </template>
      <template v-else>
        <EditModule
          :data-s="itemData"
          :mode="mode"
          @go-back="handleShow"
          @add-list="handleList($event)"
        ></EditModule>
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
import EditModule from './EditModule'
import RemoteData from '../../../mixins/RemoteData'

export default {
  components: {
    AddButton,
    BasicForm,
    EditModule
  },
  mixins: [
    RemoteData({
      quest: 'module/selectModule'
    })
  ],
  data() {
    return {
      isBlock: true,
      itemData: {
        modules_name: '',
        class_name: '',
        utility: '',
        full_class_name: ''
      }
    }
  },

  methods: {
    handleAdd() {
      this.itemData = {
        modules_name: '',
        class_name: '',
        utility: '',
        full_class_name: ''
      }
      this.handleShow()
      this.mode = 'add-module'
    },
    handleShow() {
      this.isAddButton = !this.isAddButton
      this.isBlock = !this.isBlock
    },
    handleEdit(rowInfo) {
      this.itemData = rowInfo
      this.handleShow()
      this.mode = 'edit-module'
    },
    handleDelete(e) {
      this.$http
        .delete('module/deModule/' + e.row.id, {
          params: {
            project_id: e.row.project_id
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