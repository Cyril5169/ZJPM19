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
          <!-- <el-button size="mini" type="primary" style="margin-left:10px;" :disabled="selection.length==0"
            @click="ReportProgress">进度汇报</el-button> -->
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
              <!-- <template slot-scope="scope">{{scope.row.t_early_startdate | renderFilter(datetrans)}}</template> -->
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center" width="110" show-overflow-tooltip>
              <!-- <template slot-scope="scope">{{scope.row.t_last_enddate | renderFilter(datetrans)}}</template> -->
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
          <el-tab-pane label="输入表单" name="taskInfo1">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输出文档" name="dataFile2">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="输出表单" name="dataFile4">
            <keep-alive>
              <taskDataFile v-if="bottomDivShow" :currentRow='currentRow'></taskDataFile>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
          @click="bottomDivShow=!bottomDivShow"></i>
      </div>
      <!-- 设置jindu-->
      <el-dialog width="500px" v-if="setProgressVisiable" :title="setProgressText" :close-on-click-modal="false"
        :visible.sync="setProgressVisiable" top="25vh">
        <!-- <el-progress :percentage="percentage" :color="customColor"></el-progress> -->
        <div class="block">
          <el-slider v-model="percentage" show-input :color="customColorMethod">
          </el-slider>
        <!-- <el-progress :percentage="percentage" :color="customColorMethod"></el-progress> -->

        <!-- <el-progress :percentage="percentage" :color="customColors"></el-progress> -->
        <div style="text-align:center;margin-right:100px;">
          <ul>
            <!-- <el-button size="mini" icon="el-icon-minus" @click="decrease" style="margin-left:30px;"></el-button>
            <el-button size="mini" icon="el-icon-plus" @click="increase" style="margin-left:10px;"></el-button> -->

            <el-button size="mini" type="primary" @click="EditProgress(percentage)" style="margin-left:30px;">
              保&nbsp;&nbsp;存</el-button>
            <el-button size="mini" @click="setProgressVisiable = false">取&nbsp;&nbsp;消</el-button>
          </ul>
        </div>
        </div>

      </el-dialog>
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
      setProgressVisiable: false,
      bigin: true,
      currentRow: "",
      setProgressText: "",
      tableData: [],
      bottomDivShow: false,
      selection: [], //选中行数据
      project_options: [],
      select_project: "", //下拉框绑定的项目号字段
      projectDataFilter: [], //项目渲染数据,
      taskRecordModel: {},
      t_status: null,
      report_operation: "",
      activeName: "taskInfo",
      percentage: ""
      // customColor: "#409eff",
      // customColors: [
      //   { color: "#f56c6c", percentage: 20 },
      //   { color: "#e6a23c", percentage: 40 },
      //   { color: "#5cb87a", percentage: 60 },
      //   { color: "#1989fa", percentage: 80 },
      //   { color: "#6f7ad3", percentage: 100 }
      // ]
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
    // datetrans(value) {
    //   if (!value || value == "9999-12-31") return "";
    //   //时间戳转化大法
    //   let date = new Date(value);
    //   let y = date.getFullYear();
    //   let MM = date.getMonth() + 1;
    //   MM = MM < 10 ? "0" + MM : MM;
    //   let d = date.getDate();
    //   d = d < 10 ? "0" + d : d;
    //   let h = date.getHours();
    //   h = h < 10 ? "0" + h : h;
    //   let m = date.getMinutes();
    //   m = m < 10 ? "0" + m : m;
    //   let s = date.getSeconds();
    //   s = s < 10 ? "0" + s : s;
    //   return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    // }
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
    //修改进度
    ReportProgress() {
      this.percentage = this.selection[0].t_progress;
      this.setProgressText = "汇报进度";
      this.setProgressVisiable = true;
    },
    EditProgress(percentage) {
      var taskModel = {
        t_id: this.selection[0].t_id,
        t_progress: this.percentage
      };
      this.$confirm("是否确认如上设置?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/task", this.taskModel)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
              this.setExecutorVisiable = false;
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
            this.report_operation = "start";
            text = "开始";
            list[i].t_status = 2;
          } else if (list[i].t_status == 2) {
            // this.$alert("所选任务包含执行中任务！请不要重复开始");
            this.$alert("该任务执行中！请不要重复开始");
            return;
          } else if (list[i].t_status == 3) {
            // this.$alert("所选任务包含执行中任务！请不要重复开始");
            this.$alert("该任务暂停中！请点击恢复按钮");
            return;
          } else {
            this.$alert("该任务已终止！请点击恢复按钮");
            return;
          }
        }
      } else if (mark == 22) {
        text = "恢复";
        // this.recovery = true;
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 3 || list[i].t_status == 4) {
            this.report_operation = "recover";
            list[i].t_status = 2;
          } else if (list[i].t_status == 2) {
            //若是执行中，不可点击
            // this.$alert("所选任务包含执行中任务！无需恢复");
            this.$alert("该任务执行中！无需恢复");
            return;
          } else if (list[i].t_status == 1) {
            //若是执行中，不可点击
            // this.$alert("所选任务包含未开始任务！");
            this.$alert("该任务未开始！请点击开始按钮");
            return;
          } else {
            this.$alert("该任务已终止！请点击恢复按钮");
            return;
          }
        }
        // this.recovery = true;
      } else if (mark == 3) {
        this.report_operation = "pause";
        text = "暂停";
        // this.recovery = true;
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 3) {
            this.$alert("该任务已暂停！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 4) {
            //若是执行中，不可点击
            this.$alert("该任务已终止！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 1) {
            //若是执行中，不可点击
            this.$alert("该任务未开始！请点击开始按钮");
            return;
          }
          list[i].t_status = 3;
        }
        this.recovery = true;
      } else if (mark == 4) {
        this.report_operation = "pause";
        text = "异常";
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 4) {
            this.$alert("该任务已报异常！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 3) {
            //若是执行中，不可点击
            this.$alert("该任务已暂停！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 1) {
            //若是执行中，不可点击
            this.$alert("该任务未开始！请点击开始按钮");
            return;
          }
          list[i].t_status = 4;
        }
      } else if (mark == 5) {
        this.report_operation = "finish";
        text = "完成";
        for (var i = 0; i < list.length; i++) {
          if (list[i].t_status == 4) {
            this.$alert("该任务已报异常！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 3) {
            //若是执行中，不可点击
            this.$alert("该任务已暂停！请点击恢复按钮");
            return;
          } else if (list[i].t_status == 1) {
            //若是执行中，不可点击
            this.$alert("该任务未开始！请点击开始按钮");
            return;
          }
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
              for (var i = 0; i < list.length; i++) {
                this.taskRecord(list[i]);
              }
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
    },
    taskRecord(list) {
      var value = Date.now();
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
      var nowTime = y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;

      // let date = new Date();
      // let y = date.getFullYear();
      // let MM = date.getMonth() + 1;
      // MM = MM < 10 ? "0" + MM : MM;
      // let d = date.getDate();
      // d = d < 10 ? "0" + d : d;
      // let h = date.getHours();
      // h = h < 10 ? "0" + h : h;
      // let m = date.getMinutes();
      // m = m < 10 ? "0" + m : m;
      // let s = date.getSeconds();
      // s = s < 10 ? "0" + s : s;
      // var nowTime = y + "-" + MM + "-" + d + " " + h + ":"+ m + ":"+s;
      this.taskRecordModel = {
        tr_id: 0,
        //  seq_no:this.seq_no + 1,//报工内部序号
        seq_no: 0, //报工内部序号
        t_id: list.t_id, //作业任务明细编号
        // t_id: 16, //作业任务明细编号
        is_audit: 1, //是否需要审核
        audit_emp: 0, //检查人
        audit_status: 0, //审核通过
        // audit_date: nowTime, //
        execute_emp: list.emp_id, //执行人

        report_operation: this.report_operation, //报工操作
        //  report_progress:this.percent_1,//报工进度

        report_progress: 100, //报工进度!!!

        //  report_emp:this.report_emp,//报工人
        report_emp: list.emp_id, //报工人
        report_date: nowTime, //报工日期

        accpte_emp: list.emp_id, //接收人

        accpte_date: nowTime, //就收日期
        actual_starttime: nowTime, //实际开始时间
        actual_endtime: nowTime //实际结束时间
      };
      // this.z_post("api/task_record", this.taskRecordModel).then(res => {
      //   console.log(res);
      //   // this.refreshData();
      // }).catch(res => {});;
      this.z_post("api/task_record", this.taskRecordModel)
        .then(res => {
          // this.$message({
          //   message: "新增成功",
          //   type: "success",
          //   duration: 1000
          // });
          // this.refreshData();
          // this.addEmpVisiable = false;
          console.log(res);
        })
        .catch(res => {
          // this.$alert("新增失败", "提示", {
          //   confirmButtonText: "确定",
          //   type: "error"
          // });
          console.log(res);
        });
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
    increase() {
      this.percentage += 5;
      if (this.percentage > 100) {
        this.percentage = 100;
      }
    },
    decrease() {
      this.percentage -= 5;
      if (this.percentage < 0) {
        this.percentage = 0;
      }
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