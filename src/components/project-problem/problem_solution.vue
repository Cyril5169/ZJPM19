<template>
  <div class="problem-solution">
    <el-container>
      <el-aside width="500px" style="padding-right:10px;">
        <el-card style="height:100%;box-sizing:border-box;" shadow="never">
          <div slot="header">
            <span>项目问题</span>
          </div>
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshDate"></el-button>
            <el-input size="small" @keyup.enter.native="refreshProblemData" placeholder="请输入问题描述"
              v-model="ProblemCondition" clearable style="width:160px;">
              <el-button size="small" @click="refreshProblemData"> </el-button>
            </el-input>
            <!--  slot="append" icon="el-icon-search">搜索 -->

            <el-select size="small" style="width:200px; float:right;" v-model="select_project"
              @change="refreshProblemData" ref="select_project" placeholder="请选择项目">
              <el-option v-for="item in problemProjectFilter" :key="item.value" :label="item.display"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <el-table ref="problemTable" style="width: 100%;" :data="ProblemData" tooltip-effect="dark"
            highlight-current-row row-key="p_id" default-expand-all border @row-click="handleSelectproblemClick">

            <el-table-column type="index" label="序号" width="53" align="center"></el-table-column>
            <el-table-column prop="p_note" label="问题描述" show-overflow-tooltip align="center"></el-table-column>

            <el-table-column prop="p_state" label="状态" align="center" :filters="status_options1"
              :filter-method="filterproblemStata" width="100">
              <template slot-scope="scope">{{scope.row.p_state | statusFilter}}</template>
            </el-table-column>
          </el-table>

        </el-card>
      </el-aside>
      <el-main class="mainContent">
        <!-- <el-card style="height:100%;box-sizing:border-box;" shadow="never">
            <div slot="header">
            <span>解决方案</span>
          </div> -->
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProblemSolution"></el-button>
          <el-input size="small" @keyup.enter.native="refreshProblemSolutionData" placeholder="请输入方案描述"
            v-model="condition" clearable style="width:250px;">
            <el-button size="small" @click="refreshProblemSolutionData" slot="append" icon="el-icon-search">搜索
            </el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewPSShow">新增方案
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中方案({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <zj-table :autoHeight='bottomDivShow' height='100%' ref="problemSolutionTable" v-loading="loading"
            style="width:100%;" :data="problemSolutionDate" tooltip-effect="dark" highlight-current-row border
            @selection-change="handleSelectionChange" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
            <el-table-column prop="ps_note" label="方案描述" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="ps_supply_user" label="提供者" align="center" width="120">
              <template slot-scope="scope">{{scope.row.ps_supply_user | renderFilter(employeeFilter)}}</template>
            </el-table-column>
            <el-table-column prop="ps_supply_date" label="提供时间" align="center" width="150" type='datetime'
              format="yyyy-MM-dd">
              <template slot-scope="scope">
                <span>{{ scope.row.ps_supply_date|dateFilter("yyyy-MM-dd")}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ps_state" label="状态" align="center" width="120">
              <template slot-scope="scope">{{scope.row.ps_state | statusFilterPS}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" prop="handle">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑方案信息" placement="top-start">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle
                    @click="editProblemSolutionShow(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </zj-table>
        </div>

        <div class="bottomLayout">
          <el-tabs v-model="activeName" :style="{height:bottomDivShow?'350px':'50px'}">
            <el-tab-pane label="方案详情" name="first">
              <div v-if="bottomDivShow">
                <div class="tbar">
                  <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchPSD"></el-button>
                  <el-input size="small" @keyup.enter.native="refreshPSDData" placeholder="请输入方案详情描述"
                    v-model="conditionPSD" clearable style="width:250px;">
                    <el-button size="small" @click="refreshPSDData" slot="append" icon="el-icon-search">搜索
                    </el-button>
                  </el-input>
                  <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewPSDShow">新增方案详情
                  </el-button>
                  <el-button type="primary" size="small" style="margin-left:10px;" disabled="">生成计划
                  </el-button>
                  <el-button type="primary" size="small" style="margin-left:10px;" disabled="">生成任务
                  </el-button>
                  <el-button type="primary" size="small" style="margin-left:10px;" disabled="">查看计划
                  </el-button>
                  <el-button type="primary" size="small" style="margin-left:10px;" disabled="">查看任务
                  </el-button>
                  <el-button type="danger" size="small" :disabled="PSDSelection.length==0" @click="deleteListPSD">
                    删除选中方案详情({{PSDSelection.length}})
                  </el-button>
                </div>
                <div class="gridTable">
                  <el-table ref="PSDTable" v-loading="loading3" style="width:100%;" height="200" :data="PSDData"
                    tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" label="序号" width="55" align="center">
                    </el-table-column>
                    <el-table-column prop="psd_content" label="详情描述" align="center" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="psd_emp" label="负责人" align="center" width="104">
                      <template slot-scope="scope">{{scope.row.psd_emp | renderFilter(employeePSDFilter)}}</template>
                    </el-table-column>

                    <el-table-column prop="psd_dept" label="负责部门" align="center" width="104">
                      <template slot-scope="scope">{{scope.row.psd_dept | renderFilter(depetFilter)}}</template>
                    </el-table-column>

                    <el-table-column prop="psd_deadline" label="要求完成时间" align="center" show-overflow-tooltip
                      type='datetime' format="yyyy-MM-dd">
                      <template slot-scope="scope">
                        <span>{{ scope.row.psd_deadline|dateFilter("yyyy-MM-dd")}}</span>
                      </template>
                    </el-table-column>

                    <el-table-column prop="psd_releasestate" label="详情状态" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">{{scope.row.psd_releasestate | statusFilterPSD}}</template>
                    </el-table-column>

                    <el-table-column prop="psd_direction" label="发布方向" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">{{scope.row.psd_direction | statusFilterPSDDir}}</template>
                    </el-table-column>

                    <el-table-column label="操作" width="140" prop="handle">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle
                          @click="editPSDShow(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle
                          @click="deleteOnePSD(scope.row)">
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
            @click="bottomDivShow=!bottomDivShow"></i>
        </div>

        <!-- </el-card> -->
      </el-main>
    </el-container>

    <!-- 添加/编辑问题详情 -->
    <el-dialog v-if="addProblemSolutionVisible" v-dialogDrag width="450px" :title="addOrNot?'新增方案':'编辑方案'"
      :close-on-click-modal="false" :visible.sync="addProblemSolutionVisible">
      <zj-form size="small" :newDataFlag='addProblemSolutionVisible' :model="problemSolutionModel" label-width="100px"
        ref="solutionShowForm" :rules="add_rules">
        <el-form-item label="方案详情" prop="ps_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="problemSolutionModel.ps_note"
            placeholder="方案详情">
          </el-input>
        </el-form-item>
        <el-form-item label="方案提供者" prop="ps_supply_user">
          <el-select class="formItem" v-model="problemSolutionModel.ps_supply_user" placeholder="方案提供者">
            <el-option v-for="item in employeeFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提供时间" prop="ps_supply_date">
          <el-date-picker v-model="problemSolutionModel.ps_supply_date" type="date" format="yyyy-MM-dd"
             placeholder="选择时间" style="width:50%"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="ps_state">
          <el-select style="width:50%;" v-model="problemSolutionModel.ps_state" placeholder="请选择问题状态">
            <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addProblemSolutionVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSavePSClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 
        /// 详情
        public string psd_content { set; get; }
        /// 详情状态
        public string psd_releasestate { set; get; }

        /// 负责人
        public int? psd_emp { set; get; }

        /// 负责部门
        public int? psd_dept { set; get; }

        /// 发布方向
        public string psd_direction { set; get; }

        /// 要求完成时间
        public DateTime? psd_deadline { set; get; } -->
    <!-- 新增/编辑方案详情 -->
    <el-dialog v-if="addPSDVisible" v-dialogDrag width="450px" :title="addOrNot?'新增方案详情':'编辑方案详情'"
      :close-on-click-modal="false" :visible.sync="addPSDVisible">
      <zj-form size="small" :newDataFlag='addPSDVisible' :model="PSDModel" label-width="100px" ref="PSDShowForm"
        :rules="add_PSDrules">
        <el-form-item label="详情描述" prop="psd_content">
          <el-input class="formItem" type="textarea" :rows="2" v-model="PSDModel.psd_content" placeholder="请填写详情描述">
          </el-input>
        </el-form-item>

        <el-form-item label="负责部门" prop="psd_dept">
          <el-select class="formItem" v-model="PSDModel.psd_dept" ref="select_dept" placeholder="请选择部门">
            <el-option :label="PSDModel.dept_name" :value="PSDModel.psd_dept" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="psd_dept" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="PSDModel.psd_dept">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="负责人" prop="psd_emp">
          <el-select class="formItem" v-model="PSDModel.psd_emp" placeholder="方案提供者">
            <el-option v-for="item in employeePSDFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="负责人" prop="psd_emp">
          <el-select v-model="PSDModel.psd_emp" ref="p_psd_emp" placeholder="请选择人员" :disabled="!PSDModel.psd_dept">
            <el-option v-for="item in emp_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="完成时间" prop="psd_deadline">
          <el-date-picker v-model="PSDModel.psd_deadline" type="date" format="yyyy-MM-dd" 
            placeholder="选择时间" style="width:50%"></el-date-picker>
        </el-form-item>

        <el-form-item label="详情状态" prop="psd_releasestate">
          <el-select style="width:50%;" v-model="PSDModel.psd_releasestate" placeholder="请选择详情状态">
            <el-option v-for="item in psd_releasestate_options" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布方向" prop="psd_direction">
          <el-select style="width:50%;" v-model="PSDModel.psd_direction" placeholder="请选择详情状态">
            <el-option v-for="item in psd_direction_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addPSDVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSavePSDClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

  </div>
</template>


<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      select_project: "",
      problemProjectFilter: [],
      deptData: [],
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      conditionPSD: "",
      itemListCondition: "",
      ProblemCondition: "",
      ProblemData: [],
      problemSolutionDate: [],
      PSDData: [],
      itemListData: [],
      classFilter: [],
      selectProblem: {},
      currentRow: {},
      currentPSRow: {},

      emp_options: [],

      selection: [],
      PSDSelection: [],
      loading: false,
      loading2: false,
      loading3: false,
      addProblemSolutionVisible: false,
      addPSDVisible: false,
      selectItemVisible: false,
      problemSolutionModel: {},
      PSDModel: {},
      status_options1: [
        {
          value: "create",
          text: "未处理"
        },
        {
          value: "execute",
          text: "正在处理"
        },
        {
          value: "pause",
          text: "暂停中"
        },
        {
          value: "finish",
          text: "完结"
        }
      ],
      status_options: [
        //problem_solution_Options 方案详情状态选择
        {
          value: "uncompleted",
          label: "未完成"
        },
        {
          value: "completed",
          label: "已完成"
        }
      ],
      psd_releasestate_options: [
        //方案详情状态
        {
          value: "unpublished",
          label: "未发布"
        },
        {
          value: "uncompleted",
          label: "未完成"
        },
        {
          value: "completed",
          label: "已完成"
        }
      ],
      psd_direction_options: [
        //发布方向
        {
          value: "plan",
          label: "计划"
        },
        {
          value: "task",
          label: "任务"
        }
      ],
      add_rules: {
        ps_supply_user: [
          { required: true, message: "请选择方案提供者", trigger: "change" }
        ],
        ps_supply_date: [
          { required: true, message: "请选择方案提供时间", trigger: "change" }
        ],
        ps_state: [
          { required: true, message: "请选择方案状态", trigger: "change" }
        ],
        ps_note: [
          { required: true, message: "请填写解决方案", trigger: "blur" }
        ]
      },
      add_PSDrules: {
        psd_content: [
          { required: true, message: "请填写方案详情", trigger: "change" }
        ],
        psd_deadline: [
          { required: true, message: "请选择要求完成时间", trigger: "change" }
        ],
        psd_releasestate: [
          { required: true, message: "请选择详情状态", trigger: "change" }
        ],
        psd_direction: [
          { required: true, message: "请选择发布方向", trigger: "change" }
        ],
        psd_emp: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        psd_dept: [
          { required: true, message: "请选择负责部门", trigger: "change" }
        ]
      },
      addOrNot: true,
      activeName: "first",
      bottomDivShow: false,
      itemModelList: [],
      itemModel: {},
      employeeFilter: [], //记录人员渲染
      employeePSDFilter: [], //方案详情负责人渲染
      depetFilter: [] //方案详情部门渲染
    };
  },

  filters: {
    statusFilter(value) {
      switch (value) {
        case "create":
          return "未处理";
          break;
        case "execute":
          return "正在处理";
          break;
        case "pause":
          return "暂停";
          break;
        case "finish":
          return "完结";
          break;
      }
    },
    statusFilterPS(value) {
      switch (value) {
        case "uncompleted":
          return "未完成";
          break;
        case "completed":
          return "已完成";
          break;
      }
    },
    statusFilterPSD(value) {
      //方案详情状态
      switch (value) {
        case "unpublished":
          return "未发布";
          break;
        case "uncompleted":
          return "未完成";
          break;
        case "completed":
          return "已完成";
          break;
      }
    },
    statusFilterPSDDir(value) {
      //方案发布方向
      switch (value) {
        case "plan":
          return "计划";
          break;
        case "task":
          return "任务";
          break;
      }
    }
  },

  watch: {
    addNewPSDShow(val) {
      if (val) {
        this.searchDept();
      }
    }
  },
  methods: {
    ...mapMutations("navTabs", ["addBreadCrumb"]),
    filterproblemStata(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //刷新部门数据
    searchDept() {
      this.z_get("api/dept/tree", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.deptData) != JSON.stringify(res.data)) {
            this.deptData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择部门
    handleSelectTreeClick(data) {
      this.PSDModel.psd_dept = data.dept_id;
      this.PSDModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
      this.selectEmployee(data.dept_id);
      this.PSDModel.psd_emp = "";
    },

    //查找部门人员数据
    selectEmployee(deptId) {
      this.emp_options = [];
      this.z_get(
        "api/dept/dept_emp",
        { condition: null, deptId: deptId },
        { loading: false }
      )
        .then(res => {
          if (
            res.code == 0 &&
            JSON.stringify(this.emp_options) != JSON.stringify(res.data)
          ) {
            this.emp_options = res.data.dic;
            for (var i = 0; i < this.emp_options.length; i++) {
              this.emp_options[i].label = this.emp_options[i].emp_name;
              this.emp_options[i].value = this.emp_options[i].emp_id;
            }
          }
        })
        .catch(res => {});
    },

    refreshProblemSolutionData() {
      this.loading = true;

      this.problemSolutionDate = [];
      this.z_get(
        "api/problem_solution/list",
        {
          p_id: this.currentRow.p_id,
          condition: this.condition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          //   this.classFilter = res.dict.pc_no;
          this.problemSolutionDate = res.data;
          this.employeeFilter = res.dict.ps_supply_user;
        })
        .catch(res => {});
    },

    refreshDate() {
      this.currentRow = {};
      this.currentPSRow = {};
      this.select_project = "";
      this.refreshProblemData();
      this.refreshBottom();
    },

    refreshProblemData() {
      this.ProblemData = [];
      this.refreshProblemSolutionData();
      this.z_get("api/problem/list", {
        projectno: this.select_project,
        condition: this.ProblemCondition
      })
        .then(res => {
          this.ProblemData = res.data;
          this.problemProjectFilter = res.dict.projectno;
        })
        .catch(res => {});
    },
    refreshBottom() {
      this.conditionPSD = "";
      this.PSDData = [];
      this.bottomDivShow = false;
    },
    refreshPSDData() {
      this.loading3 = true;
      this.PSDData = [];
      this.z_get(
        "api/problem_solution_detail/list",
        {
          ps_id: this.currentPSRow.ps_id,
          condition: this.conditionPSD
        },
        { loading: false }
      )
        .then(res => {
          this.loading3 = false;
          this.PSDData = res.data;
          this.employeePSDFilter = res.dict.psd_emp;
          this.depetFilter = res.dict.psd_dept;
        })
        .catch(res => {});
    },
    searchProblemSolution() {
      this.condition = "";
      this.refreshProblemSolutionData();
      this.refreshBottom();
    },
    searchPSD() {
      this.conditionPSD = "";
      this.refreshPSDData();
    },

    //点击问题显示方案
    handleSelectproblemClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载问题解决方案
        this.refreshProblemSolutionData();
      }
      this.rightDataShow = true;

      this.currentPSRow = {};
      this.refreshPSDData();
    },

    handleSelectionChange(val) {
      this.selection = val;
    },
    handleSelectionChange2(val) {
      this.PSDSelection = val;
    },
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentPSRow) != JSON.stringify(row)) {
        this.currentPSRow = row;
        //点击加载tab数据
        this.refreshBottom();
        this.refreshPSDData();
      }
      this.bottomDivShow = true;
    },
    addNewPSShow() {
      this.problemSolutionModel = {
        p_id: this.currentRow.p_id ? this.currentRow.p_id : "",
        ps_note: "",
        ps_supply_user: "",
        ps_supply_user_name: "",
        ps_supply_date: "",
        ps_state: ""
      };
      this.addOrNot = true;
      this.addProblemSolutionVisible = true;
    },
    editProblemSolutionShow(row) {
      this.problemSolutionModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addProblemSolutionVisible = true;
    },
    onSavePSClick() {
      this.$refs.solutionShowForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/problem_solution", this.problemSolutionModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshProblemSolutionData();
                this.addProblemSolutionVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.problemSolutionModel.UpdateColumns = this.$refs.solutionShowForm.UpdateColumns;
            if (this.problemSolutionModel.UpdateColumns) {
              this.z_put("api/problem_solution", this.problemSolutionModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshProblemSolutionData();
                  this.addProblemSolutionVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addProblemSolutionVisible = false;
            }
          }
        }
      });
    },
    onSavePSDClick() {
      this.$refs.PSDShowForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/problem_solution_detail", this.PSDModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshPSDData();
                this.addPSDVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.PSDModel.UpdateColumns = this.$refs.PSDShowForm.UpdateColumns;
            if (this.PSDModel.UpdateColumns) {
              this.z_put("api/problem_solution_detail", this.PSDModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshPSDData();
                  this.addPSDVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addPSDVisible = false;
            }
          }
        }
      });
    },
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？删除模板将同时删除方案详情与详情！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/problem_solution/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshProblemSolutionData();
            })
            .catch(res => {
              var msg = res.msg;
              if (msg.indexOf("FK") > -1) msg = "该数据已被使用，无法删除";
              this.$alert("删除失败:" + msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    addNewPSDShow() {
      this.PSDModel = {
        ps_id: this.currentPSRow.ps_id ? this.currentPSRow.ps_id : "",
        psd_content: "",
        psd_releasestate: "",
        psd_emp: null,
        psd_dept: null,
        dept_name: "",
        psd_direction: "",
        psd_deadline: ""
      };
      this.addOrNot = true;
      this.addPSDVisible = true;
    },
    editPSDShow(row) {
      this.PSDModel = JSON.parse(JSON.stringify(row));
      this.PSDModel.dept_name = this.renderFilter(
        this.PSDModel.psd_dept,
        this.depetFilter
      );
      this.addOrNot = false;
      this.addPSDVisible = true;
      this.selectEmployee(this.PSDModel.psd_dept);
    },

    deleteOnePSD(row) {
      var list = [];
      list.push(row);
      this.onDeletePSDClick(list);
    },
    deleteListPSD() {
      if (this.PSDSelection.length) {
        this.onDeletePSDClick(this.PSDSelection);
      }
    },
    onDeletePSDClick(list) {
      this.$confirm("是否删除产品？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/problem_solution_detail/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshPSDData();
            })
            .catch(res => {
              this.$alert("删除失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.refreshProblemData();
    this.refreshProblemSolutionData();
    this.refreshPSDData();
    this.searchDept();
  }
};
</script>





<style scoped>
.problem-solution {
  width: 1600px;
}

.Problem-tbar {
  margin-bottom: 10px;
  padding-left: 10px;
}

.mainContent {
  border-left: 5px solid #eee;
  padding: 0 0 0 10px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.gridTable {
  flex: 1;
}
.bottomLayout {
  position: relative;
}
.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
</style>
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
</style>
