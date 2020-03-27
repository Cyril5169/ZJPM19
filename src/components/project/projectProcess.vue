<template>
  <div class="projectProcess">
    <el-container>
      <el-aside class="asideContent" width='230px'>
        <div class="leftTop">
          <el-card class="leftCard" shadow="never">
            <div slot="header">
              <span>项目状态</span>
            </div>
            <div class="leftCardBody">
              <ul class="statusList">
                <li><i class="el-icon-timer"></i><span>已创建</span>
                  <el-badge :value="statusCountData.create_count"
                    :type="statusCountData.create_count == 0?'info':'danger'" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>执行中</span>
                  <el-badge :value="statusCountData.execute_count"
                    :type="statusCountData.execute_count == 0?'info':'warning'" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>暂停中</span>
                  <el-badge :value="statusCountData.pause_count" type="info" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>已结束</span>
                  <el-badge :value="statusCountData.finish_count"
                    :type="statusCountData.finish_count == 0?'info':'success'" class="statusCount"></el-badge>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
        <div class="leftBottom">
          <el-card class="leftCard" shadow="never">
            <div slot="header">
              <span>项目分类</span>
              <el-button icon="el-icon-refresh" style="float: right;" title="刷新" size="mini" circle
                @click="refreshClassData">
              </el-button>
            </div>
            <div class="leftCardBody">
              <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current class="classTree">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
                  @click="handleSelectTreeClick(data)">
                  <img style="width:16px;" src="../../assets/img/tag.png" />
                  <span style="margin-left:3px;">{{data.pc_name}}</span>
                  <el-badge class="classCount" :type="getClassCount(data.pc_no) >0 ?'primary':'info'"
                    :value="getClassCount(data.pc_no)"></el-badge>
                </div>
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-aside>

      <el-main class="mainContent">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProject"></el-button>
          <el-input size="small" @keyup.enter.native="refreshProjectData" placeholder="请输入项目名称"
            v-model="projectCondition" clearable style="width:250px;">
            <el-button size="small" @click="refreshProjectData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </div>
        <div class="gridTable">
          <el-table height='100%' ref="projectTable" v-loading="loading" style="width:100%;" :data="processData"
            tooltip-effect="dark" highlight-current-row border>
            <el-table-column prop="p_name" label="项目名称" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="nohandle" label="未处理任务数" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="doing" label="执行中任务数" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="suspend" label="暂停任务数" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="stop" label="中止任务数" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="finish" label="完工任务数" align="center" show-overflow-tooltip>
            </el-table-column>

          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "projectProcess",
  data() {
    return {
      statusCountData: {},
      classData: [], //项目类别数据
      selectClass: {},
      projectCondition: "",
      loading: false,
      processData: [], //项目统计数据
      classCountData: [] //项目类别数量数据
    };
  },
  filters: {
    datatrans(value) {
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
    }
  },
  methods: {
    ...mapMutations("navTabs", ["addBreadCrumb"]),
    //刷新项目类别数据
    refreshClassData() {
      this.classData = [];
      this.selectClass = {};
      this.searchProject();
      this.z_get("api/project_classification/treeList")
        .then(res => {
          this.classData = res.data;
        })
        .catch(res => {});
    },
    //选中某一项目类别
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchProject();
    },
    //获取某一项目类别中的项目数量
    getClassCount(pc_no) {
      var count = 0;
      var oneClass = this.classCountData.filter(item => item.pc_no == pc_no);
      if (oneClass.length) {
        count = oneClass[0].class_count;
      }
      return count;
    },
    //查询所有项目的项目进度
    searchProject() {
      this.projectCondition = "";
      this.refreshProjectData();
    },
    //查询满足条件的项目进度
    refreshProjectData() {
      this.loading = true;
      this.processData = [];
      this.z_get(
        "api/project/process",
        {
          pc_no: this.selectClass.pc_no,
          condition: this.projectCondition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.processData = res.data;
        })
        .catch(res => {});
      //状态角标
      this.z_get("api/project/statusCount", {}, { loading: false })
        .then(res => {
          this.statusCountData = res.data[0];
        })
        .catch(res => {});
      //分类项目数
      this.z_get(
        "api/project_classification/classCount",
        {},
        { loading: false }
      )
        .then(res => {
          this.classCountData = res.data;
        })
        .catch(res => {});
    }
  },
  mounted() {
    this.refreshClassData();
  }
};
</script>

<style scoped>
.projectProcess {
  width: 1250px;
}
.asideContent {
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.leftTop {
  width: 100%;
  flex: 1;
}
.leftBottom {
  width: 100%;
  height: 450px;
}
.leftCard {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.leftCardBody {
  flex: 1;
  overflow-y: auto;
}
.statusList {
  margin: 5px;
}
.statusList li {
  height: 30px;
  margin-left: 10px;
}
.statusList li span {
  margin-left: 3px;
  color: #606266;
}
.statusCount {
  float: right;
  margin-right: 10px;
}
.classCount {
  float: right;
  margin-top: 5px;
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
</style>
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
.leftCard .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>