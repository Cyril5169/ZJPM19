<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchConstraint"></el-button>
      <el-input size="small" @keyup.enter.native="refreshConstraintData" placeholder="请输入任务名称"
        v-model="constraintCondition" clearable style="width:250px;">
        <el-button size="small" @click="refreshConstraintData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewConstrainShow">新增约束
      </el-button>
      <el-button type="danger" size="small" :disabled="constraintSelection.length==0" @click="deleteListConstraint">
        删除选中约束({{constraintSelection.length}})
      </el-button>
    </div>
    <div class="gridTable">
      <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="200" :data="constraintData"
        tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="tt_name" :label="this.source=='front'?'前置任务':'后置任务'" align="center" width="200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tc_type" label="关系" align="center" width="190"></el-table-column>
        <el-table-column prop="tc_day" label="时间(天)" align="center" width="190"></el-table-column>
        <el-table-column label="操作" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editConstraintShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneConstraint(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑约束 -->
    <el-dialog v-if="addConstraintVisible" v-dialogDrag width="450px" :title="addOrNot?'新增约束':'编辑约束'"
      :close-on-click-modal="false" :visible.sync="addConstraintVisible">
      <zj-form size="small" :newDataFlag='addConstraintVisible' :model="constraintModel" label-width="100px"
        ref="constraintForm" :rules="add_rules">
        <el-form-item v-if="source=='front'" label="前置任务" prop="tt_no">
          <el-select v-model="constraintModel.tt_no" placeholder="请选择任务" :disabled="!addOrNot">
            <el-option v-for="item in taskData" :key="item.tt_no" :label="item.tt_name" :value="item.tt_no">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="后置任务" prop="tt_no">
          <el-select v-model="constraintModel.tt_pno" placeholder="请选择任务" :disabled="!addOrNot">
            <el-option v-for="item in taskData" :key="item.tt_no" :label="item.tt_name" :value="item.tt_no">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="约束类型" prop="tc_type">
          <el-select v-model="constraintModel.tc_type" placeholder="请选择约束类型">
            <el-option v-for="item in tcType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间(天)" prop="tc_day">
          <el-input class="formItem" v-model="constraintModel.tc_day" placeholder="请填写时间" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addConstraintVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskDataClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["currentRow", "source", "taskData"],
  data() {
    return {
      constraintCondition: "",
      constraintSelection: [],
      constraintData: [],
      addConstraintVisible: false,
      addOrNot: false,
      loading:false,
      constraintModel: {},
      tcType_options: [
        {
          value: "FF",
          label: "FF"
        },
        {
          value: "FS",
          label: "FS"
        },
        {
          value: "SS",
          label: "SS"
        },
        {
          value: "SF",
          label: "SF"
        }
      ],
      add_rules: {
        tt_no: [{ required: true, message: "请选择任务", trigger: "change" }],
        tc_type: [
          { required: true, message: "请选择约束类型", trigger: "change" }
        ],
        tc_day: [{ required: true, message: "请填写时间", trigger: "blur" }]
      }
    };
  },
  watch: {
    currentRow: {
      deep: true,
      immediate: true,
      handler() {
        this.searchConstraint();
      }
    }
  },
  methods: {
    refreshConstraintData() {
      this.loading = true;
      this.taskDataData = [];
      this.z_get(
        "api/template_constraint/" + this.source,
        {
          tt_no: this.currentRow.tt_no,
          condition: this.constraintCondition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.constraintData = res.data;
        })
        .catch(res => {});
    },
    searchConstraint() {
      this.constraintCondition = "";
      this.refreshConstraintData();
    },
    addNewConstrainShow() {
      if (this.taskData.length == 0) {
        this.$alert("无可选任务，请添加同一树层级的其他任务!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
        return;
      }
      this.constraintModel = {
        tt_pno: this.source == "front" ? this.currentRow.tt_no : "",
        tt_no: this.source == "front" ? "" : this.currentRow.tt_no,
        tc_type: "",
        tc_day: ""
      };
      this.addOrNot = true;
      this.addConstraintVisible = true;
    },
    editConstraintShow(row) {
      this.constraintModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addConstraintVisible = true;
    },
    onSaveTaskDataClick() {
      this.$refs.constraintForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            var isContain = false;
            for (var i = 0; i < this.constraintData.length; i++) {
              if (
                this.constraintData[i].tt_no == this.constraintModel.tt_no &&
                this.constraintData[i].tt_pno == this.constraintModel.tt_pno
              ) {
                isContain = true;
                break;
              }
            }
            if (isContain) {
              this.$alert("已存在该任务！", "提示", {
                confirmButtonText: "好的",
                type: "warning"
              });
              return;
            }
            this.z_post("api/template_constraint", this.constraintModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshConstraintData();
                this.addConstraintVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败:" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.constraintModel.UpdateColumns = this.$refs.constraintForm.UpdateColumns;
            if (this.constraintModel.UpdateColumns) {
              this.z_put("api/template_constraint", this.constraintModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshConstraintData();
                  this.addConstraintVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addConstraintVisible = false;
            }
          }
        }
      });
    },
    deleteOneConstraint(row) {
      var list = [];
      list.push(row);
      this.onDeleteConstraintClick(list);
    },
    deleteListConstraint() {
      if (this.constraintSelection.length) {
        this.onDeleteConstraintClick(this.constraintSelection);
      }
    },
    onDeleteConstraintClick(list) {
      this.$confirm("是否删除约束？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/template_constraint/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshConstraintData();
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
      this.constraintSelection = val;
    }
  }
};
</script>