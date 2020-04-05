<template>
  <div class="container">
    <el-row>
      <el-col :span="16">
        <img class="container-img" src="../assets/img/login.png" alt="">
      </el-col>
      <el-col :span="8">
        <div class="reg-input">
          <div class="reg-input-title">
            <img src="../assets/img/logo.png" alt="">
            <span>API用户登录</span>
          </div>
          <!-- 输入框 -->
          <div class="reg-submit">
            <el-form ref="resetRegistredRef" status-icon :rules="registredFormRules" :model="registredForm"
              label-width="90px">
              <el-form-item label="用户名:" prop="name">
                <el-input placeholder="用户名" v-model="registredForm.name"></el-input>
              </el-form-item>
              <el-form-item label="邮箱:" prop="email">
                <el-input placeholder="****@qq.com" type="email" v-model="registredForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="phone_number">
                <el-input placeholder="手机号码" type="number" class="phoneNumber" v-model="registredForm.phone_number">
                </el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input placeholder="密码6-16位" type="password" v-model="registredForm.password" show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="password_confirmation">
                <el-input placeholder="在输一次" type="password" v-model="registredForm.password_confirmation" show-password></el-input>
              </el-form-item>
              <el-form-item class="reg-submit-button">
                <el-button type="primary" @click="regSubmit">注册</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 注册 -->
          <div class="reg-input-isRes">
            <span>没有账户？</span>
            <el-link @click="jumpLogin" type="primary">登录</el-link>
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
        } else if (value !== this.registredForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      
      // 自定义“手机号”表单验证规则
      var validateNumber = (rule, value, callback) => {
        var regPhoneNumber = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else if (!regPhoneNumber.test(this.registredForm.phone_number)) {
          callback(new Error('请输入合法手机号'));
        } else {
          callback();
        }
      }

      return {
        // 登录表单数据
        registredForm: {
          name: 'aaa',
          email: 'aaa@qq.com',
          phone_number: '18095016192',
          password: '000000',
          password_confirmation: '000000'
        },
        // 表单验证规则
        registredFormRules: {
          name: [{
              required: true,
              message: '请输入账号',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 16,
              message: '长度在 3 到 16 个字符',
              trigger: 'blur'
            }
          ],
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
          phone_number: [{
            validator: validateNumber,
            trigger: 'blur'
          }],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 16,
              message: '长度在 3 到 16 个字符',
              trigger: 'blur'
            }
          ],
          password_confirmation: [{
            validator: validatePassword,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 点击注册
      regSubmit() {
        // 表单验证是否通过
        this.$refs.resetRegistredRef.validate(async valid => {
          if (!valid) return;
          //  验证通过并，发起请求
          this.$http.post('oAuth/registered',
            this.registredForm,
          ).then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg);
            this.$message.success(res.data.msg);
          }).catch(err => {
            // this.$message.error(err.response.data.data.join());
            //在这里可以再做一些错误处理的操作
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
      jumpLogin() {
        this.$router.push('/login');
      }
    },
  }
</script>

<style lang="less" scoped>
  .container {
    background: url("../assets/img/loginBG.png") no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    min-height: 610px;
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

  .reg-input {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 65%;
    width: 70%;
    min-height: 600px;
    min-width: 480px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5)
  }

  .reg-input-title {
    height: 12%;
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

  .phoneNumber {
    -webkit-appearance: none;
  }

  .reg-submit {
    width: 80%;
    height: 80%;
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
      margin-left: 0px;
    }

    .reg-submit-button {
      text-align: center;
      margin-top: 10%;

      .el-button {
        width: 60%;
        margin-right: 24% !important;
        
      }
    }
  }

  // 是否注册
  .reg-input-isRes {
    position: absolute;
    width: 100%;
    bottom: 8%;
    text-align: center;
    .el-link {
      font-size: 16px;
      vertical-align: top;
    }
  }
  .el-form-item{
    width: 350px;
  }
</style>