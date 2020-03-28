<template>
  <div class="standard-task">
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
      <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
        style="width:250px;">
        <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow('root')">新增根节点
      </el-button>
      <el-button type="primary" size="small" :disabled="!currentRow.st_id" @click="addNewTaskShow('children')">
        新增子节点
      </el-button>
      <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
        删除选中节点({{selection.length}})
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
      <zj-table :autoHeight='bottomDivShow' height='100%' ref="taskTable" style="width: 100%;" :data="taskData"
        tooltip-effect="dark" highlight-current-row row-key="st_id" default-expand-all
        @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick"
        @row-dblclick="handleRowDBClick">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="st_name" label="任务名称" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dept_id" label="部门" align="center" width="180">
          <template slot-scope="scope">{{scope.row.dept_id | renderFilter(dict.dept_id)}}</template>
        </el-table-column>
        <el-table-column prop="st_period" label="工期(天)" align="center" width="100"></el-table-column>
        <el-table-column prop="st_type" label="类别" align="center" width="100">
          <template slot-scope="scope">{{scope.row.st_type | renderFilter(dict.st_type)}}</template>
        </el-table-column>
        <el-table-column prop="st_note" label="说明" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="140" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </zj-table>
    </div>

    <div class="bottomLayout">
      <el-tabs v-model="activeName" :style="{height:bottomDivShow?'300px':'50px'}">
        <el-tab-pane label="物料需求" name="first">
          <keep-alive>
            <taskItem v-if="bottomDivShow" :currentRow='currentRow' source='standard'></taskItem>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="资料需求" name="second">
          <keep-alive>
            <taskDataComponent v-if="bottomDivShow" :currentRow='currentRow' source='standard'>
            </taskDataComponent>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
        @click="bottomDivShow=!bottomDivShow"></i>
    </div>

    <!-- 新增/修改任务表单 -->
    <el-dialog v-if="addTaskVisiable" v-dialogDrag width="450px" :title="addTaskText" :close-on-click-modal="false"
      :visible.sync="addTaskVisiable">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="taskModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <el-form-item label="所属部门" prop="dept_id">
          <el-select v-model="taskModel.dept_id" ref="select_dept" placeholder="请选择部门">
            <el-option :label="taskModel.dept_name" :value="taskModel.dept_id" style="height:auto;padding:0;">
              <el-tree :data="deptData" node-key="dept_id" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="taskModel.dept_id">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.dept_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="st_name">
          <el-input class="formItem" v-model="taskModel.st_name" placeholder="请填写任务名称">
          </el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select v-model="taskModel.st_type" placeholder="请选择任务类型">
            <el-option v-for="item in dict.st_type" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工期(天)" prop="st_period">
          <el-input class="formItem" v-model="taskModel.st_period" placeholder="请填写工期" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskModel.st_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import taskItem from "./common/taskItem";
import taskDataComponent from "./common/taskData";

export default {
  name: "standard-task",
  data() {
    return {
      condition: "",
      taskData: [], //表格数据
      dict: [], //字典渲染数据
      deptData: [], //部门数据
      selection: [], //选中行数据
      currentRow: {},
      addTaskVisiable: false,
      bottomDivShow: false,
      taskModel: {},
      addOrNot: true, //是否新增
      addTaskText: "",
      activeName: "first",
      add_rules: {
        dept_id: [{ required: true, message: "请选择部门", trigger: "change" }],
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      }
    };
  },
  components: {
    taskItem,
    taskDataComponent
  },
  watch: {
    addTaskVisiable(val) {
      if (val) {
        this.searchDept();
      }
    }
  },
  methods: {
    //刷新任务树
    refreshData() {
      this.taskData = [];
      this.currentRow = {};
      this.bottomDivShow = false;
      this.z_get("api/standard_task/treeList", { condition: this.condition })
        .then(res => {
          this.dict = res.dict;
          this.taskData = res.data;
        })
        .catch(res => {});
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.taskData;
      var select = false; //全选还是反选
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
    //显示任务dialog
    addNewTaskShow(type) {
      var titleName = "";
      var st_pid = null;
      if (type == "root") {
        titleName = "";
        this.addTaskText = "新增根节点";
      } else if (type == "children") {
        st_pid = this.currentRow.st_id;
        titleName = this.currentRow.st_name;
        this.addTaskText = "新增[" + titleName + "]的子节点";
      }
      this.taskModel = {
        st_id: 0,
        st_pid: st_pid,
        dept_id: "",
        dept_name: "",
        st_name: "",
        st_type: "task",
        st_period: "",
        st_note: ""
      };
      this.addOrNot = true;
      this.addTaskVisiable = true;
    },
    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/standard_task", this.taskModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.taskModel.UpdateColumns) {
              this.z_put("api/standard_task", this.taskModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addTaskVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTaskVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editTaskShow(row) {
      this.taskModel = JSON.parse(JSON.stringify(row));
      this.taskModel.dept_name = this.renderFilter(
        this.taskModel.dept_id,
        this.dict.dept_id
      );
      this.addTaskText = "编辑节点";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },
    //删除一个任务
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除任务树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除任务
    onDeleteClick(list) {
      this.$confirm(
        "是否删除？节点下的子节点及各节点的物料与资料需求将一并删除！",
        "提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }
      )
        .then(() => {
          this.z_delete("api/standard_task/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              var msg = res.msg;
              if (msg.indexOf("FK") > -1) msg = "该数据已被使用，无法删除";
              this.$alert("删除失败:" + msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //刷新部门数据
    searchDept() {
      this.z_get("api/dept/tree", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.deptData) != JSON.stringify(res.data)) {
            this.deptData = res.data;
          }
        })
        .catch(res => {});
    },
    //双击选择部门
    handleSelectTreeDblClick(data) {
      this.taskModel.dept_id = data.dept_id;
      this.taskModel.dept_name = data.dept_name;
      this.$refs.select_dept.blur();
    },
    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
      //this.bottomDivShow = true;
    },
    handleRowDBClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
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
    this.refreshData();
    this.searchDept();
  }
};
</script>

<style scoped>
.standard-task {
  width: 1100px;
}
.formItem2 {
  width: 200px;
}
.gridTable {
  flex: 1;
}
.bottomLayout {
  position: relative;
}
</style>