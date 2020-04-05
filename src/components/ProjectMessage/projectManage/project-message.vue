<template>
    <div>
        <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/allProject' }">所有项目</el-breadcrumb-item>
      <el-breadcrumb-item>消息通知</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体区域 -->
     <div class="project-message-content">
         <div class="message-top">
             <span>消息通知</span>
             <div style="float:right">
                  <!-- <el-button type="primary">删除</el-button> -->
               <el-button type="primary" @click="newmsg"><i class="el-icon-refresh" style="margin-right:8px"></i>刷新</el-button>
             </div>  
         </div>
         <hr>
         <!-- 下面是表格内容 -->
          <div class="table-content">
          <el-table :data="tableData" style="width: 100%" border>
            <!-- <el-table-column  label="选择" width="180">
              <el-checkbox  label="选择该用户" border></el-checkbox>
            </el-table-column> -->
            <el-table-column prop="from" label="用户名" width="240"></el-table-column>
            <el-table-column prop="name" label="内容" width="680"></el-table-column>
            <el-table-column prop="created_at" label="时间" width="279"></el-table-column>
          </el-table>
        </div>
     </div>


     <!-- 分页区域 -->
           <div class="block-some" style="text-align:center">
        <el-pagination
        @current-change="cur"
          :page-size="per_page-0"
          layout="total,  prev, pager, next, jumper"
          :total="total-0"
          :current-page = "curpage"
        ></el-pagination>
      </div>
    </div>
</template>

<script>
export default {
  created(){
    this.getmessage("1");
  },
    data(){
      return {
        // 表格数据
         tableData: [
      ],
      // 一共多少数据
      total:'',
      // 每页的多少条
      per_page:'',
      // 当前是第几页
      curpage:''
      }
    },
    methods:{
      async getmessage(page){
        var msg = await this.$http.get("http://api.myxy99.cn/api/MyMessage?page="+page,{
          params:{
            project_id:window.sessionStorage.projectid
          }
        })
        console.log(msg.data.data)
        this.tableData = msg.data.data.data;
        this.total  = msg.data.data.total;
        this.per_page = msg.data.data.per_page;
        this.curpage = msg.data.data.current_page;
      },
      // 每页的点击
      cur(val){
          this.getmessage(val);
      },
      // 刷新函数
      newmsg(){
           this.getmessage("1");
      }
    }
}
</script>

<style scoped>
.project-message-content {
  width: 1200px;
  min-height: 660px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 17px 1px rgba(0, 0, 0, 0.1);
  margin: 60px auto 0;
  padding: 20px 40px;
  margin-bottom: 20px;
}
.message-top{
    margin-bottom: 35px
}
.el-form{
  padding: 0;
  margin-left: 0;
}

</style>