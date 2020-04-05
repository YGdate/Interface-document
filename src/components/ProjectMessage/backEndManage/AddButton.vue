<template>
  <div class="button-position">
    <el-button class="form-button" type="primary">{{name}}</el-button>
  </div>
</template>

<style lang="less" scoped>
.form-button {
  position: absolute;
  z-index: 100;
  top: -60px;
  right: 0;
}
</style>

<script>
export default {
    props:['name']
}
</script>