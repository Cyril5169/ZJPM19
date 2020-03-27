<template>
  <div class="projectList">
    <el-container>
      <el-aside class="asideContent" width='230px'>
        <div class="leftTop">
          <el-card class="leftCard" shadow="never">
            <div slot="header">
              <span>项目状态</span>
            </div>
            <div class="leftCardBody">
              <ul class="statusList">
                <li><i class="el-icon-timer"></i><span>已创建</span>
                  <el-badge :value="statusCountData.create_count"
                    :type="statusCountData.create_count == 0?'info':'danger'" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>执行中</span>
                  <el-badge :value="statusCountData.execute_count"
                    :type="statusCountData.execute_count == 0?'info':'warning'" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>暂停中</span>
                  <el-badge :value="statusCountData.pause_count" type="info" class="statusCount"></el-badge>
                </li>
                <li><i class="el-icon-timer"></i><span>已结束</span>
                  <el-badge :value="statusCountData.finish_count"
                    :type="statusCountData.finish_count == 0?'info':'success'" class="statusCount"></el-badge>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
        <div class="leftBottom">
          <el-card class="leftCard" shadow="never">
            <div slot="header">
              <span>项目分类</span>
              <el-button icon="el-icon-refresh" style="float: right;" title="刷新" size="mini" circle
                @click="refreshClassData">
              </el-button>
            </div>
            <div class="leftCardBody">
              <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current class="classTree">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
                  @click="handleSelectTreeClick(data)">
                  <img style="width:16px;" src="../../assets/img/tag.png" />
                  <span style="margin-left:3px;">{{data.pc_name}}</span>
                  <el-badge class="classCount" :type="getClassCount(data.pc_no) >0 ?'primary':'info'"
                    :value="getClassCount(data.pc_no)"></el-badge>
                </div>
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-main class="mainContent">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProject"></el-button>
          <el-input size="small" @keyup.enter.native="refreshProjectData" placeholder="请输入模板名称"
            v-model="projectCondition" clearable style="width:250px;">
            <el-button size="small" @click="refreshProjectData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewProjectShow">新增项目
          </el-button>
          <el-button type="danger" size="small" :disabled="projectSelection.length==0" @click="deleteListProject">
            删除选中项目({{projectSelection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <el-table height='100%' ref="projectTable" v-loading="loading" style="width:100%;" :data="projectData"
            tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="p_no" label="项目号" align="center" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="p_name" label="项目名称" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="pc_no" label="所属分类" align="center" width="120" sortable show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.pc_no | renderFilter(classFilter)}}</template>
            </el-table-column>
            <el-table-column prop="p_salesman" label="业务员" width="100" align="center">
              <template slot-scope="scope">{{scope.row.p_salesman | renderFilter(employeeFilter)}}</template>
            </el-table-column>
            <el-table-column prop="p_manager" label="项目经理" width="100" align="center">
              <template slot-scope="scope">{{scope.row.p_manager | renderFilter(employeeFilter)}}</template>
            </el-table-column>
            <el-table-column prop="p_status" label="项目状态" align="center" width="100">
              <template slot-scope="scope">{{scope.row.p_status | statusFilter}}</template>
            </el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑项目信息" placement="top-start">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editProjectShow(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑项目计划" placement="top-start">
                  <el-button type="primary" icon="el-icon-s-grid" size="mini" circle @click="toDetail(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneProject(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!-- 添加/编辑项目 -->
    <el-dialog v-if="addProjectVisible" v-dialogDrag width="700px" :title="addOrNot?'新建项目':'编辑项目'"
      :close-on-click-modal="false" :visible.sync="addProjectVisible">
      <zj-form size="small" :newDataFlag='addProjectVisible' :model="projectModel" label-width="100px" ref="projectForm"
        :rules="add_rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="项目编号" prop="p_no">
              <el-input style="width:200px;" v-model="projectModel.p_no" placeholder="请填写项目号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="项目名称" prop="p_name">
              <el-input style="width:200px;" v-model="projectModel.p_name" placeholder="请填写项目名称">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="客户名称" prop="c_no">
              <el-select style="width:200px;" filterable v-model="projectModel.c_no" placeholder="请选择客户">
                <el-option v-for="item in customerFilter" :key="item.value" :label="item.display" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="项目分类" prop="pc_no">
              <el-select v-model="projectModel.pc_no" ref="select_class" placeholder="请选择所属分类">
                <el-option :label="projectModel.pc_name" :value="projectModel.pc_no" style="height:auto;padding:0;">
                  <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all
                    :expand-on-click-node="false" highlight-current :current-node-key="projectModel.pc_no">
                    <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                      @click="handleSelectTreeClick2(data)">
                      {{data.pc_name}}</div>
                  </el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="内部合同编号" prop="ccd_id">
              <el-input style="width:200px;" v-model="projectModel.ccd_id" placeholder="请填写内部合同编号">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="产品名称" prop="item_no">
              <el-select style="width:200px;" filterable v-model="projectModel.item_no" placeholder="请选择产品">
                <el-option v-for="item in productData" :key="item.item_no" :label="item.item_name"
                  :value="item.item_no">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="业务员" prop="p_salesman">
              <el-select style="width:200px;" filterable v-model="projectModel.p_salesman" placeholder="请选择业务员">
                <el-option v-for="item in employeeFilter" :key="item.value" :label="item.display" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="项目经理" prop="p_manager">
              <el-select style="width:200px;" filterable v-model="projectModel.p_manager" placeholder="请选择项目经理">
                <el-option v-for="item in employeeFilter" :key="item.value" :label="item.display" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="计划开始时间" prop="p_plan_startdate">
              <el-date-picker style="width:200px;" value-format="yyyy-MM-dd" v-model="projectModel.p_plan_startdate"
                placeholder="请选择计划开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <el-form-item label="计划结束时间" prop="p_plan_enddate">
              <el-date-picker style="width:200px;" value-format="yyyy-MM-dd" v-model="projectModel.p_plan_enddate"
                placeholder="请选择计划开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目状态" prop="p_status">
          <el-select style="width:200px;" v-model="projectModel.p_status" placeholder="请选择项目状态">
            <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目备注" prop="p_note">
          <el-input style="width:530px;" type="textarea" :rows="3" v-model="projectModel.p_note" placeholder="项目备注">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addProjectVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveProjectClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classData: [],
      projectData: [],
      selectClass: {},
      projectCondition: "",
      statusCountData: {},
      classCountData: [],
      loading: false,
      projectSelection: [],
      classFilter: [],
      employeeFilter: [],
      customerFilter: [],
      productData: [],
      projectModel: {},
      addOrNot: false,
      addProjectVisible: false,
      status_options: [
        {
          value: "create",
          label: "创建"
        },
        {
          value: "execute",
          label: "执行中"
        },
        {
          value: "pause",
          label: "暂停中"
        },
        {
          value: "finish",
          label: "完结"
        }
      ],
      add_rules: {
        p_no: [{ required: true, message: "请填写项目号", trigger: "blur" }],
        p_name: [
          { required: true, message: "请填写项目名称", trigger: "blur" }
        ],
        pc_no: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        c_no: [{ required: true, message: "请选择客户", trigger: "change" }],
        item_no: [{ required: true, message: "请选择产品", trigger: "change" }],
        p_salesman: [
          { required: true, message: "请选择业务员", trigger: "change" }
        ],
        p_manager: [
          { required: true, message: "请选择项目经理", trigger: "change" }
        ],
        p_status: [
          { required: true, message: "请选择项目状态", trigger: "change" }
        ]
      }
    };
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case "create":
          return "创建";
          break;
        case "execute":
          return "执行中";
          break;
        case "pause":
          return "暂停";
          break;
        case "finish":
          return "完结";
          break;
      }
    }
  },
  watch: {
    addProjectVisible(val) {
      if (val) {
        this.refreshProductData();
      }
    }
  },
  methods: {
    refreshClassData() {
      this.classData = [];
      this.selectClass = {};
      this.searchProject();
      this.z_get("api/project_classification/treeList")
        .then(res => {
          this.classData = res.data;
        })
        .catch(res => {});
    },
    refreshProjectData() {
      this.loading = true;
      this.projectData = [];
      this.z_get(
        "api/project",
        {
          pc_no: this.selectClass.pc_no,
          condition: this.projectCondition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.classFilter = res.dict.pc_no;
          this.employeeFilter = res.dict.p_salesman;
          this.customerFilter = res.dict.c_no;
          this.projectData = res.data;
        })
        .catch(res => {});
      //状态角标
      this.z_get("api/project/statusCount", {}, { loading: false })
        .then(res => {
          this.statusCountData = res.data[0];
        })
        .catch(res => {});
      //分类项目数
      this.z_get(
        "api/project_classification/classCount",
        {},
        { loading: false }
      )
        .then(res => {
          this.classCountData = res.data;
        })
        .catch(res => {});
    },
    refreshProductData() {
      this.productData = [];
      this.z_get("api/item/product", {}, { loading: false })
        .then(res => {
          this.productData = res.data;
        })
        .catch(res => {});
    },
    searchProject() {
      this.projectCondition = "";
      this.refreshProjectData();
    },
    addNewProjectShow() {
      this.projectModel = {
        p_no: "",
        p_name: "",
        c_no: "",
        pc_no: this.selectClass.pc_no ? this.selectClass.pc_no : "",
        pc_name: this.selectClass.pc_name ? this.selectClass.pc_name : "",
        ccd_id: "",
        item_no: "",
        p_salesman: "",
        p_manager: "",
        p_plan_startdate: "",
        p_plan_enddate: "",
        p_status: "create",
        p_note: ""
      };
      this.addOrNot = true;
      this.addProjectVisible = true;
    },
    editProjectShow(row) {
      this.projectModel = JSON.parse(JSON.stringify(row));
      this.projectModel.pc_name = this.renderFilter(
        this.projectModel.pc_no,
        this.classFilter
      );
      this.addOrNot = false;
      this.addProjectVisible = true;
    },
    onSaveProjectClick() {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project", this.projectModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshProjectData();
                this.addProjectVisible = false;
              })
              .catch(res => {
                var msg = res.msg;
                if (msg.indexOf("重复键") > -1) msg = "已存在该项目号";
                this.$alert("新增失败!" + msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.projectModel.UpdateColumns = this.$refs.projectForm.UpdateColumns;
            if (this.projectModel.UpdateColumns) {
              this.z_put("api/project", this.projectModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshProjectData();
                  this.addProjectVisible = false;
                })
                .catch(res => {
                  var msg = res.msg;
                  if (msg.indexOf("重复键") > -1) msg = "已存在该项目号";
                  this.$alert("编辑失败!" + msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addProjectVisible = false;
            }
          }
        }
      });
    },
    deleteOneProject(row) {
      var list = [];
      list.push(row);
      this.onProjectDeleteClick(list);
    },
    deleteListProject() {
      if (this.projectSelection.length) {
        this.onProjectDeleteClick(this.projectSelection);
      }
    },
    onProjectDeleteClick(list) {
      this.$confirm("是否删除该项目?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/project/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshProjectData();
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
    //选中的分类
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchProject();
    },
    //选择分类
    handleSelectTreeClick2(data) {
      this.projectModel.pc_no = data.pc_no;
      this.projectModel.pc_name = data.pc_name;
      this.$refs.select_class.blur();
    },
    handleSelectionChange(val) {
      this.projectSelection = val;
    },
    getClassCount(pc_no) {
      var count = 0;
      var oneClass = this.classCountData.filter(item => item.pc_no == pc_no);
      if (oneClass.length) {
        count = oneClass[0].class_count;
      }
      return count;
    },
    //跳转路由
    toDetail(row) {
      this.$router.push({
        name: "schedule/baseSchedule",
        params: {
          projectNo: row.p_no
        }
      });
    }
  },
  mounted() {
    this.refreshClassData();
    this.searchProject();
  }
};
</script>>

<style scoped>
.projectList {
  width: 1200px;
}
.asideContent {
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.leftTop {
  width: 100%;
  flex: 1;
}
.leftBottom {
  width: 100%;
  height: 450px;
}
.leftCard {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.leftCardBody {
  flex: 1;
  overflow-y: auto;
}
.statusList {
  margin: 5px;
}
.statusList li {
  height: 30px;
  margin-left: 10px;
}
.statusList li span {
  margin-left: 3px;
  color: #606266;
}
.statusCount {
  float: right;
  margin-right: 10px;
}
.classCount {
  float: right;
  margin-top: 5px;
}
.mainContent {
  border-left: 5px solid #eee;
  padding: 0 0 0 10px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.gridTable {
  flex: 1;
}
</style>
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
.leftCard .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>