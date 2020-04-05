<template>
  <div class="login-container">
    <el-row>
      <el-col :span="16">
        <img class="login-container-img" src="../assets/img/login.png" alt="">
      </el-col>
      <el-col :span="8">
        <div class="login-input">
          <div class="login-input-title">
            <img src="../assets/img/logo.png" alt="">
            <span>API用户登录</span>
          </div>
          <!-- 输入框 -->
          <div class="login-submit">
            <el-form ref="resetLoginRef" :rules="loginFormRules" :model="loginForm" label-width="80px">
              <el-form-item label="用户名:" prop="email" style="width:340px;">
                <el-input placeholder="email" v-model="loginForm.email"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="password" style="width:340px;">
                <el-input placeholder="Password" type="password" v-model="loginForm.password" show-password></el-input>
              </el-form-item>
              <el-form-item class="login-submit-button " style="width:350px;">
                <el-button type="primary" @click="loginSubmit">登录</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 注册 -->
          <div class="login-input-isRes">
            <span>没有账户？</span>
            <el-link @click="registered" type="primary">注册</el-link>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 登录表单数据
        loginForm: {
          email: 'user5@qq.com',
          password: '000000'
        },
        // 表单验证规则
        loginFormRules: {
           email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入合法邮箱',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 点击登录
      loginSubmit() {
        this.$refs.resetLoginRef.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return;
          //  发起请求
          this.$http.post('oAuth/login', this.loginForm)
            .then(res => {
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              //1.将登陆之后的token，保存到客户端的sessionStorage中
              window.sessionStorage.setItem("token", "Bearer " + res.data.data.token)
              // 给token设置时效
              window.sessionStorage.setItem("tokenDate", (Date.parse(new Date())+res.data.data.expires_in*1000-600000))
              this.$message.success(res.data.msg);
              //2.通过编程式导航跳转到主页
              this.$router.push('/home');
            }).catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: err.response.data.data.join('<br><br>'),
                type: 'error'
              });
            })
        })
      },
      // 跳转注册页面
      registered() {
        this.$router.push('/registered');
      }
    },
  }
</script>

<style lang="less" scoped>
  .login-container {
    background: url("../assets/img/loginBG.png") no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    min-height: 500px;
  }

  .el-row {
    width: 100%;
    height: 100%;
  }

  .el-col {
    height: 100%;
    position: relative;
  }

  .login-container-img {
    width: 70%;
    height: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    // min-width: 950px;
    // min-height: 750px;
    transform: translate(-50%, -50%);
  }

  .login-input {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 50%;
    width: 70%;
    min-height: 480px;
    min-width: 480px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5)
  }

  .login-input-title {
    height: 15%;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-bottom: 3px solid rgba(0, 0, 0, 0.4);

    img {
      height: 70%;

    }

    span {
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 18px;
      opacity: 0.82;
      margin-left: 5%;
    }
  }

  .login-submit {
    width: 80%;
    height: 60%;
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .el-form {
      width: 90%;
      height: 70%;
      position: absolute;
      left: 46%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-left: 0px !important;
    }

    .login-submit-button {
      text-align: center;
      margin-top: 50px;


      .el-button {
        width: 60%;
        // background: rgba(66,116,220)
        margin-right: 20% !important;
      }
    }
  }

  // 是否注册
  .login-input-isRes {
    position: absolute;
    width: 100%;
    bottom: 80px;
    text-align: center;

    .el-link {
      font-size: 16px;
      vertical-align: top;
    }
  }
</style>