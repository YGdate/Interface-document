<template>
  <div class="g-header">
    <div class="g-header_title">{{name}}</div>
  </div>
</template>

<style lang="less" scrope>
.g-header .g-header_title {
  font-size: 18px;
  color: #000000;
  margin-bottom: 20px;
  text-indent: 10px;
}
.g-header .g-header_title::after {
  content: '';
  display: block;
  border-bottom: solid 1px black;
  height: 1px;
  width: 880px;
  position: relative;
  left: 10px;
  top: 10px;
  opacity: 0.2;
}
</style>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>