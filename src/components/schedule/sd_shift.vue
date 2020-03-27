<template>
  <div class="deptShiftTab">
    <el-card shadow="hover" class="centerCard">
      <div class="tbar">
        <el-button type="primary" size="small"  @click="showDeptShift()">
        设置班次
      </el-button>
      </div>
      <div style="width:600px;height:400px;">
        <el-table  :row-class-name="tableRowClassName" style="width: 100%" height="100%" :data="historyShiftData" tooltip-effect="dark"
          border>
          <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
          <el-table-column type="index" width="70" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="sg_name" label="班次名称" align="center" width="140">
             <template slot-scope="scope"> 
              {{ scope.row.sg_name}}
            </template>
          </el-table-column>
          <el-table-column prop="dsg_startdate" label="开始使用时间" align="center" width="130">
            
             <template slot-scope="scope"> 
              {{ scope.row.dsg_startdate| datetrans}}
            </template>
          </el-table-column>
          <el-table-column prop="dsg_enddate" label="结束使用时间" align="center" width="130">
            <template slot-scope="scope"> 
              {{ scope.row.dsg_enddate | datetrans}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog width="360px" title="部门班次选择" :close-on-click-modal="false" :visible.sync="editSdShiftVisiable">
      <div>
        <header>
          <el-select v-model="currentRow.sg_id" clearable placeholder="请为部门选择班次" @change='refreshShiftList'>
            <el-option v-for="item in shiftOptions" :key="item.sg_id" :label="item.sg_name" :value="item.sg_id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="SaveDeptShiftClick">
            保存修改
          </el-button>
        </header>
        <p>
          <el-table ref="itemListTable" style="width:100%; " height="200" :data="shiftListData" tooltip-effect="dark"
            border stripe>
            <el-table-column prop="ds_name" label="名称" align="center"></el-table-column>
            <el-table-column label="时段" align="center">
              <template slot-scope="scope">{{timeRange(scope.row.ds_endtime,scope.row.ds_starttime)}}</template>
            </el-table-column>
          </el-table>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depShiftChild",
  // props: ["deptName", "deptId","sgId"],
  props: ["currentRow"],

  data() {
    return {
      editSdShiftVisiable: false,
      shiftOptions: [],
      condition: "", //部门班次中的班次数据筛选关键字
      shiftCondition: "", //新增部门班次中的班次数据的筛选关键字
      historyShiftData: [], //表格数据
      deptShiftModel: {}, //待提交的部门班次实例
      deptShiftModelList: [], //待提交的部门班次集合
      addDeptShiftText: "",
      addOrNot: true,
      selection: [], //选中项
      selectDeptShiftVisiable: false, //显示保存部门班次实例至待提交部门班次集合或编辑部门班次记录
      addDeptShiftVisiable: false, //显示新增部门班次界面
      shiftListData: [], //所有班次组数据
      shiftDataFilter: [],//班次数据的渲染
      currentPage: 1, //当前页（所有班次组）
      limit: 10, //每页最多展示的记录数
      total: 0, //查询到的总记录数
      add_rules: {
        sg_id: [{ required: true, message: "请选择班次", trigger: "change" }]
      }
    };
  },
  watch: {
    currentRow: {
      handler(){
        this.refreshhistoryData();
      },
      deep:true,
      immediate:true,
    },
  },
  mounted(){
      this.refreshShiftOptionsModel();
  },
  methods: {
      refreshDeptShiftData() {
        this.$emit('getDeptShiftData');
        // this.$parent.fatherMethod();//为啥这样不行？
        console.log("刷新父组件");
      },
       //转时间段
    timeRange(end, start) {
      let str1 = this.dateFilter(start, "HH:mm");
      let str2 = this.dateFilter(end, "HH:mm");
      return str1 + "~" + str2;
    },
      //打开编辑班次框
    showDeptShift() {
      console.log("报错了");
      this.refreshShiftList();
      this.editSdShiftVisiable = true;
    },
    //保存班次修改
    SaveDeptShiftClick() {
      this.z_post("api/dept_shift_group", this.currentRow)
        .then(res => {
          this.$message({
            message: "更新班次配置成功!",
            type: "success",
            duration: 1000
          });
          this.refreshhistoryData();
          this.refreshDeptShiftData();
          this.editSdShiftVisiable=false;
          // this.$parent.getDeptShiftData();
        })
        .catch(res => {
          this.$alert("未能更新配置!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
      
    },
    refreshShiftOptionsModel() {
      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {
          this.shiftOptions = res.data;
          console.log(this.shiftOptions);
        })
        .catch(res => { });
    },
  
    //展示班次明细
    refreshShiftList() {
      this.shiftListData = [];
      let params1 = -1;
      if (this.currentRow.sg_id !== "") {
        params1 = this.currentRow.sg_id
      }
      this.z_get( "api/day_shift",{ sg_id: params1 })
        .then(res => {
          if (res.code == 0) {
            this.shiftListData = res.data;
          }
        })
        .catch(res => { });
    },
    //查找带筛选条件的部门班次数据
    refreshhistoryData() {
      //  console.log("历史记录方法");
      this.z_get("api/dept_shift_group", {
        dept_id: this.currentRow.dept_id
      })
        .then(res => {
          this.historyShiftData = res.data;
          console.log(this.historyShiftData);
        })
        .catch(res => { });
    },
    //控制行样式
          tableRowClassName({row, rowIndex}) {
        if (row.dsg_enddate==null) {
           return 'success-row';
        } else  {
          return 'warning-row';
        }
      }

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
    }
  },
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}

.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 360px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 380px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}

.el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>