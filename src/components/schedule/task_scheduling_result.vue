<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="6">
          <div>
            <el-button type="primary" size="mini">保存</el-button>
            <el-button type="primary" size="mini">投放</el-button>
            <el-button type="primary" size="mini">撤销投放</el-button>
            <el-button type="primary" size="mini">导出</el-button>
            <!-- <el-button type="primary" size="mini">打印</el-button > -->
          </div>
        </el-col>
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

      <table id="top-table" border="1"  >
        <!-- 排列日期 -->
        <tr>
          <th class="top-firstBox"><span @click="pageDown(-7)" class="buttonLike">&nbsp; -</span> 日期 <span
              @click="pageDown(7)" class="buttonLike">&nbsp;+</span></th>
          <th class="top-dateBox" v-for="(date,dateIndex) in tableHead" :key="dateIndex"
            :class="{isOvered:date.isOver}"><span>
              {{date.week}} </span><span class="fontSize"> ({{date.day}}) </span></th>
        </tr>
        <!-- 排列班次 ---->
        <tr>
          <td>
            <el-select v-model="deptId" @change="changeDept" placeholder="请选择">
              <el-option v-for="item in shift_operates" :key="item.dept_id" :label="item.dept_name"
                :value="item.dept_id">
              </el-option>
            </el-select>
          </td>
          <td v-for="(date,dateIndex) in tableHead" :key="dateIndex">
            <table>
              <!-- width="100% " height="100%" cellspacing=0 cellpadding=0  padding=0 style="table-layout:fixed" -->
              <tr>
                <td  v-for="(shift,shiftIndex) in dept_shifts" :key="shiftIndex">
                  {{shift.ds_name}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- 排列事项 -->
        <tr v-for="(em, index) in tree" :key="index" height="40px" >
          <td> {{em.name}}</td>
          <td v-for="(date,dateIndex) in em.date" :key="dateIndex">
            <table class="dateTable">
                
                 <!-- {{task.t_name}} -->
              <tr>
                {{"背景颜色"}}
                <!-- <td v-for="(shift,shiftIndex) in date.shift" :key="shiftIndex">
                  <table  class="shiftTable">
                    <tr v-for="(task,taskIndex) in shift.task" :key="taskIndex">
                      <td class="taskTabble">
                      
                      </td>
                    </tr>
                  </table>
                </td> -->
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </el-main>
  </el-container>

</template>

<script>
export default {
  name: "scheduling_note_type",
  data() {
    return {
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
    //改变部门
    changeDept() {
      // console.log(this.shift_operates);
      this.shift_operate.slice(0, this.shift_operate.length);
      this.shift_operate = this.shift_operates.filter(item => item.dept_id == this.deptId);
      this.getDayShift(this.shift_operate[0].sg_id,this.deptId);
      // this.getShiftEmplyoee(this.deptId);
      // this.getShiftResult(this.deptId);
      
      console.log(333);
      console.log(this.employees);



    },
    //日历翻页
    pageDown(val) {
      this.page = this.page + val;
      this.refreshTable();
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
        head.push({ day: this.dateFilter(strDay, "MM-dd"), week: this.getWeekDay(i), isOver: isOvered, strDay: this.dateFilter(strDay, "yyyy-MM-dd") });//表头日期
      }
      this.tableHead = head;//获取表头
      this.getResultConstruct();//获取人员-日期-班次结构
    },

    //构建人员的班次任务详情数据结构
    getPeopleConstruct() {
      let em = [];
      let d = [];
      for (let s = 0; s < this.tableHead.length; s++) {
        em.push(d)
      }
      return em;
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
      this.pushResultList();
      console.log("tree");
      console.log(this.tree);
    },
    pushResultList() {
      for (let i = 0; i < this.resultList.length; i++) {
        for (let e = 0; e < this.tree.length; e++) {//遍历人员
          if (this.tree[e].emp_id == this.resultList[i].emp_id) {
            for (let d = 0; d < this.tree[e].date.length; d++) {//遍历日期
              if (this.tree[e].date[d].day == this.resultList[i].tsr_date) {
                for (let s = 0; s < this.tree[e].date[d].shift.length; s++) {//遍历班次
                  if (this.tree[e].date[d].shift[s].shiftId == this.resultList[i].ds_id) {
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
    GetShiftOprate() {
      this.z_get("api/dept/shiftoprate")
        .then(res => {
          this.shift_operates = res.data;
        })
        .catch(res => { });
    },
    getDayShift(val1,val2) {
      this.z_get("api/day_shift", { sg_id: val1 })
        .then(res => {
          this.dept_shifts = res.data;
          this.z_get("api/dept/shiftemplyoee", { deptId: val2 })
            .then(res => {
              this.employees = res.data;
              this.z_get("api/dept/shiftresult", { deptId: val2, start: this.firstDay, end: this.endDay })
                .then(res => {
                  this.resultList = res.data;
                }).then(this.refreshTable())
                .catch(res => { });

            })
            .catch(res => { });
        })
        .catch(res => { });
    },
    // getShiftEmplyoee(val) {
    //   this.z_get("api/dept/shiftemplyoee", { deptId: val })
    //     .then(res => {
    //       this.employees = res.data;
    //       this.z_get("api/dept/shiftresult", { deptId: val, start: this.firstDay, end: this.endDay })
    //         .then(res => {
    //           this.resultList = res.data;
    //         })
    //         .catch(res => { });

    //     })
    //     .catch(res => { });
    // },
    //   getShiftResult(val) {
    //   this.z_get("api/dept/shiftresult", {  deptId:val, start:this.firstDay, end:this.endDay })
    //     .then(res => {
    //       this.resultList = res.data;  
    //     })
    //     .catch(res => { });
    // },
  },
  mounted() {
    this.pushFlag = 0;
  }
};
</script>

<style scoped>
.scheduling_note_type {
  width: 100%;
}
.result-date {
  background: #dcdfe6;
  display: flex;
  height: 40px;
  text-align: center;
  /* width: 100%; */
  line-height: 40px;
  margin: 0;
}
.result-shift {
  background: #e4e7ed;
  display: flex;
  height: 40px;
  text-align: center;
  /* width: 100%; */
  line-height: 40px;
  margin: 0;
}
.result-shift li {
  border: 1;
  flex-grow: 1;
  text-align: center;
}
.result-body {
  /* background: #f2f6fc; */
  background: #f2f6fc;
  display: flex;
  height: 100px;
  line-height: 50px;
  margin: 0;
}
.result-body li {
  border: 1;
  flex-grow: 1;
  text-align: center;
}

.result-date li {
  border: 1;
  flex-grow: 1;
  text-align: center;
}
.isOvered {
  background-color: #909399;
}
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
.div_border {
  white-space: normal;
  word-break: break-all;
  /* background-color: #409eff; */
  /* height: 36px; */
  display: inline-block;

  position: relative;
  border: 0;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  /* width: 100px; */
  /* border-style:solid; */
}
.fontSize {
  font-size: 12px;
}
.top-dateBox {
  background-color: #fff;
}

#top-table {
  table-layout:fixed;
  width: 100%;
  word-wrap: break-word;
  font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  padding: 0;
}
#top-table tr.alt td {
  color: #000000;
  background-color: #67c23a;
}
#top-table td{
  /* border:1px solid #000; */
  padding: 0px;
  
}
#top-table th {
  font-size: 1.1em;
    padding: 0px;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 4px;
  background-color: #a7c942;
  color: #ffffff;
}
#top-table tr td table{
  width: 100%;
  height: 100%;
  border:0;
  /* background-color: #a7c942; */
  /* border:3px solid #000; */
  background-color:  #0af;
}
/* #top-table tr td table.dateTable tr */
/* #innertable {
  word-wrap: break-word;
} */
#innertable td {
  /* border-top: 1px solid #fff; */
  border-left: 1px solid #000;
  word-wrap: break-word;
}
.nullTable {
   
  width:"100% " ;
  height:"100%";
   /* cellspacing=0 ; */
   border-collapse:collapse; 
   /* cellpadding=0 ; */
   border:solid 0px Black; 
    padding:0 ;
    table-layout:fixed;
}
.nullTable td {
      background-color: #0af; /* 鼠标停留时背景颜色变化 */
}
.blocks {
   background-color: #0af;  /* 鼠标停留时背景颜色变化 */
    line-height: 30px;
    display: block;   /* 让span以block方式显示 */
    text-align: center;
    border: solid 1px #000;
    user-select: none;  /* 设置不可拖拽选中 */
    cursor: pointer;  /* 设置鼠标停留样式 */
}
.blocks:hover {
    background: #0af;  /* 鼠标停留时背景颜色变化 */
}
</style>