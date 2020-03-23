<template>
  <div class="baseSchedule">
    <div class="flexDiv-column" style="position:relative;">
      <div style="position:absolute;top:0;left:0;z-index:100;">
        <span>选择项目：</span>
        <el-select size="small" v-model="selectProjectNo" placeholder="请选择项目" @change="selProject">
          <el-option v-for="item in projectData" :key="item.p_no" :label="item.p_no +'-' + item.p_name"
            :value="item.p_no">
          </el-option>
        </el-select>
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="refreshProjectData"></el-button>
      </div>
      <div style="position:absolute;top:0;right:0;z-index:100;">
        <el-button icon="el-icon-arrow-left" size="small" style="float:right;" v-if="btnShow" @click="toProject">返回项目列表
        </el-button>
      </div>
      <el-tabs class="toptabs" v-model="selectNodeLevel" style="height:40px;">
        <el-tab-pane label="基准计划" name="base" disabled>
        </el-tab-pane>
        <el-tab-pane label="详细计划" name="detail" disabled>
        </el-tab-pane>
      </el-tabs>
      <div class="tabPanel flexDiv-row" style="margin-top:5px;">
        <div class="leftLayout">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProjectPlanData">
            </el-button>
            <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewProjectPlanShow">新增
            </el-button>
            <!-- <el-button type="primary" size="small">进度计算</el-button> -->
            <el-button type="primary" size="small" :disabled="projectPlanSelection.length == 0">
              发布选中计划({{projectPlanSelection.length}})</el-button>
            <el-button type="primary" size="small" :disabled="projectPlanSelection.length == 0">
              撤销发布选中计划({{projectPlanSelection.length}})</el-button>
            <el-button type="primary" size="small"
              :disabled="!currentRow.pp_id && currentRow.pp_release_status !='published'">时间变更</el-button>
          </div>
          <div class="gridTable">
            <zj-table height='100%' ref="projectPlanTable" style="width: 100%;" :data="projectPlanData"
              tooltip-effect="dark" highlight-current-row @selection-change="handleSelectionChange"
              @row-click="handleRowClick">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="pp_release_status" label="发布状态" align="center" width="80">
                <template slot-scope="scope">{{scope.row.pp_release_status | releaseStatusFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_name" label="作业名称" align="center" width="120" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="pp_node_type" label="任务类型" align="center" width="80">
                <template slot-scope="scope">{{scope.row.pp_node_type | stTypeFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_early_startdate" label="计划开始时间" align="center" width="110">
                <template slot-scope="scope">{{scope.row.pp_early_startdate | dateFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_last_enddate" label="计划完成时间" align="center" width="110">
                <template slot-scope="scope">{{scope.row.pp_last_enddate | dateFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_period" label="工期(天)" align="center" width="90">
              </el-table-column>
              <el-table-column prop="" label="负责人" align="center" width="100">
              </el-table-column>
              <el-table-column prop="pp_progress" label="完成进度" align="center" width="100">
                <template slot-scope="scope">{{scope.row.pp_progress == null ?0:scope.row.pp_progress}}%</template>
              </el-table-column>
              <el-table-column prop="pp_note" label="计划描述" align="center" width="120" show-overflow-tooltip>
              </el-table-column>
              <el-table-column :fixed="projectPlanData.length>0?'right':false" label="操作" width="100" prop="handle">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle
                    @click="editNewProjectPlanShow(scope.row)">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle>
                  </el-button>
                </template>
              </el-table-column>
            </zj-table>
          </div>
        </div>
        <div class="rightLayout">
          <div class="rightTop" style="height:330px;">
            <schedule :height="330" :width="'100%'" :isShowToolBar='false'></schedule>
          </div>
          <div class="rightBottom" style="flex:1;">
            <el-tabs v-model="activeName" style="height:100%;" class="bottomtabs flexDiv-column">
              <el-tab-pane label="部件需求" name="first" class="flexDiv-column">
                <keep-alive>
                  <taskMaterial v-if="bottomDivShow" :currentRow='currentRow' class="flexDiv-column" source='plan'>
                  </taskMaterial>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="资料需求" name="second" class="flexDiv-column">
                <keep-alive>
                  <taskData v-if="bottomDivShow" :currentRow='currentRow' class="flexDiv-column" source='plan'>
                  </taskData>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="紧前作业" name="third" class="flexDiv-column">
              </el-tab-pane>
              <el-tab-pane label="紧后作业" name="forth" class="flexDiv-column">
              </el-tab-pane>
              <el-tab-pane label="变更记录" name="fifth" class="flexDiv-column">
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑项目 -->
    <el-dialog v-if="addProjectPlanVisible" v-dialogDrag width="700px" :title="addOrNot?'新建项目计划':'编辑项目计划'"
      :close-on-click-modal="false" :visible.sync="addProjectPlanVisible">
      <zj-form size="small" :newDataFlag='addProjectPlanVisible' :model="projectPlanModel" label-width="100px"
        ref="projectPlanForm" :rules="add_rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="作业名称" prop="pp_name">
              <el-input style="width:200px;" v-model="projectPlanModel.pp_name" placeholder="请填写作业名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="任务类型">
              <el-select v-model="projectPlanModel.pp_node_type" placeholder="请选择任务类型">
                <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计划开始时间" prop="pp_early_startdate">
              <el-date-picker style="width:200px;" v-model="projectPlanModel.pp_early_startdate"
                placeholder="请选择计划开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="计划结束时间" prop="pp_last_enddate">
              <el-date-picker style="width:200px;" v-model="projectPlanModel.pp_last_enddate" placeholder="请选择计划开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="工期" prop="pp_period">
              <el-input style="width:200px;" v-model="projectPlanModel.pp_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="projectGroupData.length? 11 : 9 ">
            <el-form-item label="负责人(组织)" prop="group_id">
              <el-select v-model="projectPlanModel.group_id" ref="select_group" placeholder="请选择组织">
                <el-option :label="projectPlanModel.wp_name" :value="projectPlanModel.group_id"
                  style="height:auto;padding:0;">
                  <el-tree :data="projectGroupData" node-key="group_id" ref="tree" default-expand-all
                    :expand-on-click-node="false" highlight-current :current-node-key="projectPlanModel.group_id">
                    <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                      @click="handleSelectTreeClick(data)">
                      {{data.wp_id | renderFilter(postDataFilter)}}</div>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="projectGroupData.length==0" :span="2">
            <el-tooltip effect="dark" content="前往维护" placement="top-start">
              <el-button style="margin-left:5px;" size="mini" icon="el-icon-right" @click="toProjectGroup"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-form-item label="完成进度" prop="pp_progress">
          <el-input style="width:200px;" v-model="projectPlanModel.pp_progress" placeholder="请填写完成进度" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>%
        </el-form-item>
        <el-form-item label="计划备注" prop="pp_note">
          <el-input style="width:530px;" type="textarea" :rows="3" v-model="projectPlanModel.pp_note"
            placeholder="项目计划备注">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addProjectPlanVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveProjectPlanClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import taskMaterial from "../schedule-task/taskTab/taskMaterial";
import taskData from "../schedule-task/taskTab/taskData";
import schedule from "../control/ScheduleControl";

export default {
  data() {
    return {
      projectData: [],
      projectPlanData: [],
      projectGroupData: [],
      postDataFilter: [],
      selectProjectNo: [],
      selectBasePlan: [],
      projectPlanModel: {},
      projectPlanSelection: [],
      currentRow: [],
      btnShow: false,
      bottomDivShow: false,
      projectPlanCondition: "",
      activeName: "first",
      selectNodeLevel: "base",
      addProjectPlanVisible: false,
      addOrNot: false,
      stType_options: [
        {
          value: "task",
          label: "任务"
        },
        {
          value: "work",
          label: "节点"
        }
      ],
      add_rules: {
        pp_name: [
          { required: true, message: "请填写作业名称", trigger: "blur" }
        ],
        pp_period: [{ required: true, message: "请填写工期", trigger: "blur" }],
        pp_progress: [
          { required: true, message: "请填写完成进度", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    taskMaterial,
    taskData,
    schedule
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
    selectNodeLevel: {
      immediate: true,
      handler() {
        this.$nextTick(function() {
          this.changeTabColor();
        });
      }
    },
    addProjectPlanVisible(val) {
      if (val) {
        this.searchProjectGroupData();
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
          this.projectData = res.data;
        })
        .catch(res => {});
    },
    refreshProjectPlanData() {
      this.projectPlanData = [];
      this.currentRow = {};
      this.projectPlanSelection = [];
      this.bottomDivShow = false;
      if (this.selectNodeLevel == "base") {
        //刷新基准计划
        this.z_get("api/project_plan/basePlan", {
          p_no: this.selectProjectNo
        })
          .then(res => {
            this.projectPlanData = res.data;
          })
          .catch(res => {});
      } else if (this.selectNodeLevel == "detail") {
        this.z_get("api/project_plan/detailPlan", {
          pp_id: this.selectBasePlan.pp_id
        })
          .then(res => {
            this.projectPlanData = res.data;
          })
          .catch(res => {});
      }
    },
    searchProjectGroupData() {
      this.z_get(
        "api/project_group/treeList",
        {
          p_no: this.selectProjectNo,
          condition: ""
        },
        { loading: false }
      )
        .then(res => {
          this.postDataFilter = res.dict.wp_id;
          //如果不一样才赋值
          if (
            JSON.stringify(this.projectGroupData) != JSON.stringify(res.data)
          ) {
            this.projectGroupData = res.data;
          }
        })
        .catch(res => {});
    },
    searchProjectPlanData() {
      this.projectPlanCondition = ""; //先放这，防止后面要筛选
      this.refreshProjectPlanData();
    },
    selProject(val) {
      this.selectProjectNo = val;
      this.selectNodeLevel = "base";
      this.searchProjectPlanData();
    },
    addNewProjectPlanShow() {
      if (this.selectProjectNo) {
        this.projectPlanModel = {
          p_no: this.selectProjectNo,
          pp_name: "",
          pp_node_type: "task",
          pp_early_startdate: "",
          pp_last_enddate: "",
          pp_period: "0",
          group_id: "",
          wp_name: "",
          pp_note: "",
          pp_progress: "0",
          pp_node_level: this.selectNodeLevel,
          pp_pid:
            this.selectNodeLevel == "base" ? null : this.selectBasePlan.pp_id
        };
        this.addOrNot = true;
        this.addProjectPlanVisible = true;
      } else {
        this.$message({
          message: "请先选择一个项目!",
          type: "warning",
          duration: 1000
        });
      }
    },
    editNewProjectPlanShow(row) {
      this.projectPlanModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addProjectPlanVisible = true;
    },
    onSaveProjectPlanClick() {
      this.$refs.projectPlanForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project_plan", this.projectPlanModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshProjectPlanData();
                this.addProjectPlanVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.projectPlanModel.UpdateColumns = this.$refs.projectPlanForm.UpdateColumns;
            if (this.projectPlanModel.UpdateColumns) {
              this.z_put("api/project_plan", this.projectPlanModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshProjectPlanData();
                  this.addProjectPlanVisible = false;
                })
                .catch(res => {
                  var msg = res.msg;
                  if (msg.indexOf("重复键") > -1) msg = "已存在该项目号";
                  this.$alert("编辑失败!" + msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addProjectPlanVisible = false;
            }
          }
        }
      });
    },
    //选择组织
    handleSelectTreeClick(data) {
      this.projectPlanModel.group_id = data.group_id;
      this.projectPlanModel.wp_name = this.renderFilter(
        data.wp_id,
        this.postDataFilter
      );
      this.$refs.select_group.blur();
    },
    handleSelectionChange(val) {
      this.projectPlanSelection = val;
    },
    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
      this.bottomDivShow = true;
    },
    //跳转路由
    toProject() {
      this.$router.push({
        name: "project/projectList"
      });
      this.addBreadCrumb("project/projectList");
    },
    toProjectGroup() {
      this.$router.push({
        name: "schedule/project_group",
        params: {
          projectNo: this.selectProjectNo
        }
      });
      this.addBreadCrumb("schedule/project_group");
    },
    changeTabColor() {
      this.$nextTick(function() {
        var firstTab = document.getElementById("tab-base");
        firstTab.style.color =
          this.selectNodeLevel == "base" ? "#409EFF" : "#C0C4CC";
        var secondTab = document.getElementById("tab-detail");
        secondTab.style.color =
          this.selectNodeLevel == "base" ? "#C0C4CC" : "#409EFF";
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
  width: 740px;
  border-right: 2px solid #eee;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.rightLayout {
  width: 740px;
  margin-left: 2px;
  display: flex;
  flex-direction: column;
}
.gridTable {
  flex: 1;
}
</style>

<style>
.toptabs .el-tabs__nav {
  transform: translateX(-50%) !important;
  margin-left: 50%;
}
.bottomtabs .el-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>