@@ -1,671 +0,0 @@
<template>
  <div class="project_group">
    <div style="margin-bottom:10px;">
      <span>选择项目：</span>
      <el-select size="small" v-model="selectProjectId" placeholder="请选择项目" @change="selProject">
        <el-option v-for="item in projectData" :key="item.p_no" :label="renderFilter(item.p_no,classFilter)"
          :value="item.p_no"></el-option>
      </el-select>
      <el-button icon="el-icon-refresh" title="刷新项目列表" size="mini" circle @click="refreshProjectData()"></el-button>
    </div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
      <el-input size="small" disabled @keyup.enter.native="refreshData" placeholder="请输入组织编号或名称" v-model="condition"
        style="width:280px;">
        <el-button disabled @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-dropdown split-button type="primary" size="small" style="margin-left:10px;" :disabled="!selectProjectId"
        @click="addNewproject_groupShow('root')">新增根节点
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="!selectProjectId" @click.native="addFromTempGroupShow('root')">从组织模板选择
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown split-button type="primary" size="small" :disabled="!currentRow.group_id"
        @click="addNewproject_groupShow('children')">
        新增子节点
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="!currentRow.group_id" @click.native="addFromTempGroupShow('children')">从组织模板选择
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
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
      <zj-table :autoHeight='bottomDivShow' height='100%' ref="project_groupTable" style="width: 100%;"
        :data="tableData" tooltip-effect="dark" highlight-current-row row-key="group_id" default-expand-all
        @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick"
        @row-dblclick="handleRowDBClick">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="wp_id" label="组织名称" align="left" width="300">
          <template slot-scope="scope">{{scope.row.wp_id | renderFilter(postDataFilter)}}</template>
        </el-table-column>

        <el-table-column prop="group_node_type" label="责任类型" align="left" width="200">
          <template slot-scope="scope">{{scope.row.group_node_type | dutyTypeFilter}}</template>
        </el-table-column>

        <el-table-column label="说明" prop="group_note" align="left"></el-table-column>
        <el-table-column label="操作" width="150" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editproject_groupShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </zj-table>
    </div>
    <div class="bottomLayout">
      <el-tabs v-model="activeName" :style="{height:bottomDivShow?'300px':'50px'}">
        <el-tab-pane label="团队组成" name="first">
          <keep-alive>
            <member v-if="bottomDivShow" :currentRow='currentRow'>
            </member>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
        @click="bottomDivShow=!bottomDivShow"></i>
    </div>
    <!-- 新增/修改组织表单 -->
    <el-dialog v-if="addproject_groupVisiable" v-dialogDrag width="450px" :title="addproject_groupText"
      :close-on-click-modal="false" :visible.sync="addproject_groupVisiable">
      <zj-form size="small" :newDataFlag='addproject_groupVisiable' :model="project_groupModel" label-width="100px"
        ref="project_groupForm" :rules="add_rules">
        <el-form-item label="组织名称" prop="wp_id">
          <!-- <el-input class="formItem" v-model="project_groupModel.wp_id" placeholder="请填写组织名称">
          </el-input> -->
          <el-select v-model="project_groupModel.wp_id" ref="select_project_group" placeholder="请选择岗位">
            <el-option v-for="item in postDataFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="group_node_type">
          <el-select v-model="project_groupModel.group_node_type" placeholder="请选择">
            <el-option v-for="item in dutyTypeOpnions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="project_groupModel.group_note"
            placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addproject_groupVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveproject_groupClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 模板选择组织结构 -->
    <el-dialog v-if="addFromTempGroupVisiable" width="700px" title="选择组织模板" :close-on-click-modal="false"
      :visible.sync="addFromTempGroupVisiable">
      <div class="tbar">
        <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchTempGroup"></el-button>
        <el-input size="small" @keyup.enter.native="refreshTempGroupData" placeholder="请输入模板名称"
          v-model="TempGroupCondition" clearable style="width:220px;">
          <el-button size="small" @click="refreshTempGroupData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
        <el-button type="primary" size="small" style="margin-left:10px;" :disabled="TempGroupSelection.length==0"
          @click="onSelectTempGroup">
          确认选择({{TempGroupSelection.length}})
        </el-button>
      </div>
      <div class="gridTable">
        <zj-table ref="TempGroupTable" style="width: 100%;" height="400" :data="TempGroupData" tooltip-effect="dark"
          highlight-current-row row-key="tg_id" default-expand-all @select="handleSelectChildren"
          @selection-change="handleSelectionChange2" @select-all="handleSelectAll2">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column prop="wp_id" label="岗位" align="left" width="220">
            <template slot-scope="scope">{{scope.row.wp_id | renderFilter(postDataFilter2)}}</template>
          </el-table-column>
          <el-table-column prop="tg_node_type" label="类型" align="left" width="100">
            <template slot-scope="scope">{{scope.row.tg_node_type | dutyTypeFilter}}</template>
          </el-table-column>
          <el-table-column prop="tg_note" label="说明" align="left" show-overflow-tooltip></el-table-column>
        </zj-table>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import member from "./project_group_member"; //  ./表示当前目录下
// import member from "@/components/schedule/project_group_member";
import { mapMutations } from "vuex";
export default {
  name: "project_group",
  components: { member },
  data() {
    return {
      selectProjectId: "",
      condition: "",
      tableData: [], //表格数据
      postDataFilter: [],
      postDataFilter2: [],
      TempGroupData: [],
      currentRow: {},
      selection: [],
      addproject_groupVisiable: false,
      addFromTempGroupVisiable: false,
      project_groupModel: {},
      addOrNot: true, //是否新增
      addproject_groupText: "",
      projectData: "",
      bottomDivShow: false,
      activeName: "first",
      TempGroupSelection: "",
      TempGroupModelList: [],
      TempGroupCondition: "",
      add_rules: {
        wp_id: [
          { required: true, message: "请选择组织名称", trigger: "change" }
        ]
      },
      dutyTypeOpnions: [
        {
          value: "person",
          label: "个人"
        },
        {
          value: "organize",
          label: "组织"
        }
      ]
    };
  },

  filters: {
    dutyTypeFilter(value) {
      switch (value) {
        case "person":
          return "个人";
          break;
        case "organize":
          return "组织";
          break;
        // default:
        //   return "个人";
        //   break;
      }
    }
  },
  methods: {
    refreshProjectData() {
      this.projectData = [];
      this.z_get("api/project")
        .then(res => {
          this.classFilter = res.dict.p_no;
          this.projectData = res.data;
          //this.console.log(projectData);
        })
        .catch(res => {});
    },
    //刷新组织树
    refreshData() {
      this.tableData = [];
      this.currentRow = {};
      this.bottomDivShow = false;
      this.z_get("api/project_group/treeList", {
        p_no: this.selectProjectId,
        condition: this.condition
      })
        .then(res => {
          this.postDataFilter = res.dict.wp_id;
          this.tableData = res.data;
        })
        .catch(res => {});
      // }
    },
    refreshTempGroupData() {
      this.loading = true;
      this.TempGroupData = [];
      this.z_get(
        "api/template_group/treeList",
        {
          condition: this.TempGroupCondition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.postDataFilter2 = res.dict.wp_id;
          this.TempGroupData = res.data;
          this.console.log(TempGroupData);
        })
        .catch(res => {});
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    searchTempGroup() {
      this.TempGroupCondition = "";
      this.refreshTempGroupData();
    },
    selProject(val) {
      this.selectProjectId = val;
      this.search();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },

    //全选选中子节点
    handleSelectAll(selection) {
      var val = this.tableData;
      var select = false; //全选还是反选
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].group_id == val[0].group_id) {
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
    handleSelectAll2(selection) {
      var val = this.TempGroupData;
      var select = false; //全选还是反选
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].tg_id == val[0].tg_id) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren2(val[i].children, select);
        }
      }
    },

    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.project_groupTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.project_groupTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },

    selectChildren2(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.TempGroupSelection.indexOf(val[i]) == -1) {
          this.$refs.TempGroupTable.toggleRowSelection(val[i]);
        } else if (!select && this.TempGroupSelection.indexOf(val[i] > -1)) {
          this.$refs.TempGroupTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //显示组织dialog
    addNewproject_groupShow(type) {
      var titleName = "";
      var group_pid = null;
      if (type == "root") {
        titleName = "";
        this.addproject_groupText = "新增根节点";
      } else if (type == "children") {
        group_pid = this.currentRow.group_id;
        titleName = this.renderFilter(
          this.currentRow.wp_id,
          this.postDataFilter
        );
        this.addproject_groupText = "新增[" + titleName + "]的子节点";
      }
      this.project_groupModel = {
        group_id: 0,
        p_no: this.selectProjectId,
        wp_id: "",
        group_pid: group_pid,
        group_node_type:"",
        group_name: "",
        group_note: ""
      };
      this.addOrNot = true;
      this.addproject_groupVisiable = true;
    },
    //保存新增/编辑组织
    onSaveproject_groupClick() {
      this.$refs.project_groupForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project_group", this.project_groupModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addproject_groupVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.project_groupModel.UpdateColumns = this.$refs.project_groupForm.UpdateColumns;
            if (this.project_groupModel.UpdateColumns) {
              this.z_put("api/project_group", this.project_groupModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addproject_groupVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addproject_groupVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑组织
    editproject_groupShow(row) {
      this.project_groupModel = JSON.parse(JSON.stringify(row));      
      this.addproject_groupText = "编辑节点";
      this.addOrNot = false;
      this.addproject_groupVisiable = true;
    },
    //删除一个组织
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除组织树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    //确认删除组织
    onDeleteClick(list) {
      this.$confirm(
        "是否删除？节点下的子节点及各节点的团队组成将一并删除！",
        "提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        }
      )
        .then(() => {
          this.z_delete("api/project_group/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败:" + res.msg, "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    //刷新组织数据
    selectproject_group() {
      this.z_get(
        "api/project_group/treeList",
        { condition: "" },
        { loading: false }
      )
        .then(res => {
          //如果不一样才赋值
          if (
            JSON.stringify(this.project_groupData) != JSON.stringify(res.data)
          ) {
            this.project_groupData = res.data;
          }
        })
        .catch(res => {});
    },

    //从组织模板添加
    addFromTempGroupShow(type) {
      var titleName = "";
      var group_pid = null;
      if (type == "root") {
        titleName = "";
        this.addproject_groupText = "新增根节点";
      } else if (type == "children") {
        group_pid = this.currentRow.group_id;
        titleName = this.renderFilter(
          this.currentRow.wp_id,
          this.postDataFilter
        );
        this.addproject_groupText = "新增[" + titleName + "]的子节点";
      }
      this.project_groupModel = {
        group_id: 0,
        group_pid: group_pid,
        wp_id: "",
        p_no: this.selectProjectId,
        group_node_type: "",
        group_name: "",
        group_note: ""
      };
      this.addOrNot = true;
      this.refreshTempGroupData();
      this.addFromTempGroupVisiable = true;
    },
    //确认添加任务
    onSelectTempGroup() {
      this.TempGroupModelList = [];
      for (var i = 0; i < this.TempGroupSelection.length; i++) {
        var select = this.TempGroupSelection[i];
        //var level = "";
        var pid = this.project_groupModel.group_pid; //所有最顶层的节点的父节点
        if (!select.tg_pid) {
          //选中最顶层
          //level = "组织";
        } else {
          //level = "个人";
          var fartherNode = this.TempGroupSelection.filter(
            item => item.tg_id == select.tg_pid
          ); //看是否有父节点选中，没有这个就是最顶层
          if (fartherNode.length) {
            pid = select.tg_pid;
          }
        }
        var oneTemp = {
          group_id: select.tg_id, //后台重新赋值
          group_pid: pid, //后台重新赋值
          wp_id: select.wp_id,
          p_no: this.selectProjectId,
          group_node_type: select.tg_node_type,
          group_name: "",
          group_note: select.tg_note
        };
        this.TempGroupModelList.push(oneTemp);
      }
      this.z_post("api/project_group/list", this.TempGroupModelList, {
        params: { pid: this.project_groupModel.group_pid }
      })
        .then(res => {
          this.$message({
            message: "新增成功!",
            type: "success",
            duration: 1000
          });
          this.refreshData();
          this.addFromTempGroupVisiable = false;
        })
        .catch(res => {
          this.$alert("新增失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },

    //双击选择组织
    handleSelectTreeDblClick(data) {
      this.project_groupModel.group_id = data.group_id;
      this.project_groupModel.group_name = data.group_name;
      this.$refs.select_project_group.blur();
    },
    //当前选中的节点
    handleSelectionChange2(val) {
      this.TempGroupSelection = val;
    },
    handleSelectChildren(selection, row) {
      if (selection) {
        //勾选选中子节点
      } else {
        //取消选中父节点
      }
    },
    //点击组织行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
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
    this.refreshProjectData();
    if (this.$route.params.projectNo) {
      this.selectProjectId = this.$route.params.projectNo;
      this.refreshData();
    }
  }
};
</script>

<style scoped>
.project_group {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.gridTable {
  flex: 1;
}
.bottomLayout {
  position: relative;
}
</style>