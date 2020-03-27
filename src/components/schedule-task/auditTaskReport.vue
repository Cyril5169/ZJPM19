<template>
  <div class="taskManage">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="mini" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
            style="width:190px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <span style="font-size:15px;margin-left:10px">项目号:</span>
          <el-select size="mini" v-model="select_project" @change="refreshData" ref="select_project" placeholder="请选择项目"
            style="width:180px;">
            <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span style="font-size:15px;margin-left:10px">任务状态:</span>
          <el-select size="mini" v-model="select_status" @change="refreshData" ref="select_status" placeholder="请选择任务状态"
            style="width:150px;">
            <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span style="font-size:15px;margin-left:10px">员工姓名:</span>
          <el-select size="mini" v-model="select_emp" @change="refreshData" ref="select_emp" placeholder="请选择员工"
            style="width:150px;">
            <el-option v-for="item in emp_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" style="margin-left:10px;">审核通过
          </el-button>
          <el-button type="danger" size="mini" style="margin-left:10px;">审核不通过
          </el-button>
        </div>
        <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%;" :height="bottomDivShow?'300px':'450px'" :data="taskData"
            tooltip-effect="dark" highlight-current-row row-key="t_id" default-expand-all
            @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_id" label="作业编号" align="left" width="180"></el-table-column>
            <el-table-column prop="t_name" label="任务名称" align="left" width="180"></el-table-column>
            <el-table-column prop="p_no" label="项目号" align="left" width="180">
              <!-- <template slot-scope="scope">{{scope.row.p_no | renderFilter(projectDataFilter)}}</template> -->
            </el-table-column>
            <!-- <el-table-column prop="t_note" label="班次" align="left"></el-table-column> -->
            <el-table-column prop="t_status" label="状态" align="left" width="120">
              <template slot-scope="scope">{{scope.row.t_status |transStatus }}</template>
            </el-table-column>
            <el-table-column prop="emp_id" label="作业人员" align="left" width="180">
              <template slot-scope="scope">{{scope.row.emp_id | renderFilter(empDataFilter)}}</template>
            </el-table-column>
            <el-table-column label="操作" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editTaskShow(scope.row)">通过
                </el-button>
                <el-button type="danger" size="mini" @click="deleteOne(scope.row)">不通过
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" :style="{height:bottomDivShow?'200px':'50px'}">
          <el-tab-pane label="任务信息" name="taskInfo">
            <keep-alive>
              <taskExecutor v-if="bottomDivShow" :currentRow='currentRow'>
              </taskExecutor>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="班次安排" name="material">
            <keep-alive>
              <taskMaterial v-if="bottomDivShow" :currentRow='currentRow' source='task'></taskMaterial>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="资料需求" name="data">
            <keep-alive>
              <taskData v-if="bottomDivShow" :currentRow='currentRow' source='task'></taskData>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="部件需求" name="dataFile3">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入物料" name="dataFile1">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入文档" name="dataFile">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入表单" name="dataFile2">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
          @click="bottomDivShow=!bottomDivShow"></i>
      </div>
    </div>
  </div>
</template>


<script>
import taskExecutor from "@/components/schedule-task/taskTab/taskExecutor";
import taskMaterial from "@/components/schedule-task/taskTab/taskMaterial";
import taskData from "@/components/schedule-task/taskTab/taskData";
import taskDataFile from "@/components/schedule-task/taskTab/taskDataFile";
export default {
  name: "taskManage",
  components: {
    taskExecutor,
    taskMaterial,
    taskData,
    taskDataFile
  },
  data() {
    return {
      select_project: "", //下拉框绑定的项目号字段
      select_status: "",
      select_emp: "",
      condition: "", //搜索框绑定的任务名称字段
      taskData: [], //表格数据
      deptDataFilter: [], //部门渲染数据
      empDataFilter: [], //人员渲染数据
      projectDataFilter: [], //项目渲染数据
      selection: [],
      currentRow: {},
      project_options: [],
      emp_options: [],
      activeName: "taskInfo",
      bottomDivShow: false
    };
  },
  filters: {
    datetrans(value) {
      if (!value || value == "9999-12-31") return "";
      //时间戳转化大法
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
    transStatus(value) {
      switch (value) {
        case 0:
          return "待确认";
          break;
        case 1:
          return "未开始";
          break;
        case 2:
          return "执行中";
          break;
        case 3:
          return "暂停";
          break;
        case 4:
          return "终止";
          break;
        case 5:
          return "完工";
          break;
      }
    }
  },
  methods: {
    //查找项目数据
    selectProject() {
      this.project_options = [];
      this.z_get("api/project", {}, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.project_options = res.data;
            for (var i = 0; i < this.project_options.length; i++) {
              this.project_options[i].label = this.project_options[i].p_name;
              this.project_options[i].value = this.project_options[i].p_no;
            }
          }
        })
        .catch(res => {});
    },

    //查找人员数据
    selectEmployee() {
      this.emp_options = [];
      this.z_get("api/employee", { condition: null }, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.emp_options = res.data;
            for (var i = 0; i < this.emp_options.length; i++) {
              this.emp_options[i].label = this.emp_options[i].emp_name;
              this.emp_options[i].value = this.emp_options[i].emp_id;
            }
          }
        })
        .catch(res => {});
    },

    //刷新任务树
    refreshData() {
      this.taskData = [];
      this.currentRow = {};
      this.bottomDivShow = false;
      this.z_get("api/task/treeList", {
        condition: this.condition,
        p_no: this.select_project,
        t_status: 5
      })
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.empDataFilter = res.dict.emp_id;
          this.projectDataFilter = res.dict.p_no;
          this.taskData = res.data;
        })
        .catch(res => {});
    },

    //刷新
    search() {
      this.condition = "";
      this.select_project = "";
      this.select_emp = "";
      this.select_status="";
      this.refreshData();
    },
    //表格树选中改变
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
    },

    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        this.bottomDivShow = false;
      }
      this.bottomDivShow = true;
    }
  },
  mounted() {
    this.selectProject();
    this.selectEmployee();
    this.refreshData();
  }
};
</script>

<style scoped>
.taskManage {
  width: 100%;
}

.bottomLayout {
  position: relative;
}
.gridTable {
  flex: 1;
}
</style>