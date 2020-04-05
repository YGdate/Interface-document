<template>
  <div>
    <div :class="isShow ?'noShow':'show'">
      <img @click="backPrevious" class="return-icon" src="../../../assets/img/returnUp.png" alt="">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的项目</el-breadcrumb-item>
        <el-breadcrumb-item>接口管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片试图区域 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-input @keyup.enter.native="searchContent" placeholder="请输入内容" v-model="inputSearch"
            class="input-with-select">
            <el-button slot="append" @click="searchContent" icon="el-icon-search"></el-button>
          </el-input>
          <el-button style="float:right;margin-top:8px !important" type="warning" @click="allSelect"
            v-if="permission2 == 1" icon="el-icon-delete" size="small">批量删除
          </el-button>
          <el-button style="margin:8px 0 0 40px!important;" type="primary" @click="addInterface" v-if="permission2 == 1"
            icon="el-icon-circle-plus-outline" size="small">添加接口
          </el-button>
        </div>
        <div>
          <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" size="small"
            @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="45" v-if="permission2 == 1">
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <div class="interfaceName" @click="checkInterface(scope.row)">{{scope.row.interface_name}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="interfaec_method" label="Method">
            </el-table-column>
            <el-table-column prop="interface_url" label="URL">
            </el-table-column>
            <el-table-column label="是否交互">
              <template slot-scope="scope">
                <el-switch @change="changeInterfaceState(scope.row)" v-model="scope.row.interface_is_interactive"
                  :active-value="scope.row.interface_is_interactive == null ? '1' : scope.row.interface_is_interactive"
                  :inactive-value="scope.row.interface_is_interactive" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="interface_belong_to" label="所属项目">
            </el-table-column>
            <el-table-column label="操作" v-if="permission2 == 1">
              <template slot-scope="scope">
                <span @click="alertInterface(scope.row)" class="operationButton"><i class="el-icon-edit"></i></span>
                <span @click="deleteInterface(scope.row)" class="operationButton"><i class="el-icon-delete"></i></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 分页 -->
      <div class="Pagination">
        <el-pagination center :hide-on-single-page="true" background @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalNum">
        </el-pagination>
      </div>
    </div>

    <!-- 接口审核详情页 -->
    <div :class="isShow ?'show':'noShow'">
      <img class="return-icon" @click="isShow = false" src="../../../assets/img/returnUp.png" alt="">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right" class="title">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的项目</el-breadcrumb-item>
        <el-breadcrumb-item>接口管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片试图区域 -->
      <el-card>
        <!-- form表单 -->
        <el-form ref="interFormData" :rules="interFormDataRules" label-position="left" :inline="true"
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
                      <el-input :readonly="isReadOnly" v-model="interFormData.interface_name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="模块名" prop="interface_module_id">
                      <el-select :disabled="isReadOnly" style="width:350px;" v-model="interFormData.interface_module_id"
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
                      <el-input :readonly="isReadOnly" v-model="interFormData.interface_url"
                        placeholder="示例：http://apimanager.cn/find/{id}">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="接口方法名" prop="interface_function_name">
                      <el-input :readonly="isReadOnly" v-model="interFormData.interface_function_name"></el-input>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="请求数据类型" prop="interface_request_type">
                      <el-input :readonly="isReadOnly" v-model="interFormData.interface_request_type"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="请求方式" prop="interfaec_method">
                      <el-select :disabled="isReadOnly" style="width:350px;" v-model="interFormData.interfaec_method"
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
                      <el-select :disabled="isReadOnly" style="width:350px;"
                        v-model="interFormData.interface_response_type" placeholder="请选择返回类型">
                        <el-option v-for="item in responseType" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="错误码" prop="interface_response_error_code_ids">
                      <el-select :disabled="isReadOnly" style="width:350px;"
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
                      <el-input style="width:1000px;" :readonly="isReadOnly" rows="10" class="interface-textarea"
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
                <el-button @click="addRequire" v-show="!isReadOnly" style="float:right" size="small" type="primary">添加一行
                </el-button>
                <el-divider></el-divider>
                <el-table :data="interFormData.interface_header" stripe style="width: 100%" fit>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.header_name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">
                      <el-select :disabled="isReadOnly" v-model="scope.row.header_is_need" placeholder="请选择">
                        <el-option v-for="item in IsRequiredData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select :disabled="isReadOnly" v-model="scope.row.header_type" placeholder="请选择">
                        <el-option v-for="item in typesOfData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="默认值">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.header_default_value">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.header_remark"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" v-if="!isReadOnly">
                    <template slot-scope="scope">
                      <span style="cursor:pointer;font-size:22px;">
                        <i class="el-icon-delete" @click="deleteRequire(scope.$index,scope.row)"></i>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            <!-- 请求参数 -->
            <el-tab-pane label="请求参数" name="2">
              <div class="tab-content">
                <div style="display:inline-block" class="tab-content-title">请求参数</div>
                <el-button @click="addRequest" v-show="!isReadOnly" style="float:right" size="small" type="primary">添加一行
                </el-button>
                <el-divider></el-divider>
                <el-table :data="interFormData.interface_request" stripe style="width: 100%" fit>
                  <el-table-column label="名称">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.request_name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="必填">
                    <template slot-scope="scope">
                      <el-select :disabled="isReadOnly" v-model="scope.row.request_is_need" placeholder="请选择">
                        <el-option v-for="item in IsRequiredData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型">
                    <template slot-scope="scope">
                      <el-select :disabled="isReadOnly" v-model="scope.row.request_type" placeholder="请选择">
                        <el-option v-for="item in typesOfData" :key="item.value" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="默认值">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.request_default_value">
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input class="infoWidth" :readonly="isReadOnly" v-model="scope.row.request_remark"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" v-if="!isReadOnly">
                    <template slot-scope="scope">
                      <span style="cursor:pointer;font-size:22px;">
                        <i class="el-icon-delete" @click="deleteRequest(scope.$index)"></i>
                      </span>
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
                  <el-input style="width:1000px;" rows="10" :readonly="isReadOnly" class="interface-textarea"
                    type="textarea" v-model="interFormData.interface_response_success_example">
                  </el-input>
                </el-form-item>
                <el-form-item label="错误返回事例" prop="interface_response_fail_example">
                  <el-input style="width:1000px;" :readonly="isReadOnly" rows="10" class="interface-textarea"
                    type="textarea" v-model="interFormData.interface_response_fail_example">
                  </el-input>
                </el-form-item>
                <el-form-item v-show="false">
                  <el-button @click="resetForm">重置</el-button>
                </el-form-item>
                <div v-if="!isReadOnly || permission2 == 0" class="submitInterfaceData">
                  <el-button type="primary" @click="Feedback">{{FeedbackSave}}</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
    </div>

    <!-- 反馈弹框 -->
    <el-dialog title="反馈" :visible.sync="dialogFormVisible">
      <el-form :model="feedbackFormData" :rules="feedbackRules" ref="feedbackFormDataRef">
        <el-form-item class="problemDescriptionTitle" label="[反馈标题]:" label-width="100px" prop="title" >
          <el-input placeholder="请输入标题" v-model="feedbackFormData.title">
          </el-input>
        </el-form-item>
        <el-form-item class="problemDescription" label="[问题描述]:" label-width="100px" prop="body">
          <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="feedbackFormData.body">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="submitFeedback">提交反馈</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 第二权限
        permission2: '',
        // 项目id
        projectID: '',
        // 是否只读
        isReadOnly: '',
        // 输入框内容
        inputSearch: '',
        // 接口列表tableData数据
        tableData: [{
          interface_id: 0,
          interface_name: "",
          interface_url: "",
          interfaec_method: "",
          interface_is_interactive: null,
          interface_belong_to: ""
        }],
        // 总共条数
        totalNum: 1,
        // 当前页码
        currentPage: 1,
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
        // form表单验证规则
        interFormDataRules: {
          interface_name: [{required: true,message: '请输入接口名',trigger: 'blur'}],
          interfaec_method: [{required: true,message: '请选择请求方式',trigger: 'change'}],
          interface_url: [{required: true,message: '请输入URL',trigger: 'blur'}],
          interface_function_name: [{required: true,message: '请输入方法名',trigger: 'blur'}],
          interface_response_type: [{required: true,message: '请选择返回类型',trigger: 'change'}],
          interface_intro: [{required: true,message: '请输入接口说明',trigger: 'blur'}],
          interface_response_success_example: [{required: true,message: '请输入正确返回事例',trigger: 'blur'}],
          interface_response_fail_example: [{required: true,message: '请输入失败返回事例',trigger: 'blur'}],
          interface_request_type: [{required: true,message: '请输入请求数据类型',trigger: 'blur'}],
          interface_module_id: [{required: true,message: '请选模块名',trigger: 'change'}],
          interface_response_error_code_ids: [{required: true,message: '请选择错误码',trigger: 'change'}],
        },
        // 所有模块名
        interface_module_nameOptions: [{
          id: '',
          modules_name: ""
        }],
        // 请求方式
        requresMethod: [{
            label: 'get',
            value: 'get'
          }, {
            label: 'post',
            value: 'post'
          },
          {
            label: 'delete',
            value: 'int'
          }
        ],
        // 返回类型
        responseType: [{
            value: '1',
            label: 'applicatoin/json1'
          }, {
            value: '2',
            label: 'applicatoin/json2'
          },
          {
            value: '3',
            label: 'applicatoin/json3'
          },
          {
            value: '4',
            label: 'applicatoin/json4'
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
        }, {
          value: 'array',
          label: 'array'
        }, {
          value: 'function',
          label: 'function'
        }],
        // 当前接口id
        interfaceID: '',
        // 提交反馈按钮->"我要反馈"/“保存”
        FeedbackSave: '',
        // 反馈弹框的显示
        dialogFormVisible: false,
        // 反馈结果数据
        feedbackFormData: {
          title: '',
          body:''
        },
        // 存放多选框选中的值
        multipleSelection: [],
        // dialog数据验证
        feedbackRules:{
           title: [{required: true,message: '请输反馈title',trigger: 'blur'}],
          body: [{required: true,message: '请输入反馈内容',trigger: 'blur'}],
        }
      }
    },
    created() {
      this.permission2 = window.sessionStorage.getItem('permission2')
      this.projectID = window.sessionStorage.getItem('projectID')
      this.isReadOnly = (this.permission2 == 1) ? true : false
      // 获取接口列表
      this.getInterfaceList()
      this.showError_codes()
      this.showModules()
    },
    methods: {
      // 获取接口列表
      getInterfaceList() {
        this.$http.get('frontend/interface/' + this.projectID, {
            params: {
              page: this.currentPage
            }
          })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
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
      // 返回上一级
      backPrevious() {
        this.$router.push('/myProject')
      },
      // 搜索接口方法
      searchContent() {
        this.$http.get('frontend/interface/search', {
            params: {
              search_content: this.inputSearch,
              project_id: this.projectID
            }
          })
          .then(res => {
            console.log(res)
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
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
      //修改接口是否交互状态
      changeInterfaceState(row) {
        this.$http.put('frontend/interface/' + row.interface_id)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
            this.getInterfaceList()

          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 重置表单
      resetForm() {
        this.$refs.interFormData.resetFields()
      },
      // 选择删除全部接口
      allSelect() {
        const selectInterface = [];
        this.multipleSelection.forEach((item) => {
          selectInterface.push(item.interface_id)
        })
        this.$http({
            method: 'delete',
            url: 'backend/interfaces',
            data: selectInterface
          })
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)

          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 页码改动函数
      handleCurrentChange(page) {
        this.currentPage = page
        this.getInterfaceList()
      },
      // 后端显示模块名
      showModules() {
        this.$http.get('backend/module_names/' + this.projectID)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.interface_module_nameOptions = res.data.data
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 后端查看错误码
      showError_codes() {
        this.$http.get('backend/error_code/' + this.projectID)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.errorCodes = res.data.data
            console.log(res);
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 添加接口
      addInterface() {
        this.activeIndex = '0'
        this.isShow = !this.isShow
        this.FeedbackSave = '添加接口'
        this.isShow = true
        this.isReadOnly = false
        this.resetForm()
        this.interFormData.interface_header = []
        this.interFormData.interface_request = []

      },
      // 查看接口
      checkInterface(row) {
        this.resetForm()
        this.activeIndex = '0'
        this.FeedbackSave = '保存'
        this.interfaceID = row.interface_id;
        this.$http.get('backend/interface/' + row.interface_id)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.interFormData = res.data.data
            this.isShow = true
            this.isReadOnly = true
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 修改接口
      alertInterface(row) {
        this.activeIndex = '0'
        this.FeedbackSave = '保存'
        this.resetForm()
        this.interfaceID = row.interface_id;
        this.$http.get('backend/interface/' + row.interface_id)
          .then(res => {
            if (res.data.code !== 200) return this.$message.error(res.data.msg)
            this.interFormData = res.data.data
            this.isShow = true;
            this.isReadOnly = false
          })
          .catch(err => {
            this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: eval('(' + err.response.data + ')').data.join('<br><br>'),
              type: 'error'
            });
          })
      },
      // 删除接口
      deleteInterface(row) {
        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('backend/interface/' + row.interface_id)
            .then(res => {
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              this.getInterfaceList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
            .catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: err.response.data.data.join('<br><br>'),
                type: 'error'
              });
            })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加一行请求头
      addRequire() {
        let newValue = {
          header_name: "",
          header_type: "",
          header_remark: "",
          header_is_need: true,
          header_default_value: ""
        }
        this.interFormData.interface_header.push(newValue)
      },
      // 删除指定行的请求头
      deleteRequire(index) {
        this.interFormData.interface_header.splice(index, 1)
      },
      // 添加一行请求参数
      addRequest() {
        let newValue = {
          request_name: "",
          request_type: "",
          request_remark: "",
          request_is_need: true,
          request_default_value: ""
        }
        this.interFormData.interface_request.push(newValue)
      },
      // 删除指定行请求参数
      deleteRequest(index) {
        this.interFormData.interface_request.splice(index, 1)
      },
      // 我要反馈 / 提交修改
      Feedback() {
        // 反馈
        if (this.FeedbackSave == '我要反馈') this.dialogFormVisible = true
        else if (this.FeedbackSave == '保存') {
          this.$refs.interFormData.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return this.$message.error('请将数据填写完整！');

          this.$http.put('backend/interface/' + this.interfaceID, this.interFormData)
            .then(res => {
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              this.getInterfaceList()
              this.$message.success(res.data.msg)
            })
            .catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: eval('(' + err.response.data + ')').data.join('<br><br>'),
                type: 'error'
              });
            })
          })
        } else if (this.FeedbackSave == '添加接口') {
          this.$refs.interFormData.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return this.$message.error('请将数据填写完整！');

          console.log(111);
          this.$http.post('backend/interface', this.interFormData)
            .then(res => {
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              this.getInterfaceList()
              this.$message.success(res.data.msg)
            })
            .catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: eval('(' + err.response.data + ')').data.join('<br><br>'),
                type: 'error'
              });
            })
          })
        }
      },
      // 提交反馈
      submitFeedback(){
         this.$refs.feedbackFormDataRef.validate(async valid => {
          // 判断验证是否通过
          if (!valid) return

          this.$http.post('Message/FrontEndInterfaceController',{
            interface_id:this.interfaceID,
            project_id:this.projectID,
            title:this.feedbackFormData.title,
            body:this.feedbackFormData.body,
            type:'接口反馈'
          })
            .then(res => {
              if (res.data.code !== 200) return this.$message.error(res.data.msg)
              console.log(res);
              this.$message.success(res.data.msg)
            })
            .catch(err => {
              this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: eval('(' + err.response.data + ')').data.join('<br><br>'),
                type: 'error'
              });
            })
          })
      },
      // 多选框选中触发
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      
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
    display: inline-block;
    vertical-align: top;
    margin: 5px 0 0 20px;
  }

  // 卡片试图
  .box-card {
    margin: 0 186px;
    padding: 0 50px 20px 50px;
  }

  // 输入框大小
  .input-with-select {
    width: 400px;
  }

  // 接口名诚样式
  .interfaceName {
    cursor: pointer;
  }

  .interfaceName:hover {
    color: #409EFF;
  }

  // 分页
  .Pagination {
    text-align: center;
    margin-top: 50px;
  }

  // 接口审核详情页是否显示
  .noShow {
    display: none;
  }

  .show {
    display: block;
  }

  // 操作按钮的样式
  .operationButton {
    font-size: 20px;
    cursor: pointer;
    margin: 0 10px;
  }

  //---------------------------------- 查看接口页面------------------------------
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

  }

  // ---------------------请求头---------------
  // 输入框的宽度
  .infoWidth {
    width: 100% !important;
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
    text-align: right;
    margin: 20px 178px;
  }

  .el-dialog {
    border-radius: 5px !important;
  }

    // 问题反馈输入框
  .problemDescription {

    padding: 0 40px 0 0;
  }

  .problemDescriptionTitle {
    margin-top: -20px;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    padding: 30px 40px 0 0;
  }

  // 提交按钮
  .dialog-footer {
    text-align: center;
  }
</style>