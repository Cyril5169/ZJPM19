<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItem"></el-button>
      <el-input size="small" @keyup.enter.native="refreshItemData" placeholder="请输入物料名称" v-model="itemCondition"
        clearable style="width:250px;">
        <el-button size="small" @click="refreshItemData" slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
      <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTaskItemShow">新增物料需求
      </el-button>
      <el-button type="danger" size="small" :disabled="itemSelection.length==0" @click="deleteListItem">
        删除选中物料({{itemSelection.length}})
      </el-button>
    </div>
    <div class="gridTable">
      <el-table ref="taskItemTable" v-loading="loading" style="width:100%;" height="200" :data="taskItemData"
        tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" width="40" align="center">
        </el-table-column>
        <el-table-column prop="item_name" label="物料名称" align="center" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="item_no" label="物料编码" align="center" width="130"></el-table-column>
        <el-table-column prop="sti_quantity" label="数量" align="center" width="90"></el-table-column>
        <el-table-column prop="unit_name" label="单位" align="center" width="100"></el-table-column>
        <el-table-column prop="sti_note" label="任务备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="140" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneItem(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增物料需求 -->
    <el-dialog :width=" taskItemModelList.length? '1000px':'550px'" title="新增物料需求" :close-on-click-modal="false"
      :visible.sync="addTaskItemVisible">
      <div class="transferDiv">
        <div class="leftTransferItem">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchItemList"></el-button>
            <el-input size="small" @keyup.enter.native="refreshItemListData" placeholder="请输入物料编码/名称"
              v-model="itemListCondition" clearable style="width:250px;">
              <el-button size="small" @click="refreshItemListData" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div>
            <span style="color:gray;font-size:12px;">*双击选择物料</span>
            <el-table ref="itemListTable" v-loading="loading2" style="width:100%;" height="300" :data="itemListData"
              tooltip-effect="dark" @row-dblclick="handleRowDbClcik" border stripe>
              <el-table-column prop="item_no" label="物料编码" align="center" width="100"></el-table-column>
              <el-table-column prop="item_name" label="物料名称" align="center" width="120" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="item_unit" label="单位" align="center" width="80">
                <template slot-scope="scope">{{scope.row.item_unit | renderFilter(unitFilter)}}</template>
              </el-table-column>
              <el-table-column prop="auxiliary_unit" label="辅助单位" align="center" width="80">
                <template slot-scope="scope">{{scope.row.auxiliary_unit | renderFilter(unitFilter)}}</template>
              </el-table-column>
              <el-table-column prop="item_specification" label="规格" align="center" width="100" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="item_brand" label="品牌" align="center" width="100" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="item_weight" label="重量" align="center" width="55"></el-table-column>
              <el-table-column prop="it_1code" label="大类" align="center" width="100">
                <template slot-scope="scope">{{scope.row.it_1code | renderFilter(itCodeFilter)}}</template>
              </el-table-column>
              <el-table-column prop="it_2code" label="中类" align="center" width="100">
                <template slot-scope="scope">{{scope.row.it_2code | renderFilter(itCodeFilter)}}</template>
              </el-table-column>
              <el-table-column prop="it_3code" label="小类" align="center" width="100">
                <template slot-scope="scope">{{scope.row.it_3code | renderFilter(itCodeFilter)}}</template>
              </el-table-column>
            </el-table>
            <div style="margin:0 15%;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="limit"
                layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
        <div class="rightTransferItem" v-if="taskItemModelList.length">
          <fieldset class="oneItem" v-for="(item,index) in taskItemModelList" :key="index">
            <legend>物料{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectItem(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="80px" :rules="addItem_rules">
              <el-form-item label="物料编码" prop="item_na0">
                <el-input class="formItem2" v-model="item.item_no" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="物料名称" prop="item_name">
                <el-input class="formItem2" v-model="item.item_name" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="需求数量" prop="sti_quantity">
                <el-input class="formItem2" v-model="item.sti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input class="formItem2" v-model="item.sti_note" placeholder="备注信息">
                </el-input>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="taskItemModelList.length">
          <el-button size="medium" @click="addTaskItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveItemListClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择/修改物料 -->
    <el-dialog v-if="selectItemVisible" v-dialogDrag width="450px" :title="addOrNot?'新增物料需求':'编辑物料需求'"
      :close-on-click-modal="false" :visible.sync="selectItemVisible">
      <zj-form size="small" :newDataFlag='selectItemVisible' :model="taskItemModel" label-width="100px"
        ref="taskItemForm" :rules="addItem_rules">
        <el-form-item label="需求数量" prop="sti_quantity">
          <el-input class="formItem" v-model="taskItemModel.sti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskItemModel.sti_note" placeholder="备注信息">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="selectItemVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTaskItemClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["currentRow", "source"],
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      itemCondition: "",
      itemListCondition: "",
      loading: false,
      loading2: false,
      unitFilter: [],
      itCodeFilter: [],
      taskItemData: [],
      itemListData: [],
      itemSelection: [],
      taskItemModel: {},
      taskItemModelList: [],
      addTaskItemVisible: false,
      selectItemVisible: false,
      addOrNot: true,
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        sti_quantity: [
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
        this.searchItem();
      }
    }
  },
  methods: {
    //刷新物料需求
    refreshItemData() {
      this.loading = true;
      this.taskItemData = [];
      this.z_get(
        "api/standard_task_item",
        {
          st_id: this.source == "standard" ? this.currentRow.st_id : null,
          tt_no: this.currentRow.tt_no,
          condition: this.itemCondition,
          source: this.source
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.taskItemData = res.data;
        })
        .catch(res => {});
    },
    //刷新物料item表
    refreshItemListData() {
      this.loading2 = true;
      this.itemListData = [];
      this.z_get(
        "api/item/page",
        {
          condition: this.itemListCondition,
          page: this.currentPage,
          limit: this.limit
        },
        { loading: false }
      )
        .then(res => {
          this.loading2 = false;
          this.itCodeFilter = res.dict.it_1code;
          this.unitFilter = res.dict.item_unit;
          this.itemListData = res.data;
          this.total = res.total;
        })
        .catch(res => {});
    },
    searchItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    //显示新增物料需求
    addNewTaskItemShow() {
      this.taskItemModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addTaskItemVisible = true;
    },
    //保存/编辑选中物料
    onSaveTaskItemClick() {
      this.$refs.taskItemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.taskItemModelList.push(
              JSON.parse(JSON.stringify(this.taskItemModel))
            );
            this.selectItemVisible = false;
          } else {
            //修改
            this.taskItemModel.UpdateColumns = this.$refs.taskItemForm.UpdateColumns;
            if (this.taskItemModel.UpdateColumns) {
              this.z_put("api/standard_task_item", this.taskItemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshItemData();
                  this.selectItemVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.selectItemVisible = false;
            }
          }
        }
      });
    },
    //保存新增物料需求
    onSaveItemListClick() {
      for (var i = 0; i < this.taskItemModelList.length; i++) {
        if (!this.taskItemModelList[i].sti_quantity) {
          this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      this.z_post("api/standard_task_item/list", this.taskItemModelList)
        .then(res => {
          this.$message({
            message: "新增成功!",
            type: "success",
            duration: 1000
          });
          this.addTaskItemVisible = false;
          this.refreshItemData();
        })
        .catch(res => {
          this.$alert("新增失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //显示编辑物料需求
    editItemShow(row) {
      this.taskItemModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.selectItemVisible = true;
    },
    //删除一个物料需求
    deleteOneItem(row) {
      var list = [];
      list.push(row);
      this.onDeleteItemClick(list);
    },
    //删除多个物料需求
    deleteListItem() {
      if (this.itemSelection.length) {
        this.onDeleteItemClick(this.itemSelection);
      }
    },
    //确认删除物料需求
    onDeleteItemClick(list) {
      this.$confirm("是否删除物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/standard_task_item/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshItemData();
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
      this.itemSelection = val;
    },
    //双击选中物料
    handleRowDbClcik(row) {
      this.taskItemModel = {
        sti_id: 0,
        st_id: this.currentRow.st_id,
        tt_no: this.currentRow.tt_no,
        item_no: row.item_no,
        item_name: row.item_name,
        sti_quantity: "",
        sti_note: "",
        sti_source: this.source
      };
      var isContain = false;
      for (var i = 0; i < this.taskItemData.length; i++) {
        if (this.taskItemData[i].item_no == this.taskItemModel.item_no) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.taskItemModelList.length; i++) {
        if (this.taskItemModelList[i].item_no == this.taskItemModel.item_no) {
          isContain = true;
          break;
        }
      }
      if (isContain) {
        this.$alert("已存在该物料!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
      } else {
        this.addOrNot = true;
        this.selectItemVisible = true;
      }
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },
    //删除选中的物料
    deleteSelectItem(index) {
      this.taskItemModelList.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 500px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 350px;
  height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.oneItem {
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.bottomButton {
  text-align: center;
  margin: 10px 0;
}
</style>