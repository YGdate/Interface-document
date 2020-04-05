<template>
  <div class="container">
    <el-row>
      <el-col :span="16">
        <img class="container-img" src="../assets/img/login.png" alt="">
      </el-col>
      <el-col :span="8">
        <div class="input">
          <div class="input-title">
            <img src="../assets/img/logo.png" alt="">
            <span>API用户登录</span>
          </div>
          <!-- 输入框 -->
          <div class="submit">
            <el-form ref="alertPasswordRef" :rules="alertPasswordFormRules" :model="alertPasswordForm"
              label-width="100px">
              <el-form-item label="原密码:" prop="oldPassword">
                <el-input placeholder="密码6-16位" type="password" v-model="alertPasswordForm.oldPassword" show-password>
                </el-input>
              </el-form-item>
              <el-form-item label="新密码:" prop="newPassword">
                <el-input placeholder="密码6-16位" type="password" v-model="alertPasswordForm.newPassword" show-password>
                </el-input>
              </el-form-item>
              <el-form-item label="重复密码:" prop="reNewPassword">
                <el-input placeholder="再输一次" type="password" v-model="alertPasswordForm.reNewPassword"
                  show-password></el-input>
              </el-form-item>
              <el-form-item class="submit-button">
                <el-button type="primary" @click="alertPasswor">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
       // 自定义“重新输入密码”表单验证规则
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.alertPasswordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        // 登录表单数据
        alertPasswordForm: {
          oldPassword: '',
          newPassword: '000000',
          reNewPassword:'000000'
        },
        // 表单验证规则
        alertPasswordFormRules: {
          oldPassword: [{
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
          ],
           newPassword: [{
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
          ],
          reNewPassword: [{
            validator: validatePassword,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 点击修改密码
      alertPasswor() {
        this.$refs.resetLoginRef.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return;
          //  发起请求
          this.$http.post('api/oAuth/login', this.loginForm)
            .then(res => {
              console.log(res);
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              //1.将登陆之后的token，保存到客户端的sessionStorage中
              window.sessionStorage.setItem("token", "Bearer " + res.data.data.token)
              this.$message.success(res.data.msg)
              // 清除token
              window.sessionStorage.clear()
            }).catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: eval('(' + err.response.data + ')').data.join('<br><br>'),
                type: 'error'
              });
            })
        })
      },
     
    },
  }
</script>

<style lang="less" scoped>
  .container {
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

  .container-img {
    width: 70%;
    height: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    // min-width: 950px;
    // min-height: 750px;
    transform: translate(-50%, -50%);
  }

  .input {
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

  .input-title {
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

  .submit {
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

    }

    .submit-button {
      text-align: center;
      margin-top: 50px;


      .el-button {
        width: 60%;
        // background: rgba(66,116,220)
        margin-right: 20% !important;
      }
    }
  }

  
</style>