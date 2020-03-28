<template>
  <div class="taskExecutor">
    <div>
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
        <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入执行人/部门" v-model="condition"
          style="width:200px;">
        </el-input>
        <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewOne()">新增执行者</el-button>
      </div>
      <div class="gridTable" style="width:60%;">
        <el-table ref="taskExecutorTable" style="width: 100%" height="200px" :data="tableData" tooltip-effect="dark"
          highlight-current-row border>
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" width="55" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="dept_name" label="执行部门" align="center"></el-table-column>
          <el-table-column prop="emp_name" label="执行人" align="center" width="160"></el-table-column>
          <el-table-column label="是否主要执行" align="center" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.tr_ismain | transMainExecute }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130" prop="handle">
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

    <!--设置执行者 -->
    <el-dialog width="450px" :title="setExecutorText" :close-on-click-modal="false" :visible.sync="setExecutorVisiable"
      top="25vh" @closed="refreshExecutorForm" :append-to-body="true">
      <zj-form :model="executorModel" :newDataFlag='setExecutorVisiable' label-width="100px" ref="executorForm"
        :rules="executor_rules">
        <el-form-item label="部门" prop="dept_id">
          <el-select v-model="executorModel.dept_id" @change="refreshExecutorEmps(executorModel.dept_id)"
            placeholder="请选择部门">
            <el-option v-for="item in dept_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" ref="exe_emp_id" prop="emp_id">
          <el-select v-model="executorModel.emp_id" placeholder="请选择人员" :disabled="!executorModel.dept_id">
            <el-option v-for="item in emp_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要执行"  prop="tr_ismain">
          <el-select v-model="executorModel.tr_ismain">
            <el-option v-for="item in tr_mainOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:20px;">
          <el-button type="primary" @click="saveExecutorClick" style="margin-left:-60px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="setExecutorVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "taskExecutor",
  props: ["currentRow"],
  data() {
    return {
      condition: "", //搜索栏关键字
      tableData: [],
      setExecutorText: "",
      setExecutorVisiable: false,
      executorModel: {}, //执行者表单对象
      emp_options: [], //存储部门员工数据
      dept_options: [], //存储部门数据
      addOrNot: false,
      tr_mainOptions: [
        //是否为主要执行
        {
          value: true,
          label: "是"
        },
        {
          value: false,
          label: "否"
        }
      ],
      executor_rules: {
        dept_id: [
          { required: true, message: "请选择执行部门", trigger: "change" }
        ]
      }
    };
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
    //搜索
    search() {
      this.condition = "";
      this.refreshData();
    },
    //刷新任务执行者数据
    refreshData() {
      this.z_get("api/task_release/executor", {
        condition: this.condition,
        taskId: this.currentRow.t_id
      })
        .then(res => {          
          this.tableData = res.data.dic;
        })
        .catch(res => {});
    },
    //刷新设置执行者表单
    refreshExecutorForm() {
      this.$refs.executorForm.resetFields();
    },
    //刷新设置执行者弹出框的人员信息
    refreshExecutorEmps(deptId) {
      this.selectEmployee(deptId);
      this.$refs.exe_emp_id.resetField(); //改变选中负责部门，将负责人员重置
    },
    //查找部门数据
    selectDept(type, id) {
      this.dept_options = [];
      if (type == 1) {
        //新增临时任务（根节点），则查出所有部门
        this.z_get("api/dept", {}, { loading: false })
          .then(res => {
            if (
              res.code == 0 &&
              JSON.stringify(this.dept_options) != JSON.stringify(res.data)
            ) {
              //如果不一样才赋值
              this.dept_options = res.data;
              for (var i = 0; i < this.dept_options.length; i++) {
                this.dept_options[i].label = this.dept_options[i].dept_name;
                this.dept_options[i].value = this.dept_options[i].dept_id;
              }
            }
          })
          .catch(res => {});
      } else if (type == 2) {
        //新增子任务，则查出父任务所示负责部门下的所有部门
        this.z_get("api/dept/children", { deptId: id }, { loading: false })
          .then(res => {
            if (
              res.code == 0 &&
              JSON.stringify(this.dept_options) != JSON.stringify(res.data)
            ) {
              this.dept_options = res.data;
              for (var i = 0; i < this.dept_options.length; i++) {
                this.dept_options[i].label = this.dept_options[i].dept_name;
                this.dept_options[i].value = this.dept_options[i].dept_id;
              }
            }
          })
          .catch(res => {});
      }
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
            for (var i = 0; i < this.emp_options.length; i++) {
              this.emp_options[i].label = this.emp_options[i].emp_name;
              this.emp_options[i].value = this.emp_options[i].emp_id;
            }
          }
        })
        .catch(res => {});
    },
    //新增
    async addNewOne(type) {
      let res1 = await this.selectDept(2, this.currentRow.dept_id); //查出选中任务负责部门的部门支
      this.executorModel = {
        dept_id: "",
        emp_id: "",
        tr_ismain: false,
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        t_id: this.currentRow.t_id
      };
      this.setExecutorText = "新增执行者";
      this.addOrNot = true;
      this.setExecutorVisiable = true;
    },
    //编辑
    async editShow(row) {
      this.executorModel = JSON.parse(JSON.stringify(row));
      let res1 = await this.selectDept(2, this.currentRow.dept_id); //查找出负责部门的部门支
      let res2 = await this.selectEmployee(this.executorModel.dept_id); //查出当前部门所对应的人员
      this.setExecutorText = "编辑执行者";
      this.addOrNot = false;
      this.setExecutorVisiable = true;
    },
    //提交新增/修改结果
    saveExecutorClick() {
      this.$refs.executorForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task_release", this.executorModel, {
              params: { t_id: this.currentRow.t_id }
            })
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.setExecutorVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败:" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });                
              });
          } else {
            this.executorModel.UpdateColumns = this.$refs.executorForm.UpdateColumns;
            if (this.executorModel.UpdateColumns) {
              this.z_put("api/task_release", this.executorModel, {
                params: { t_id: this.currentRow.t_id }
              })
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.setExecutorVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败:" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });                  
                });
            } else {
              this.setExecutorVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除树1
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //删除树2
    onDeleteClick(list) {
      this.$confirm("是否确认删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/task_release/list", {
            params: { t_id: this.currentRow.t_id },
            data: list
          })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
            });
        })
        .catch(() => {});
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
    },
    transMainExecute: function(value) {
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
  created() {}
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
.tbarStyle {
  margin-top: 5px;
  margin-bottom: 13px;
}
.formItem {
  width: 200px;
}
</style>