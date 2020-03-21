<template>
  <div class="baseSchedule">
    <div class="containAll">
      <div class="leftLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewProjectPlan">新增</el-button>
          <el-button type="primary" size="small">进度计算</el-button>
          <el-button type="primary" size="small">发布</el-button>
          <el-button type="primary" size="small">撤销发布</el-button>
          <el-button type="primary" size="small">变更详情</el-button>
        </div>
        <div class="gridTable">
          <zj-table height='100%' ref="projectPlanTable" style="width: 100%;" :data="projectPlanData"
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
          </zj-table>
        </div>
      </div>
      <div class="rightLayout">
        <div style="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectPlanData: []
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
  methods: {
    addNewProjectPlan(){
      
    }
  }
};
</script>

<style scoped>
.baseSchedule {
  width: 1500px;
}
.containAll {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
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