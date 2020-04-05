<template>
  <el-table :data="data" style="width: 100%">
    <el-table-column :label="$attrs.col1" width="200">
      <template slot-scope="scope">
        <span style="margin-left: 10px">
          {{ $attrs.mode == '模块设置' ? scope.row.modules_name:
          $attrs.mode == '错误码编辑'? scope.row.error_code: $attrs.mode == '任务管理'?scope.row.name:''}}
        </span>
      </template>
    </el-table-column>
    <el-table-column :label="$attrs.col2" width="220">
      <template slot-scope="scope">
        <span style="margin-left: 10px">
          {{ $attrs.mode == '模块设置' ? scope.row.class_name :
          $attrs.mode == '错误码编辑'? scope.row.error_info: $attrs.mode == '任务管理'?scope.row.class_name:''}}
        </span>
      </template>
    </el-table-column>
    <el-table-column v-if="$attrs.col3" :label="$attrs.col3" width="250">
      <template slot-scope="scope">
        <span style="margin-left: 10px">
          {{ $attrs.mode == '模块设置' ?scope.row.full_class_name:
          $attrs.mode == '错误码编辑'?scope.row.http_code: '' }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      modules_name: true
    }
  },

  methods: {
    handleEdit(index, row) {
      this.$emit('edit-module', row)
    },
    handleDelete(index, row) {
      this.$emit('handle-delete',{index,row})
    }
  }
}
</script>