<template>
  <div class="deptShiftTab">
    <el-card shadow="hover" class="centerCard">
         <div class="tbar">
      <el-button type="primary" size="small" :disabled="!currentRow.st_id" @click="showDeptShift()">
        部门班次设置
      </el-button>
    </div>
        <div style="width:600px;height:400px;">
          <el-table ref="deptShiftTable" style="width: 100%" height="100%" :data="deptShiftData" tooltip-effect="dark" border >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="70" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="sg_name" label="班次名称" align="center" width="140"></el-table-column>
            <el-table-column prop="dsg_startdate" label="开始使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_startdate| datetrans}}
              </template>
            </el-table-column>
            <el-table-column prop="dsg_enddate" label="结束使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_enddate | datetrans}}
              </template>
            </el-table-column>
          </el-table>
        </div>
    </el-card>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depShiftChild",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "", //部门班次中的班次数据筛选关键字
      shiftCondition: "", //新增部门班次中的班次数据的筛选关键字
      deptShiftData: [], //表格数据
      deptShiftModel: {}, //待提交的部门班次实例
      deptShiftModelList: [], //待提交的部门班次集合
      addDeptShiftText: "",
      addOrNot: true,
      selection: [], //选中项
      selectDeptShiftVisiable: false, //显示保存部门班次实例至待提交部门班次集合或编辑部门班次记录
      addDeptShiftVisiable: false, //显示新增部门班次界面
      shiftListData: [], //所有班次组数据
      shiftDataFilter:[],//班次数据的渲染
      currentPage: 1, //当前页（所有班次组）
      limit: 10, //每页最多展示的记录数
      total: 0, //查询到的总记录数
      add_rules: {
        sg_id: [{ required: true, message: "请选择班次", trigger: "change" }]
      }
    };
  },
  watch: {
    deptId(val) {
      console.log("子组件调用");
      if (val) {
        this.refreshData();
      }
    },
  },
  methods: {
     //打开编辑班次框
    showDeptShift() {
      this.deptshift = this.tableDataFlat.filter(item => item.dept_id == this.deptId);
      this.shiftSelectItem = this.deptshift[0].sg_id;
      this.refreshShiftList();
      this.addDeptShiftVisiable = true;
    },
    //查找带筛选条件的部门班次数据
    refreshData(){
       console.log("历史记录方法");
     console.log(this.deptId);
      this.z_get("api/dept_shift_group", {
        dept_id: this.deptId
      })
        .then(res => {
          this.deptShiftData = res.data;
          
            console.log( this.deptShiftData);
        })
        .catch(res => {});
    },
  
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
</style>