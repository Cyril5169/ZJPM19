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
          <el-table ref="taskTable" style="width: 100%" height="200px" :data="tableData" tooltip-effect="dark"
            highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick" @row-dblclick="handleRowDBClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="emp_name" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="项目号" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="计划结束时间" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="计划结束时间" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="任务备注" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="任务状态" align="center"></el-table-column>
            <el-table-column prop="dept_name" label="确认时间" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomLayout">
        <el-tabs v-model="activeName" style="{height:bottomDivShow?'300px':'50px'}">
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
  name: "finishedTask",
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
  methods: {
    //搜索
    search() {
      this.condition = "";
      this.refreshData();
    },
    //刷新任务执行者数据
    refreshData() {
      this.bottomDivShow = false;
      this.z_get("api/task/treeList", {
        condition: this.condition
      })
        .then(res => {
          console.log(res);
          this.tableData = res.data.dic;
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
  created() {}
};
</script>

<style scoped>
.finishedTask {
  width: 100%;
}
.formItem {
  width: 200px;
}
.bottomLayout {
  position: relative;
}
</style>