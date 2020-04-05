<template>
  <div>
    <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt />
    <span class="title">消息通知</span>
    <div class="basiContainer">
      <HeaderTitle name="消息通知"></HeaderTitle>
      <el-table :data="formData" style="width: 100%">
        <el-table-column prop="from" label="用户名" width="180"></el-table-column>
        <el-table-column prop="name" label="内容" width="280"></el-table-column>
        <el-table-column prop="created_at" label="时间"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
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

<style lang="less" scope>
.basiContainer {
  max-height: 700px;
  position: relative;
  width: 900px;
  margin: 70px auto;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
}
.cell {
  text-align: center;
}
.operation {
  position: absolute;
  top: 10px;
  right: 30px;
}
.el-button--medium {
  width: 100px;
  padding: 5px 20px;
}
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
import RemoteData from '../../../mixins/RemoteData'

export default {
  mixins: [
    RemoteData({
      quest: 'MyMessage'
    })
  ],
  data() {
    return {}
  },

  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
    handleDelete() {},
    handleReflush() {},
    backPrevious() {
      this.$router.push('/myProject')
    }
  }
}
</script>