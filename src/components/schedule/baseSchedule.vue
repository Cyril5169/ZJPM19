<template>
  <div class="baseSchedule">
    <div class="flexDiv-column" style="position:relative;">
      <div style="position:absolute;top:0;left:0;z-index:100;">
        <span>选择项目：</span>
        <el-select size="small" v-model="selectProjectNo" placeholder="请选择项目" @change="selProject">
          <el-option v-for="item in projectData" :key="item.p_no"
            :label="renderFilter(item.pc_no,classFilter) +'-' + item.p_name" :value="item.p_no">
          </el-option>
        </el-select>
      </div>
      <el-tabs class="toptabs" v-model="activeName" style="height:40px;">
        <el-tab-pane label="基准计划" name="first" disabled>
        </el-tab-pane>
        <el-tab-pane label="详细计划" name="second" disabled>
        </el-tab-pane>
      </el-tabs>
      <div class="tabPanel flexDiv-row" style="box-sizing: border-box;">
        <div class="leftLayout">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProjectPlanData">
            </el-button>
            <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewProjectPlan">新增
            </el-button>
            <el-button type="primary" size="small">进度计算</el-button>
            <el-button type="primary" size="small">发布</el-button>
            <el-button type="primary" size="small">撤销发布</el-button>
            <el-button type="primary" size="small">变更详情</el-button>
          </div>
          <div class="gridTable">
            <el-table height='100%' ref="projectPlanTable" style="width: 100%;" :data="projectPlanData"
              tooltip-effect="dark" highlight-current-row>
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="pp_release_status" label="发布状态" align="center" width="100">
                <template slot-scope="scope">{{scope.row.pp_release_status | releaseStatusFilter}}</template>
              </el-table-column>
              <el-table-column prop="" label="编号" align="center" width="80"></el-table-column>
              <el-table-column prop="pp_name" label="作业名称" align="center" width="120" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="pp_node_type" label="类别" align="center" width="100">
                <template slot-scope="scope">{{scope.row.pp_node_type | stTypeFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_early_startdate" label="计划开始时间" align="center" width="120">

              </el-table-column>
              <el-table-column prop="pp_last_enddate" label="计划开始时间" align="center" width="120">

              </el-table-column>
              <el-table-column label="操作" width="140" prop="handle">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle>
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="rightLayout">

        </div>
      </div>
      <div style="position:absolute;top:0;right:0;">
        <el-button icon="el-icon-arrow-left" size="small" style="float:right;" v-if="btnShow" @click="toProject">返回项目列表
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      projectData: [],
      projectPlanData: [],
      selectProjectNo: [],
      classFilter: [],
      btnShow: false,
      projectPlanCondition: "",
      activeName: "first"
    };
  },
  filters: {
    releaseStatusFilter(value) {
      switch (value) {
        case "published":
          return "已发布";
          break;
        case "unpublish":
          return "未发布";
          break;
      }
    },
    stTypeFilter(value) {
      switch (value) {
        case "task":
          return "任务";
          break;
        case "work":
          return "节点";
          break;
      }
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler() {
        this.$nextTick(function() {
          this.changeTabColor();
        });
      }
    }
  },
  methods: {
    ...mapMutations("navTabs", ["addBreadCrumb"]),
    refreshProjectData() {
      this.z_get("api/project", {
        pc_no: 0,
        condition: ""
      })
        .then(res => {
          this.classFilter = res.dict.pc_no;
          this.projectData = res.data;
        })
        .catch(res => {});
    },
    refreshProjectPlanData() {},
    searchProjectPlanData() {
      this.projectPlanCondition = "";
      this.refreshProjectPlanData();
    },
    selProject(val) {
      this.selectProjectNo = val;
      this.searchProjectPlanData();
    },
    addNewProjectPlan() {},
    //跳转路由
    toProject() {
      this.$router.push({
        name: "project/projectList"
      });
      this.addBreadCrumb("project/projectList");
    },
    changeTabColor() {
      this.$nextTick(function() {
        var firstTab = document.getElementById("tab-first");
        firstTab.style.color =
          this.activeName == "first" ? "#409EFF" : "#C0C4CC";
        var secondTab = document.getElementById("tab-second");
        secondTab.style.color =
          this.activeName == "first" ? "#C0C4CC" : "#409EFF";
      });
    }
  },
  mounted() {
    this.refreshProjectData();
    if (this.$route.params.projectNo) {
      this.selectProjectNo = this.$route.params.projectNo;
      this.btnShow = true;
      this.refreshProjectPlanData();
    }
    this.changeTabColor();
  }
};
</script>

<style scoped>
.baseSchedule {
  width: 1500px;
}
.leftLayout {
  width: 40%;
  height: 100%;
  border-right: 2px solid #eee;
  box-sizing: border-box;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.gridTable {
  flex: 1;
}
.rightLayout {
  flex: 1;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
</style>

<style>
.toptabs .el-tabs__nav {
  transform: translateX(-50%) !important;
  margin-left: 50%;
}
</style>