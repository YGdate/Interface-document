<template>
  <div>
    人员管理
    <div class="main-div">
      <el-form :inline="true" :onsubmit="false">
        <el-form-item style="width:180px">
          <el-select placeholder="全部成员" v-model="somemenber" @change="mainchange">
            <el-option label="前端" value="mainqian"></el-option>
            <el-option label="后端" value="mainhou"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="width:302px;margin-left:50px;">
          <el-input
            placeholder="用户名 / 手机号 / 邮箱"
            v-model="searchmenber"
            @keyup.enter.native="searchsome"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor:pointer"
              @click="searchsome"
            ></i>
          </el-input>
        </el-form-item>

        <el-form-item style="float:right " >
          <el-button type="primary" @click="dialogVisible2=true">新增成员</el-button>
        </el-form-item>
      </el-form>
      <hr />

      <!-- 下面是主体的表格 -->
      <div class="main-table">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="name" label="用户名" width="120"></el-table-column>
          <el-table-column prop="position_code" label="用户组" width="120"></el-table-column>
          <el-table-column prop="phone_number" label="手机号" width="220"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
          <el-table-column label="设置为项目管理员" width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.access_code"
                active-color="#13ce66"
                active-value="-1"
                inactive-color="#ff4949"
                @change="setmanage(scope.row)"
              ></el-switch>
            </template>
            <!-- <el-switch v-model="sw" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
          </el-table-column>
          <el-table-column label="状态" width="140">
            <template slot-scope="scope">
              <span :class="(scope.row.state == 1) ? 'zhengchang' : 'buzhengchang'">
                <i :class="nosure[scope.row.state]"></i>
                <span :class="(scope.row.state == 1) ? 'noshow' : ''">不</span>正常
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <i
                class="el-icon-edit"
                style="margin-right:30px;font-size:25px;cursor:pointer"
                @click="updatedarryquestion(scope.row)"
              ></i>
              <i
                class="el-icon-delete"
                style="font-size:25px;cursor:pointer"
                @click="userdelete(scope.row.id)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页区域 -->
    <div class="block-some" style="text-align:center;margin-top:20px">
      <el-pagination
        :current-page.sync="current_page"
        :page-size="per_page-0"
        layout="total,  prev, pager, next, jumper"
        :total="tota-0"
        @current-change="curchange"
      ></el-pagination>
    </div>

    <!-- 第一个弹框的内容 -->
    <el-dialog :visible.sync="dialogVisible" width="1200px">
      <div class="update-top" style="margin-top:20px;margin-bottom:30px">
        <el-form ref="form" label-width="80px" :inline="true">
          <span style="font-size:18px;font-weight:500">编辑成员</span>
          <div style="float:right;flex:inline-block">
            <el-form-item style="width:150px">
              <el-select style="width:150px;" placeholder="运行权选择" v-model="upchan" @change="changeupchan">
                <el-option label="禁用" value="ban"></el-option>
                <el-option label="运行" value="pass"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:130px">
                 <el-button type="primary" style="margin-left:25px" @click="sureupdate">确定修改</el-button>
            </el-form-item>
           
          </div>
        </el-form>
      </div>
      <hr />

      <!-- 下面是修改的表单主体内容 -->
      <div style="margin-top:30px;">
        <el-form
          ref="formupdate"
          label-width="80px"
          style="padding-left:330px"
          :rules="addrules"
          :model="updatedarry"
        >
          <!-- 下面是修改用户名 -->
          <el-form-item label="用户名" style="width:400px;" prop="name">
            <el-input v-model="updatedarry.name"></el-input>
          </el-form-item>
          <!-- 下面是密码 -->
          <el-form-item label="密码" style="width:400px;" prop="password">
            <el-input type="password" v-model="updatedarry.password" placeholder="此项可以不填"></el-input>
          </el-form-item>
          <!-- 下面是修改手机号 -->
          <el-form-item label="手机号" style="width:400px;" prop="number">
            <el-input v-model="updatedarry.number"></el-input>
          </el-form-item>
          <!-- 下面是修改邮箱 -->
          <el-form-item label="邮箱" style="width:400px;" prop="email">
            <el-input v-model="updatedarry.email"></el-input>
          </el-form-item>
          <!-- 选择类别 -->
          <el-form-item label="用户组" style="width:400px;">
            <el-select
              placeholder="请选择所属方向"
              v-model="modifymenber.modifymenberdirection"
            >
              <el-option label="前端开发人员" value="qianduankaifa"></el-option>
              <el-option label="后端开发人员" value="houduankaifa"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 第二！！！个弹框的内容 -->
    <el-dialog :visible.sync="dialogVisible2" width="1200px">
      <div class="update-top" style="margin-top:20px;margin-bottom:30px">
        <el-form label-width="80px" :inline="true">
          <span style="font-size:18px;font-weight:500">编辑成员</span>
          <div style="float:right;flex:inline-block">
            <el-button type="primary" @click="addquestion">新增</el-button>
          </div>
        </el-form>
      </div>
      <hr />
      <div style="margin-top:30px;">
        <el-form
          ref="addform"
          label-width="80px"
          style="padding-left:330px"
          :model="addmenber"
          :rules="addrules2"
        >
          <!-- 下面是修改用户名 -->
          <el-form-item label="用户名" style="width:400px;" prop="menbername">
            <el-input v-model="addmenber.menbername"></el-input>
          </el-form-item>
          <!-- 下面是密码 -->
          <el-form-item label="密码" style="width:400px;" prop="menberpassword">
            <el-input type="password" v-model="addmenber.menberpassword"></el-input>
          </el-form-item>
          <!-- 下面是修改手机号 -->
          <el-form-item label="手机号" style="width:400px;" prop="menbernumber">
            <el-input v-model="addmenber.menbernumber"></el-input>
          </el-form-item>
          <!-- 下面是修改邮箱 -->
          <el-form-item label="邮箱" style="width:400px;" prop="menberemail">
            <el-input v-model="addmenber.menberemail"></el-input>
          </el-form-item>
          <!-- 选择类别 -->
          <el-form-item label="用户组" style="width:400px;">
            <el-select
              placeholder="请选择所属方向"
              v-model="addmenber.menberdirection"
              @change="addchange"
            >
              <el-option label="前端开发人员" value="addqian"></el-option>
              <el-option label="后端开发人员" value="addhou"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 确认删除的弹出框 -->
    <el-dialog title="提示" :visible.sync="suredelete" width="30%" center>
      <span>你确定要删除改用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="suredelete = false">取 消</el-button>
        <el-button type="primary" @click="usersuredelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的验证规则
    var checkemail = (rule, value, cb) => {
      const regemail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regemail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱！'))
    }
    // 验证手机号的规则
    var checknumber = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        // 合法的电话
        return cb()
      }
      cb(new Error('请输入正确的电话号码！'))
    }

    return {
      // 请求的地址
      url: 'Admin/getUser?page=',
      // 分页信息总数
      tota: '',
      // 修改数据的选项卡数据
      upchan: '',
      // 修改时的临时id
      updateID: '',
      // 每页多少数据
      per_page: '',
      // 当前页
      current_page: 1,
      // 要删除的用户id
      deleteuserid: '',
      // 确认删除的提示框
      suredelete: false,
      // 正常异常的图标显示
      nosure: ['el-icon-close', 'el-icon-check'],
      // 修改信息时的临时数组
      updatedarry: {
        name: '',
        password: '',
        number: '',
        email: '',
        derection: ''
      },
      // 编辑成员的弹框
      dialogVisible: false,
      // 新增成员的弹框
      dialogVisible2: false,
      // 下面是表格的数据内容
      tableData: [],
      // 全部成员或条件成员的数据绑定
      somemenber: '',
      // 搜索的数据绑定
      searchmenber: '',
      // 正常，选择，搜索的变化
      change: '0',
      // 下面是新增对象的数据存储
      addmenber: {
        menbername: '',
        menberpassword: '',
        menberemail: '',
        menbernumber: '',
        menberdirection: ''
      },
      // 下面是修改数据的数据存储
      modifymenber: {
        modifymenbername: '',
        modifymenberpassword: '',
        modifymenberemail: '',
        modifymenbernumber: '',
        modifymenber: '',
        modifymenberdirection: ''
      },
      // 表单的规则验证
      addrules: {
        name: [
          // 不能为空的规则
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户名的长度在2到5个字符之间！',
            trigger: 'blur'
          }
        ],
        password: [
          // 不能为空的规则
          { required: true, message: '请输入密码！', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码的长度在6到16个字符之间！',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱！', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入手机号！', trigger: 'blur' },
          { validator: checknumber, trigger: 'blur' }
        ]
      },

      // 新增的验证规则
      addrules2: {
        menbername: [
          // 不能为空的规则
          { required: true, message: '请输入用户名！', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户名的长度在2到5个字符之间！',
            trigger: 'blur'
          }
        ],
        menberpassword: [
          // 不能为空的规则
          { required: true, message: '请输入密码！', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码的长度在6到16个字符之间！',
            trigger: 'blur'
          }
        ],
        menberemail: [
          { required: true, message: '请输入邮箱！', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        menbernumber: [
          { required: true, message: '请输入手机号！', trigger: 'blur' },
          { validator: checknumber, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getmessage('1')
  },
  methods: {
    // 一开始获取数据的函数
    async getmessage(page) {
      var onedata = await this.$http.get(this.url + page)
      console.log(onedata.data.data)
      if (onedata.status == 200) {
        // 给表格数据赋值
        this.current_page = onedata.data.data.current_page

        this.tableData = onedata.data.data.data
        // 给数据总数赋值
        this.tota = parseInt(onedata.data.data.total)
        // 每页多少数据
        this.per_page = parseInt(onedata.data.data.per_page)
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].position_code == '0') {
            this.tableData[i].position_code = '前端'
          } else if (this.tableData[i].position_code == '1') {
            this.tableData[i].position_code = '后端'
          } else {
            this.tableData[i].position_code = '未设置'
          }
        }
      }
    },
          // 修改表单的运行禁用点击
      changeupchan(val) {
        if (val == 'ban') {
          this.upchan = '禁用'
        } else {
          this.upchan = '运行'
        }
      },
    // 确认修改的点击
     sureupdate() {
      this.$refs.formupdate.validate(async valid => {
        if(valid==false){
          return 0;
        }
          else{
      let code
      let state
      if (this.upchan == '禁用') {
        state = '0'
      }
      if (this.upchan == '运行') {
        state = '1'
      }
      if (this.modifymenber.modifymenberdirection == 'qianduankaifa') {
        code = '0'
      } else {
        code = '1'
      }
      if (this.modifymenber.modifymenberdirection == '') {
        this.$message.error('请完整填写数据！')
        return 0
      }

      var update = await this.$http
        .post('Admin/UpdateUserInfo', {
          ID: this.updateID,
          name: this.updatedarry.name,
          password: this.updatedarry.password,
          phone: this.updatedarry.number,
          email: this.updatedarry.email,
          access_code: code,
          state: state
        })
        .catch(err => {
          this.$message.error(err.response.data.data.join())
        })
      if (update.data.code == 200) {
        this.$message.success('修改成功！')
        this.dialogVisible = false
        if (this.change == '0') {
          this.getmessage('1')
        }
        if (this.change == '1') {
          this.mainchange('1')
        } 
      } else {
        this.$message.error('修改失败！')
      }
          }

      })

    },
    async setmanage(row) {
      let id = row.id
      let acc
      console.log(row.access_code)
      if (row.access_code == '-1') {
        acc = '-1'
      } else {
        acc = '0'
      }
      console.log(acc)
      var set = await this.$http.get('Admin/SetManage', {
        params: {
          id: parseInt(id),
          access_code: acc
        }
      })
      if (set.data.code == 200) {
        this.$message.success('修改成功!')
      } else {
        this.$message.error('修改失败！')
        if (row.access_code == '0') {
          row.access_code = '1'
        } else {
          row.access_code = '0'
        }
      }
    },
    // 删除按钮的点击
    userdelete(id) {
      this.suredelete = true
      this.deleteuserid = id
    },
    // // 修改前端后端下拉
    // kaifa(val) {},
    // 确认删除的函数
    async usersuredelete() {
      var deleteuser = await this.$http.get('Admin/DeleteUser', {
        params: {
          ID: parseInt(this.deleteuserid)
        }
      })
      if (deleteuser.data.code == 200) {
        this.deleteuserid = ''
        this.suredelete = false
        this.getmessage()
        this.$message.success('删除成功！')
      } else {
        this.suredelete = false
        this.$message.error('删除失败!')
      }
    },
    // 主页面前端后端的选择
    async mainchange(val) {
      let dir
      if (val == 'mainqian') {
        dir = '0'
      } else {
        dir = '1'
      }
      var oda = await this.$http.get(this.url + val, {
        params: {
          access_code: dir
        }
      })
      if (oda.status == 200) {
        this.change = '1'
        // 给表格数据赋值
        this.tableData = oda.data.data.data
        // 给数据总数赋值
        this.tota = parseInt(oda.data.data.total)
        // 每页多少数据
        this.per_page = parseInt(oda.data.data.per_page)
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].position_code == '0') {
            this.tableData[i].position_code = '前端'
          } else if (this.tableData[i].position_code == '1') {
            this.tableData[i].position_code = '后端'
          } else {
            this.tableData[i].position_code = '未设置'
          }
        }
      }
    },
    // 新增成员的点击
    addquestion() {
      if (this.addmenber.menberdirection == '') {
        this.$message.error('表单数据不符合要求！')
        return 0
      }
      this.$refs.addform.validate(async valid => {
        if (valid == false) {
          this.$message.error('表单数据不符合要求！')
        } else {
          let code;
          if(this.addmenber.menberdirection == '前端开发人员'){
            code = '1'
          }else if(this.addmenber.menberdirection == '后端开发人员'){
            code = '0'
          }
          var addu = await this.$http
            .post('Admin/AddUser', {
              name: this.addmenber.menbername,
              password: this.addmenber.menberpassword,
              phone: this.addmenber.menbernumber,
              email: this.addmenber.menberemail,
              access_code: code
            })
            .catch(err => {
              this.$message.error(err.response.data.data.join())
            })
          if (addu.data.code == 200) {
            this.$message.success('添加新成员成功！')
            this.addmenber.menbername = ''
            this.addmenber.menberpassword = ''
            this.addmenber.menbernumber = ''
            this.addmenber.menberemail = ''
            this.addmenber.menberdirection = ''
            this.dialogVisible2 = false
          } else {
            this.$message.error('添加新成员失败！')
          }
          // this.getmessage('1');
        }
      })
    },
    // 修改成员数据的点击
    async updatedarryquestion(row) {
      this.modifymenber.modifymenberdirection = ''
      this.dialogVisible = true
      let co = row.position_code
      if (co == '前端') {
        this.modifymenber.modifymenberdirection = 'qianduankaifa'
      }
      if (co == '后端') {
        this.modifymenber.modifymenberdirection = 'houduankaifa'
      }
      let id = row.id
      this.updateID = row.id
      var userdata = await this.$http.get('Admin/ShowUserInfo', {
        params: {
          ID: parseInt(id)
        }
      })
      let access_code = userdata.data.data[0].access_code
      if (access_code == 0) {
        this.upchan = '禁用'
      } else {
        this.upchan = '运行'
      }
      this.updatedarry.name = row.name
      this.updatedarry.number = row.phone_number
      this.updatedarry.email = row.email
      this.updatedarry.derection = row.position_code
    },
    // 新增页面下拉点击
    addchange(val) {
      if (val == 'addqian') {
        this.addmenber.menberdirection = '前端开发人员'
      } else {
        this.addmenber.menberdirection = '后端开发人员'
      }
    },
    // 主页面的当前页点击
    curchange(val) {
      if (this.change == '0') {
        this.getmessage(val)
      } else if (this.change == '1') {
        console.log(11111)
        this.mainchange(val)
      } else {
        this.searchsome(val)
      }
    },
    // 搜索事件的点击
    async searchsome(val) {
      let con = this.searchmenber.trim()
      if (con == '') {
        this.somemenber = ''
        this.change = '0'
        this.getmessage('1')
      } else {
        var serdata = await this.$http
          .post('Admin/SearchUser?page=' + val, {
            info: con
          })
          .catch(err => {
            this.$message.error(err.response.data.data.join())
          })
        if (serdata.data.code == 100) {
          this.$message.error('无搜索内容！')
        } else {
          // this.current_page = serdata.data
          this.current_page = 1
          this.somemenber = ''
          this.change = '3'
          this.tableData = serdata.data.data.data
          // 给数据总数赋值
          this.tota = parseInt(serdata.data.data.total)
          // 每页多少数据
          this.per_page = parseInt(serdata.data.data.per_page)
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].position_code == '0') {
              this.tableData[i].position_code = '前端'
            } else if (this.tableData[i].position_code == '1') {
              this.tableData[i].position_code = '后端'
            } else {
              this.tableData[i].position_code = '未设置'
            }
          }
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.main-div {
  width: 1200px;
  height: 660px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
  margin: 30px auto 0;
  padding: 30px 30px 20px;
}

// 状态栏正常的样式
.zhengchang {
  display: inline-block;
  width: 76px;
  height: 23px;
  background: rgba(18, 150, 219, 1);
  border-radius: 10px;
  color: white;
  i {
    margin-right: 5px;
  }
}
// 状态栏不正常的样式
.buzhengchang {
  display: inline-block;
  width: 76px;
  height: 23px;
  background: red;
  border-radius: 10px;
  color: white;
  i {
    margin-right: 5px;
  }
}
// 显示样式
.noshow {
  display: none;
}
.el-form{
  padding: 0;
  margin-left: 0;
}
.el-form-item__content{
  width: 180px;
}
</style>