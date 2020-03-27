<template>
  <div class="tClassFormPanel">
    <div class="tbar">
      <el-button
        icon="el-icon-refresh"
        title="刷新"
        size="mini"
        circle
        @click="search"
      ></el-button>
      <el-input
        @keyup.enter.native="refreshData"
        v-model="condition"
        placeholder="请输入任务类型名称"
        style="width:300px;"
        size="small"
      >
        <el-button
          @click="refreshData"
          slot="append"
          icon="el-icon-search"
          size="small"
          >搜索</el-button
        >
      </el-input>

      <el-button
        type="primary"
        style="margin-left:10px;"
        @click="addNewTClass"
        size="small"
        >新增</el-button
      >
    </div>
    <div class="gridTable">
      <zj-table
        :data="tableData"
        height="100%"
        :autoHeight="bottomDivShow"
        border
        style="width:100% "
        default-expand-all
        highlight-current-row
        row-key="type_code"
        @row-click="handleRowClick"
        tooltip-effect="dark"
      >
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="type_code"
          label="任务分类ID"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="任务分类名称"
          width="150"
          align="center"
        >
        </el-table-column>

        <el-table-column
          prop="type_note"
          label="任务分类说明"
          width="529"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <!--<el-button size="mini"
              >详情</el-button>-->

            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="editTClassShow(scope.row)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleteOne(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </zj-table>
    </div>

    <!--任务分类页签-->
    <div class="bottomLayout">
      <el-tabs
        v-model="activeName"
        :style="{ height: bottomDivShow ? '300px' : '50px' }"
      >
        <el-tab-pane label="页签定义" name="first">
          <div v-if="bottomDivShow">
            <div class="tbar">
              <el-button
                icon="el-icon-refresh"
                title="刷新"
                size="mini"
                circle
                @click="searchItem"
              ></el-button>

              <el-input
                size="small"
                @keyup.enter.native="refreshTabData"
                placeholder="请输入页签名称"
                v-model="tabCondition"
                clearable
                style="width:250px;"
              >
                <el-button
                  size="small"
                  @click="refreshTabData"
                  slot="append"
                  icon="el-icon-search"
                  >搜索</el-button
                >
              </el-input>

              <el-button
                type="primary"
                size="small"
                style="margin-left:10px;"
                @click="addNewTab"
                >添加
              </el-button>
            </div>
            <div class="gridTable">
              <el-table
                v-loading="loading"
                style="width:100%;"
                height="200"
                :data="typeTabData"
                tooltip-effect="dark"
                highlight-current-row
                border
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="80"
                  align="center"
                ></el-table-column>

                <el-table-column
                  prop="ttt_code"
                  label="页签名称"
                  align="center"
                  width="814"
                >
                  <template slot-scope="scope">{{
                    scope.row.ttt_code | renderFilter(tttFilter)
                  }}</template>
                </el-table-column>

                <el-table-column label="操作" width="185" align="center">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      circle
                      @click="editTabShow(scope.row)"
                    >
                    </el-button>

                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      circle
                      @click="deleteOneTab(scope.row)"
                    >
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <i
        class="splitButton"
        :class="[bottomDivShow ? 'el-icon-caret-bottom' : 'el-icon-caret-top']"
        @click="bottomDivShow = !bottomDivShow"
      ></i>
    </div>

    <el-dialog
      :title="addTClassText"
      :visible.sync="tClassFormVisible"
      width="500px"
      close-on-click-model="false"
      @closed="refreshForm"
    >
      <zj-form
        :newDataFlag="tClassFormVisible"
        :model="tClassModel"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="width:400px"
        ref="tClassForm"
      >
        <el-form-item label="任务分类ID" prop="type_code">
          <el-input
            v-model="tClassModel.type_code"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="任务分类名称" prop="type_name">
          <el-input
            v-model="tClassModel.type_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="任务分类说明">
          <el-input
            v-model="tClassModel.type_note"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </zj-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="tClassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveTClassClick('tClassForm')"
          >保 存</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      v-dialogDrag
      width="450px"
      :title="addTabText"
      :close-on-click-modal="false"
      :visible.sync="tabFormVisible"
      top="5vh"
    >
      <zj-form
        size="small"
        :newDataFlag="tabFormVisible"
        :model="tabModel"
        label-width="100px"
        ref="tabForm"
        :rules="tab_rules"
      >
        <el-form-item label="页签名称" prop="ttt_code">
          <el-select v-model="tabModel.ttt_code" placeholder="请选择页签">
            <el-option
              v-for="item in tabcode_options"
              :key="item.cc_code"
              :label="item.cc_name"
              :value="item.cc_code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="tabFormVisible = false"
            >取&nbsp;&nbsp;消</el-button
          >
          <el-button
            type="primary"
            size="medium"
            @click="onSaveTabClick('tabForm')"
            style="margin-left:30px;"
          >
            保&nbsp;&nbsp;存
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
      tClassModel: {},
      tabModel: {},

      tabFormVisible: false,
      tClassFormVisible: false,

      condition: "",
      tabCondition: "",

      addTClassText: "",
      addTabText: "",

      tableData: [],
      typeTabData: [],

      activeName: "first",
      bottomDivShow: false,

      tttFilter: [], //页签名称渲染
      tabcode_options: [],

      loading: false,
      currentRow: {},

      addOrNot: true,
      tab_rules: {
        ttt_code: [
          { required: true, message: "页签名称不能为空", trigger: "blur" }
        ]
      },
      rules: {
        //新增用户校验规则
        type_code: [
          { required: true, message: "任务分类ID不能为空", trigger: "blur" }
        ],
        type_name: [
          { required: true, message: "任务分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },

  

  methods: {
    refreshData() {
      this.tableData = [];
      this.currentRow = {};
      this.z_get("api/task_type/list", { condition: this.condition })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(res => {});
    },

    refreshTabData() {
      this.loading = true;
      this.typeTabData = [],
      this.z_get(
        "api/task_type_tab/list",
        { type_code: this.currentRow.type_code, condition: this.tabCondition },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.tttFilter = res.dict.ttt_code;
          this.typeTabData = res.data;
        })
        .catch(res => {});
    },

    // refreshBottom() {
    //   this.tabCondition = "";
    //   this.typeTabData = [];    
    //   this.bottomDivShow = false;
    // },

    

    addNewTClass() {
      this.tClassFormVisible = true;
      this.addOrNot = true;
      this.addTClassText = "新增任务分类";
      this.tClassModel = {
        //type_code: "0",
        type_name: "",
        type_note: ""
      };
    },

    addNewTab() {
      this.tabFormVisible = true;
      this.addOrNot = true;
      this.addTabText = "新增任务类型页签";
      this.tabModel = {
        type_code: this.currentRow.type_code,
        ttt_code: ""
      };
    },

    //重置表单
    refreshForm() {
      this.$refs.tClassForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
      this.selectTabcode_options();
    },

    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载tab数据
        //this.refreshBottom();
        this.refreshTabData();
      }
      this.bottomDivShow = true;
    },

    searchItem() {
      this.tabCondition = "";
      this.refreshTabData();
    },

    //新增页签表单种选择页签名称
    selectTabcode_options() {
      this.tabcode_options = [];
      this.z_get("api/common_code", { ct_id: 7, condition: "" })
        .then(res => {
          this.tabcode_options = res.data;
        })
        .catch(res => {});
    },

    //编辑数据
    editTClassShow(row) {
      this.tClassModel = JSON.parse(JSON.stringify(row));
      this.addTClassText = "编辑任务分类信息";
      this.addOrNot = false;
      this.tClassFormVisible = true;
    },

    //显示编辑页签表单
    editTabShow(row) {
      this.tabModel = JSON.parse(JSON.stringify(row));
      this.tabModel.tab_name = this.renderFilter(
        this.tabModel.tab_id,
        this.tabDataFilter
      );

      this.addTabText = "编辑页签信息";
      this.addOrNot = false;
      this.tabFormVisible = true;
    },

    //删除一个任务分类

    deleteOne(row) {
      this.z_delete("api/task_type", { data: row })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.refreshData();
        })
        .catch(res => {
          this.$alert("操作失败:" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          console.log(res);
        });
    },

    deleteOneTab(row) {
      this.z_delete("api/task_type_tab", { data: row })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.refreshTabData();
        })
        .catch(res => {
          this.$alert("操作失败:" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          console.log(res);
        });
    },

    onSaveTClassClick() {
      this.$refs.tClassForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task_type", this.tClassModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.tClassFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.tClassModel.UpdateColumns = this.$refs.tClassForm.UpdateColumns;
            console.log(this.tClassModel);
            if (this.tClassModel.UpdateColumns) {
              this.z_put("api/task_type", this.tClassModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.tClassFormVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTClassVisible = false;
            }
          }
        } else {
          return false;
        }
      });
    },

    onSaveTabClick() {
      this.$refs.tabForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task_type_tab", this.tabModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                ;
                this.refreshTabData();
                this.tabFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.tabModel.UpdateColumns = this.$refs.tabForm.UpdateColumns;
            if (this.tabModel.UpdateColumns) {
              this.z_put("api/task_type_tab", this.tabModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshTabData();
                  this.tabFormVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              return false;
            }
          }
        }
      });
    }
  },

  mounted() {
    this.refreshData();
    this.refreshTabData();
    this.selectTabcode_options();
  }
};
</script>

<style scoped>
.tClassFormPanel {
  /*position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;*/
  width: 1100px;
}

.gridTable {
  flex: 1;
}
</style>
