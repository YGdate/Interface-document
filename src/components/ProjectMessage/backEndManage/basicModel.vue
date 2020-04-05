<template>
  <div class="basiContainer" :style="'height: ' + basicHeight">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.basiContainer {
  position: relative;
  width: 900px;
  margin: 70px auto;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
}
</style>

<script>
export default {
    props:['height'],
    computed:{
        basicHeight(){
            return this.height + 'px'
        }
    }
}
</script>