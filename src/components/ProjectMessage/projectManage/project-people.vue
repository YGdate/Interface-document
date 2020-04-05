<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/allProject' }">所有项目</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="project-people-content">
      <div class="people-content-top" style="margin-bottom:20px">
        <el-select v-model="direc" @change="choicedir">
          <el-option label="前端" value="qian"></el-option>
          <el-option label="后端" value="hou"></el-option>
        </el-select>

        <!-- 搜索框 -->
        <el-input v-model="searchcontent" placeholder="请输入搜索内容 / 为空返回所有" class="people-search" style="margin-left:50px"  @keyup.enter.native="searchdata">
          <i slot="suffix" class="el-input__icon el-icon-search" style="cursor:pointer" @click="searchdata('1')"></i>
        </el-input>

        <!-- 邀请按钮 -->
        <el-button type="primary" style="float:right" @click="addbox">邀请新成员</el-button>
      </div>
      <hr />

      <!-- 下面是表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="name" label="用户名" width="150"></el-table-column>
        <el-table-column prop="position_code" label="用户组" width="100"></el-table-column>
        <el-table-column prop="phone_number" label="手机号" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="project_name" label="所属项目" width="190"></el-table-column>
        <el-table-column fixed="right" label="是否设为后端管理员" width="160">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.type"
              active-color="#13ce66"
              active-value="1"
              inactive-color="#ff4949"
              @change="setmanage(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <i class="el-icon-delete" style="font-size:25px;cursor:pointer" @click="deletefunc(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <!-- 主页的分页代码 -->
      <div class="block-some" style="text-align:center">
        <el-pagination
          :page-size="per_page-0"
          layout="total,  prev, pager, next, jumper"
          :total="total.one-0"
          :current-page="curpage.one-0"
          @current-change="onechange"
        ></el-pagination>
      </div>
    </div>
    <!-- 下面是弹框代码 -->
    <el-dialog title="邀请新成员" :visible.sync="dialogVisible" width="1200px">
      <!-- 这是弹框的顶部 -->
      <div class="dialog-top">
        <!-- 所需项目 -->
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item label="当前项目">
              <span>{{projectname}}</span>
          </el-form-item>

          <!-- 搜索 -->
          <el-form-item>
            <el-input placeholder="用户名 / 手机 / 邮箱"  style="margin-left:50px"  v-model="tansear" @keyup.enter.native="sear('1')">
              <i slot="suffix" class="el-input__icon el-icon-search" style="cursor:pointer" @click="sear('1')" ></i>
            </el-input>
          </el-form-item>
           <el-input placeholder="用户名 / 手机 / 邮箱"  style="margin-left:50px;display:none"  v-model="tansear" >
              <i slot="suffix" class="el-input__icon el-icon-search" style="cursor:pointer" @click="sear('1')"></i>
            </el-input>

          <el-button type="primary" style="float:right" @click="addpeople">添加</el-button>
        </el-form>
        <hr />
        <!-- 下面的内容 -->
        <div class="table-content">
          <el-table  @selection-change="handleSelectionChange"  :data="addtable" style="width: 100%" border>
             <el-table-column
      type="selection" width="55">
    </el-table-column>
            <el-table-column  label="用户名" width="240" prop="name"></el-table-column>
            <el-table-column  label="手机号" width="433" prop="phone_number"></el-table-column>
            <el-table-column  label="邮箱" width="430"  prop="email"></el-table-column>
          </el-table>
        </div>
        <!-- 分页的内容 -->
        <!-- 分页区域 -->
        <div class="block-some2" style="text-align:center">
          <el-pagination :current-page="cur2" :page-size="per_page-0" layout="total,  prev, pager, next, jumper" :total="total.two-0"
           @current-change="towchange"></el-pagination>
        </div>
      </div>
    </el-dialog>

<!-- 询问是否删除的弹框显示 -->
<el-dialog
  title="删除提示"
  :visible.sync="deleteornot"
  width="500px">
  <span>你确认删除该人员吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteornot=false">取 消</el-button>
    <el-button type="primary" @click="suredeleteuser">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.gainmessage('1')
    this.getmenber('1')
  },
  data() {

    return {
      // 项目的名字
      projectname: window.sessionStorage.projectname,
      // 弹出框的搜索内容
      tansear:'',
      // 新增选中的数组
      addarry:[],
      // 项目id
      proid:window.sessionStorage.projectid,
      // 搜索的内容
      searchcontent:'',
      // 弹框当前页
      cur2:'',
      // 首页的前后端选择
      choice:'',
      // 是否删除弹框的布尔值
      deleteornot:false,
      // 弹框的显示与隐藏
      dialogVisible: false,
      // 删除的人员id的暂存区域
      deleteid:'',
      // 删除的弹框的显示与隐藏
      dialogVisible2: false,
      direc: '',
      tableData: [],
      // 这里是邀请新成员的表格数据
      addtable:[],
      // 总数据数
      total: {
        one: '',
        two: ''
      },
      // 每页数据
      per_page: '',
      // 当前页选择
      curpage: {
        one: '',
        two: ''
      },
      // 分辨下拉正常以及搜索的数
      threeboy: '1',
      // 弹窗的分辨数
      twoboy:'1'
    }
  },
  methods: {
    // 开局请求函数
    async gainmessage(val) {
      this.threeboy = '1'
      var pp = await this.$http.get('projectadmin/getAllUsers?page='+val, {
        params: {
          pid: window.sessionStorage.projectid
        }
      })
      this.tableData = pp.data.data.data
      this.total.one = pp.data.data.total
      this.per_page = pp.data.data.per_page
      this.curpage.one = pp.data.data.current_page
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].position_code == '0') {
          this.tableData[i].position_code = '前端'
        } else if (this.tableData[i].position_code == '1') {
          this.tableData[i].position_code = '后端'
        } else {
          this.tableData[i].position_code = '未设置'
        }
      }
    },
    // 新增页面的所有人
    async getmenber(page){
      this.twoboy = '1'
      let msg = await this.$http.get("ProjectAdmin/membersItem/"+this.proid+"?page="+page)
      this.addtable = msg.data.data.data;
      this.total.two = msg.data.data.total;
       this.cur2 = msg.data.data.current_page
    },
    // 换页的函数
    onechange(val) {
      if (this.threeboy == '1') {
        this.gainmessage(val)
      }
      if (this.threeboy == '2') {
        this.qianhou(val)
      }
      if (this.threeboy == '3') {
        this.searchdata(val)
      }
    },
    // 弹框的换页函数
      towchange(val){
          if(this.twoboy=='1'){
              this.getmenber(val)
          }else{
              this.sear(val)
          }
      },
      // 弹框的搜索函数
      async sear(page){
            let con = this.tansear.trim();
            if(con==''){
              this.twoboy='1'
              this.getmenber('')
            }else{
                let msg = await this.$http.post("ProjectAdmin/queryUsers?page="+page,{

                    itemid:this.proid-0,
                      str:con

                })
                this.twoboy='2'
                this.addtable = msg.data.data.data;
      this.total.two = msg.data.data.total;
       this.cur2 = msg.data.data.current_page
            }
      },
    // 是否删除的弹框提示
    deletefunc(row){
      console.log(row)
      this.deleteid = row.project_member_id;
       this.deleteornot = true;
    },
          //增加选择的人
      handleSelectionChange(val){
        //addarry
       // console.log(val)
       this.addarry  = [];
        for(let i=0;i<val.length;i++){
          this.addarry.push(val[i].id)
        }
      },
    // 确认删除该人员
   async suredeleteuser(){
     let user = await this.$http.get("projectadmin/deleteUser/"+this.deleteid)
     console.log(user.data)
     if(user.data.code == 200){
       this.$message.success("删除成功！")
       this.deleteornot = false;
              this.gainmessage(this.curpage.one)
     }else{
       this.$message.error("删除失败！")
        this.deleteornot = false;
     }
    },
    // 主页面选择前后端
   choicedir(val){
      let choice;
      this.threeboy = '2';
        if(val=="qian"){
            choice = 0;
        }else{
             choice = 1;
        }
        this.choice = choice;
        this.qianhou("1")
    },
    // 选择完首页前后端的函数
    async qianhou(page){
            let dx = await this.$http.get("projectadmin/getUsers?page="+page,{
        params:{
          pid:window.sessionStorage.projectid,
          pcode:this.choice
        }
      })
            this.tableData = dx.data.data.data
      this.total.one = dx.data.data.total
      this.per_page = dx.data.data.per_page
      this.curpage.one = dx.data.data.current_page
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].position_code == '0') {
          this.tableData[i].position_code = '前端'
        } else if (this.tableData[i].position_code == '1') {
          this.tableData[i].position_code = '后端'
        } else {
          this.tableData[i].position_code = '未设置'
        }
      }
    },
    // 搜索的函数
    async searchdata(page){
      let con = this.searchcontent.trim();
      if(con==''){
        this.threeboy='1'
            this.choicedir=''
            this.gainmessage('1')
      }else{
           let gain = await this.$http.post("projectadmin/searchUser?page="+page,this.$qs.stringify({
             project_id:window.sessionStorage.projectid,
             Content:con
           }))
           console.log(gain)
           if(gain.data.msg=="未查询到数据!"){
             this.$message.success("未查询到数据！")
             return 0;
           }else{
             this.threeboy = '3'
         this.tableData = gain.data.data.data
      this.total.one = gain.data.data.total
      this.per_page = gain.data.data.per_page
      this.curpage.one = gain.data.data.current_page
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
    },
    // 是否设为管理员
    async setmanage(row){
      let userid = row.id;
      let type;
        if(row.type==1){
              type = '1'
        }else{
            type = '0'
        }
        let msg = await this.$http.get("projectadmin/setBackManager/"+userid,{
          params:{
            pid:window.sessionStorage.projectid,
            type:type
          }
        })
        console.log(msg)
        if(msg.data.code==200){
          this.$message.success("修改成功！")
        }else{
          this.$message.error("修改失败！")
          if(row.type==1){
            row.type =false
          }else{
             row.type = 1
          }
        }
    },
// 确认添加的函数
async addpeople(){
  console.log(this.addarry)
  if(this.addarry.length==0){
    this.$message.error("请选择添加人员！");
    return 0;
  }
let msg = await this.$http.post("ProjectAdmin/addMembers",this.$qs.stringify({
  itemid:window.sessionStorage.projectid,
  userid:this.addarry.toString()
}))
console.log(msg)
if(msg.data.code==200){
  this.$message.success("添加成功！")
  this.addarry=[]
  this.dialogVisible=false;
  this.gainmessage('1')
    this.getmenber('1')
}else{
  this.$message.error("添加失败！")
}
},
// 增加框的显示
addbox(){
  this.dialogVisible=true
  this.getmenber('1')
}
    
  }
}
</script>

<style scoped>
.project-people-content {
  width: 1200px;
  min-height: 660px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
  margin: 60px auto 0;
  padding: 20px;
  margin-bottom: 20px;
}
.people-search {
  width: 302px;
}
/* 弹框分页样式 */
.block-some2 {
  margin-top: 20px;
}
.el-form{
  padding: 0;
  margin-left: 0;
}
</style>