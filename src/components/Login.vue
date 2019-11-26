<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avater-box">
        <img src="../assets/img/logo.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        
      }
    },
    created(){
      //加载页面初始化函数
      this.getdata()
    },
    methods: {
      // 页面初始化函数
      getdata(){
        //1.将登陆之后的token，保存到客户端的sessionStorage中
        window.sessionStorage.setItem("token",'aaaaaaaaa');
        // 通过登录成功的返回值，保存权限状态到sessionStorage
        window.sessionStorage.setItem("permission1",'1');
        window.sessionStorage.setItem("permission2",'1');
        //2.通过编程式导航跳转到主页
        this.$router.push('/home');
      }
    },
  }
</script>

<style lang="less" scoped>

</style>