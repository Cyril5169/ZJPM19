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
        <!-- <el-tab-pane label="合并视图" name="union">
        </el-tab-pane> -->
      </el-tabs>
      <div class="tabPanel flexDiv-row" style="margin-top:5px;">
        <div class="leftLayout">
          <div class="tbar">
            <el-button icon="el-icon-back" v-if="selectNodeLevel == 'detail'" type="info" title="返回基准计划" size="mini"
              circle @click="returnBasePlan"></el-button>
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProjectPlanData">
            </el-button>
            <el-button type="primary" size="small" @click="addNewProjectPlanShow('root')">
              {{selectNodeLevel == 'base'?'新增':'新增根节点'}}
            </el-button>
            <el-button v-if="selectNodeLevel == 'detail'" type="primary" size="small" :disabled="!currentRow.pp_id"
              @click="addNewProjectPlanShow('children')">
              新增子节点
            </el-button>
            <!-- <el-button type="primary" size="small">进度计算</el-button> -->
            <el-button v-if="selectNodeLevel == 'base'" type="primary" size="small"
              :disabled="!currentRow.pp_id ||(currentRow.pp_release_status !='unrelease' || currentRow.pp_node_type!='work')"
              @click="publishPlan('released')">
              发布</el-button>
            <el-button v-if="selectNodeLevel == 'base'" type="primary" size="small"
              :disabled="!currentRow.pp_id ||( currentRow.pp_release_status !='released' || currentRow.pp_node_type!='work')"
              @click="publishPlan('unrelease')">
              撤销发布</el-button>
            <el-button v-if="selectNodeLevel == 'detail'" type="primary" size="small"
              :disabled="projectPlanSelection.length == 0" @click="publishPlanList('released')">
              发布选中({{projectPlanSelection.length}})</el-button>
            <el-button v-if="selectNodeLevel == 'detail'" type="primary" size="small"
              :disabled="projectPlanSelection.length == 0" @click="publishPlanList('unrelease')">
              撤销发布选中({{projectPlanSelection.length}})</el-button>
            <el-button type="primary" size="small"
              :disabled="!currentRow.pp_id || currentRow.pp_release_status !='released'" @click="changeTimeShow">时间变更
            </el-button>
            <el-dropdown style="margin-left:5px;">
              <el-button size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="!currentRow.pp_id" @click.native="moveUp">上移</el-dropdown-item>
                <el-dropdown-item :disabled="!currentRow.pp_id" @click.native="moveDown" divided>下移</el-dropdown-item>
                <el-dropdown-item v-if="selectNodeLevel == 'detail'" @click.native="expandAll" divided>展开所有节点
                </el-dropdown-item>
                <el-dropdown-item v-if="selectNodeLevel == 'detail'" @click.native="collapseAll" divided>折叠所有节点
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="gridTable">
            <zj-table height='100%' ref="projectPlanTable" class="projectPlanTable" style="width: 100%;"
              :data="projectPlanData" tooltip-effect="dark" row-key="pp_id" default-expand-all highlight-current-row
              @selection-change="handleSelectionChange" @row-click="handleRowClick" @row-dblclick="handleRowDBClick"
              :cell-class-name="cellClass" @select-all="handleSelectAll">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="pp_release_status" label="发布状态" width="100">
                <template slot-scope="scope">{{scope.row.pp_release_status | releaseStatusFilter}}</template>
              </el-table-column>
              <el-table-column prop="pp_name" label="任务名称" align="center" width="120" show-overflow-tooltip>
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
              <el-table-column prop="" label="负责人" align="center" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{getCharge(scope.row)}}</template>
              </el-table-column>
              <el-table-column prop="pp_progress" label="完成进度" align="center" width="100">
                <template slot-scope="scope">{{scope.row.pp_progress == null ?0:scope.row.pp_progress}}%</template>
              </el-table-column>
              <el-table-column prop="pp_note" label="计划描述" align="center" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column :fixed="handleFix()" label="操作" width="120" prop="handle">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-right" size="mini" circle
                    v-if="scope.row.pp_node_type == 'task' && selectNodeLevel == 'base'"
                    @click="handleRowDBClick(scope.row)">
                  </el-button>
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle
                    v-if="scope.row.pp_release_status !='released'" @click="editProjectPlanShow(scope.row)">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle
                    @click="onDeletePlanClick(scope.row)" v-if="scope.row.pp_release_status !='released'">
                  </el-button>
                </template>
              </el-table-column>
            </zj-table>
          </div>
        </div>
        <div class="rightLayout">
          <div class="rightTop" style="flex:1">
            <schedule :height="'100%'" :width="'100%'" v-model="projectPlanData" :hightLightNo="hightLightNo"
              :canControll="false" :cellHeight='75' startTimeField='pp_early_startdate' endTimeField='pp_last_enddate'
              taskNameField='pp_name' noField='sort' :expandSatrtMonth='1' :expandEndMonth='1' :cellWidth='280'>
            </schedule>
          </div>
          <div class="rightBottom" style="height:260px;">
            <el-tabs v-model="activeName" style="height:100%;" class="bottomtabs flexDiv-column">
              <el-tab-pane label="部件需求" name="first" class="flexDiv-column">
                <keep-alive>
                  <taskMaterial v-if="bottomDivShow" class="flexDiv-column" :currentRow='currentRow' source='plan'
                    :autoHeight="activeName=='first'">
                  </taskMaterial>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="资料需求" name="second" class="flexDiv-column">
                <keep-alive>
                  <taskData v-if="bottomDivShow" class="flexDiv-column" :currentRow='currentRow' source='plan'
                    :autoHeight="activeName=='second'">
                  </taskData>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="紧前任务" name="third" class="flexDiv-column">
                <keep-alive>
                  <constraintTable v-if="bottomDivShow" class="flexDiv-column" :currentRow='currentRow' source='front'
                    :autoHeight="activeName=='third'" :taskData='sameLevelTask'>
                  </constraintTable>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="紧后任务" name="forth" class="flexDiv-column">
                <keep-alive>
                  <constraintTable v-if="bottomDivShow" class="flexDiv-column" :currentRow='currentRow' source='behind'
                    :autoHeight="activeName=='forth'" :taskData='sameLevelTask'>
                  </constraintTable>
                </keep-alive>
              </el-tab-pane>
              <el-tab-pane label="变更记录" name="fifth" class="flexDiv-column">
                <div v-if="bottomDivShow" class="gridTable">
                  <zj-table :autoHeight='activeName =="fifth"' style="width:100%;" height="100" :data="changeTimeData"
                    tooltip-effect="dark" highlight-current-row border>
                    <el-table-column type="index" width="40" align="center">
                    </el-table-column>
                    <el-table-column prop="change_type" label="变更类型" align="center" width="100">
                      <template slot-scope="scope">{{scope.row.change_type | changeTypeFilter}}</template>
                    </el-table-column>
                    <el-table-column prop="beforetime" label="变更前时间" align="center" width="100">
                      <template slot-scope="scope">{{scope.row.beforetime | dateFilter}}</template>
                    </el-table-column>
                    <el-table-column prop="aftertime" label="变更后时间" align="center" width="100">
                      <template slot-scope="scope">{{scope.row.aftertime | dateFilter}}</template>
                    </el-table-column>
                    <el-table-column prop="change_reason" label="变更原因" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="create_user" label="变更人" align="center" width="100"></el-table-column>
                    <el-table-column prop="create_date" label="申请时间" align="center" width="140">
                      <template slot-scope="scope">{{scope.row.create_date | dateFilter('yyyy-MM-dd HH:mm')}}</template>
                    </el-table-column>
                  </zj-table>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑项目 -->
    <el-dialog v-if="addProjectPlanVisible" v-dialogDrag width="700px" :title="addOrNot? titleText :'编辑项目计划'"
      :close-on-click-modal="false" :visible.sync="addProjectPlanVisible">
      <zj-form size="small" :newDataFlag='addProjectPlanVisible' :model="projectPlanModel" label-width="110px"
        ref="projectPlanForm" :rules="add_rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="任务名称" prop="pp_name">
              <el-input style="width:200px;" v-model="projectPlanModel.pp_name" placeholder="请填写任务名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="任务类型">
              <el-select :disabled="projectPlanData.length == 0" v-model="projectPlanModel.pp_node_type"
                placeholder="请选择任务类型" @change="nodeTypeSel">
                <el-option v-for="item in stType_options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计划开始时间" prop="pp_early_startdate">
              <el-date-picker :disabled="projectPlanModel.pp_node_type == 'work'"
                style="width:200px;" v-model="projectPlanModel.pp_early_startdate" placeholder="请选择开始时间"
                :picker-options="pickerOptions1">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="计划结束时间" prop="pp_last_enddate">
              <el-date-picker style="width:200px;" v-model="projectPlanModel.pp_last_enddate"
                placeholder="请选择结束时间" :picker-options="pickerOptions1">
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

    <!-- 时间变更 -->
    <el-dialog v-if="changeTimeVisible" v-dialogDrag width="450px" :title="'[' + currentRow.pp_name+']' + '时间变更'"
      :close-on-click-modal="false" :visible.sync="changeTimeVisible">
      <zj-form size="small" :newDataFlag='changeTimeVisible' :model="changeTimeModel" label-width="100px"
        ref="taskItemForm" :rules="changeTime_rules">
        <el-form-item label="变更类型">
          <el-select v-model="changeTimeModel.change_type" placeholder="请选择变更类型" @change="changeTypeSel">
            <el-option v-for="item in changeType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更前时间">
          <span>{{changeTimeModel.beforetime | dateFilter}}</span>
        </el-form-item>
        <el-form-item label="变更后时间" prop="pp_early_startdate">
          <el-date-picker style="width:200px;" v-model="changeTimeModel.aftertime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改原因">
          <el-input class="formItem" type="textarea" :rows="2" v-model="changeTimeModel.change_reason"
            placeholder="修改原因">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="changeTimeVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveChangeTimeClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import taskMaterial from "../schedule-task/taskTab/taskMaterial";
import taskData from "../schedule-task/taskTab/taskData";
import schedule from "../control/ScheduleControl";
import constraintTable from "./common/constraintTable";

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
      currentRow: {},
      changeTimeData: [],
      changeTimeModel: {},
      timeConstraintRow: {},
      btnShow: false,
      bottomDivShow: false,
      projectPlanCondition: "",
      activeName: "first",
      titleText: "",
      selectNodeLevel: "base",
      addProjectPlanVisible: false,
      changeTimeVisible: false,
      addOrNot: false,
      loading: false,
      hightLightNo: 0,
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
      changeType_options: [
        {
          value: "start",
          label: "变更开始"
        },
        {
          value: "end",
          label: "变更结束"
        }
      ],
      add_rules: {
        pp_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        pp_period: [{ required: true, message: "请填写工期", trigger: "blur" }],
        pp_progress: [
          { required: true, message: "请填写完成进度", trigger: "blur" }
        ],
        pp_last_enddate: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ]
      },
      changeTime_rules: {
        aftertime: [{ required: true, message: "请选择时间", trigger: "blur" }]
      },
      addType: "",
      pickerOptions1: {
        //时间限制
        disabledDate: time => {
          if (this.selectNodeLevel == "detail") {
            return (
              time.getTime() <
                new Date(this.timeConstraintRow.pp_early_startdate).getTime() ||
              time.getTime() >
                new Date(this.timeConstraintRow.pp_last_enddate).getTime()
            );
          }
        }
      }
    };
  },
  components: {
    taskMaterial,
    taskData,
    schedule,
    constraintTable
  },
  filters: {
    releaseStatusFilter(value) {
      switch (value) {
        case "released":
          return "已发布";
          break;
        case "unrelease":
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
    },
    changeTypeFilter(value) {
      switch (value) {
        case "start":
          return "变更开始";
          break;
        case "end":
          return "变更结束";
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
  computed: {
    sameLevelTask() {
      var allData = this.arrayChildrenFlatten(this.projectPlanData, []);
      allData = allData.filter(
        item =>
          item.level == this.currentRow.level &&
          item.pp_id != this.currentRow.pp_id
      );
      return allData;
    }
  },
  methods: {
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
    refreshChangeTimeData() {
      this.changeTimeData = [];
      this.loading = true;
      this.z_get(
        "api/project_plan_change/list",
        {
          pp_id: this.currentRow.pp_id
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.changeTimeData = res.data;
        })
        .catch(res => {});
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
      this.refreshProjectPlanData();
    },
    addNewProjectPlanShow(type) {
      this.addType = type;
      if (this.selectProjectNo) {
        var pp_pid = null;
        var pp_last_enddate = "";
        if (type == "root") {
          if (this.selectNodeLevel == "detail") {
            pp_pid = this.selectBasePlan.pp_id;
            this.titleText =
              "新增[" + this.selectBasePlan.pp_name + "]的根计划";
            pp_last_enddate = this.selectBasePlan.pp_last_enddate;
            this.timeConstraintRow = this.selectBasePlan;
          } else {
            this.titleText = "新增基准计划";
          }
        } else if (type == "children") {
          pp_pid = this.currentRow.pp_id;
          this.titleText = "新增[" + this.currentRow.pp_name + "]的子计划";
          pp_last_enddate = this.currentRow.pp_last_enddate;
          this.timeConstraintRow = this.currentRow;
        }
        this.projectPlanModel = {
          p_no: this.selectProjectNo,
          pp_name: "",
          pp_node_type: "work",
          pp_early_startdate: "",
          pp_last_enddate: pp_last_enddate,
          pp_period: "0",
          group_id: "",
          wp_name: "",
          pp_note: "",
          pp_progress: "0",
          pp_node_level: this.selectNodeLevel,
          pp_pid: pp_pid,
          pp_release_status: "unrelease"
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
    editProjectPlanShow(row) {
      this.projectPlanModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      if (row.level == 1) {
        this.timeConstraintRow = this.selectBasePlan;
      } else {
        this.timeConstraintRow = this.projectPlanData.filter(
          item => item.pp_id == row.pp_pid
        )[0];
      }
      this.addProjectPlanVisible = true;
    },
    nodeTypeSel() {
      if (this.projectPlanModel.pp_node_type == "work") {
        this.projectPlanModel.pp_early_startdate = "";
      } else {
        this.projectPlanModel.pp_early_startdate = this.timeConstraintRow.pp_early_startdate;
      }
    },
    onSaveProjectPlanClick() {
      this.$refs.projectPlanForm.validate(valid => {
        if (valid) {
          if (this.projectPlanModel.pp_node_type == "task") {
            if (this.projectPlanModel.pp_early_startdate == "") {
              this.$alert("请选择计划开始时间!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
              return;
            }
            if (
              new Date(this.projectPlanModel.pp_early_startdate) >=
              new Date(this.projectPlanModel.pp_last_enddate)
            ) {
              this.$alert("结束时间不能小于开始时间!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
              return;
            }
          }
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
                  this.$alert("编辑失败!", "提示", {
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
    onDeletePlanClick(row) {
      this.$confirm("是否删除该计划?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/project_plan", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshProjectPlanData();
            })
            .catch(res => {
              var msg = res.msg;
              if (msg.indexOf("FK") > -1) msg = "该数据已被使用，无法删除";
              this.$alert("删除失败:" + msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    publishPlan(status) {
      var selection_temp = JSON.parse(JSON.stringify(this.currentRow));
      selection_temp.pp_release_status = status;
      selection_temp.pp_releaser = 0;
      selection_temp.UpdateColumns = ["pp_release_status", "pp_releaser"];
      var title = status == "unrelease" ? "撤销" : "";
      this.z_put("api/project_plan", selection_temp)
        .then(res => {
          this.$message({
            message: title + "发布成功!",
            type: "success",
            duration: 1000
          });
          this.refreshProjectPlanData();
          this.addProjectPlanVisible = false;
        })
        .catch(res => {
          this.$alert(title + "发布失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    publishPlanList(status) {
      var selection_temp = JSON.parse(
        JSON.stringify(this.projectPlanSelection)
      );
      for (var i = 0; i < selection_temp.length; i++) {
        selection_temp[i].pp_release_status = status;
        selection_temp[i].pp_releaser = 0;
        selection_temp[i].UpdateColumns = ["pp_release_status", "pp_releaser"];
      }
      var title = status == "unrelease" ? "撤销" : "";
      this.z_put("api/project_plan/list", selection_temp)
        .then(res => {
          this.$message({
            message: title + "发布成功!",
            type: "success",
            duration: 1000
          });
          this.refreshProjectPlanData();
          this.addProjectPlanVisible = false;
        })
        .catch(res => {
          this.$alert(title + "发布失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    changeTimeShow() {
      this.changeTimeModel = {
        pp_id: this.currentRow.pp_id,
        beforetime: this.currentRow.pp_early_startdate,
        aftertime: "",
        change_reason: "",
        change_type: "start"
      };
      this.changeTimeVisible = true;
    },
    changeTypeSel() {
      if (this.changeTimeModel.change_type == "start") {
        this.changeTimeModel.beforetime = this.currentRow.pp_early_startdate;
      } else if (this.changeTimeModel.change_type == "end") {
        this.changeTimeModel.beforetime = this.currentRow.pp_last_enddate;
      }
    },
    onSaveChangeTimeClick() {
      var selRow = JSON.parse(JSON.stringify(this.currentRow));
      if (this.changeTimeModel.change_type == "start") {
        selRow.pp_early_startdate = this.changeTimeModel.aftertime;
        selRow.UpdateColumns = ["pp_early_startdate"];
      } else if (this.changeTimeModel.change_type == "end") {
        selRow.pp_last_enddate = this.changeTimeModel.aftertime;
        selRow.UpdateColumns = ["pp_last_enddate"];
      }
      this.z_post("api/project_plan_change/changeRecord", {
        model: this.changeTimeModel,
        plan: selRow
      })
        .then(res => {
          this.$message({
            message: "变更成功!",
            type: "success",
            duration: 1000
          });
          this.refreshProjectPlanData();
          this.changeTimeVisible = false;
        })
        .catch(res => {
          this.$alert("变更失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //负责人
    getCharge(row) {
      if (row.wp_name) {
        var charge = row.wp_name;
        if (row.dept_name) {
          if (row.emp_name) {
            return charge + "(" + row.emp_name + ")";
          } else {
            return charge + "(" + row.dept_name + ")";
          }
        } else {
          return charge;
        }
      }
      return "无";
    },
    moveUp() {
      var index = this.projectPlanData.indexOf(this.currentRow);
      if (index == 0) {
        this.$message({
          message: "第一行不能上移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.projectPlanData.splice(index, 1)[0];
      this.projectPlanData.splice(index - 1, 0, this.currentRow);
      for (let i = 0; i < this.projectPlanData.length; i++) {
        const item = this.projectPlanData[i];
        item.sort = i;
        item.UpdateColumns = ["sort"];
      }
      this.z_put("api/project_plan/list", this.projectPlanData)
        .then(res => {
          this.$message({
            message: "上移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("上移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    moveDown() {
      var index = this.projectPlanData.indexOf(this.currentRow);
      if (index == this.projectPlanData.length - 1) {
        this.$message({
          message: "最后一行不能下移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.projectPlanData.splice(index, 1)[0];
      this.projectPlanData.splice(index + 1, 0, this.currentRow);
      for (let i = 0; i < this.projectPlanData.length; i++) {
        const item = this.projectPlanData[i];
        item.sort = i;
        item.UpdateColumns = ["sort"];
      }
      this.z_put("api/project_plan/list", this.projectPlanData)
        .then(res => {
          this.$message({
            message: "下移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("下移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
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
      this.refreshChangeTimeData();
      this.bottomDivShow = true;
      this.hightLightNo = row.no;
    },
    //跳转到详细计划
    handleRowDBClick(row) {
      if (this.selectNodeLevel == "detail") return;
      if (row.pp_node_type == "work") {
        this.$message({
          message: "节点类型无详细计划！",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.selectNodeLevel = "detail";
      this.selectBasePlan = row;
      this.refreshProjectPlanData();
    },
    //返回基准计划
    returnBasePlan() {
      this.selectNodeLevel = "base";
      this.selectBasePlan = [];
      this.refreshProjectPlanData();
    },
    //跳转路由
    toProject() {
      this.$router.push({
        name: "project/projectList"
      });
    },
    toProjectGroup() {
      this.$router.push({
        name: "schedule/project_group",
        params: {
          projectNo: this.selectProjectNo
        }
      });
    },
    changeTabColor() {
      this.$nextTick(function() {
        var firstTab = document.getElementById("tab-base");
        var secondTab = document.getElementById("tab-detail");
        if (this.selectNodeLevel == "base") {
          firstTab.style.color = "#409EFF";
          secondTab.style.color = "#C0C4CC";
        } else if (this.selectNodeLevel == "detail") {
          firstTab.style.color = "#C0C4CC";
          secondTab.style.color = "#409EFF";
        } else {
          firstTab.style.color = "#C0C4CC";
          secondTab.style.color = "#C0C4CC";
        }
      });
    },
    //是否固定操作栏
    handleFix() {
      if (this.selectNodeLevel == "base") {
        if (this.projectPlanData.length > 0) {
          return "right";
        }
      } else if (this.selectNodeLevel == "detail") {
        if (this.projectPlanData.length > 0) {
          return "right";
        }
      }
      return false;
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.pp_release_status == "released") {
          return "backgroundComplete";
        }
      }
    },
    //全选选中子节点
    handleSelectAll(selection) {
      if (this.pp_node_level == "base") return;
      var val = this.projectPlanData;
      var select = false; //全选还是反选
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].pp_id == val[0].pp_id) {
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
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.projectPlanSelection.indexOf(val[i]) == -1) {
          this.$refs.projectPlanTable.toggleRowSelection(val[i]);
        } else if (!select && this.projectPlanSelection.indexOf(val[i] > -1)) {
          this.$refs.projectPlanTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
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
  width: 735px;
  margin-left: 3px;
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
.leftLayout .el-button + .el-button {
  margin-left: 5px;
}
.projectPlanTable .el-button + .el-button {
  margin-left: 3px !important;
}
</style>