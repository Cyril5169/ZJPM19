<template>
  <div class="myTask">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="mini" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition"
            style="width:200px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <span style="font-size:15px;margin-left:10px">项目:</span>
          <el-select size="mini" v-model="select_project" @change="refreshData" ref="select_project"
            placeholder="请选择项目">
            <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask('confirm')">开始</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask('reject')">暂停/恢复</el-button>
          <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask('confirm')">完成</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask('reject')">变更申请</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask('confirm')">异常</el-button>

        </div>
        <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%" height="200px" :data="tableData" tooltip-effect="dark"
            highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick" @row-dblclick="handleRowDBClick">
            <el-table-column type="selection" width="30" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_name" label="任务名称" align="center" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_status" label="执行状态" align="center" width="90" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="p_no" label="所属项目" align="center" width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.p_no | renderFilter(projectDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="备注" align="center" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="t_origin" label="来源" align="center" width="80" show-overflow-tooltip>
              <!-- <template slot-scope="scope">{{scope.row.t_origin | originTypeFilter}}</template> -->
              <template slot-scope="scope">{{scope.row.t_origin | originTrans}}</template>
            </el-table-column>
            <el-table-column prop="t_period" label="工期" align="center" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" align="center" width="110" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center" width="110" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_release_state" label="进度" align="center" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" prop="handle" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" style="margin-left:10px;" circle :disabled="selection.length==0"
                  @click="confirmTask(scope.row)">开始</el-button>
                <el-button size="mini" type="danger" style="margin-left:10px;" circle :disabled="selection.length==0"
                  @click="confirmTask(scope.row)">暂停/恢复</el-button>
                <el-button size="mini" type="primary" style="margin-left:10px;" circle :disabled="selection.length==0"
                  @click="confirmTask(scope.row)">完成</el-button>
                <el-button size="mini" type="danger" style="margin-left:10px;" circle :disabled="selection.length==0"
                  @click="confirmTask(scope.row)">变更申请</el-button>
                <el-button size="mini" type="danger" style="margin-left:10px;" circle :disabled="selection.length==0"
                  @click="confirmTask(scope.row)">异常</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" :style="{height:bottomDivShow?'300px':'50px'}">
          <el-tab-pane label="任务信息" name="executor">
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
          <el-tab-pane label="部件需求" name="dataFile">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入物料" name="dataFile">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入文档" name="dataFile">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入表单" name="dataFile">
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
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "myTask",
  props: ["currentRow"],
  data() {
    return {
      condition: "", //搜索栏关键字
      tableData: [],
      bottomDivShow: false,
      executorModel: {}, //执行者表单对象
      emp_options: [], //存储部门员工数据
      dept_options: [], //存储部门数据
      addOrNot: false,
      selection: [], //选中行数据
      project_options: [],
      select_project: "", //下拉框绑定的项目号字段
      projectDataFilter: [], //项目渲染数据,
      tr_mainOptions: [
        //是否为主要执行
        {
          value: true,
          label: "是"
        },
        {
          value: false,
          label: "否"
        }
      ],
      executor_rules: {
        dept_id: [
          { required: true, message: "请选择执行部门", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    currentRow: {
      deep: true,
      immediate: true,
      handler() {
        this.search();
      }
    }
  },
  filters: {
    // originTypeFilter(value) {
    //   switch (value) {
    //     case "temp":
    //       return "临时";
    //       break;
    //     case "plan":
    //       return "计划";
    //       break;
    //   }
    // },
    originTrans(value) {
      switch (value) {
        case "temp":
          return "临时";
          break;
        case "plan":
          return "计划";
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
    //搜索
    search() {
      this.condition = "";
      this.select_project = "";
      this.refreshData();
    },
    //刷新任务执行者数据
    refreshData() {
      this.bottomDivShow = false;
      this.z_get("api/task/treeList", {
        condition: this.condition,
        p_no: this.select_project
      })
        .then(res => {
          this.projectDataFilter = res.dict.p_no;
          console.log(res);
          this.tableData = res.data;
        })
        .catch(res => {});
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false; //全选还是反选
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
    },

    //展开所有节点
    expandAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") == -1) {
            icon[i].click();
          }
        }
      }
    },
    //折叠所有节点
    collapseAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") > -1) {
            icon[i].click();
          }
        }
      }
    },

    //确认
    async confirmTask(type) {}
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
    transMainExecute: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    }
  },
  created() {},
  mounted() {
    this.selectProject();
    this.refreshData();
  }
};
</script>

<style scoped>
.myTask {
  width: 100%;
}
.formItem {
  width: 200px;
}
.bottomLayout {
  position: relative;
}
</style>