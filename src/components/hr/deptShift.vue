<template>
  <div class="deptShift">
    <div class="containAll">
      <div class="leftContent">
        <div>
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
            <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入部门名称" v-model="condition"
              style="width:180px;">
              <el-button @click="refreshData" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-dropdown style="margin-left:10px;">
              <el-button size="small">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
                <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="topContent" style="height:465px;">
            <el-table ref="deptTable" style="width: 100%" height="100%" :data="tableData" tooltip-effect="dark"
              highlight-current-row row-key="dept_id" default-expand-all @row-click="handleRowClick">
              <el-table-column prop="dept_name" label="部门名称" style="width:95%" align="left"></el-table-column>
              <el-table-column prop="sg_name" label="班次" width="100px" align="center">
                <template slot-scope="scope">
                  <span @click="showDeptShift(scope.row.dept_id)" class="buttonLike">
                    {{scope.row.sg_name|sg_nameFilter}}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="rightContent">
        <el-tabs style="display:inline-block;width:100%;" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="部门人员" name="deptEmployee">
            <child2 v-if="isChildUpdate1" :deptName="deptNameSelect" :deptId="deptIdSelect"></child2>
          </el-tab-pane>
          <el-tab-pane label="部门使用班次记录" name="deptShift">
            <child1 v-if="isChildUpdate1" :deptName="deptNameSelect" :deptId="deptIdSelect"></child1>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>

    <el-dialog width="360px" title="部门班次选择" :close-on-click-modal="false" :visible.sync="addDeptShiftVisiable">

      <body class="leftTransferItem">
        <header>
          <el-select v-model="shiftSelectItem" clearable placeholder="请为部门选择班次" @change='refreshShiftList'>
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
      </body>
      <div class="rightTransferItem">
        <fieldset class="oneItem" v-for="(item,index) in ShiftModelList" :key="index">
          <legend>班次组{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
              @click="deleteSelectShift(index)"></el-button>
          </legend>
          <el-form size="small" :model="item" label-width="110px" :rules="add_rules">
            <el-form-item label="班次组" prop="sg_id">
              <el-select v-model="item.sg_id" placeholder="请选择班次组" disabled>
                <el-option v-for="item in shiftDataFilter" :key="item.value" :label="item.display" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始使用日期" prop="dsg_startdate">
              <el-date-picker v-model="item.dsg_startdate" type="date" format="yyyy 年 MM 月 dd 日" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束使用日期" prop="dsg_enddate">
              <el-date-picker v-model="item.dsg_enddate" type="date" format="yyyy 年 MM 月 dd 日" placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </fieldset>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import deptShiftChild from "@/components/hr/deptShiftChild";
import depEmpChild from "@/components/hr/depEmpChild";
export default {
  name: "deptShift",
  components: {
    child1: deptShiftChild,
    child2: depEmpChild
  },
  data() {
    return {
      deptshift: [],
      ShiftModelList: [],
      shiftSelectItem: "",
      addDeptShiftVisiable: false,
      condition: "",
      tableData: [], //表格数据
      tableDataFlat: [],
      shiftListData: [],
      selection: [],
      addDeptVisiable: false,
      deptModel: {},
      addOrNot: true, //是否新增
      addDeptText: "",
      activeName: "deptShift",
      deptIdSelect: 0, //传入tab的部门id，注意类型
      deptNameSelect: "  ", //传入tab的部门名称
      isChildUpdate1: true, //保证tab不会同时渲染所有tab，且每次点击某tab都会重新渲染该tab
      shiftOptions: [],
      add_rules: {
        dept_name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        dept_type_id: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.refreshData();
    this.refreshShiftOptionsModel();
  },
  filters: {
    sg_nameFilter(value) {
      if (value == null) return "前往设置";
      return value;
    },
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
    },
    deptTypeTrans(value) {
      switch (value) {
        case 1:
          return "部门";
          break;
        case 2:
          return "小组";
          break;
      }
    }
  },
  methods: {
    //保存班次修改
    SaveDeptShiftClick() {
      let tableDataObj = {};
      tableDataObj.sg_id = 0;
      tableDataObj.dept_id = this.deptshift[0].dept_id;
      if (this.shiftSelectItem != "") {
        tableDataObj.sg_id = this.shiftSelectItem;
      }

      this.z_post("api/dept_shift_group", tableDataObj)
        .then(res => {
          this.$message({
            message: "更新班次配置成功!",
            type: "success",
            duration: 1000
          });
          this.refreshData();
        })
        .catch(res => {
          this.$alert("未能更新配置!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //转时间段
    timeRange(end, start) {
      let str1 = this.dateFilter(start, "HH:mm");
      let str2 = this.dateFilter(end, "HH:mm");
      return str1 + "~" + str2;
    },
    //平铺部门班次
    arrayChildrenFlatten(array, result) {
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.children && item.children.length > 0) {
          result.push(item);
          result = this.arrayChildrenFlatten(item.children, result);
        } else {
          result.push(item);
        }
      }
      return result;
    },
    //打开编辑班次框
    showDeptShift(val) {
      this.deptshift = this.tableDataFlat.filter(item => item.dept_id == val);
      this.shiftSelectItem = this.deptshift[0].sg_id;
      this.refreshShiftList();
      this.addDeptShiftVisiable = true;
    },
    // changeShiftList() {
    //   this.sg_id = this.deptshift[0].sg_id;
    // },
    //展示班次明细
    refreshShiftList() {
      this.shiftListData = [];
      let params1 = -1;
      if (this.shiftSelectItem !== "") {
        params1 = this.shiftSelectItem;
      }
      this.z_get("api/day_shift", {
        sg_id: params1
      })
        .then(res => {
          if (res.code == 0) {
            this.shiftListData = res.data;
          }
        })
        .catch(res => {});
    },
    refreshData() {
      this.z_get("api/dept/shift", { condition: this.condition })
        .then(res => {
          this.tableData = res.data;
          this.tableDataFlat = this.arrayChildrenFlatten(res.data, []);
        })
        .catch(res => {});
    },
    refreshShiftOptionsModel() {
      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {
          this.shiftOptions = res.data;
          console.log(this.shiftOptions);
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.deptForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //标签页切换
    handleClick(tab) {
      var tabName = tab.name;
      switch (tabName) {
        case "emp_dept":
          (this.isChildUpdate1 = true),
            (this.isChildUpdate2 = this.isChildUpdate3 = this.isChildUpdate4 = false); //这样写可以？
          break;
      }
    },
    handleRowClick(row, column) {
      this.deptIdSelect = row.dept_id;
      console.log("this.deptIdSelect");
      console.log(this.deptIdSelect);
      this.deptNameSelect = row.dept_name;
    },
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
  }
};
</script>

<style scoped>
.deptShift {
  width: 1250px;
}
.formItem {
  width: 300px;
}
.leftContent {
  width: 40%;
  position: absolute;
  display: flex;
  display: -webkit-flex;
}
.rightContent {
  float: right;
  width: 71%;
}
.buttonLike {
  /* background-color: #409eff; */
  cursor: pointer;
  color: #409eff;
  font-weight: bold;
}
</style>