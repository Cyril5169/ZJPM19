<template>
  <div class="deptEmpTab">
    <el-card shadow="hover" class="centerCard">
      <div>
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入员工姓名" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜 索</el-button>
          </el-input>
          <el-button size="small" type="primary" style="margin-left:10px;" @click="addDeptEmpShow()">新增部门人员</el-button>
          <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
            批量删除({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small" :disabled="selection.length==0">
              批量修改({{selection.length}})<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editList(1)" divided>设置为需被排班</el-dropdown-item>
              <el-dropdown-item @click.native="editList(4)" divided>取消设置需被排班</el-dropdown-item>
              <el-dropdown-item @click.native="editList(2)" divided>设置为负责人</el-dropdown-item>
              <el-dropdown-item @click.native="editList(5)" divided>取消设置为负责人</el-dropdown-item>
              <el-dropdown-item @click.native="editList(3)" divided>设置为主部门</el-dropdown-item>
              <el-dropdown-item @click.native="editList(6)" divided>取消设置为主部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div style="width:100%;height:370px;">
          <el-table ref="deptEmpTable" style="width: 100%" height="100%" :data="deptEmpData" tooltip-effect="dark"
            highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="70" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="emp_name" label="姓名" align="center" width="140"></el-table-column>
            <el-table-column prop="emp_no" label="工号" align="center"></el-table-column>
            <el-table-column label="是否需被排班" align="center" width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.de_isscheduling | transIsScheduling }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_manager" label="是否为负责人" align="center" width="125">
              <template slot-scope="scope">
                <span>{{ scope.row.is_manager | transIsManager }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_main_dept" label="是否为主部门" align="center" width="125">
              <template slot-scope="scope">
                <span>{{ scope.row.is_main_dept | transIsMainDept }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <!-- 新增部门人员 -->
    <el-dialog :width=" deptEmpModelList.length? '800px':'400px'" title="新增部门人员" :close-on-click-modal="false"
      :visible.sync="addDeptEmpVisiable">
      <div class="transferDiv">
        <div class="leftTransferItem">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchEmp"></el-button>
            <el-input size="small" @keyup.enter.native="refreshEmpList" placeholder="请输入人员名称" v-model="empCondition"
              clearable style="width:250px;">
              <el-button size="small" @click="refreshEmpList" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div>
            <span style="color:gray;font-size:12px;">*双击选择人员</span>
            <el-table ref="itemListTable" style="width:100%;" height="300" :data="empListData" tooltip-effect="dark"
              @row-dblclick="handleRowDbClcik" border stripe>
              <el-table-column prop="emp_name" label="人员名称" align="center"></el-table-column>
            </el-table>
            <div style="margin:0 15%;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="limit"
                layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
        <div class="rightTransferItem" v-if="deptEmpModelList.length">
          <fieldset class="oneItem" v-for="(item,index) in deptEmpModelList" :key="index">
            <legend>人员{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectEmp(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="80px" :rules="addEmp_rules">
              <el-form-item label="人员" prop="emp_id">
                <el-select v-model="item.emp_id" placeholder="请选择人员" disabled="">
                  <el-option v-for="item in empDataFilter" :key="item.value" :label="item.display" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="deptEmpModelList.length">
          <el-button size="medium" @click="addDeptEmpVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDeptEmpListClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!--编辑部门人员记录 -->
    <el-dialog width="400px" title="编辑部门人员" :close-on-click-modal="false" :visible.sync="selectDeptEmpVisiable"
      top="25vh" @closed="refreshForm" :append-to-body="true">
      <el-form :model="deptEmpModel" label-width="100px" ref="deptEmpForm" :rules="add_rules">
        <el-form-item label="人员" prop="emp_id">
          <el-select v-model="deptEmpModel.emp_id" ref="select_emp" placeholder="请选择人员" :disabled="!addOrNot">
            <el-option v-for="item in empDataFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写项1" prop="de_isscheduling" v-if="!addOrNot">
          <el-checkbox v-model="deptEmpModel.de_isscheduling">是否需被排班</el-checkbox>
        </el-form-item>
        <el-form-item label="填写项2" prop="is_manager" v-if="!addOrNot">
          <el-checkbox v-model="deptEmpModel.is_manager">是否为负责人</el-checkbox>
        </el-form-item>
        <el-form-item label="填写项3" prop="is_main_dept" v-if="!addOrNot">
          <el-checkbox v-model="deptEmpModel.is_main_dept">是否为主部门</el-checkbox>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:20px;">
          <el-button type="primary" @click="onSaveDeptEmpClick" style="margin-left:-60px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="selectDeptEmpVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depEmpChild",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "", //部门人员中的人员数据筛选关键字
      empCondition: "", //新增部门人员中的人员数据的筛选关键字
      deptEmpData: [], //表格数据
      deptEmpModel: {}, //部门人员实例
      deptEmpModelList: [], //待提交的部门人员集合
      addOrNot: true,
      selection: [], //选中项
      addDeptEmpVisiable: false, //显示新增部门员工界面
      selectDeptEmpVisiable: false, //显示保存待提交部门员工或编辑部门员工记录的界面
      empListData: [], //所有人员数据
      currentPage: 1, //当前页（所有人员）
      limit: 10, //每页最多展示的记录数
      total: 0, //查询到的总记录数
      empDataFilter: [], //过滤人员数据
      add_rules: {
        emp_id: [{ required: true, message: "请选择人员", trigger: "change" }]
      }
    };
  },
  watch: {
    deptId(val) {
      if (val) {
        this.refreshData();
      }
    }
    // addDeptEmpVisiable(val) {
    //   if (val) {
    //     this.searchEmp();
    //   }
    // }
    // selectDeptEmpVisiable(val) {
    //   if (val) {
    //     this.refreshEmpList();
    //   }
    // }
  },
  methods: {
    //查找所有的人员数据
    searchEmp() {
      this.empCondition = "";
      this.refreshEmpList();
    },
    //查找带筛选条件的人员数据
    refreshEmpList() {
      this.empListData = [];
      this.z_get(
        "api/employee/page",
        {
          condition: this.empCondition,
          page: this.currentPage,
          limit: this.limit
        },
        { loading: false }
      )
        .then(res => {
          if (res.code == 0) {
            this.empDataFilter = res.dict.emp_id;
            this.empListData = res.data;
            this.total = res.total;
          }
        })
        .catch(res => {});
    },
    //查找带筛选条件的当前部门的部门人员数据
    refreshData() {
      this.z_get("api/dept/dept_emp", {
        condition: this.condition,
        deptId: this.deptId
      })
        .then(res => {
          this.deptEmpData = res.data.dic;
        })
        .catch(res => {});
    },
    //查找当前部门的部门人员数据
    search() {
      this.condition = "";
      this.refreshData();
    },
    addDeptEmpShow() {
      this.deptEmpModelList = [];
      this.addOrNot = true;
      this.addDeptEmpVisiable = true;
    },
    onSaveDeptEmpClick() {
      this.$refs.deptEmpForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/dept/dept_emp", this.deptEmpModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.selectDeptEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败:" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.z_put("api/dept/dept_emp", this.deptEmpModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.selectDeptEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    editShow(row) {
      this.deptEmpModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.selectDeptEmpVisiable = true;
    },
    refreshForm() {
      this.$refs.deptEmpForm.resetFields();
    },
    //表格选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //批量修改
    editList(mark) {
      if (this.selection.length) {
        this.onEditClick(this.selection, mark);
      }
    },
    onEditClick(list, mark) {
      var text = "";
      if (mark == 1) {
        text = "设置为需被排班";
        for (var i = 0; i < list.length; i++) {
          list[i].de_isscheduling = true;
        }
      } else if (mark == 2) {
        text = "设置为负责人";
        for (var i = 0; i < list.length; i++) {
          list[i].is_manager = true;
        }
      } else if (mark == 3) {
        text = "设置为主部门";
        for (var i = 0; i < list.length; i++) {
          list[i].is_main_dept = true;
        }
      } else if (mark == 4) {
        text = "取消设置需被排班";
        for (var i = 0; i < list.length; i++) {
          list[i].de_isscheduling = false;
        }
      } else if (mark == 5) {
        text = "取消设置为负责人";
        for (var i = 0; i < list.length; i++) {
          list[i].is_manager = false;
        }
      } else if (mark == 6) {
        text = "取消设置为主部门";
        for (var i = 0; i < list.length; i++) {
          list[i].is_main_dept = false;
        }
      }
      this.$confirm("对于选中项，是否确认" + text + "?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/dept/dept_emp_list", list)
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
        })
        .catch(() => {});
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //批量删除
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除选中项？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/dept/dept_emp_list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败", "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
              console.log(res);
            });
        })
        .catch(() => {});
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshEmpList();
    },
    //双击选中人员
    handleRowDbClcik(row) {
      this.deptEmpModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_id: this.deptId,
        emp_id: row.emp_id,
        is_main_dept: false,
        is_manager: false,
        de_isscheduling: "",
        de_isauthority: ""
      };
      var isContain = false;
      for (var i = 0; i < this.deptEmpData.length; i++) {
        if (this.deptEmpData[i].emp_id == this.deptEmpModel.emp_id) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.deptEmpModelList.length; i++) {
        if (this.deptEmpModelList[i].emp_id == this.deptEmpModel.emp_id) {
          isContain = true;
          break;
        }
      }
      if (isContain) {
        this.$alert("已存在该人员!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
      } else {
        this.addOrNot = true;
        // this.selectDeptEmpVisiable = true;
        //新增
        this.deptEmpModelList.push(
          JSON.parse(JSON.stringify(this.deptEmpModel))
        );
      }
    },
    //删除待提交的部门人员集合中的人员
    deleteSelectEmp(index) {
      this.deptEmpModelList.splice(index, 1);
    },
    //提交新增的部门人员集合
    onSaveDeptEmpListClick() {
      this.$confirm("是否提交新增的部门人员？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_post("api/dept/dept_emp_list", this.deptEmpModelList)
            .then(res => {
              this.$message({
                message: "新增成功!",
                type: "success",
                duration: 1000
              });
              this.addDeptEmpVisiable = false;
              this.refreshData();
            })
            .catch(res => {
              this.$alert("新增失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  filters: {
    transIsScheduling: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsAuthority: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsMainDept: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsManager: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    }
  },
  created() {
    this.searchEmp();
  }
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
.formItem {
  width: 200px;
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
  width: 360px;
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