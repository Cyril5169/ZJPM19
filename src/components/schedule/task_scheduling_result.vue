<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="1">
          <div> 图例:</div>
        </el-col>
        <el-col :span="1">
          <div> 已保存:</div>
        </el-col>
        <el-col :span="1">
          <div class="sampelDiv1"> &nbsp; </div>
        </el-col>
        <el-col :span="1">
          <div> 已排班:</div>
        </el-col>
        <el-col :span="1">
          <div class="sampelDiv2"> &nbsp; </div>
        </el-col>
        <el-col :span="1">
          <div> 明天前:</div>
        </el-col>
        <el-col :span="1">
          <div class="sampelDiv3"> &nbsp; </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <!-- 制作表格 -->

      <body>
        <table class="top-table" border="1">
          <!-- 排列日期 -->
          <tr class="date-tr">
            <th class="date-tr-first"><span @click="pageDown(-7)" class="buttonLike">&nbsp; -</span> 日期 <span
                @click="pageDown(7)" class="buttonLike">&nbsp;+</span></th>
            <th v-for="(date,dateIndex) in tableHead" :key="dateIndex" :class="{isOvered:date.isOver}">
              <span> {{date.week}} </span>
              <span class="fontSize"> ({{date.day|dateFilter("MM-dd")}}) </span>
            </th>
          </tr>
          <!-- 排列班次 ---->
          <tr class="shift-tr">
            <td>
              <el-select v-model="deptId" @change="changeDept" placeholder="请选择">
                <el-option v-for="item in shift_operates" :key="item.dept_id" :label="item.dept_name"
                  :value="item.dept_id">
                </el-option>
              </el-select>
            </td>
            <td v-for="(date,dateIndex) in tableHead" :key="dateIndex">
              <table class="shift-tr-table" border="1">
                <tr width="100%">
                  <td v-for="(shift,shiftIndex) in dept_shifts" :key="shiftIndex">
                    {{shift.ds_name}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- 排列事项 -->
          <tr class="em-tr" v-for="(em, index) in tree" :key="index" height="40px">
            <td> {{em.name}}</td>
            <td v-for="(date,dateIndex) in em.date" :key="dateIndex">
              <table class="em-tr-table">
                <!-- {{task.t_name}} -->
                <tr>
                  <!-- {{"背景颜色"}} -->
                  <td v-for="(shift,shiftIndex) in date.shift" :key="shiftIndex">
                    <table class="em-tr-ttable" @click="editShiftClick(em.emp_id,date.day,shift.shiftId)">
                      <tr class="em-tr-ttable-tr" v-for="(task,taskIndex) in shift.task" :key="taskIndex">
                        <td>
                          {{task.t_name}}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
    </el-main>
    <el-dialog width="900px" title="任务安排" :close-on-click-modal="false" :visible.sync="addTaskVisiable">
      <div slot="header" style="text-align:center">
        <span>可排任务</span>
      </div>
      <div>
        <el-table ref="taskTable" style="width: 100%;" height="250px" :data="taskData" tooltip-effect="dark"
          highlight-current-row row-key="t_id">
          <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
          <el-table-column prop="t_name" label="任务名称" align="center" width="120"></el-table-column>
          <el-table-column label="最早开始时间" align="center" width="110" type='datetime' format="yyyy-MM-dd">
            <template slot-scope="scope">
              <span>{{ scope.row.t_early_startdate|dateFilter("yyyy-MM-dd")}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="t_last_enddate" label="最晚结束时间" align="center" width="110" format="yyyy-MM-dd">
            <template slot-scope="scope">
              <span>{{ scope.row.t_last_enddate|dateFilter("yyyy-MM-dd") }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="t_period" label="工期(天)" align="center" width="100"></el-table-column>
          <el-table-column label="班次数" align="center" width="180">
            <template slot-scope="scope">
              <el-input-number :min="1" :max="14" v-model="scope.row.shiftNum" controls-position="right">
              </el-input-number>
            </template>

          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">

              <el-button width="60" type="primary" size="mini" v-show="scope.row.preshow"
                @click="batchPreClick(scope.row.t_id,scope.row.shiftNum)"> 预排 </el-button>
              <el-button width="60" type="primary" size="mini"  v-show="scope.row.okshow"
              @click="batchOkClick(scope.row.t_id,scope.row.shiftNum)">发布 </el-button>
              <el-button width="60" type="warning" size="mini" v-show="!scope.row.preshow"
              @click="batchBackClick(scope.row.t_id)"> 撤回 </el-button> 
              <el-button width="60" type="warning" size="mini" v-show="!scope.row.okshow"
              @click="batchCancelClick(scope.row.t_id)"> 撤销</el-button>
            </template>

          </el-table-column>

        </el-table>
      </div>

    </el-dialog>
  </el-container>

</template>

<script>
export default {
  name: "scheduling_note_type",
  data() {
    return {
      resultFactor: { emp_id: 0, ds_id: 0, tsr_date: new Date() },
      activeName: "first",
      taskData: [],
      taskDataed: [],
      taskModel: [],
      addTaskVisiable: false,
      deptId: '',
      pushFlag: 0,
      firstDay: new Date(),
      endDay: new Date(),
      dayNum: 7,//视图显示天数,可添加下拉框前端设置一两周
      dept_shifts: [],
      shift_operates: [],
      shift_operate: [],
      weeks: [],
      resultList: [
        // {
        //   tsr_id: 1,//排班结果id
        //   ds_id: 1,//班次id 
        //   t_id: 3,//任务id
        //   emp_id: 1,//员工id
        //   tsr_date: "03-24",//任务所排日期
        //   dept_id: 1,//部门id
        //   emp_name: "张三",//
        //   date: '2020-03-18',
        //   shift: "早",
        //   task: "装配A",//原任务名称
        //   t_name: "装配AA",//任务名称
        //   t_note: "任务备注",
        //   t_period: 2,//任务工期
        //   t_last_enddate: new Date(),//最晚结束
        //   t_early_startdate: new Date(),//最早开始
        //   t_shiftcount: 5,//所需总数
        //   t_needshifts: 2,//尚需数
        //   t_flow_status: 1,//流转状态
        //   t_priority: 1,//优先级
        // },
      ],
      employees: [
        // {
        //   emp_name: "张三",
        //   emp_id: '1',
        // },
        // {
        //   emp_name: "李四",
        //   emp_id: '2',
        // },
        // {
        //   emp_name: "王五",
        //   emp_id: '3',
        // },
      ],
      tree: [],
      page: 0,

      tableHead: [],
    };
  },

  created() {
    this.GetShiftOprate();
    this.refreshTable();
  },
  methods: {
    //先后顺序搞不清
    //日历翻页，改变日期
    pageDown(val) {
      this.page = this.page + val;
     
      this.changeDept();
      
    },
    //改变部门
    changeDept() {
       this.refreshTable();
      this.shift_operate.slice(0, this.shift_operate.length);
      this.shift_operate = this.shift_operates.filter(item => item.dept_id == this.deptId);
      if (this.shift_operate.length > 0) {
        this.getDayShift(this.shift_operate[0].sg_id, this.deptId);
      }
    },

    //刷新排班排产日期
    refreshTable() {
      //排班部门确定排班班次（与日期一起确定行头），排班人员（确定列头）
      var head = [];
      var formatDate = [];
      var currentDay = new Date();
      var cyear = currentDay.getFullYear();
      var cmonth = currentDay.getMonth();
      var cday = currentDay.getDate();
      var cweek = (currentDay.getDay() + 6) % 7;
      this.firstDay = new Date(cyear, cmonth, cday - cweek + this.page);
      this.endDay = new Date(cyear, cmonth, cday - cweek + this.page + 7);
      for (var i = 0; i < this.dayNum; i++) {
        var strDay = new Date(cyear, cmonth, cday - cweek + this.page + i);
        formatDate.push(this.dateFilter(strDay, "yyyy-MM-dd"));
        var y = strDay.getFullYear();
        var m = strDay.getMonth() + 1;
        var d = strDay.getDate();
        var m_d = m + "-" + d;
        var isOvered = strDay > currentDay ? 0 : 1;
        head.push({ day: this.dateFilter(strDay, "yyyy-MM-dd"), week: this.getWeekDay(i), isOver: isOvered, strDay: this.dateFilter(strDay, "yyyy-MM-dd") });//表头日期
      }
      this.tableHead = head;//获取表头
    },


    //构建人名{}，日期[]的排班结果，类似于C#中键值Dictionary
    getResultConstruct() {
      this.tree.splice(0, this.tree.length);
      for (let i = 0; i < this.employees.length; i++) {
        let em = { name: this.employees[i].emp_name, emp_id: this.employees[i].emp_id, date: [] };
        for (let d = 0; d < this.tableHead.length; d++) {
          let dr = { day: this.tableHead[d].day, shift: [] };
          for (let s = 0; s < this.dept_shifts.length; s++) {
            let sr = { shiftId: this.dept_shifts[s].ds_id, task: [] };
            dr.shift.push(sr);
          }
          em.date.push(dr)
        }
        this.tree.push(em);
      }
    },
    pushResultList() {
      console.log("resultList1", this.resultList);
      for (let i = 0; i < this.resultList.length; i++) {
        for (let e = 0; e < this.tree.length; e++) {//遍历人员
          if (this.tree[e].emp_id == this.resultList[i].emp_id) {
            for (let d = 0; d < this.tree[e].date.length; d++) {//遍历日期
              console.log("if:", this.tree[e].date[d].day, this.resultList[i].tsr_date);
              if (this.tree[e].date[d].day == this.dateFilter(this.resultList[i].tsr_date, "yyyy-MM-dd")) {
                for (let s = 0; s < this.tree[e].date[d].shift.length; s++) {//遍历班次

                  if (this.tree[e].date[d].shift[s].shiftId == this.resultList[i].ds_id) {
                    console.log("添加班次了？", this.tree[e].date[d].shift[s].shiftId, this.resultList[i].ds_id);
                    this.tree[e].date[d].shift[s].task.push(this.resultList[i]);//在班次中添加任务属性

                    break;//跳出遍历班次循环  
                  }
                }
                break;//跳出遍历日期循环   
              }
            }
            break;//跳出遍历人员循环
          }
        }
      }
    },

    GetShiftOprate() {
      this.z_get("api/dept/shiftoprate")
        .then(res => {
          this.shift_operates = res.data;
        })
        .catch(res => { });
    },
    getDayShift(val1, val2) {
      // console.log(val1,val2,"this.dept_shifts");
      this.z_get("api/day_shift", { sg_id: val1 })
        .then(res => {
          this.dept_shifts = res.data;
          this.z_get("api/dept/shiftemplyoee", { deptId: val2 })
            .then(res => {
              this.employees = res.data;
              this.z_get("api/task_scheduling_result/shiftresult", { deptId: val2, start: this.firstDay, end: this.endDay })
                .then(res => {
                  this.resultList = res.data;
                  this.getResultConstruct();

                }).then(res => {
                  this.pushResultList()
                  console.log("tree1", this.tree);
                  console.log("result1", this.resultList);
                }
                ).catch(res => { });
            })
            .catch(res => { });
        })
        .catch(res => { });
    },

    batchPreClick(t_id, shiftNum) {
      let res = [];
      let emp_id = this.resultFactor.emp_id;
      let startDay = new Date(this.resultFactor.tsr_date);
      let startShift = this.resultFactor.ds_id;
      let s0 = 0;
      let ss = this.dept_shifts.length;
      // console.log("startShift", startShift);
      for (let c = 0; c < this.dept_shifts.length; c++) {
        if (this.dept_shifts[c].ds_id == startShift) {
          s0 = c;
        }
      }

      for (let i = 0; i < shiftNum; i++) {
        if (s0 < ss) {

          res.push({ tsr_id: i, ds_id: this.dept_shifts[s0].ds_id, t_id: t_id, emp_id: emp_id, tsr_date: startDay });
          s0 = s0 + 1;
        }
        else {
          s0 = 0;
          startDay = new Date(startDay.valueOf() + 24 * 60 * 60 * 1000);
          res.push({ tsr_id: i, ds_id: this.dept_shifts[s0].ds_id, t_id: t_id, emp_id: emp_id, tsr_date: startDay });
          s0 = s0 + 1;
        }

      }
      // console.log(res);

      this.z_post("api/task_scheduling_result/batch", res)
        .then(res => {
          this.$message({
            message: "新增成功!",
            type: "success",
            duration: 1000
          });
          this.refreshTable();
          this.addTaskVisiable = false;
        })
        .catch(res => {
          this.$alert("新增失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
      this.getDayShift(this.shift_operate[0].sg_id, this.deptId);
    },
    batchOkClick(t_id, shiftNum) {

    },
    batchBackClick(t_id, shiftNum) {

    },
    batchCancelClick(t_id, shiftNum) {

    },
    //编辑班次
    // editShiftClick(emp_id, tsr_date, ds_id) {

    //   alert('emp_id ' + emp_id + 'tsr_date ' + tsr_date + 'ds_id ' + ds_id)

    // },
    //打开具体班次结果进行编辑
    editShiftClick(emp_id, tsr_date, ds_id) {
      this.resultFactor.emp_id = emp_id;
      this.resultFactor.ds_id = ds_id;
      this.resultFactor.tsr_date = tsr_date;
      //  alert('emp_id ' + emp_id + 'tsr_date ' + tsr_date + 'ds_id ' + ds_id + 'dept_id ' + this.deptId)
      //查出某班次可排任务
      this.z_get("api/task/schedule", { emp_id: emp_id, dept_id: this.deptId, tsr_date: tsr_date })
        .then(res => {
          let list = res.data;
          list.forEach(element => {
            element["shiftNum"] = 5;
          });
          this.taskData = list;
        })
        .catch(res => { });
      this.addTaskVisiable = true;
    },
    //保存操作结果
    addShiftResult() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            this.z_put("api/task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "编辑成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          }
        } else {
          return false;
        }
      });
    },


    //查出某班次已排排任务
    getScheduleTask() {
      let emp_id = 1;
      let ds_id = 1;
      let tsr_date = "2020-02-20";
      this.z_get("api/task_scheduling_result/schedule", { tsr_date: tsr_date, emp_id: emp_id, ds_id: ds_id })
        .then(res => {
          this.shiftResult = res.data;
        })
        .catch(res => { });
    },




    //星期渲染
    getWeekDay(value) {
      switch ((value) % 7) {
        case (0): return "一"
        case (1): return "二"
        case (2): return "三"
        case (3): return "四"
        case (4): return "五"
        case (5): return "六"
        case (6): return "日"
      }
    },


  },
  mounted() {
    this.pushFlag = 0;
  }
};
</script>

<style scoped>
/* .isOvered {
  background-color: #909399;
} */
.sampelDiv1 {
  background-color: #67c23a;
  width: 20px;
  display: inline-block;
}
.sampelDiv2 {
  background-color: #e6a23c;
  width: 20px;
  display: inline-block;
}
.sampelDiv3 {
  background-color: #909399;
  width: 20px;
  display: inline-block;
}
.buttonLike {
  /* background-color: #409eff; */
  cursor: pointer;
  color: #409eff;
  font-weight: bold;
}

.fontSize {
  font-size: 12px;
}

.top-table {
  table-layout: fixed;
  width: 100%;
  word-wrap: break-word;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  padding: 0;
}
.date-tr {
  /* width: 100%; */
  border: solid 1px Black;
  background-color: #67c23a;
  /* border="1" height="100%" width="100% " cellspacing=0 cellpadding=0 padding=0 style="table-layout:fixed" */
}
.date-tr-first {
  background-color: #dcdfe6;
}
.shift-tr {
  /* width: 100%; */
  border: solid 1px Black;
  /* background-color: #67c23a; */
}
.shift-tr-table {
  border-collapse: collapse;
  width: 100%;
  /* height: 100%; 无效！退而求其次 */
  table-layout: fixed;
  min-height: 42px;
  /* background-color: #0af; */
  border: solid 1px Black;
  text-align: center;
}
.em-tr {
  /* width: 100%; */
  border: solid 1px Black;
  background-color: #dcdfe6;
  text-align: center;
}
.em-tr-table {
  border-collapse: collapse;
  width: 100%;
  /* height: 100%; 无效！退而求其次 */
  min-height: 42px;
  /* text-align: center; */
  background-color: #dcdfe6;
}
.em-tr-ttable {
  table-layout: fixed;
  width: 100%;
  min-height: 42px;
  background-color: #67c23a;
  cursor: pointer; /* 设置鼠标停留样式 */
}
.em-tr-ttable:hover {
  width: 100%;
  min-height: 42px;
  background-color: #409eff;
}
.em-tr-ttable-tr {
  width: 100%;
  min-height: 42px;
  background-color: #dcdfe6;
}

/* 字体 */
/* font-family: "Trebuchet MS", Arial, Helvetica, sans-serif; */
/* text-align: center; */

/* #top-table tr td table {
  width: 100%;
  height: 100%;
  border: 1;
   background-color:  #0af; 
} */

/* word-wrap: break-word;  */
/* 自动换行 */

/* table中合并边框 */
/* border-collapse: collapse; */

/* table边框线 */
/* border: solid 0px Black; */

/* table中列宽属性  */
/* table-layout: fixed; */
/* automatic	默认。列宽度由单元格内容设定。 */
/* fixed	列宽由表格宽度和列宽度设定。 */
/* inherit	规定应该从父元素继承 table-layout 属性的值 */

.blocks {
  background-color: #0af; /* 鼠标停留时背景颜色变化 */
  line-height: 30px;
  display: block; /* 让span以block方式显示 */
  text-align: center;
  border: solid 1px #000;
  user-select: none; /* 设置不可拖拽选中 */
  cursor: pointer; /* 设置鼠标停留样式 */
}
/* 鼠标悬停样式 */
/* :hover */
</style>