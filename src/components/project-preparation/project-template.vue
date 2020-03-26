<template>
  <div class="project-template">
    <el-container>
      <el-aside width="220px" style="padding-right:10px;">
        <el-card style="height:100%;box-sizing:border-box;" shadow="never">
          <div slot="header">
            <span>项目分类</span>
            <el-button icon="el-icon-refresh" style="float: right;" title="刷新" size="mini" circle
              @click="refreshClassData">
            </el-button>
          </div>
          <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
            highlight-current class="classTree">
            <div slot-scope="{node, data}" style="width:100%;user-select:none;height:30px;line-height: 30px;"
              @click="handleSelectTreeClick(data)">
              <img style="width:16px;" src="../../assets/img/tag.png" />
              <span style="margin-left:3px;">{{data.pc_name}}</span>
            </div>
          </el-tree>
        </el-card>
      </el-aside>
      <el-main class="mainContent">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchTemplate"></el-button>
          <el-input size="small" @keyup.enter.native="refreshTemplateData" placeholder="请输入模板名称" v-model="condition"
            clearable style="width:250px;">
            <el-button size="small" @click="refreshTemplateData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewTemplateShow">新增模板
          </el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">
            删除选中模板({{selection.length}})
          </el-button>
        </div>
        <div class="gridTable">
          <zj-table :autoHeight='bottomDivShow' height='100%' ref="templateTable" v-loading="loading"
            style="width:100%;" :data="projectTemplateData" tooltip-effect="dark" highlight-current-row border
            @selection-change="handleSelectionChange" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="pt_name" label="模板名称" align="center" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="pt_note" label="模板说明" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pc_no" label="所属分类" align="center" width="150" sortable show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.pc_no | renderFilter(classFilter)}}</template>
            </el-table-column>
            <el-table-column prop="create_user" label="创建人" align="center" width="100"></el-table-column>
            <el-table-column prop="create_date" label="创建时间" align="center" width="100">
              <template slot-scope="scope">
                {{scope.row.create_date | dateFilter}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" prop="handle">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑模板信息" placement="top-start">
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editTemplateShow(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑模板详情" placement="top-start">
                  <el-button type="primary" icon="el-icon-s-grid" size="mini" circle @click="toDetail(scope.row)">
                  </el-button>
                </el-tooltip>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </zj-table>
        </div>
        <div class="bottomLayout">
          <el-tabs v-model="activeName" :style="{height:bottomDivShow?'310px':'50px'}">
            <el-tab-pane label="模板产品" name="first">
              <div v-if="bottomDivShow">
                <div class="tbar">
                  <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchProduct"></el-button>
                  <el-input size="small" @keyup.enter.native="refreshProductData" placeholder="请输入物料名称"
                    v-model="conditionProduct" clearable style="width:250px;">
                    <el-button size="small" @click="refreshProductData" slot="append" icon="el-icon-search">搜索
                    </el-button>
                  </el-input>
                  <el-button type="primary" size="small" style="margin-left:10px;" @click="addProductShow">新增模板产品
                  </el-button>
                  <el-button type="danger" size="small" :disabled="productSelection.length==0"
                    @click="deleteListProduct">
                    删除选中产品({{productSelection.length}})
                  </el-button>
                </div>
                <div class="gridTable">
                  <el-table ref="productTable" v-loading="loading3" style="width:100%;" height="200" :data="productData"
                    tooltip-effect="dark" highlight-current-row border @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="40" align="center">
                    </el-table-column>
                    <el-table-column prop="item_name" label="物料名称" align="center" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="item_no" label="物料编码" align="center" width="130"></el-table-column>
                    <el-table-column prop="pti_quantity" label="数量" align="center" width="90"></el-table-column>
                    <el-table-column prop="item_unit" label="单位" align="center" width="100"></el-table-column>
                    <el-table-column prop="pti_note" label="备注" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" width="140" prop="handle">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" circle
                          @click="editProductShow(scope.row)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle
                          @click="deleteOneProduct(scope.row)">
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <i class="splitButton" :class="[bottomDivShow?'el-icon-caret-bottom':'el-icon-caret-top']"
            @click="bottomDivShow=!bottomDivShow"></i>
        </div>
      </el-main>
    </el-container>

    <!-- 添加/编辑模板 -->
    <el-dialog v-if="addTemplateVisible" v-dialogDrag width="450px" :title="addOrNot?'新增模板':'编辑模板'"
      :close-on-click-modal="false" :visible.sync="addTemplateVisible">
      <zj-form size="small" :newDataFlag='addTemplateVisible' :model="templateModel" label-width="100px"
        ref="templateForm" :rules="add_rules">
        <el-form-item label="所属分类" prop="pc_no">
          <el-select v-model="templateModel.pc_no" ref="select_class" placeholder="请选择所属分类">
            <el-option :label="templateModel.pc_name" :value="templateModel.pc_no" style="height:auto;padding:0;">
              <el-tree :data="classData" node-key="pc_no" ref="tree" default-expand-all :expand-on-click-node="false"
                highlight-current :current-node-key="templateModel.pc_no">
                <div slot-scope="{node, data}" style="width:100%;user-select:none;"
                  @click="handleSelectTreeClick2(data)">
                  {{data.pc_name}}</div>
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="pt_name">
          <el-input class="formItem" v-model="templateModel.pt_name" placeholder="请填写模板名称">
          </el-input>
        </el-form-item>
        <el-form-item label="模板说明">
          <el-input class="formItem" type="textarea" :rows="2" v-model="templateModel.pt_note" placeholder="模板说明">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;">
          <el-button size="medium" @click="addTemplateVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveTemplateClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增物料需求 -->
    <el-dialog :width=" itemModelList.length? '1000px':'550px'" title="新增模板产品" :close-on-click-modal="false"
      :visible.sync="addProductVisible">
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
        <div class="rightTransferItem" v-if="itemModelList.length">
          <fieldset class="oneItem" v-for="(item,index) in itemModelList" :key="index">
            <legend>物料{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectItem(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="80px" ref="itemListForm" :rules="addItem_rules">
              <el-form-item label="物料编码" prop="item_na0">
                <el-input class="formItem2" v-model="item.item_no" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="物料名称" prop="item_name">
                <el-input class="formItem2" v-model="item.item_name" placeholder="请选择物料" disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="需求数量" prop="pti_quantity">
                <el-input class="formItem2" v-model="item.pti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
                </el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input class="formItem2" v-model="item.pti_note" placeholder="备注信息">
                </el-input>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="itemModelList.length">
          <el-button size="medium" @click="addProductVisible = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveItemListClick" style="margin-left:30px;">保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 选择/修改物料 -->
    <el-dialog v-if="selectItemVisible" v-dialogDrag width="450px" :title="addOrNot?'新增模板产品':'编辑模板产品'"
      :close-on-click-modal="false" :visible.sync="selectItemVisible">
      <zj-form size="small" :newDataFlag='selectItemVisible' :model="itemModel" label-width="100px" ref="itemForm"
        :rules="addItem_rules">
        <el-form-item label="需求数量" prop="pti_quantity">
          <el-input class="formItem" v-model="itemModel.pti_quantity" placeholder="请填写需求数量" oninput="value=value.replace(/[^\d.]/g,'')
                                .replace(/^\./g, '').replace(/\.{2,}/g, '.')
                                .replace('.', '$#$').replace(/\./g, '')
                                .replace('$#$', '.')
                                .slice(0,value.indexOf('.') === -1? value.length: value.indexOf('.') + 3)">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input class="formItem" type="textarea" :rows="2" v-model="itemModel.pti_note" placeholder="备注信息">
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
  data() {
    return {
      limit: 10,
      currentPage: 1,
      total: 0,
      condition: "",
      conditionProduct: "",
      itemListCondition: "",
      classData: [],
      projectTemplateData: [],
      productData: [],
      itemListData: [],
      unitFilter: [],
      itCodeFilter: [],
      classFilter: [],
      selectClass: {},
      currentRow: {},
      selection: [],
      productSelection: [],
      loading: false,
      loading2: false,
      loading3: false,
      addTemplateVisible: false,
      addProductVisible: false,
      selectItemVisible: false,
      templateModel: {},
      add_rules: {
        pc_no: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
        pt_name: [
          { required: true, message: "请填写模板名称", trigger: "blur" }
        ]
      },
      addItem_rules: {
        item_name: [{ required: true, message: "请选择物料", trigger: "blur" }],
        pti_quantity: [
          { required: true, message: "请填写数量", trigger: "blur" }
        ]
      },
      addOrNot: true,
      activeName: "first",
      bottomDivShow: false,
      itemModelList: [],
      itemModel: {}
    };
  },
  methods: {
    refreshTemplateData() {
      this.loading = true;
      this.refreshBottom();
      this.currentRow = [];
      this.projectTemplateData = [];
      this.z_get(
        "api/project_template",
        {
          pc_no: this.selectClass.pc_no,
          condition: this.condition
        },
        { loading: false }
      )
        .then(res => {
          this.loading = false;
          this.classFilter = res.dict.pc_no;
          this.projectTemplateData = res.data;
        })
        .catch(res => {});
    },
    refreshClassData() {
      this.classData = [];
      this.selectClass = {};
      this.refreshTemplateData();
      this.z_get("api/project_classification/treeList")
        .then(res => {
          this.classData = res.data;
        })
        .catch(res => {});
    },
    refreshBottom() {
      this.conditionProduct = "";
      this.productData = [];
      this.bottomDivShow = false;
    },
    refreshProductData() {
      this.loading3 = true;
      this.productData = [];
      this.z_get(
        "api/project_template_item",
        {
          pt_id: this.currentRow.pt_id,
          condition: this.conditionProduct
        },
        { loading: false }
      )
        .then(res => {
          this.loading3 = false;
          this.productData = res.data;
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
    searchTemplate() {
      this.condition = "";
      this.refreshTemplateData();
    },
    searchProduct() {
      this.conditionProduct = "";
      this.refreshProductData();
    },
    searchItemList() {
      this.itemListCondition = "";
      this.currentPage = 1;
      this.refreshItemListData();
    },
    //选中的分类
    handleSelectTreeClick(data) {
      this.selectClass = data;
      this.searchTemplate();
    },
    //选择分类
    handleSelectTreeClick2(data) {
      this.templateModel.pc_no = data.pc_no;
      this.templateModel.pc_name = data.pc_name;
      this.$refs.select_class.blur();
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleSelectionChange2(val) {
      this.productSelection = val;
    },
    handleRowClick(row, column) {
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
        //点击加载tab数据
        this.refreshBottom();
        this.refreshProductData();
      }
      this.bottomDivShow = true;
    },
    addNewTemplateShow() {
      this.templateModel = {
        pc_no: this.selectClass.pc_no ? this.selectClass.pc_no : "",
        pc_name: this.selectClass.pc_name ? this.selectClass.pc_name : "",
        pt_name: "",
        pt_note: ""
      };
      this.addOrNot = true;
      this.addTemplateVisible = true;
    },
    editTemplateShow(row) {
      this.templateModel = JSON.parse(JSON.stringify(row));
      this.templateModel.pc_name = this.renderFilter(
        this.templateModel.pc_no,
        this.classFilter
      );
      this.addOrNot = false;
      this.addTemplateVisible = true;
    },
    onSaveTemplateClick() {
      this.$refs.templateForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/project_template", this.templateModel)
              .then(res => {
                this.$message({
                  message: "新增成功!",
                  type: "success",
                  duration: 1000
                });
                this.refreshTemplateData();
                this.addTemplateVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败!", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.templateModel.UpdateColumns = this.$refs.templateForm.UpdateColumns;
            if (this.templateModel.UpdateColumns) {
              this.z_put("api/project_template", this.templateModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshTemplateData();
                  this.addTemplateVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addTemplateVisible = false;
            }
          }
        }
      });
    },
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？删除模板将同时删除模板产品与详情！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/project_template/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshTemplateData();
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
    addProductShow() {
      this.itemModelList = [];
      this.searchItemList();
      this.addOrNot = true;
      this.addProductVisible = true;
    },
    editProductShow(row) {
      this.itemModel = JSON.parse(JSON.stringify(row));
      this.addOrNot = false;
      this.selectItemVisible = true;
    },
    deleteOneProduct(row) {
      var list = [];
      list.push(row);
      this.onDeleteProductClick(list);
    },
    deleteListProduct() {
      if (this.productSelection.length) {
        this.onDeleteProductClick(this.productSelection);
      }
    },
    onDeleteProductClick(list) {
      this.$confirm("是否删除产品？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/project_template_item/list", { data: list })
            .then(res => {
              this.$message({
                message: "删除成功!",
                type: "success",
                duration: 1000
              });
              this.refreshProductData();
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
    //双击选中物料
    handleRowDbClcik(row) {
      this.itemModel = {
        pt_id: this.currentRow.pt_id,
        item_no: row.item_no,
        item_name: row.item_name,
        pti_quantity: "",
        pti_note: ""
      };
      var isContain = false;
      for (var i = 0; i < this.productData.length; i++) {
        if (this.productData[i].item_no == this.itemModel.item_no) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.itemModelList.length; i++) {
        if (this.itemModelList[i].item_no == this.itemModel.item_no) {
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
    //保存/编辑选中物料
    onSaveTaskItemClick() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.itemModelList.push(JSON.parse(JSON.stringify(this.itemModel)));
            this.selectItemVisible = false;
          } else {
            //修改
            this.itemModel.UpdateColumns = this.$refs.itemForm.UpdateColumns;
            if (this.itemModel.UpdateColumns) {
              this.z_put("api/project_template_item", this.itemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshProductData();
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
      for (var i = 0; i < this.itemModelList.length; i++) {
        if (!this.itemModelList[i].pti_quantity) {
          this.$alert("物料" + (i + 1) + "数量未填写", "提示", {
            confirmButtonText: "确定",
            type: "warning"
          });
          return;
        }
      }
      this.z_post("api/project_template_item/list", this.itemModelList)
        .then(res => {
          this.$message({
            message: "新增成功!",
            type: "success",
            duration: 1000
          });
          this.addProductVisible = false;
          this.refreshProductData();
        })
        .catch(res => {
          this.$alert("新增失败!", "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //删除选中的物料
    deleteSelectItem(index) {
      this.itemModelList.splice(index, 1);
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshItemListData();
    },
    //跳转路由
    toDetail(row) {
      this.$router.push({
        name: "project-preparation/template-task",
        params: {
          templateId: row.pt_id
        }
      });
    }
  },
  mounted() {
    this.refreshClassData();
    this.refreshTemplateData();
  }
};
</script>

<style scoped>
.project-template {
  width: 1200px;
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
.bottomLayout {
  position: relative;
}
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
<style>
.classTree .el-tree-node__content {
  height: 30px;
}
</style>