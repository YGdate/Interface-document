<template>
  <div class="container">
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt />
    <span class="title">错误码设置</span>
    <div class="basiContainer">
      <template v-if="isBlock">
        <AddButton @click.native="handleAdd" name="新增错误码"></AddButton>
        <BasicForm
          @edit-module="handleEdit($event)"
          @handle-delete="handleDelete($event)"
          mode="错误码编辑"
          :data="formData"
          col1="错误码"
          col2="错误码说明"
          col3="HTTP状态码"
        ></BasicForm>
      </template>
      <template v-else>
        <EditCode
          :data-s="itemData"
          :mode="mode"
          @go-back="handleShow"
          @add-list="handleList($event)"
        ></EditCode>
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
import EditCode from './EditCode'
import RemoteData from '../../../mixins/RemoteData'

export default {
  components: {
    AddButton,
    BasicForm,
    EditCode
  },
  mixins: [
    RemoteData({
      quest: 'errCode/selectErrorCode'
    })
  ],
  data() {
    return {
      isBlock: true,
      itemData: {
        error_code: '',
        error_info: '',
        http_code: ''
      }
    }
  },

  methods: {
    handleAdd() {
      this.itemData = {
        error_code: '',
        error_info: '',
        http_code: ''
      }
      this.handleShow()
      this.mode = 'add-error'
    },
    handleShow() {
      this.isBlock = !this.isBlock
    },
    handleEdit(rowInfo) {
      this.itemData = rowInfo
      this.handleShow()
      this.mode = 'edit-error'
    },
    handleDelete(e) {
      this.$http
        .delete('errCode/deErrorCode/' + e.row.id, {
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