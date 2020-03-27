<template>
  <div class="finishedTask">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="mini" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition"
            style="width:200px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
          </el-input>

        </div>
        <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%" :height="bottomDivShow?'200px':'350px'" :data="tableData"
            tooltip-effect="dark" highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_name" label="任务名称" width="120" align="center"></el-table-column>
            <el-table-column prop="p_no" label="项目号" width="120" align="center"></el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" width="200" show-overflow-tooltip align="center">
              <template slot-scope="scope">{{scope.row.t_early_startdate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" width="200" show-overflow-tooltip align="center">
              <template slot-scope="scope">{{scope.row.t_last_enddate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="任务备注" align="center"></el-table-column>
            <el-table-column prop="t_status" label="任务状态" width="120" align="center">
              <template slot-scope="scope">{{scope.row.t_status | transStatus}}</template>
            </el-table-column>
            <!-- <el-table-column prop="update_date" label="确认时间" width="220" show-overflow-tooltip align="center"></el-table-column> -->
          </el-table>
        </div>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" style="{height:bottomDivShow?'300px':'50px'}">
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
          <el-tab-pane label="部件需求" name="dataFile1">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入物料" name="dataFile2">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入文档" name="dataFile">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输入表单" name="dataFile3">
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
  name: "finishedTask",
  components: {
    taskExecutor,
    taskMaterial,
    taskData,
    taskDataFile
  },
  data() {
    return {
      condition: "", //搜索栏关键字
      activeName: "taskInfo",
      tableData: [],
      t_status: 0,
      currentRow: "",
      bottomDivShow: false,
      selection: [] //选中行数据
    };
  },
  methods: {
    //搜索
    search() {
      this.condition = "";
      this.refreshData();
    },
    //刷新任务执行者数据
    refreshData() {
      this.bottomDivShow = false;
      this.z_get("api/task", {
        condition: this.condition,
        t_status: 5,
        emp_id: 14
      })
        .then(res => {
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
        if (selection[i].t_id == val[0].t_id) {
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
    }
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
  created() {this.refreshData();},
  mounted() {this.refreshData();}
};
</script>

<style scoped>
.finishedTask {
  width: 100%;
}
.bottomLayout {
  position: relative;
}
.gridTable {
  flex: 1;
}
</style>