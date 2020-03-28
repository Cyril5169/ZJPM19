<template>
  <div class="shift_group">
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
      <el-input size="small" @keyup.enter.native="refreshHead" placeholder="请输入班次名称" v-model="condition" clearable
        style="width:250px;">
        <el-button size="small" @click="refreshHead" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskShow">新增班次组
      </el-button>
    </div>
    <div class="gridTable">
      <zj-table :autoHeight='bottomDivShow' height='100%' ref="shiftGroupTable" style="width: 100%;" :data="taskData"
        tooltip-effect="dark" highlight-current-row row-key="st_id" default-expand-all
        @selection-change="handleSelectionChange" @select-all="handleSelectAll" @row-click="handleRowClick"
        @row-dblclick="handleRowDBClick">
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
        <!-- <el-table-column prop="st_id" label="任务编号" align="center" width="150"></el-table-column> -->
        <el-table-column prop="sg_id" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="sg_name" label="班次名称" align="center" width="200"></el-table-column>
        <el-table-column prop="sg_note" label="班次说明" align="center" width="200"></el-table-column>
        <el-table-column label="操作"  prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="onDeleteClick(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </zj-table>
    </div>

    <div class="bottomLayout">
      <el-tabs v-model="activeName" :style="{height:bottomDivShow?'300px':'50px'}">
        <el-tab-pane label="班次明细" name="first">
          <keep-alive>
            <div v-if="bottomDivShow" >
              <div class="tbar">
                <!-- <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button> -->
                <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewDayShiftShow">新增班次明细
                </el-button>
              </div>
              <div>
                <el-table ref="DayShiftTable" v-loading="loading" style="width:100%;" height="200" :data="DayShiftData"
                  tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                  <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                  <el-table-column type="index" width="40" align="center">
                  </el-table-column>

                  <el-table-column prop="ds_name" label="班次名称" align="center" width="80"></el-table-column>
                  <el-table-column prop="ds_starttime" label="开始时间" align="center" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.ds_starttime|dateFilter("HH:mm")}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ds_endtime" label="结束时间" align="center" width="80">
                    <template slot-scope="scope">
                      <span>{{ scope.row.ds_endtime|dateFilter("HH:mm")}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="is_report" label="是否报工" align="center" width="120">
                    <template slot-scope="scope">
                      <span>{{ scope.row.is_report|yesOrNo("是否")}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ds_period" label="时长" align="center" ></el-table-column>
                  <el-table-column label="操作" width="140" prop="handle">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
                      </el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle
                        @click="deleteOneItem(scope.row)">
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </keep-alive>

        </el-tab-pane>
      </el-tabs>
      <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
        @click="bottomDivShow=!bottomDivShow"></i>
    </div>

    <!-- 新增/修改班次组 -->
    <el-dialog v-if="addTaskVisiable" v-dialogDrag width="450px" :title="addTaskText" :close-on-click-modal="false"
      :visible.sync="addTaskVisiable">
      <zj-form size="small" :newDataFlag='addTaskVisiable' :model="shiftGroupModel" label-width="100px" ref="taskForm"
        :rules="add_rules">
        <el-form-item label="班次组名称" prop="sg_name">
          <el-input class="formItem" v-model="shiftGroupModel.sg_name" placeholder="班次组名称">
          </el-input>
        </el-form-item>
        <el-form-item label="班次说明" prop="sg_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="shiftGroupModel.sg_note" placeholder="说明信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTaskVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增班次明细 -->
    <el-dialog width="350px" :title="addDayShiftText" :close-on-click-modal="false"
      :visible.sync="addDayShiftVisible">
      <el-form size="small" :newDataFlag='addDayShiftVisible' :model="DayShiftModel" label-width="100px"
        ref="DayShiftForm">
        <el-form-item label="班次名称" prop="ds_name">
          <el-input class="shiftformItem" v-model="DayShiftModel.ds_name" placeholder="班次名称(早，中，晚，全白...)">
          </el-input>
        </el-form-item>

        <el-form-item label="开始时间" prop="ds_starttime">
          <el-time-select class="shiftformItem" placeholder="起始时间" v-model="starttime" format="HH:mm"  
          :picker-options="{
            start: '06:00',
             step: '00:15',
             end: '23:30',
          }">
          </el-time-select>
        </el-form-item>

        <el-form-item label="结束时间" prop="ds_endtime">
          <el-time-select class="shiftformItem" placeholder="结束时间" v-model="endtime" :picker-options="{
             start: '06:00',
             step: '00:15',
             end: '23:30',
             minTime: starttime}">
          </el-time-select>
        </el-form-item>

        <el-form-item label="是否报工" prop="is_report">
          <el-checkbox v-model="DayShiftModel.is_report">是</el-checkbox>

        </el-form-item>
        <el-form-item label="时长" prop="ds_period">
          {{timeRange(starttime,endtime) }}h
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:10px;">
          <el-button size="medium" @click="addDayShiftVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDayShiftClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "shift_group",
  data() {
    return {
      bottomDivShow: false,
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      taskData: [], //表格数据
      DayShiftData: [], //物料
      selection: [], //选中行数据
      itemSelection: [],
      dataSelection: [],
      currentRow: {},
      addTaskVisiable: false,
      addDayShiftVisible: false,
      addTaskDataVisible: false,

      bottomDataShow: false,
      shiftGroupModel: {},
      DayShiftModel: {},
      DayShiftModelList: [],

      addOrNot: true, //是否新增
      addTaskText: "",
      addDayShiftText: "",
      addTaskDataText: "",
      activeName: "first",
      loading: false,
      loading2: false,
      loading3: false,
      starttime: "06:00",
      endtime: "12:00",
      add_rules: {
        st_name: [
          { required: true, message: "请填写任务名称", trigger: "blur" }
        ],
        st_period: [{ required: true, message: "请填写工期", trigger: "blur" }]
      },
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        sti_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      },

    };
  },
  filters: {
  },
  //   watch: {
  //     addTaskVisiable(val) {
  //       if (val) {
  //         this.selectDept();
  //       }
  //     }
  //   },
  //  computed: {

  //   },
  methods: {
    timeRange(val1, val2) {
      this.DayShiftModel.ds_period = ((new Date("2020-01-01 " + val2) - new Date("2020-01-01 " + val1)) / 1000 / 60 / 60).toFixed(2);
      return ((new Date("2020-01-01 " + val2) - new Date("2020-01-01 " + val1)) / 1000 / 60 / 60).toFixed(2)
    },
    //刷新任务树
    refreshHead() {
      this.bottomDivShow = false;
      this.taskData = [];
      this.currentRow = {};
      this.bottomDataShow = false;

      this.z_get("api/shift_group", { condition: this.condition })
        .then(res => {

          this.taskData = res.data;
        })
        .catch(res => { });
    },
    //刷新班次明细
    refreshItemData() {
      this.loading = true;
      this.DayShiftData = [];
      this.z_get(
        "api/day_shift",
        { sg_id: this.currentRow.sg_id },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.DayShiftData = res.data;
        })
        .catch(res => { });
    },


    search() {
      this.condition = "";
      this.refreshHead();
    },
    searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },

    searchData() {
      this.dataCondition = "";

    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleSelectionChange2(val) {
      this.itemSelection = val;
    },
    handleSelectionChange3(val) {
      this.dataSelection = val;
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
          this.$refs.shiftGroupTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.shiftGroupTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //显示任务dialog
    addNewTaskShow() {
      //var titleName = "";

      this.addTaskText = "新增班次组";
      this.shiftGroupModel = {
        st_id: 0,
        st_name: "",
        st_period: "",
        st_note: ""
      };
      this.addOrNot = true;
      this.starttime = "08:00",
        this.endtime = "18:00",
        this.addTaskVisiable = true;
    },
    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/shift_group", this.shiftGroupModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshHead();
                this.addTaskVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.shiftGroupModel.UpdateColumns = this.$refs.taskForm.UpdateColumns;
            if (this.shiftGroupModel.UpdateColumns) {
              this.z_put("api/shift_group", this.shiftGroupModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshHead();
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
      this.shiftGroupModel = JSON.parse(JSON.stringify(row));
      this.shiftGroupModel.dept_name = this.renderFilter(
        this.shiftGroupModel.dept_id,

      );
      this.addTaskText = "编辑班次";
      this.addOrNot = false;
      this.addTaskVisiable = true;
    },

    //确认删除班次组
    onDeleteClick(row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/shift_group", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshHead();
            })
            .catch(res => {
              this.$alert("删除失败", "不能删除已经使用的班次！", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => { });
    },

    //显示新增班次明细
    addNewDayShiftShow() {
      this.DayShiftModel = {
        ds_id: 0,
        sg_id: this.currentRow.sg_id,
        ds_name: "",
        ds_starttime: new Date(),
        ds_endtime: new Date(),
        is_report: 0,
        ds_period: 0,
      };
      this.starttime = "08:00";
      this.endtime = "18:00";
      this.addDayShiftText = "新增班次";
      this.addOrNot = true;
      this.addDayShiftVisible = true;
    },
    //保存/编辑选中班次
    onSaveDayShiftClick() {
      let config = {
        params: {
          starttime: this.starttime,
          endtime: this.endtime
        }
      }
      this.$refs.DayShiftForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/day_shift", this.DayShiftModel, config)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshItemData();
                this.addDayShiftVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });

          } else {
            //修改

            this.z_put("api/day_shift", this.DayShiftModel, config)
              .then(res => {
                this.$message({
                  message: "编辑成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshItemData();
                this.addDayShiftVisible = false;
              })
              .catch(res => {
                this.$alert("编辑失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });

          }
        }
      });
    },

    //显示编辑班次明细
    editItemShow(row) {
      this.DayShiftModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.addDayShiftText = "编辑班次明细";
      this.addDayShiftVisible = true;
      this.starttime = this.dateFilter(this.DayShiftModel.ds_starttime, "HH:mm");
      this.endtime = this.dateFilter(this.DayShiftModel.ds_endtime, "HH:mm");
    },


    //确认删除班次明细
    deleteOneItem(row) {
      this.$confirm("是否删除物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/day_shift", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshItemData();
            })
            .catch(res => {
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => { });
    },


    //点击任务行显示下面
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载tab数据

        this.refreshItemData();
      }
      this.bottomDataShow = true;
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


    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;

    },
    //删除选中的班次
    deleteSelectItem(index) {
      this.DayShiftModelList.splice(index, 1);
    }
  },
  mounted() {
    this.refreshHead();

  }
};
</script>

<style scoped>
.shift_group {
  width: 650px;
}
.gridTable {
  flex: 1;
}
.bottomLayout {
  position: relative;
}
.shiftformItem{
  width: 120px;
}
</style>