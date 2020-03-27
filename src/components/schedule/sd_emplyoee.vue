<template>
  <div class="deptShiftTab">
    <el-card shadow="hover" class="centerCard">
        <div class="tbar">
        <el-button type="primary" size="small" :disabled="selection.length==0"  @click="JoinShift(1)">
        参与排班
      </el-button>
      <el-button type="warning" size="small"  :disabled="selection.length==0" @click="JoinShift(0)">
        取消排班
      </el-button>
      </div>
      <div style="width:600px;height:400px;">
        <el-table :row-class-name="tableRowClassName" style="width: 100%" height="100%" :data="deptShiftData" tooltip-effect="dark"
          border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" width="70" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="emp_id" label="ID" align="center" width="140"></el-table-column>
          <el-table-column prop="emp_name" label="姓名" align="center" width="140"></el-table-column>
          <el-table-column prop="de_isscheduling" label="参与排班" align="center" width="140">
            <template slot-scope="scope">{{scope.row.de_isscheduling|yesOrNo("是否")}}</template>
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
  // props: ["deptName", "deptId"],
  props: ["currentRow"],

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
      deep: true,
      immediate: true,
        handler() {
        this.refreshData();
        
      },
    }
  },
 
  methods: {
      //表格选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
        //批量修改
    JoinShift(val) {
        for (var i = 0; i < this.selection.length; i++) {
          this.selection[i].de_isscheduling = val;
        }
       this.z_put("api/dept/dept_emp_list", this.selection)
            .then(res => {
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
    },
    //查找带筛选条件的部门班次数据
    refreshData() {
      this.z_get("api/dept/dept_emp", { deptId: this.currentRow.dept_id })
        .then(res => {
          this.deptShiftData = res.data.dic;
        })
        .catch(res => { });
    },
   //控制行样式
          tableRowClassName({row, rowIndex}) {
        if (row.de_isscheduling==1) {
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