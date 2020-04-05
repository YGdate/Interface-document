<template>
  <div>
    <div :class="isShow ?'noShow':'show'">
      <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt="">
      <span class="title">接口审核</span>
      <!-- 卡片试图区域 -->
      <el-card style="margin: 0 220px;" >
        <!-- table 表格 -->
        <el-table :data="tableData" center stripe style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="interface_name" label="接口名">
          </el-table-column>
          <el-table-column prop="name" label="开发人员">
          </el-table-column>
          <el-table-column prop="address" label="状态">
            <template slot-scope='scope'>
              <span>{{scope.row.state == 1 ? '通过':'不通过'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span @click="auditInterface(scope.row)" class="alertInterface"> <i class="el-icon-setting"></i></span>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
       <!-- 分页 -->
        <div class="block">
          <el-pagination :hide-on-single-page="true" background @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalNum">
          </el-pagination>
        </div>
    </div>
     <!-- 接口审核详情页 -->
    <div :class="isShow ?'show':'noShow'">
      <img class="return-icon" @click="isShow = false" src="../../../assets/img/returnUp.png" alt="">
      <!-- 面包屑导航 -->
      <el-breadcrumb style="display:inline-block; margin-top:5px;" separator-class="el-icon-arrow-right" class="title">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的项目</el-breadcrumb-item>
        <el-breadcrumb-item>接口管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片试图区域 -->
      <el-card>
        <!-- form表单 -->
        <el-form ref="interFormData"  label-position="left" :inline="true"
          :model="interFormData" label-width="110px" size="small">
          <!-- table选项卡 -->
          <el-tabs v-model="activeIndex" :tab-position="'left'" label-position="label">
            <!-- 基础信息 -->
            <el-tab-pane label="基础信息" name="0" >
              <div class="tab-content">
                <div class="tab-content-title">基础信息 <span>(带*的为必填)</span></div>
                <el-divider></el-divider>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="接口名称" prop="interface_name">
                      <el-input :readonly="true" v-model="interFormData.interface_name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="模块名" prop="interface_module_id">
                      <el-select :disabled="true" style="width:350px;" v-model="interFormData.interface_module_id"
                        placeholder="请选择模块名">
                        <el-option v-for="item in interface_module_nameOptions" :key="item.id"
                          :label="item.modules_name" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="URL" prop="interface_url">
                      <el-input :readonly="true" v-model="interFormData.interface_url">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接口方法名" prop="interface_function_name">
                      <el-input :readonly="true" v-model="interFormData.interface_function_name"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="请求数据类型" prop="interface_request_type">
                      <el-input :readonly="true" v-model="interFormData.interface_request_type"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="请求方式" prop="interfaec_method">
                      <el-select :disabled="true" style="width:350px;" v-model="interFormData.interfaec_method"
                        placeholder="请选择请求方式">
                        <el-option v-for="item in requresMethod" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="返回类型" prop="interface_response_type">
                      <el-select :disabled="true" style="width:350px;"
                        v-model="interFormData.interface_response_type" placeholder="请选择返回类型">
                        <el-option v-for="item in responseType" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="错误码" prop="interface_response_error_code_ids">
                      <el-select :disabled="true" style="width:350px;"
                        v-model="interFormData.interface_response_error_code_ids" multiple filterable allow-create
                        default-first-option placeholder="请选择错误码标签">
                        <el-option v-for="item in errorCodes" :key="item.id" :label="item.error_code" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="接口说明" prop="interface_intro">
                      <el-input style="width:1000px;" :readonly="true" rows="10" class="interface-textarea"
                        type="textarea" v-model="interFormData.interface_intro"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <!-- 请求头  -->
            <el-tab-pane label="请求头" name="1">
              <div class="tab-content">
                <div style="display:inline-block" class="tab-content-title">请求头</div>
                <el-divider></el-divider>
                <el-table :data="interFormData.interface_header" stripe style="width: 100%" fit>
                  <el-table-column label="名称" >
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.header_name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">
                      <el-select :disabled="true" v-model="scope.row.header_is_need" placeholder="请选择">
                        <el-option v-for="item in IsRequiredData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select :disabled="true" v-model="scope.row.header_type" placeholder="请选择">
                        <el-option v-for="item in typesOfData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="默认值">
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.header_default_value">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.header_remark"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <!-- 请求参数 -->
            <el-tab-pane label="请求参数" name="2">
              <div class="tab-content">
                <div style="display:inline-block" class="tab-content-title">请求参数</div>
                <el-divider></el-divider>
                <el-table :data="interFormData.interface_request" stripe style="width: 100%" fit>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.request_name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">
                      <el-select :disabled="true" v-model="scope.row.request_is_need" placeholder="请选择">
                        <el-option v-for="item in IsRequiredData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select :disabled="true" v-model="scope.row.request_type" placeholder="请选择">
                        <el-option v-for="item in typesOfData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="默认值">
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.request_default_value">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input style="width:100%" class="infoWidth" :readonly="true" v-model="scope.row.request_remark"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <!-- 返回事例 -->
            <el-tab-pane label="返回示例" name="3">
              <div class="tab-content">
                <div class="tab-content-title">返回示例</div>
                <el-divider></el-divider>
                <el-form-item label="正确返回事例" prop="interface_response_success_example">
                  <el-input style="width:1000px;" rows="10" :readonly="true" class="interface-textarea"
                    type="textarea" v-model="interFormData.interface_response_success_example">
                  </el-input>
                </el-form-item>
                <el-form-item label="错误返回事例" prop="interface_response_fail_example">
                  <el-input style="width:1000px;" :readonly="true" rows="10" class="interface-textarea"
                    type="textarea" v-model="interFormData.interface_response_fail_example">
                  </el-input>
                </el-form-item>
                <div class="submitInterfaceData">
                  <el-button type="primary" @click="ReviewPass">审核通过</el-button>
                  <el-button type="warning" @click="ReviewNoPass">审核不通过</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
    </div>
    
  </div>
</template>

<script>
  // 引入深拷贝模块
  // import _ from 'lodash'

  export default {
    data() {
      return {
        // table表格的数据
        tableData: [{
          id:0,
          interface_name: '',
          name: '',
          state: 0
        }],
        // 当前页
        currentPage: 1,
        // 总共条数
        totalNum: 0,
        // 接口审核详情页是否显示
        isShow: false,
        // 审核接口表单数据
        addForm: {
          goods_name: '',
        },
        // 步骤条激活
        activeIndex: '0',
        // form的所有数据
        interFormData: {
          interface_id: 0,
          interface_name: "",
          interfaec_method: "",
          interface_url: "",
          interface_function_name: "",
          interface_response_type: "",
          interface_intro: "",
          interface_header: [{
            header_name: "",
            header_type: "",
            header_remark: "",
            header_is_need: '',
            header_default_value: ""
          }],
          interface_response_success_example: "",
          interface_response_fail_example: "",
          interface_request_type: "",
          interface_request: [{
            request_name: "",
            request_type: "",
            request_remark: "",
            request_is_need: '',
            request_default_value: ""
          }],
          interface_module_id: '',
          interface_response_error_code_ids: []
        },
        // 所有模块名
        interface_module_nameOptions: [{
          id: 0,
          modules_name: ""
        }],
        // 请求方式
        requresMethod: [{
            label: 'get',
            value: 'get'
          }
        ],
        // 返回类型
        responseType: [{
            value: '1',
            label: 'applicatoin/json1'
          }
        ],
        // 错误码
        errorCodes: [{
          id: 1,
          error_code: 200,
          error_info: "",
          http_code: 201
        }],

        // 是否必填下拉框数据
        IsRequiredData: [{
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }],
        // 类型选择下拉框
        typesOfData: [{
          value: 'string',
          label: 'string'
        }],
        projectID:'',
        interfaceID:''
      }
    },
    created() {
       this.projectID = window.sessionStorage.getItem('projectID')
      // 获取所有接口
      this.getInterfaceList()
    },
    methods: {
      // 返回上一级
      backPrevious() {
        this.$router.push('/myProject')
      },
      // 获取所有接口
       getInterfaceList() {
         this.$http.get('check/get_API_all', {
            params: {
              project_id:this.projectID,
              page: this.currentPage
            }
          })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            console.log(res);
            this.tableData = res.data.data.data
            this.currentPage = res.data.data.current_page
            this.totalNum = res.data.data.total
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 审核接口
      auditInterface(row) {
        this.isShow = true;
        this.interfaceID = row.id;
         this.$http.get('backend/interface/'+row.id)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.interFormData = res.data.data

          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 审核通过
      ReviewPass(){
         this.$http.put('check/check/'+this.interfaceID,{
           state:1
         })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            
            this.$message.success(res.data.msg)
           this.getInterfaceList()

          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
      },
       // 审核不通过
      ReviewNoPass(){
        this.$http.put('check/check/'+this.interfaceID,{
           state:0
         })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
           this.getInterfaceList()

          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: err.response.data.data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 跳页
      handleCurrentChange(page) {
        this.currentPage = page
        this.getInterfaceList()
      },
      // 标签页被点击时触发的函数
      tabClick() {
        console.log(this.activeIndex);
      },
      // 添加商品按钮
      addGoods() {

      }
    }
  }
</script>

<style lang='less' scoped>

  // 退出按钮
  .return-icon {
    margin-bottom: 10px;
    cursor: pointer;
    display: inline-block !important;
  }

  .title {
    vertical-align: top;
    margin-left: 20px;
  }

  .el-table {
    font-size: 16px;
  }

  .alertInterface {
    cursor: pointer;
  }

  // 分页
  .block {
    margin-top: 40px;
    text-align: center;
  }

  // 接口审核详情页是否显示
  .noShow {
    display: none;
  }

  .show {
    display: block;
  }

  // -------------------------------接口审核详情页样式-------------------------------
  // 退出按钮
  .previewImg {
    width: 100%;
  }

  .btnAdd {
    margin: 15px 0 0 0;
  }

  // 选项卡右边内容区域
  .tab-content {
    padding: 10px 60px;
    height: auto;
    width: 90%;

    .el-input {
      width: 350px;
    }

    // 每行的高度
    .el-row {
      margin-bottom: 20px;

      .el-form-item__label {
        width: 120px;
      }
    }

    .interfaceInfo-URL{
      width: 1000px;
    }
  }

  // 标题
  .tab-content-title {

    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 1);

    span {
      font-size: 16px;
      font-weight: 300;
    }
  }

  .el-tab-pane {
    height: 50px;

  }

  .el-form-item__label {
    width: 150px;
  }

  //提交按钮
  .submitInterfaceData {
    text-align: center;
    margin: 20px 20px;

    .el-button {
      margin: 0 100px;
    }
  }
.el-form {
    padding: 0;
    margin-left: 0;
}

</style>