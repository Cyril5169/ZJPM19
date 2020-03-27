<template>
  <div class="taskConfirmed">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="mini" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition"
            style="width:200px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="confirmTask(1)">确认({{selection.length}})</el-button>
        </div>
        <div class="gridTable">
          <el-table :height="bottomDivShow?'200px':'350px'" ref="tableData" style="width: 100%" :data="tableData"
            tooltip-effect="dark" highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_name" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="p_no" label="项目号" align="center"></el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" align="center">
              <template slot-scope="scope">{{scope.row.t_early_startdate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center">
              <template slot-scope="scope">{{scope.row.t_last_enddate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="任务备注" align="center"></el-table-column>
            <el-table-column prop="t_status" label="任务状态" align="center">
               <template slot-scope="scope">{{scope.row.t_status | transStatus}}</template>
            </el-table-column>
            <!-- <el-table-column prop="dept_name" label="确认时间" align="center"></el-table-column> -->
            <el-table-column label="操作" width="130" prop="handle" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="confirmOneTask(scope.row,1)">确认
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
              <taskInfo v-if="bottomDivShow" :currentRow='currentRow'>
              </taskInfo>
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
import taskInfo from "./taskInfo";

export default {
  name: "taskConfirmed",
  components: { taskExecutor, taskMaterial, taskData, taskDataFile, taskInfo },

  data() {
    return {
      condition: "", //搜索栏关键字
      t_status: 0,
      tableData: [],
      activeName: "taskInfo",
      bottomDivShow: false,
      currentRow: {},
      selection: [] //选中行数据
    };
  },

  methods: {
    //搜索
    search() {
      this.condition = "";
      this.t_status = 0;
      this.refreshData();
    },
    //刷新任务数据
    refreshData() {
      this.tableData = [];
      this.currentRow = {};
      this.bottomDivShow = false;
      this.z_get("api/task", {
        condition: this.condition,
        p_no: "",
        t_status: 0,
        emp_id: 14
      })
        .then(res => {
          console.log(res);
          // this.tableData = res.data.dic;
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
      var val = this.tableData;
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
      }
      this.$confirm("是否" + text + "选中项?", "提示", {
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
  created() {
    this.refreshData();
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.taskConfirmed {
  width: 100%;
}
.bottomLayout {
  position: relative;
}
.gridTable {
  flex: 1;
}
</style>