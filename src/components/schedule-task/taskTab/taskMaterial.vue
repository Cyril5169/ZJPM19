<template>
  <div>
    <div class="tbar">
      <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchTaskItem"></el-button>
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
    <div class="gridTable" :style="{width:source =='plan'?'100%':'75%'}">
      <zj-table :autoHeight='autoHeight' ref="taskItemTable" v-loading="loading" style="width:100%;"
        :height="source =='plan'?'100%':200" :data="taskItemData" tooltip-effect="dark" highlight-current-row border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="55" align="center">
        </el-table-column>
        <el-table-column prop="item_name" label="物料名称" align="center" :width="source =='plan'?120:200"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="item_no" label="物料编码" align="center" :width="source =='plan'?100:150"></el-table-column>
        <el-table-column prop="ti_quantity" label="数量" align="center" :width="source =='plan'?80:100"></el-table-column>
        <el-table-column prop="unit_name" label="单位" align="center" :width="source =='plan'?80:100"></el-table-column>
        <el-table-column prop="ti_note" label="任务备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" :width="source =='plan'?100:140" prop="handle">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItemShow(scope.row)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOneItem(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </zj-table>
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
              <el-form-item label="需求数量" prop="ti_quantity">
                <el-input class="formItem2" v-model="item.ti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input class="formItem2" v-model="item.ti_note" placeholder="备注信息">
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
        <el-form-item label="需求数量" prop="ti_quantity">
          <el-input class="formItem" v-model="taskItemModel.ti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="taskItemModel.ti_note" placeholder="备注信息">
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
  props: ["currentRow", "source", "autoHeight"],
  data() {
    return {
      itemCondition: "", //任务物料需求搜索的关键字
      itemListCondition: "", //物料主文件搜索的关键字
      itemSelection: [], //选中的任务物料需求记录集合
      itemListData: [], //物料主文件的数据
      taskItemData: [], //任务物料需求记录表的数据
      taskItemModelList: [], //待提交的物料需求记录集合
      taskItemModel: {}, //从物料主文件中选中的物料实体
      unitFilter: [],
      itCodeFilter: [],
      currentPage: 1, //当前页（物料主文件）
      limit: 10, //每页最多展示的记录数
      total: 0, //查询到的总记录数
      addOrNot: false,
      addTaskItemVisible: false,
      loading: false,
      loading2: false,
      selectItemVisible: false, //是否显示新增/编辑所需物料的弹出框
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        ti_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    currentRow: {
      //当选中任务后，执行查询任务物料需求记录的方法
      deep: true,
      immediate: true,
      handler() {
        this.searchTaskItem();
      }
    }
  },
  methods: {
    //刷新任务物料需求
    refreshItemData() {
      this.loading = true;
      this.taskItemData = [];
      this.z_get(
        "api/task_item",
        {
          pp_id: this.source == "plan" ? this.currentRow.pp_id : null,
          t_id: this.currentRow.t_id,
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
    //刷新物料item表（物料主文件）
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
    //查询任务物料需求
    searchTaskItem() {
      this.itemCondition = "";
      this.refreshItemData();
    },
    //查询物料item表（物料主文件）
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    //当前选中的节点
    handleSelectionChange(val) {
      this.itemSelection = val;
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },
    //显示新增物料需求
    addNewTaskItemShow() {
      this.taskItemModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addTaskItemVisible = true;
    },
    //双击选中物料
    handleRowDbClcik(row) {
      this.taskItemModel = {
        ti_id: 0,
        pp_id: this.currentRow.pp_id,
        t_id: this.currentRow.t_id,
        item_no: row.item_no,
        item_name: row.item_name,
        ti_quantity: "",
        ti_note: "",
        ti_source: this.source
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
    //保存选中物料至待提交的任务需求物料集合/编辑任务需求物料
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
              this.z_put("api/task_item", this.taskItemModel)
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
    //提交新增的需求物料集合
    onSaveItemListClick() {
      for (var i = 0; i < this.taskItemModelList.length; i++) {
        if (!this.taskItemModelList[i].ti_quantity) {
          this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      this.z_post("api/task_item/list", this.taskItemModelList)
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
    //删除待提交的需求物料集合中的元素
    deleteSelectItem(index) {
      this.taskItemModelList.splice(index, 1);
    },
    //显示编辑任务物料需求记录的框体
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
      this.$confirm("是否删除选中的物料？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/task_item/list", { data: list })
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
.gridTable {
  flex: 1;
}
</style>