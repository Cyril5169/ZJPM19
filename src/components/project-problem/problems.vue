<template>
  <div style="problem">
    <div class="containALL">
      <div class="topLayout">

        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入问题描述或者问题位置" v-model="condition"
            clearable style="width:295px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>

          <span style="font-size:13px;margin-left:10px">项目名称:</span>
         

          <el-select size="small"  v-model="select_project" @change="refreshData" ref="select_project" placeholder="请选择项目">
              <el-option v-for="item in problemProjectFilter" :key="item.value" :label="item.display"
                :value="item.value">
              </el-option>
            </el-select>

          <el-button type="primary" size="small" style="margin-left:20px;" @click="addNewproblemShow">新增问题

          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中节点({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <el-table ref="problemTable" style="width: 100%;" :data="problemData" tooltip-effect="dark"
            highlight-current-row border row-key="problem_no" default-expand-all
            @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

            <el-table-column prop="projectno" label="所属项目" align="center" sortable width="150">
              <template slot-scope="scope">{{scope.row.projectno | renderFilter(problemProjectFilter)}}</template>
            </el-table-column>

            <el-table-column prop="p_note" label="问题描述" width="300" align="center"></el-table-column>
            <el-table-column prop="p_position" label="位置" width="120" align="center"></el-table-column>

            <el-table-column prop="pt_id" label="问题类型" align="center" width="100">
              <template slot-scope="scope">{{scope.row.pt_id | renderFilter(problemTypeFilter)}}</template>
            </el-table-column>

            <el-table-column prop="p_emp" label="记录人" align="center" sortable width="100">
              <template slot-scope="scope">{{scope.row.p_emp | renderFilter(employeeFilter)}}</template>
            </el-table-column>
            <el-table-column prop="p_recorddate" label="记录时间" align="center" width="110" type='datetime'
              format="yyyy-MM-dd">
              <template slot-scope="scope">
                <span>{{ scope.row.p_recorddate|dateFormat("yyyy-MM-dd")}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="p_state" label="状态" align="center" width="80"></el-table-column> -->

            <el-table-column prop="p_state" label="状态" align="center" width="100">
              <template slot-scope="scope">{{scope.row.p_state | statusFilter}}</template>
            </el-table-column>

            <el-table-column label="操作" width="150" prop="handle" align="center">
              <template slot-scope="scope">

                <el-tooltip class="item" effect="dark" content="编辑问题信息" placement="top-start">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editProblemShow(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="问题详情" placement="top-start">
                  <el-button type="primary" icon="el-icon-s-grid" size="mini" circle @click="toDetail(scope.row)">
                  </el-button>
                </el-tooltip>

                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>

      <!-- 新增项目问题 -->
      <el-dialog v-dialogDrag width="450px" :title="addproblemText" :close-on-click-modal="false"
        :visible.sync="addproblemVisiable" top="5vh" @closed="refreshForm">
        <zj-form size="small" :newDataFlag='addproblemVisiable' :model="problemModel" label-width="100px"
          ref="problemForm" :rules="add_rules">

          <el-form-item label="所属项目" prop="projectno">
            <el-select class="formproblem" v-model="problemModel.projectno" placeholder="请选择项目">
              <el-option v-for="item in problemProjectFilter" :key="item.value" :label="item.display"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="问题描述" prop="p_note">
            <el-input class="formproblem" type="textarea" :rows="4" v-model="problemModel.p_note" placeholder="请填写问题描述">
            </el-input>
          </el-form-item>

          <el-form-item label="位置" prop="p_position">
            <el-input class="formproblem" v-model="problemModel.p_position" placeholder="请填写位置">
            </el-input>
          </el-form-item>

          <el-form-item label="问题类型" prop="pt_id">
            <el-select class="formproblem" v-model="problemModel.pt_id" placeholder="请选择问题类型">
              <el-option v-for="item in problemTypeFilter" :key="item.value" :label="item.display" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="问题记录人" prop="p_emp">
            <el-select class="formproblem" v-model="problemModel.p_emp" placeholder="请选择记录人">
              <el-option v-for="item in employeeFilter" :key="item.value" :label="item.display" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="记录时间" prop="p_recorddate">
            <el-date-picker v-model="problemModel.p_recorddate" type="date" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" placeholder="选择时间" style="width:50%"></el-date-picker>
          </el-form-item>

          <el-form-item label="状态" prop="p_state">
            <el-select style="width:50%;" v-model="problemModel.p_state" placeholder="请选择问题状态">
              <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="text-align:center;margin-right:100px;">
            <el-button size="medium" @click="addproblemVisiable = false">取&nbsp;&nbsp;消</el-button>
            <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">
              保&nbsp;&nbsp;存
            </el-button>
          </el-form-item>
        </zj-form>
      </el-dialog>
    </div>

  </div>
</template>
    

    <script>
export default {
  name: "problem",
  data() {
    return {
      
      select_project:"",
      condition: "",

      problemCondition: "",
      problemListCondition: "",
      dataCondition: "",
      problemData: [], //物料数据

      problemTypeData: [], //物料类型数据

      employeeFilter: [], //记录人员渲染
      problemTypeFilter: [],
      problemProjectFilter: [],

      problemModel: {},

      problem_typeModel: {},

      problemDataFilter: [],

      selection: [], //选中行数据

      addproblemVisiable: false,

      addOrNot: true, //是否新增

      addproblemText: "",
      addTaskproblemText: "",
      status_options: [
        {
          value: "create",
          label: "未处理"
        },
        {
          value: "execute",
          label: "正在处理"
        },
        {
          value: "pause",
          label: "暂停中"
        },
        {
          value: "finish",
          label: "完结"
        }
      ],

      add_rules: {
        p_note: [
          { required: true, message: "请填写问题描述", trigger: "blur" }
        ],
        pt_id: [
          { required: true, message: "请填写问题类型", trigger: "change" }
        ],
        p_state: [
          { required: true, message: "请填写问题状态", trigger: "blur" }
        ],
        p_emp: [{ required: true, message: "选择记录人", trigger: "change" }],
        projectno: [{ required: true, message: "选择项目", trigger: "change" }]
      }
    };
  },

  watch: {
    addproblemVisiable(val) {
      if (val) {
        this.selectproblem_type1();
        this.selectproblem_type2();
        this.selectproblem_type3();
      }
    }
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
    }
  },
  methods: {
    //刷新物料信息
    refreshData() {
      this.problemData = [];
      this.z_get("api/problem/list", {projectno:this.select_project, condition: this.condition })
        .then(res => {
          this.problemData = res.data;
          this.employeeFilter = res.dict.p_emp;
          this.problemTypeFilter = res.dict.pt_id;
          this.problemProjectFilter = res.dict.projectno;
        })
        .catch(res => {});
    },
    //重置表单
    search() {
      this.condition = "";
      this.select_project = "";
      this.refreshData();
    },

    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },

    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].st_id == val[0].st_id) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },

    //显示任务dialog
    addNewproblemShow() {
      this.addproblemText = "新增问题";
      this.problemModel = {
        p_id: 0,
        t_id: null,
        pt_id: null,
        pt_name: "",
        p_note: "",
        p_emp: null,
        p_empName: "",
        p_recorddate: new Date(),
        p_state: "",
        p_position: "",
        projectno: "",
        projectName: ""
      };
      this.addOrNot = true;
      this.addproblemVisiable = true;
    },

    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.problemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/problem", this.problemModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addproblemVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.problemModel.UpdateColumns = this.$refs.problemForm.UpdateColumns;
            if (this.problemModel.UpdateColumns) {
              this.z_put("api/problem", this.problemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addproblemVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addproblemVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editProblemShow(row) {
      this.problemModel = JSON.parse(JSON.stringify(row));
      this.problemModel.pt_name = this.renderFilter(
        this.problemModel.pt_id,
        this.problemTypeFilter
      );

      this.problemModel.p_empName = this.renderFilter(
        this.problemModel.p_emp,
        this.employeeFilter
      );

      this.problemModel.projectName = this.renderFilter(
        this.problemModel.projectno,
        this.problemProjectFilter
      );

      this.addproblemText = "编辑问题";
      this.addOrNot = false;
      this.addproblemVisiable = true;
    },

    //删除一个任务
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除任务树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除任务
    onDeleteClick(list) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/problem/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.refreshData();
    this.selectproblem_type1();
  }
};
</script>


<style scoped>
.problem {
  width: 1100px;
}

.tbar {
  margin-bottom: 10px;
  padding-left: 10px;
}
.formproblem {
  width: 300px;
}

.gridTable {
  flex: 1;
}
</style>





