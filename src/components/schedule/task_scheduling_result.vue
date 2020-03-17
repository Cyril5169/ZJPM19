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

      <table id="top-table" cellspacing=0 cellpadding=0 border=1 style="table-layout:fixed">
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
          <td></td>
          <td v-for="(date,dateIndex) in tableHead" :key="dateIndex">
            <table width="100% " cellspacing=0 cellpadding=0 border=1 padding=0 style="table-layout:fixed">
              <tr>
                <td v-for="(shift,shiftIndex) in dept_shifts" :key="shiftIndex">
                  {{shift.name}}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- 排列事项 -->
        <tr v-for="(em, index) in tree" :key="index" height="40px" class="alt">
          <td> {{em.name}}</td>
          <td v-for="(date,dateIndex) in em.date" :key="dateIndex">
            <table width="100% " height="100%" cellspacing=0 cellpadding=0 padding=0 style="table-layout:fixed">
              <tr>
                <td v-for="(shift,shiftIndex) in date" :key="shiftIndex">
                  <table width="100% " height="100%" cellspacing=0 cellpadding=0 padding=0 style="table-layout:fixed">
                    <tr v-for="(task,taskIndex) in shift" :key="taskIndex">
                      <td>
                        {{task.task}}
                      </td>
                    </tr>
                  </table>

                </td>
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
      pushFlag: 0,
      firstDay: new Date(),
      dayNum: 7,//视图显示天数
      renshu: 2,
      dept_shifts: [
        {
          name: "早",
          start: "7:00",
          end: "17:00",
        },
        {
          name: "中",
          start: "17:00",
          end: "24:00",
        }
      ],
      weeks: [],
      resultList: [
        {
          name: "张三",
          date: '2020-03-18',
          shift: "早",
          task: "装配A",
        },
        {
          name: "张三",
          date: '2020-03-18',
          shift: "早",
          task: "装配C",
        },
        {
          name: "张三",
          date: '2020-03-18',
          shift: "早",
          task: "装配B",
        },
        {
          name: "张三",
          date: '2020-03-18',
          shift: "中",
          task: "质检B",
        },
        {
          name: "张三",
          date: '2020-03-19',
          shift: "中",
          task: "装配A",
        },

        {
          name: "李四",
          date: '2020-03-19',
          shift: "早",
          task: "装配C",
        },
        {
          name: "王五",
          date: '2020-03-16',
          shift: "早",
          task: "质检D",
        },

      ],
      employees: [],
      tree: [],
      page: 0,

      tableHead: [],
    };
  },

  created() {
    this.refreshTable();

    // console.log(this.tree);
  },
  methods: {
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
      for (var i = 0; i < this.dayNum; i++) {
        var strDay = new Date(cyear, cmonth, cday - cweek + this.page + i);
        formatDate.push(this.dateFormat(strDay, "yyyy-MM-dd"));
        var y = strDay.getFullYear();
        var m = strDay.getMonth() + 1;
        var d = strDay.getDate();
        var m_d = m + "-" + d;
        var isOvered = strDay > currentDay ? 0 : 1;
        head.push({ day: this.dateFormat(strDay, "MM-dd"), week: this.getWeekDay(i), isOver: isOvered, strDay: this.dateFormat(strDay, "yyyy-MM-dd") });//表头日期
      }
      this.tableHead = head;//获取表头
      this.tree = this.convertModelsToTreee(this.resultList);
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
    getResultConstruct(n) {

      let em = { name: n, date: [] };
      for (let d = 0; d < this.tableHead.length; d++) {
        let dr = [];
        for (let s = 0; s < this.dept_shifts.length; s++) {
          let sr = [];
          dr.push(sr);
        }
        em.date.push(dr)
      }
      return em;
    },
    //将查出的班次结果信息转化成树结构数组
    convertModelsToTreee(val) {
      // let d1=new Date("2020-03-30");
      // let d2=new Date("2020-03-20");
      // console.log(d1-d2);
      let employees = [];
      let tree = [];
      let name = [];
      let task = {};
      for (let i = 0; i < val.length; i++) {
        task = { name: val[i].name, date: val[i].date, shift: val[i].shift, task: val[i].task }
        let time = new Date(this.dateFormat(task.date, "yyyy-MM-dd")) - new Date(this.dateFormat(this.firstDay, "yyyy-MM-dd"))
        let eindex = 0;
        let dindex = parseInt(time / (1 * 24 * 60 * 60 * 1000));
        if (dindex < 0 || dindex > this.dayNum - 1) {
          continue
        }
        let sindex = 0;
        for (let s = 0; s < this.dept_shifts.length; s++) {
          if (task.shift == this.dept_shifts[s].name) {
            sindex = s
            //  console.log(s);
          }
        }
        if (employees.indexOf(task.name) == -1) {
          employees.push(task.name)
          eindex = employees.indexOf(task.name);
          name = [];
          tree.push(this.getResultConstruct(task.name));
          tree[eindex].date[dindex][sindex].push(task);
          this.pushFlag += 1;
        }
        else {
          eindex = employees.indexOf(task.name);

          tree[eindex].date[dindex][sindex].push(task);
          this.pushFlag += 1;
        }
      }
      //     console.log("最后的树结构");
      // console.log(tree);
      return tree;
    },

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
.div1-box {
  height: 39px;
  width: 80px;
  background-color: #dcdfe6;
  float: left;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
}

.shift-box {
  width: 49%;
  background-color: #67c23a;
  float: left;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
}
.top-dateBox {
  background-color: #fff;
}

#top-table {
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
#top-table td,
#top-table th {
  font-size: 1em;
  /* border: 1px solid #000; */
  padding: 0px;
}

#top-table th {
  font-size: 1.1em;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 4px;
  background-color: #a7c942;
  color: #ffffff;
}
/* #innertable {
  word-wrap: break-word;
} */
#innertable td {
  /* border-top: 1px solid #fff; */
  border-left: 1px solid #000;
  word-wrap: break-word;
}
</style>