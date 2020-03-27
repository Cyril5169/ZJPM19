<template>
  <div class="item-items">
    <div class="containALL">
      <div class="topLayout">

        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入物料名称" v-model="condition" clearable
            style="width:250px;">
            <el-button size="small" @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewItemShow">新增
          </el-button>
          <el-button type="primary" size="small">导入
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中节点({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <el-table ref="itemTable" style="width: 100%;" :data="itemData" tooltip-effect="dark"
            highlight-current-row border row-key="item_no" default-expand-all @selection-change="handleSelectionChange"
             >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column prop="item_no" label="物料编码" width="120" sortable  align="center"></el-table-column>
            <el-table-column prop="item_name" label="物料名称" align="center" show-overflow-tooltip  sortable ></el-table-column>

            <el-table-column prop="item_unit" label="单位" align="center"  width="80">
              <template slot-scope="scope">{{scope.row.item_unit | renderFilter(unitFilter)}}</template>
            </el-table-column>

            <el-table-column prop="auxiliary_unit" label="辅助单位" align="center"  width="120">
              <template slot-scope="scope">{{scope.row.auxiliary_unit | renderFilter(unitFilter)}}</template>
            </el-table-column>

            
            <el-table-column prop="item_specification" label="规格" align="center" width="100"></el-table-column>
            <el-table-column prop="item_brand" label="品牌" align="center" width="100"></el-table-column>
            <el-table-column prop="item_weight" label="重量" align="center" width="55"></el-table-column>
            
            

            <el-table-column prop="it_1code" label="大类" align="center" width="100">
              <template slot-scope="scope">{{scope.row.it_1code | renderFilter(ITDataFilter1)}}</template>
            </el-table-column>
            <el-table-column prop="it_2code" label="中类" align="center" width="100">
              <template slot-scope="scope">{{scope.row.it_2code | renderFilter(ITDataFilter2)}}</template>
            </el-table-column>
            <el-table-column prop="it_3code" label="小类" align="center" width="100">
              <template slot-scope="scope">{{scope.row.it_3code | renderFilter(ITDataFilter2)}}</template>
            </el-table-column>

            <el-table-column label="操作" width="109" prop="handle" align="center">
              <template slot-scope="scope">

                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTaskShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>

      <!-- 新增物料 -->
      <el-dialog v-dialogDrag width="450px" :title="addItemText" :close-on-click-modal="false"
        :visible.sync="addItemVisiable" top="5vh" >
        <zj-form size="small" :newDataFlag='addItemVisiable' :model="itemModel" label-width="100px" ref="itemForm"
          :rules="add_rules">
          <el-form-item label="物料名称" prop="item_name" >
            <el-input class="formItem" v-model="itemModel.item_name" placeholder="请填写任务名称">
            </el-input>
          </el-form-item>

          
          <el-form-item label="单位" prop="item_unit">
            <el-select class="formItem" v-model="itemModel.item_unit"  placeholder="请选择单位">
              <el-option v-for="item in Unitcode_options" :key="item.cc_code" :label="item.cc_name"
                :value="item.cc_code">
              </el-option>
            </el-select>
          </el-form-item>
          

          <el-form-item label="辅助单位" prop="auxiliary_unit">
            <el-select class="formItem" v-model="itemModel.auxiliary_unit"  placeholder="请选择辅助单位">
              <el-option v-for="item in Unitcode_options" :key="item.cc_code" :label="item.cc_name"
                :value="item.cc_code">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="规格" prop="item_specification">
            <el-input class="formItem" v-model="itemModel.item_specification" placeholder="请填写规格">
            </el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="item_brand">
            <el-input class="formItem" v-model="itemModel.item_brand" placeholder="请填写品牌">
            </el-input>
          </el-form-item>
          <el-form-item label="重量" prop="item_weight">
            <el-input class="formItem" v-model="itemModel.item_weight" placeholder="请填写重量">
            </el-input>
          </el-form-item>

          <el-form-item label="所属大类" prop="it_1code">
            <el-select v-model="itemModel.it_1code" ref="select_IT" placeholder="请选择大类名称">
              <el-option :label="itemModel.it_1name" :value="itemModel.it_1code" style="height:auto;padding:0;">
                <el-tree :data="itemTypeData" node-key="it_id" ref="tree" default-expand-all
                  :expand-on-click-node="false" highlight-current :current-node-key="itemTypeData.it_id">
                  <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                    @click="handleSelectTreeDblClick(data)">
                    {{data.it_name}}</div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属中类" prop="it_2code">
            <el-select v-model="itemModel.it_2code" ref="select_IT2" placeholder="请选择中类名称">
              <el-option :label="itemModel.it_2name" :value="itemModel.it_2code" style="height:auto;padding:0;">
                <el-tree :data="itemTypeData2" node-key="it_id" ref="tree" default-expand-all
                  :expand-on-click-node="false" highlight-current :current-node-key="itemTypeData2.it_id">
                  <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                    @click="handleSelectTreeDblClick2(data)">
                    {{data.it_name}}</div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属小类" prop="it_3code">
            <el-select v-model="itemModel.it_3code" ref="select_IT3" placeholder="请选择小类名称">
              <el-option :label="itemModel.it_3name" :value="itemModel.it_3code" style="height:auto;padding:0;">
                <el-tree :data="itemTypeData3" node-key="it_id" ref="tree" default-expand-all
                  :expand-on-click-node="false" highlight-current :current-node-key="itemTypeData3.it_id">
                  <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                    @click="handleSelectTreeDblClick3(data)">
                    {{data.it_name}}</div>
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="小类" prop="it_3code">
            <el-input class="formItem" v-model="itemModel.it_3code" placeholder="">
            </el-input>
          </el-form-item> -->

          <el-form-item style="text-align:center;margin-right:100px;">
            <el-button size="medium" @click="addItemVisiable = false">取&nbsp;&nbsp;消</el-button>
            <el-button type="primary" size="medium" @click="onSaveTaskClick" style="margin-left:30px;">
              保&nbsp;&nbsp;存
            </el-button>
          </el-form-item>
        </zj-form>
      </el-dialog>
    </div>

  </div>
</template>
    

    <script>
export default {
  name: "item",
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",

      unitFilter:[],//单位渲染

      itemCondition: "",
      itemListCondition: "",
      dataCondition: "",
      itemData: [], //物料数据
      itemTypeData: [], //物料类型数据
      itemTypeData2: [],
      itemTypeData3: [],

      Unitcode_options:[],

      ITDataFilter1: [], //物料类型渲染数据
      ITDataFilter2: [],
      ITDataFilter3: [],
      itemTypeCode1: "",
      itemTypeCode2: "",

      itemModel: {},
      item_typeModel: {},

      itemDataFilter: [],

      selection: [], //选中行数据

      addItemVisiable: false,

      addOrNot: true, //是否新增

      addItemText: "",
      addTaskItemText: "",

      activeName: "first",

      add_rules: {
        item_name: [
          { required: true, message: "请填写物料名称", trigger: "blur" }
        ],
        // item_brand: [
        //   { required: true, message: "请填写物料品牌", trigger: "blur" }
        // ],
        it_1code: [
          { required: true, message: "选择物料大类", trigger: "change" }
        ],
        item_unit: [
          { required: true, message: "选择单位", trigger: "change" }
        ]
      }
    };
  },

  watch: {
    addItemVisiable(val) {
      if (val) {
        this.selectItem_type1();
        this.selectItem_type2();
        this.selectItem_type3();
      }
    }
  },
  methods: {
    //刷新物料信息
    refreshData() {
      this.itemData = [];
      this.z_get("api/item", { condition: this.condition })
        .then(res => {
          this.itemData = res.data;
          this.unitFilter = res.dict.item_unit;          
          this.ITDataFilter1 = res.dict.it_1code;
          this.ITDataFilter2 = res.dict.it_1code;
          this.ITDataFilter3 = res.dict.it_1code;
        })
        .catch(res => {});
    },

 
    selectUnitcode_options() {
      this.Unitcode_options = [];      
      this.z_get("api/common_code", { ct_id: 3, condition: "" })
        .then(res => {
          this.Unitcode_options = res.data;
        })
        .catch(res => {});
    },

    selectItem_type1() {
      var conditionIT1 = "selectItemTypeCode1";
      this.itemTypeData3 = [];
      this.itemTypeData2 = [];
        this.z_get(
          "api/item_type",
          { condition: conditionIT1 },
          { loading: false }
        )
          .then(res => {
            //如果不一样才赋值
            if (JSON.stringify(this.itemTypeData) != JSON.stringify(res.data)) {
              this.itemTypeData = res.data;
            }
          })
          .catch(res => {});
    },

    selectItem_type2() {
      var conditionIT2 = "selectItemTypeCode2" + this.itemModel.it_1code;
      this.itemTypeData3 = [];
      this.z_get(
        "api/item_type",
        { condition: conditionIT2 },
        { loading: false }
      )
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.itemTypeData2) != JSON.stringify(res.data)) {
            this.itemTypeData2 = res.data;
          }
        })
        .catch(res => {});
    },

    selectItem_type3() {
      var conditionIT3 = "selectItemTypeCode3" + this.itemModel.it_2code;
      this.z_get(
        "api/item_type",
        { condition: conditionIT3 },
        { loading: false }
      )
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.itemTypeData2) != JSON.stringify(res.data)) {
            this.itemTypeData3 = res.data;
          }
        })
        .catch(res => {});
    },

    //重置表单

    search() {
      this.condition = "";
      this.refreshData();
      this.selectUnitcode_options();
    },

    //当前选中的节点
    handleSelectionChange(val) {
      this.selection = val;
    },


    //显示任务dialog
    addNewItemShow() {
      this.addItemText = "新增物料";
      this.itemModel = {
        item_no: "",
        item_name: "",
        item_unit: "",
        auxiliary_unit: "",
        item_specification: "",
        item_brand: "",
        item_weight: "",
        it_1code: "",
        it_2code: "",
        it_3code: "",
        it_1name: "",
        it_2name: "",
        it_3name: ""
      };
      this.addOrNot = true;
      this.addItemVisiable = true;
    },

    //保存新增/编辑任务
    onSaveTaskClick() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/item", this.itemModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addItemVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.itemModel.UpdateColumns = this.$refs.itemForm.UpdateColumns;
            if (this.itemModel.UpdateColumns) {
              this.z_put("api/item", this.itemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addItemVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addItemVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑任务
    editTaskShow(row) {
      this.itemModel = JSON.parse(JSON.stringify(row));
      this.itemModel.it_1name = this.renderFilter(
        this.itemModel.it_1code,        
        this.ITDataFilter1,        
      );

      this.itemModel.it_2name = this.renderFilter(
        this.itemModel.it_2code,
        this.ITDataFilter2
      );

      this.itemModel.it_3name = this.renderFilter(
        this.itemModel.it_3code,
        this.ITDataFilter3
      );

      this.addItemText = "编辑物料";
      this.addOrNot = false;
      this.addItemVisiable = true;
    },

    //双击选择大中小物料类型
    handleSelectTreeDblClick(data) {
      this.itemModel.it_1code = data.it_code;
      this.itemModel.it_1name = data.it_name;
      this.itemModel.it_2code = "";
      this.itemModel.it_2name = "";
      this.itemModel.it_3code = "";
      this.itemModel.it_3name = "";

      this.$refs.select_IT.blur();
      this.selectItem_type2();
    },

    handleSelectTreeDblClick2(data) {
      this.itemModel.it_2code = data.it_code;
      this.itemModel.it_2name = data.it_name;
      this.itemModel.it_3code = "";
      this.itemModel.it_3name = "";
      this.$refs.select_IT2.blur();
      this.selectItem_type3();
    },

    handleSelectTreeDblClick3(data) {
      this.itemModel.it_3code = data.it_code;
      this.itemModel.it_3name = data.it_name;
      this.$refs.select_IT3.blur();
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
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/item/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.refreshData();
    this.selectItem_type1();
    this.selectUnitcode_options();
  }
};
</script>


<style scoped>
.item-items {
  width: 1250px;
}

/* .containAll {
  width: 1100px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  box-sizing: border-box;
  background-color: #eeeeee;
} */

.tbar {
  margin-bottom: 10px;
  padding-left: 10px;
}
.formItem {
  width: 300px;
}

.gridTable {
  flex: 1;
}

</style>





