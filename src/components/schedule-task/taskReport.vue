<template>
  <div class="taskManage">
    <div class="containAll">
      <el-tabs v-model="activeName2">
        <el-tab-pane label="待确认" name="confirmedTask">
          <keep-alive>
            <taskConfirmed :currentRow='currentRow'>
            </taskConfirmed>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="我的任务" name="myTask">
          <keep-alive>
            <myTask :currentRow='currentRow'>
            </myTask>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="已完成任务" name="completedTask">
          <keep-alive>
            <finishedTask :currentRow='currentRow'>
            </finishedTask>
          </keep-alive>
        </el-tab-pane>

        <!-- <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
            style="width:200px;">
          </el-input>
          <span style="font-size:15px;margin-left:10px">项目号:</span>
          <el-select size="small" v-model="select_project" @change="refreshData" ref="select_project"
            placeholder="请选择项目">
            <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewNode('root')">新增
          </el-button>
          <el-button type="primary" size="small" :disabled="selection.length!=1" @click="addNewNode('children')">
            新增子任务
          </el-button>
          <el-dropdown style="margin-left:7px;margin-right:7px;">
            <el-button size="small" :disabled="selection.length==0">
              设置执行者({{selection.length}})<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="editExecutorShow()" divided>设置执行者</el-dropdown-item>
              <el-dropdown-item @click.native="resetExecutor()" divided>取消设置执行者</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="small" :disabled="selection.length==0" @click="ReleseTask(1)">
            发布到排班({{selection.length}})
          </el-button>
          <el-button type="primary" size="small" :disabled="selection.length==0" @click="ReleseTask(2)">
            发布到个人({{selection.length}})
          </el-button>
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
        <div class="gridTable">
          <el-table ref="taskTable" style="width: 100%;" :height="bottomDivShow?'300px':'450px'" :data="taskData"
            tooltip-effect="dark" highlight-current-row row-key="t_id" default-expand-all
            @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="t_name" label="任务名称" align="center" width="130"></el-table-column>
            <el-table-column prop="t_status" label="执行状态" align="center" width="115"></el-table-column>
            <el-table-column prop="t_flow_status" label="流转状态" align="center" width="115"></el-table-column>
            <el-table-column prop="p_no" label="所属项目" align="center" width="130">
              <template slot-scope="scope">{{scope.row.p_no | renderFilter(projectDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="备注" align="center"></el-table-column>
            <el-table-column prop="t_origin" label="来源" align="center" width="100">
              <template slot-scope="scope">{{scope.row.t_origin |originTrans }}</template>
            </el-table-column>
            <el-table-column prop="emp_id" label="负责人" align="center" width="120">
              <template slot-scope="scope">{{scope.row.emp_id | renderFilter(empDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="dept_id" label="负责部门" align="center" width="120">
              <template slot-scope="scope">{{scope.row.dept_id | renderFilter(deptDataFilter)}}</template>
            </el-table-column>
            <el-table-column prop="t_period" label="工期" align="center" width="90"></el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" align="center" width="130">
              <template slot-scope="scope">{{scope.row.t_early_startdate | datetrans}}</template>
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center" width="130">
              <template slot-scope="scope">{{scope.row.t_last_enddate | datetrans}}</template>
            </el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div> -->
      </el-tabs>

    </div>

  </div>
</template>


<script>
import taskExecutor from "@/components/schedule-task/taskTab/taskExecutor";
import taskMaterial from "@/components/schedule-task/taskTab/taskMaterial";
import taskData from "@/components/schedule-task/taskTab/taskData";
import taskDataFile from "@/components/schedule-task/taskTab/taskDataFile";
import taskConfirmed from "@/components/schedule-task/taskTab/taskConfirmed";
import myTask from "@/components/schedule-task/taskTab/myTask";
import finishedTask from "./taskTab/finishedTask";

export default {
  name: "taskManage",
  components: {
    finishedTask,
    taskConfirmed,
    myTask
  },
  data() {
    return {
      select_project: "", //下拉框绑定的项目号字段
      condition: "", //搜索框绑定的任务名称字段
      taskData: [], //表格数据
      deptDataFilter: [], //部门渲染数据
      empDataFilter: [], //人员渲染数据
      projectDataFilter: [], //项目渲染数据
      selection: [],
      currentRow: {},
      addTaskVisiable: false,
      setExecutorVisiable: false,
      taskModel: {},
      p_taskModel: {
        //新增子任务或编辑子任务时，某些字段存在约束
        t_period: "", //demical
        t_early_startdate: "",
        t_last_enddate: ""
      },
      executorModel: {},
      setExecutorText: "", //设置执行者的弹出框title
      addOrNot: true, //是否新增
      addTaskText: "", //新增编辑弹出框title
      project_options: [],
      dept_options: [],
      emp_options: [],
      activeName: "executor",
      activeName2: "myTask",
      // bottomDivShow: false,
      origin_options: [
        {
          value: "temp",
          label: "临时"
        },
        {
          value: "plan",
          label: "计划"
        }
      ],
      executor_rules: {
        dept_id: [
          { required: true, message: "请选择执行部门", trigger: "change" }
        ]
      },
      task_rules: {
        dept_id: [
          { required: true, message: "请选择负责部门", trigger: "change" }
        ],
        emp_id: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        t_name: [{ required: true, message: "请填写任务名称", trigger: "blur" }]
      },
      pickerOptions: {
        disabledDate: time => {
          return this.dealDisabledDate(time); //可能需要再修改
        }
      }
    };
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
    originTrans(value) {
      switch (value) {
        case "temp":
          return "临时";
          break;
        case "plan":
          return "计划";
          break;
      }
    }
  },
  methods: {
    //查找项目数据
    selectProject() {
      this.project_options = [];
      this.z_get("api/project", {}, { loading: false })
        .then(res => {
          if (res.code == 0) {
            this.project_options = res.data;
            for (var i = 0; i < this.project_options.length; i++) {
              this.project_options[i].label = this.project_options[i].p_name;
              this.project_options[i].value = this.project_options[i].p_no;
            }
          }
        })
        .catch(res => {});
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
    //查询父节点的数据
    selectPTaskModel(id) {
      this.z_get("api/task/model", { t_id: id }, { loading: false })
        .then(res => {
          if (
            res.code == 0 &&
            JSON.stringify(this.p_taskModel) != JSON.stringify(res.data)
          ) {
            this.p_taskModel = res.data;
          }
        })
        .catch(res => {});
    },
    //刷新新增及编辑任务弹出框中的负责人员信息
    refreshEmployee(deptId) {
      this.selectEmployee(deptId);
      this.$refs.form_emp_id.resetField(); //改变选中负责部门，将负责人员重置
    },
    //刷新设置执行者弹出框的人员信息
    refreshExecutorEmps(deptId) {
      this.selectEmployee(deptId);
      this.$refs.exe_emp_id.resetField(); //改变选中负责部门，将负责人员重置
    },
    //刷新任务树
    refreshData() {
      this.taskData = [];
      this.currentRow = {};
      // this.bottomDivShow = false;
      this.z_get("api/task/treeList", {
        condition: this.condition,
        p_no: this.select_project
      })
        .then(res => {
          this.deptDataFilter = res.dict.dept_id;
          this.empDataFilter = res.dict.emp_id;
          this.projectDataFilter = res.dict.p_no;
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.taskForm.resetFields();
    },
    //重置设置执行者表单
    refreshExecutorForm() {
      this.$refs.executorForm.resetFields();
    },
    //刷新
    search() {
      this.condition = "";
      this.select_project = "";
      this.refreshData();
    },
    //新增
    async addNewNode(type) {
      var t_pid = ""; //创建根节点时，若pid为空，前端后台不匹配；若pid为0，因为pid和id外键关联，后台无法插入
      var dept_id = "";
      var t_origin = "temp"; //默认任务来源为临时
      var p_no = "";
      var emp_id = "";
      if (type == "root") {
        this.addTaskText = "新增临时任务";
        let res1 = await this.selectDept(1, null); //获取所有部门
      } else if (type == "children") {
        t_origin = this.selection[0].t_origin; //获取父节点的相关属性
        t_pid = this.selection[0].t_id;
        dept_id = this.selection[0].dept_id;
        p_no = this.selection[0].p_no;
        emp_id = this.selection[0].emp_id;
        this.addTaskText = "新增[" + this.selection[0].t_name + "]的子任务";
        let res2 = await this.selectDept(2, dept_id); //获取父节点下的部门
        this.p_taskModel.t_period = this.selection[0].t_period; //新增子任务或编辑子任务时，某些字段存在约束
        this.p_taskModel.t_early_startdate = this.selection[0].t_early_startdate;
        this.p_taskModel.t_last_enddate = this.selection[0].t_last_enddate;
      }
      this.taskModel = {
        // c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        t_origin: t_origin,
        t_pid: t_pid,
        dept_id: dept_id,
        emp_id: emp_id,
        p_no: p_no
      };
      if (type == "children") {
        this.selectEmployee(dept_id); //获取部门人员信息
      }
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    //时间datePicker范围处理：暂时仅考虑父节点的时间限制(并未与Date.now()比较)
    dealDisabledDate(time) {
      if (this.taskModel.t_pid) {
        let endTime = this.p_taskModel.t_last_enddate;
        let startTime = this.p_taskModel.t_early_startdate;
        return (
          time.getTime() < new Date(startTime).getTime() ||
          time.getTime() > new Date(endTime).getTime()
        );
      } else {
        return time.getTime() < Date.now() - 8.64e7;
      }
    },
    //点击批量设置执行者
    async editExecutorShow() {
      this.executorModel = {
        dept_id: "",
        emp_id: ""
      };
      this.setExecutorText = "设置执行者";
      let res1 = await this.selectDept(1, null); //获取所有部门（需修改！！！）
      // let res2 = await this.selectDept(2, dept_id); //需获取的部门应是与该账户关联的部门支（参考OBS）
      this.setExecutorVisiable = true;
    },
    //提交设置执行者的结果1
    EditExecutor() {
      if (this.selection.length) {
        this.onEditClick(
          this.selection,
          this.executorModel.dept_id,
          this.executorModel.emp_id
        );
      }
    },
    //提交设置执行者的结果2
    onEditClick(list, deptId, empId) {
      var tIdList = [];
      for (var i = 0; i < list.length; i++) {
        //获取被编辑的任务
        tIdList.push(list[i].t_id);
      }
      this.$confirm("是否确认如上设置?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/task_release/executor", tIdList, {
            params: { deptId: deptId, empId: empId }
          })
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
              this.setExecutorVisiable = false;
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
    //重置设置执行者
    resetExecutor() {
      if (this.selection.length) {
        this.resetExecutorClick(this.selection);
      }
    },
    //发布任务
    ReleseTask(mark) {
      if (this.selection.length) {
        this.onReleaseClick(this.selection, mark);
      }
    },
    //提交发布结果
    onReleaseClick(list, mark) {
      var text = "";
      if (mark == 1) {
        text = "发布到排班";
        for (var i = 0; i < list.length; i++) {
          list[i].t_release_state = "1";
        }
      } else if (mark == 2) {
        text = "发布到个人";
        for (var i = 0; i < list.length; i++) {
          list[i].t_release_state = "2";
        }
      }
      this.$confirm("是否确认将选中项" + text + "?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/task/list", list)
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
    resetExecutorClick(list) {
      this.$confirm("是否确认重置选中项的执行者?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_put("api/task_release/resetExecutor", list)
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
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].st_id == val[0].st_id) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.taskTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //提交新增及编辑结果
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          //判断子节点任务的工期限制
          if (
            this.p_taskModel.t_period != "" &&
            this.taskModel.t_period > this.p_taskModel.t_period
          ) {
            this.$alert(
              "工期不能超过父节点任务的工期：" +
                this.p_taskModel.t_period +
                "天",
              "提示",
              {
                confirmButtonText: "确定",
                type: "warning"
              }
            );
            return;
          }
          if (this.addOrNot) {
            this.z_post("api/task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else {
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.taskModel.UpdateColumns) {
              this.z_put("api/task", this.taskModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addTaskVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                  console.log(res);
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    async editTaskShow(row) {
      this.taskModel = JSON.parse(JSON.stringify(row));
      if (!this.taskModel.t_pid) {
        let res1 = await this.selectDept(1, null); //编辑根节点：查出所有部门的数据
      } else {
        let res2 = await this.selectDept(2, this.taskModel.dept_id); //编辑子节点：查出父节点部门下的子部门
        let res3 = await this.selectPTaskModel(this.taskModel.t_pid); //获取父节点的model
      }
      this.selectEmployee(this.taskModel.dept_id);
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      //判断能否删除：
      this.taskModel = JSON.parse(JSON.stringify(row));
      if (this.taskModel.t_origin == "plan") {
        //计划任务不能删除
        this.$alert("项目计划任务无法删除", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
        return;
      }
      if (this.taskModel.t_release_state) {
        //已发布任务不能删除
        this.$alert("已发布任务无法删除", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
        return;
      }
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
    //删除需要将关联的数据一并删除，包括执行者、物料、资料需求
    onDeleteClick(list) {
      this.$confirm("是否删除？该任务及其子任务将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/task/list", { data: list })
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
    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        this.bottomDivShow = false;
      }
      this.bottomDivShow = true;
    },
    //展开所有节点
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
    //折叠所有节点
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
  },
  mounted() {
    this.selectProject();
    this.refreshData();
  }
};
</script>

<style scoped>
.taskManage {
  width: 100%;
}
.formItem {
  width: 218px;
}
.bottomLayout {
  position: relative;
}
</style>