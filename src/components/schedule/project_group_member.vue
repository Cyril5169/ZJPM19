<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
      <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入人员名称" v-model="condition" clearable
        style="width:250px;">
        <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewmember()">新增成员</el-button>
      <!-- <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
        删除选中({{selection.length}})
      </el-button> -->
    </div>
    <div class="gridTable">
      <el-table ref="memberTable" style="width: 100%;" height="200" :data="memberData" tooltip-effect="dark"
        highlight-current-row border @selection-change="handleSelectionChange" row-key="pgm_id">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column>  -->
        <el-table-column type="index" label="序号" width="55" align="center" sortable></el-table-column>
        <el-table-column prop="emp_id" label="人员" align="center" width="180">
          <template slot-scope="scope">{{scope.row.emp_id | renderFilter(empDataFilter)}}</template>
        </el-table-column>
        <el-table-column prop="dept_id" label="部门" align="center" width="180">
          <template slot-scope="scope">{{scope.row.dept_id | renderFilter(deptDataFilter)}}</template>
        </el-table-column>
        <el-table-column prop="pgm_starttime" label="进入时间" align="center" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pgm_endtime" label="退出时间" align="center" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="is_enabled" label="是否生效" align="center" width="90">
          <template slot-scope="scope">{{scope.row.is_enabled | enabledTypeFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editmemberShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-if="addEmpVisiable" v-dialogDrag width="450px" :title="addEmpText" :close-on-click-modal="false"
      :visible.sync="addEmpVisiable">
      <zj-form :model="memberModel" label-width="100px" ref="memberForm" :rules="add_rules" size="small"
        :newDataFlag='addEmpVisiable'>
        <el-form-item label="部门" prop="dept_id">
          <el-select v-model="memberModel.dept_id" @change="refreshEmployee(memberModel.dept_id)" placeholder="请选择部门">
            <el-option v-for="item in deptDataFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="emp_id">
          <el-select v-model="memberModel.emp_id" :disabled="!memberModel.dept_id" placeholder="请选择人员">
            <el-option v-for="item in empDataFilter" :key="item.value" :label="item.display" :value="item.value">
              <!-- <el-option v-for="item in emp_options" :key="item.value" :label="item.label" :value="item.value"> -->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进入时间" prop="pgm_starttime">
          <el-date-picker value-format="yyyy-MM-dd" v-model="memberModel.pgm_starttime" placeholder="请选择进入时间">
            <template slot-scope="scope">{{ scope.row.pgm_starttime | datatrans}}
            </template>
          </el-date-picker>
        </el-form-item>
        <el-form-item value-format="yyyy-MM-dd" label="退出时间" prop="pgm_endtime">
          <el-date-picker v-model="memberModel.pgm_endtime" placeholder="请选择退出时间">
            <template slot-scope="scope">{{ scope.row.pgm_endtime | datatrans}}
            </template>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否生效" prop="is_enabled">
          <el-select v-model="memberModel.is_enabled" placeholder="请选择">
            <el-option v-for="item in enabledTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button @click="addEmpVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSavememberClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["currentRow"],
  data() {
    return {
      condition: "",
      memberData: [], //表格数据
      selection: [],
      addEmpVisiable: false,
      memberModel: {},
      empDataFilter: [],
      deptDataFilter: [],
      emp_options: [],
      addOrNot: true, //是否新增
      addEmpText: "",
      add_rules: {
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }]
      },
      enabledTypeOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ]
    };
  },
  filters: {
    enabledTypeFilter(value) {
      switch (value) {
        case 0:
          return "否";
          break;
        case 1:
          return "是";
          break;
      }
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
    }
    // enabledTypeFilter(value) {
    //   switch (value) {
    //     case "0":
    //       return "否";
    //       break;
    //     case "1":
    //       return "是";
    //       break;
    //     // default :
    //     //   return "否";
    //     //   break;
    //   }
    // }
  },
  watch: {
    currentRow: {
      deep: true,
      immediate: true,
      handler() {
        this.search();
      }
    }
  },
  methods: {
    refreshData() {
      this.z_get("api/project_group_member/list", {
        group_id: this.currentRow.group_id,
        condition: this.condition
      })
        .then(res => {
          this.empDataFilter = res.dict.emp_id;
          this.deptDataFilter = res.dict.dept_id;
          this.memberData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.tgForm.resetFields();
    },
    refreshBottom() {
      this.itemCondition = "";
      this.dataCondition = "";
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //查找部门人员数据
    selectEmployee(deptId) {
      this.emp_options = [];
      this.z_get(
        "api/dept/dept_emp",
        { condition: null, deptId: deptId },
        { loading: false }
      )
        .then(res => {
          if (
            res.code == 0 &&
            JSON.stringify(this.emp_options) != JSON.stringify(res.data)
          ) {
            this.emp_options = res.data.dic;
            console.log(emp_options);
            for (var i = 0; i < this.emp_options.length; i++) {
              this.emp_options[i].label = this.emp_options[i].emp_name;
              this.emp_options[i].value = this.emp_options[i].emp_id;
            }
          }
        })
        .catch(res => {});
    },
    //刷新新增及编辑任务弹出框中的负责人员信息
    refreshEmployee(deptId) {
      this.selectEmployee(deptId);
      // this.$refs.form_emp_id.resetField(); //改变选中负责部门，将负责人员重置
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    addNewmember() {
      this.addEmpText = "新增成员";
      this.memberModel = {
        pgm_id: 0,
        group_id: this.currentRow.group_id,
        emp_id: "",
        dept_id: "",
        is_enabled: "",
        pgm_starttime: "",
        pgm_endtime: ""
      };
      this.addOrNot = true;
      this.addEmpVisiable = true;
    },

    onSavememberClick() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            var isContain = false;
            for (var i = 0; i < this.memberData.length; i++) {
              if (this.memberData[i].emp_id == this.memberModel.emp_id) {
                isContain = true;
                break;
              }
            }
            if (isContain) {
              this.$alert("已存在该成员！", "提示", {
                confirmButtonText: "好的",
                type: "warning"
              });
              return;
            }
            if (this.memberModel.is_enabled == 1) {
              this.$alert("已指派过负责人！", "提示", {
                confirmButtonText: "好的",
                type: "warning"
              });
              return;
            }
            this.z_post("api/project_group_member", this.memberModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addEmpVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.memberModel.UpdateColumns = this.$refs.memberForm.UpdateColumns;
            console.log(this.memberModel.UpdateColumns);
            if (this.memberModel.UpdateColumns) {
              // var isContain4 = false;
              var a = 0;
              for (var i = 0; i < this.memberData.length; i++) {
                if (this.memberData[i].emp_id == this.memberModel.emp_id) {
                  a++;
                  // isContain4 = true;
                  // break;
                }
              }
              // if (isContain4) {
              if (a > 1) {
                this.$alert("已存在该成员！", "提示", {
                  confirmButtonText: "好的",
                  type: "warning"
                });
                return;
              }
              if (this.memberModel.is_enabled == 1) {
                var isContain2 = false;
                for (var i = 0; i < this.memberData.length; i++) {
                  if (this.memberData[i].is_enabled == 1) {
                    isContain2 = true;
                    break;
                  }
                }
              }

              if (isContain2) {
                this.$alert("已指派过负责人！", "提示", {
                  confirmButtonText: "好的",
                  type: "warning"
                });
                return;
              }
              this.z_put("api/project_group_member", this.memberModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addEmpVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                  console.log(res);
                });
            } else {
              this.addEmpVisiable = false;
            }
          }
        }
      });
    },
    //编辑数据
    editmemberShow(row) {
      this.memberModel = JSON.parse(JSON.stringify(row));
      this.selectEmployee(this.memberModel.dept_id);
      this.addEmpText = "编辑成员";
      this.addOrNot = false;
      this.addEmpVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          var realSelect = this.arrayChildrenFlatten(list, []);
          this.z_delete("api/project_group_member/list", { data: realSelect })
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
                type: "error"
              });
            });
        })
        .catch(() => {});
    },

    //多维数组扁平化
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
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.memberTable.toggleRowSelection(row);
    }
  }
};
</script>

<style scoped>
</style>