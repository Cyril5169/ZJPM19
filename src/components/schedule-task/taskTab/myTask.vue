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
            @click="confirmTask(21)">开始</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask(3)">暂停</el-button>
          <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask(22)">恢复</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask()">变更申请</el-button>
          <el-button size="mini" type="danger" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask(4)">异常</el-button>
          <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask(5)">完成</el-button>

        </div>
        <div class="gridTable">
          <zj-table ref="taskTable" style="width: 100%" :height="bottomDivShow?'200px':'350px'" :data="tableData"
            tooltip-effect="dark" highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="30" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_name" label="任务名称" align="center" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_status" label="执行状态" align="center" width="90" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.t_status | transStatus}}</template>
            </el-table-column>
            <el-table-column prop="p_no" label="所属项目" align="center" width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.p_no | renderFilter(projectDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="备注" align="center" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="t_origin" label="来源" align="center" width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.t_origin | originTrans}}</template>
            </el-table-column>
            <el-table-column prop="t_period" label="工期" align="center" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" align="center" width="110" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.t_early_startdate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center" width="110" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.t_last_enddate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_progress" label="进度" align="center" width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" prop="handle" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" style="margin-left:3px;" circle
                  @click="confirmOneTask(scope.row,21)">开始</el-button>
                <el-button size="mini" type="danger" style="margin-left:3px;" circle
                  @click="confirmOneTask(scope.row,3)">暂停</el-button>
                <el-button size="mini" type="primary" style="margin-left:3px;" circle
                  @click="confirmOneTask(scope.row,22)">恢复</el-button>
                <el-button size="mini" type="danger" style="margin-left:3px;" circle @click="confirmOneTask(scope.row)">
                  变更申请</el-button>
                <el-button size="mini" type="danger" style="margin-left:3px;" circle
                  @click="confirmOneTask(scope.row,4)">异常</el-button>
                <el-button size="mini" type="primary" style="margin-left:3px;" circle
                  @click="confirmOneTask(scope.row,5)">完成</el-button>
              </template>
            </el-table-column>
          </zj-table>
        </div>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" :style="{height:bottomDivShow?'300px':'50px'}">
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
          <el-tab-pane label="输出文档" name="dataFile2">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输出表单" name="dataFile2">
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
  name: "myTask",
  components: {
    taskExecutor,
    taskMaterial,
    taskData,
    taskDataFile
  },
  data() {
    return {
      condition: "", //搜索栏关键字
      recovery: false,
      bigin: true,
      currentRow: "",
      tableData: [],
      bottomDivShow: false,
      selection: [], //选中行数据
      project_options: [],
      select_project: "", //下拉框绑定的项目号字段
      projectDataFilter: [], //项目渲染数据,
      t_status: null,
      activeName: "taskInfo"
    };
  },

  filters: {
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
    },
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
      // this.select_project = "";
      // this.t_status = "";
      this.refreshData();
    },
    //刷新 数据
    refreshData() {
      this.bottomDivShow = false;
      this.z_get("api/task", {
        condition: this.condition,
        p_no: this.select_project,
        t_status: this.t_status,
        // t_status: 1,
        emp_id: 14
      })
        // this.z_get("api/task", {
        //   condition: this.condition,
        //   p_no: this.select_project
        // })
        .then(res => {
          this.projectDataFilter = res.dict.p_no;
          // console.log(res);
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
    },
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        // this.bottomDivShow = false;
      }
      this.bottomDivShow = true;
    },
    //确认一个
    confirmOneTask(row, mark) {
      var list = [];
      list.push(row);
      this.onConfirmClick(list, mark);
    },
    //确认任务
    confirmTask(mark) {
      if (this.selection.length) {
        this.onConfirmClick(this.selection, mark);
      }
    },
    //提交确认结果
    onConfirmClick(list, mark) {
      var text = "";
      if (mark == 1) {
        text = "确认";
        for (var i = 0; i < list.length; i++) {
          list[i].t_status = 1;
        }
      } else if (mark == 0) {
        text = "拒绝";
        for (var i = 0; i < list.length; i++) {
          list[i].t_status = 0;
        }
      } else if (mark == 21) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 1) {
            text = "开始";
            list[i].t_status = 2;
          } else {
            this.$alert("所选任务包含执行中任务！请不要重复开始");
            return;
          }
        }
      } else if (mark == 22) {
        text = "恢复";
        // this.recovery = true;
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 3) {
            list[i].t_status = 2;
          } else if (list[i].t_status == 2) {//若是执行中，不可点击
            this.$alert("所选任务包含执行中任务！无需恢复");
            return;
          }  else if (list[i].t_status == 1) {//若是执行中，不可点击
            this.$alert("所选任务包含未开始任务！");
            return;
          }  else {
            this.$alert("该任务已终止！");
            return;
          }
        }
        // this.recovery = true;
      } else if (mark == 3) {
        text = "暂停";
        // this.recovery = true;
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 3) {
            this.$alert("该任务已暂停！");
            return;
          } else if (list[i].t_status == 4) {//若是执行中，不可点击
            this.$alert("该任务已终止！");
            return;
          } else if (list[i].t_status == 1) {//若是执行中，不可点击
            this.$alert("该任务未开始！");
            return;
          }
          list[i].t_status = 3;
        }
        this.recovery = true;
      } else if (mark == 4) {
        text = "异常";
        for (var i = 0; i < list.length; i++) {
          list[i].t_status = 4;
        }
      } else if (mark == 5) {
        text = "完成";
        for (var i = 0; i < list.length; i++) {
          list[i].t_status = 5;
        }
      }
      // this.$confirm("确定将任务状态修改为‘" + text + "’吗?", "提示", {
      this.$confirm("确定‘" + text + "’吗?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/task/list", list)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("修改失败", "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
              console.log(res);
            });
        })
        .catch(() => {});
      this.refreshData();
      this.bigin = true;
    }
  },

  // created() {
  //   // this.bottomDivShow = false;
  //   this.refreshData();
  // },
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
.bottomLayout {
  position: relative;
}
.gridTable {
  flex: 1;
}
</style>