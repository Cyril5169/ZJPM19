<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchData"></el-button>
      <el-input size="small" @keyup.enter.native="refreshDataData" placeholder="请输入物料名称" v-model="dataCondition"
        clearable style="width:250px;">
        <el-button size="small" @click="refreshDataData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskDataShow">新增资料需求
      </el-button>
      <el-button type="danger" size="small" :disabled="dataSelection.length==0" @click="deleteListData">
        删除选中资料({{dataSelection.length}})
      </el-button>
    </div>
    <div class="gridTable">
      <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="200" :data="taskDataData"
        tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号"  width="55" align="center">
        </el-table-column>
        <el-table-column prop="td_name" label="资料名称" align="center" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ddt_id" label="资料类型" align="center" width="130">
          <template slot-scope="scope">{{scope.row.ddt_id | renderFilter(dataTypeFilter)}}</template>
        </el-table-column>
        <el-table-column prop="td_type" label="需求类型" align="center" width="130">
          <template slot-scope="scope">{{scope.row.td_type | tdTypeFilter}}</template>
        </el-table-column>
        <el-table-column prop="td_quantity" label="数量(份)" align="center" width="90"></el-table-column>
        <el-table-column prop="td_note" label="资料说明" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="140" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskDataShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneData(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑资料需求 -->
    <el-dialog v-if="addTaskDataVisible" v-dialogDrag width="450px" :title="addOrNot?'新增资料需求':'编辑资料需求'"
      :close-on-click-modal="false" :visible.sync="addTaskDataVisible">
      <zj-form size="small" :newDataFlag='addTaskDataVisible' :model="taskDataModel" label-width="100px"
        ref="taskDataForm" :rules="addData_rules">
        <el-form-item label="资料名称" prop="td_name">
          <el-input class="formItem" v-model="taskDataModel.td_name" placeholder="请填写资料名称">
          </el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="ddt_id">
          <el-select v-model="taskDataModel.ddt_id" placeholder="请选择资料类型">
            <el-option v-for="item in dataTypeFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类型" prop="td_type">
          <el-select v-model="taskDataModel.td_type" placeholder="请选择需求类型">
            <el-option v-for="item in tdType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求数量" prop="td_quantity">
          <el-input class="formItem" v-model="taskDataModel.td_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskDataModel.td_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskDataVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskDataClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["currentRow","source"],
  data() {
    return {
      dataCondition: "",
      dataSelection: [],
      taskDataData: [],
      dataTypeFilter: [],
      taskDataModel: {},
      addOrNot: true,
      addTaskDataVisible: false,
      loading: false,
      tdType_options: [
        {
          value: "input",
          label: "输入"
        },
        {
          value: "output",
          label: "输出"
        }
      ],
      addData_rules: {
        td_name: [
          { required: true, message: "请填写资料名称", trigger: "blur" }
        ],
        ddt_id: [
          { required: true, message: "请选择资料类型", trigger: "change" }
        ],
        td_type: [
          { required: true, message: "请选择需求类型", trigger: "change" }
        ],
        td_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    currentRow: {
      deep: true,
      immediate: true,
      handler() {
        this.searchData();
      }
    }
  },
  filters: {
    tdTypeFilter(value) {
      switch (value) {
        case "input":
          return "输入";
          break;
        case "output":
          return "输出";
          break;
      }
    }
  },
  methods: {
    //刷新资料需求
    refreshDataData() {
      this.loading = true;
      this.taskDataData = [];
      this.z_get(
        "api/task_data",
        {
          t_id: this.currentRow.t_id,
          condition: this.itemCondition,
          source: this.source 
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.dataTypeFilter = res.dict.ddt_id;  
          this.taskDataData = res.data;
        })
        .catch(res => {});
    },
    searchData() {
      this.dataCondition = "";
      this.refreshDataData();
    },
    //显示新增资料需求
    addNewTaskDataShow() {
      this.taskDataModel = {
        td_id: 0,
        t_id: this.currentRow.t_id,
        ddt_id: "", //是否是漏了
        td_name: "",
        td_note: "",
        td_quantity: "",
        td_type: "",
        td_source: this.source,
        td_isdone:0,
      };
      this.addOrNot = true;
      this.addTaskDataVisible = true;
    },
    //新增/编辑资料需求
    onSaveTaskDataClick() {
      this.$refs.taskDataForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task_data", this.taskDataModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshDataData();
                this.addTaskDataVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.taskDataModel.UpdateColumns = this.$refs.taskDataForm.UpdateColumns;
            if (this.taskDataModel.UpdateColumns) {
              this.z_put("api/task_data", this.taskDataModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshDataData();
                  this.addTaskDataVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTaskDataVisible = false;
            }
          }
        }
      });
    },
    //显示编辑资料
    editTaskDataShow(row) {
      this.taskDataModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addTaskDataVisible = true;
    },
    //删除单个资料需求
    deleteOneData(row) {
      var list = [];
      list.push(row);
      this.onDeleteDataClick(list);
    },
    //删除多个资料需求
    deleteListData() {
      if (this.dataSelection.length) {
        this.onDeleteDataClick(this.dataSelection);
      }
    },
    //确认删除资料需求
    onDeleteDataClick(list) {
      this.$confirm("是否删除资料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/task_data/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshDataData();
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
    //当前选中的节点
    handleSelectionChange(val) {
      this.dataSelection = val;
    }
  }
};
</script>

<style scoped>
</style>