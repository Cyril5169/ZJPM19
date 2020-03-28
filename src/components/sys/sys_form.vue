<template>
  <div>
    <div class="main">
      <div class="left">
        <div class="title">
          <div class="title-content">
            <span style="font-size:16px;">系统表单</span>
          </div>
        </div>
        <div class="c-tbar">
          <el-button size="mini" type="primary"  @click="isAddForm=true">
            新增表单
          </el-button>
        </div>
        <div class="table_ct">
          <el-table ref="sysFormTable" style="width:100%;" :height="sysFormTableHeight" :data="sysFormData"
            tooltip-effect="dark" highlight-current-row :show-header="false" fit row-key="sys_form_id"
            :current-row-key="currentSysForm.sys_form_id" @current-change="handleSysFormRowClick"
            @row-click="handleSysFormRowClick" border>
            <el-table-column prop="sys_form_name" align="left">
              <template slot-scope="scope">
                <i class="el-icon-s-fold"></i>
                <span>{{ scope.row.sys_form_name }}（{{ scope.row.sys_form_code }}）</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div class="splitter"></div>
      <div class="center">
        <div class="title">
          <div class="title-content">
            <span>系统表单字段</span>
            <el-button style="margin:auto 5px; width:60px;float:right;" v-show="currentSysForm.sys_form_id" size="mini"
              round @click="formModel=JSON.parse(JSON.stringify(currentSysForm));isEditForm=true">编辑</el-button>
            <span v-show="currentSysForm.sys_form_id"
              style="float:right;background:#909399;color:#fff;display:block; padding:3px 10px;">{{currentSysForm.sys_form_name}}</span>
          </div>
        </div>
        <div class="c-tbar">
          <el-button size="mini" type="primary" :disabled="!currentSysForm.sys_form_id" @click="addFieldClick">
            新增字段
          </el-button>
          <el-button size="mini" plain type="danger" :disabled="fieldSelection.length==0" @click="deleteFieldList">
            删除选中({{fieldSelection.length}})
          </el-button>
        </div>
        <div class="table_ct">
          <el-table ref="fieldTable" style="width:100%;" :height="fieldTableHeight" :data="fieldData"
            tooltip-effect="dark" highlight-current-row fit row-key="sys_form_field_id"
            :current-row-key="currentField.sys_form_field_id" @current-change="handleFieldRowClick"
            @row-click="handleFieldRowClick" border @selection-change="handleFieldSelectionChange">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="sff_name" label="名称" align="left" width="120"></el-table-column>
            <el-table-column prop="sff_code" label="CODE" align="left" width="100"></el-table-column>
            <el-table-column label="编码否" width="90" align="center" prop="handle">
              <template slot-scope="scope">
                <span v-if="scope.row.has_code">是</span>
              </template>
            </el-table-column>
            <el-table-column label="字典绑定" width="150" align="center" prop="handle">
              <template slot-scope="scope">
                <el-popover v-if="scope.row.sys_dic_id" placement="bottom" :title="scope.row.sff_name + '的数据字典'"
                  width="400" trigger="click">
                  <el-table :data="dicItemData" tooltip-effect="dark" highlight-current-row fit
                    row-key="sys_dic_item_id" border max-height="300px">
                    <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
                    <el-table-column prop="sdi_name" label="显示的名称" align="left" flex>
                    </el-table-column>
                    <el-table-column prop="sdi_code" label="存储的CODE" align="left" width="120">
                    </el-table-column>
                    <el-table-column label="是否可用" width="90" align="center" prop="handle">
                      <template slot-scope="scope">
                        <span v-if="scope.row.sdi_status">√</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button slot="reference" size="mini" round type="primary">查看</el-button>
                </el-popover>
                <el-button size="mini" round @click="setDicClick(scope.row)">设置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="splitter"></div>
      <div class="right">
        <div class="title">
          <div class="title-content">
            <span>编码规则(未实现)</span>
            <span v-show="currentField.sys_form_field_id"
              style="float:right;background:#909399;color:#fff;display:block; padding:3px 10px;">{{currentField.sff_name}}</span>
          </div>
        </div>
        <div class="c-tbar">
          <el-button size="mini" round plain type="danger">
            删除选中({{codeRuleSelection.length}})
          </el-button>
        </div>
        <div class="table_ct">
          <el-table ref="codeRuleTable" style="width:100%;" :height="codeRuleTableHeight" :data="codeRuleData"
            tooltip-effect="dark" highlight-current-row fit row-key="code_rule_id"
            :current-row-key="currentCodeRule.code_rule_id" @current-change="handleCodeRuleRowClick"
            @row-click="handleCodeRuleRowClick" border>
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="cr_type" label="类型" align="left" width="60"></el-table-column>
            <el-table-column prop="cr_format" label="格式" align="left" width="80"></el-table-column>
            <el-table-column prop="cr_length" label="长度" align="left" width="60"></el-table-column>
            <el-table-column prop="cr_replenish" label="补位码" align="left" width="80"></el-table-column>
            <el-table-column prop="cr_serial_as" label="流水号依据" align="left" width="70"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 新增系统表单 -->
    <el-dialog width="510px" title="新增系统表单" :close-on-click-modal="false" :visible.sync="isAddForm"
      @open="add_form_condition='';refreshSysTableData();">
      <div style="background:#eee;padding: 5px 10px;">
        <el-input size="small" @input="filterSysTableData" placeholder="请输入关键字进行过滤" v-model="add_form_condition" clearable
          style="width:300px;" prefix-icon='el-icon-search'>
        </el-input>
      </div>
      <el-table border max-height="400" :data="sysTableData" tooltip-effect="dark" highlight-current-row fit
        row-key="sys_form_code" @row-dblclick="addForm">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="sys_form_code" label="表名" align="left" width="150"></el-table-column>
        <el-table-column prop="sys_form_name" label="表说明" align="left" width="200"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 编辑系统表单 -->
    <el-dialog width="450px" title="编辑系统表单" :close-on-click-modal="false" :visible.sync="isEditForm"
      @closed="formModel={};$refs.formEditForm.resetFields()">
      <zj-form size="small" :newDataFlag='isEditForm' :model="formModel" label-width="120px" ref="formEditForm"
        :rules="form_rules">
        <el-form-item label="系统表单名称" prop="sys_form_name">
          <el-input class="form-item" v-model="formModel.sys_form_name" placeholder="请填写系统表单名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="isEditForm=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditForm" @click="onDeleteFormClick">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveFormClick2">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
    <!-- 新增系统表单字段 -->
    <el-dialog width="510px" title="新增系统表单字段" :close-on-click-modal="false" :visible.sync="isAddField"
      @open="refreshSysColumnData">
      <el-table border max-height="400" :data="sysColumnData" tooltip-effect="dark" highlight-current-row fit
        row-key="sff_code" @row-dblclick="addField">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="sff_code" label="列名" align="left" width="150"></el-table-column>
        <el-table-column prop="sff_name" label="列说明" align="left" width="200"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 选择数据字典 -->
    <el-dialog width="510px" title="选择数据字典" :close-on-click-modal="false" :visible.sync="dicSelectVisible"
      @open="dic_condition='';refreshDicData();">
      <div style="background:#eee;padding: 5px 10px;">
        <el-input size="small" @keyup.enter.native="refreshDicData" placeholder="名称/CODE" v-model="dic_condition"
          clearable style="width:300px;">
          <el-button slot="append" icon="el-icon-search" @click="refreshDicData"></el-button>
        </el-input>
      </div>
      <el-table border max-height="400" :data="dicData" tooltip-effect="dark" highlight-current-row fit
        row-key="sys_dic_id" @row-dblclick="selectDic">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="sd_name" label="名称" align="left" width="120"></el-table-column>
        <el-table-column prop="sd_code" label="CODE" align="left" width="100"></el-table-column>
        <el-table-column label="启用" width="90" align="center" prop="sd_status">
          <template slot-scope="scope">
            <span v-if="scope.row.sd_status">√</span>
          </template>
        </el-table-column>
        <el-table-column label="系统级" width="90" align="center" prop="sd_is_sys">
          <template slot-scope="scope">
            <span v-if="scope.row.sd_is_sys">√</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>


<style scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.left {
  box-sizing: border-box;
  width: 250px;
  border: 1px solid #dedede;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.c-tbar {
  background: #eee;
  padding: 5px 10px;
  margin-bottom: 10px;
}
.table_ct {
  flex: 1;
  box-sizing: border-box;
}
.splitter {
  background: #eee;
  width: 5px;
  margin: 0 5px;
}
.splitter1 {
  background: #eee;
  height: 5px;
  margin: 5px 0;
}
.center {
  box-sizing: border-box;
  width: 565px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  border: 1px solid #dedede;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  border-bottom: 1px solid #dedede;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.title-content {
  font-size: 16px;
  padding: 0 10px;
}
.right {
  border: 1px solid #dedede;
  box-sizing: border-box;
  width: 500px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.right-item {
  border: 1px solid #dedede;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex: 1;
}
</style>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      sysFormData: [],
      fieldData: [],
      dicItemData: [],
      codeRuleData: [],

      currentSysForm: {},
      currentField: {},
      currentDicItem: {},
      currentCodeRule: {},

      fieldTableHeight: 300,
      sysFormTableHeight: 300,
      dicItemTableHeight: 100,
      codeRuleTableHeight: 100,

      isEditForm: false,
      isEditField: false,
      isAddDicItem: false,
      isEditDicItem: false,
      isAddCodeRule: false,
      isEditCodeRule: false,

      formModel: {},
      fieldModel: {},
      dicItemModel: {},
      codeRuleModel: {},

      formSelection: [],
      fieldSelection: [],
      dicItemSelection: [],
      codeRuleSelection: [],

      form_rules: {
        sys_form_name: [{ required: true, message: "请填写系统表单名称" }]
      },
      field_rules: {},
      dicItem_rules: {
        sdi_name: [{ required: true, message: "请填写显示的名称" }],
        sdi_code: [{ required: true, message: "请填写存储的CODE" }]
      },
      codeRule_rules: {},

      dicData: [],
      dicSelectingField: {},
      dic_condition: [],

      isAddForm: false,
      add_form_condition: "",
      sysTableMetaData: [],
      sysTableData: [],

      isAddField: false,
      sysColumnData:[],
    };
  },
  computed: {
    dicItemFormVisible: {
      get: function() {
        return this.isAddDicItem || this.isEditDicItem;
      },
      set: function(v) {
        if (!v) {
          this.isAddDicItem = false;
          this.isEditDicItem = false;
        }
      }
    },
    dicSelectVisible: {
      get: function() {
        return !!this.dicSelectingField.sys_form_field_id;
      },
      set: function(v) {
        if (v == false) this.dicSelectingField = {};
      }
    }
  },
  methods: {
    handleSysFormRowClick(row) {
      this.currentSysForm = row == null ? {} : row;
      this.refreshFieldData();
    },
    handleFieldRowClick(row) {
      this.currentField = row == null ? {} : row;
      this.refreshDicItemData();
      this.refreshCodeRuleData();
    },
    handleFieldSelectionChange(val){
      this.fieldSelection=val;
    },
    handleDicItemRowClick(row) {
      this.currentDicItem = row == null ? {} : row;
    },
    handleCodeRuleRowClick(row) {
      this.currentCodeRule = row == null ? {} : row;
    },
    refreshSysTableData() {
      this.z_get("api/sys_form/tablelist")
        .then(res => {
          this.sysTableMetaData = res.data;
          this.filterSysTableData();
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //本地过滤
    filterSysTableData() {
      var th = this;
      this.sysTableData =
        this.add_form_condition == ""
          ? this.sysTableMetaData
          : this.sysTableMetaData.filter(function(value) {
              return (
                value.sys_form_name.indexOf(th.add_form_condition) != -1 ||
                value.sys_form_code.indexOf(th.add_form_condition) != -1
              );
            });
    },
    addForm(row){
      this.$prompt('修改表单命名', '表单命名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.sys_form_name,
          inputPattern:/\S/,
          inputErrorMessage:'不允许为空'
        }).then(({ value }) => {
          let row1=JSON.parse(JSON.stringify(row));
          row1.sys_form_name=value;
          this.z_post("api/sys_form", row1)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshSysFormData();
                this.isAddForm = false;
              })
              .catch(res => {
                this.$alert("新增失败" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    refreshSysFormData() {
      this.z_get("api/sys_form/list")
        .then(res => {
          this.sysFormData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    refreshFieldData() {
      this.z_get("api/sys_form_field/listofsysform", {
        sys_form_id: this.currentSysForm.sys_form_id
      })
        .then(res => {
          this.fieldData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    addFieldClick(){
      this.isAddField=true;
    },
    refreshSysColumnData(){
      this.z_get("api/sys_form_field/dbcolumnlist", {
        sys_form_code: this.currentSysForm.sys_form_code
      })
        .then(res => {
          this.sysColumnData = res.data;
          this.sysColumnData.forEach(item => {
            item.sys_form_id=this.currentSysForm.sys_form_id
          });
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    addField(row){
      this.$prompt('修改字段命名', '字段命名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.sff_name,
          inputPattern:/\S/,
          inputErrorMessage:'不允许为空'
        }).then(({ value }) => {
          let row1=JSON.parse(JSON.stringify(row));
          row1.sff_name=value;
          this.z_post("api/sys_form_field", row1)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshFieldData();
                this.isAddField = false;
              })
              .catch(res => {
                this.$alert("新增失败" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    refreshDicItemData() {
      this.z_get("api/sys_dic_item/listofsysdic", {
        sys_dic_id: this.currentField.sys_dic_id
      })
        .then(res => {
          this.dicItemData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    refreshCodeRuleData() {
      this.z_get("api/code_rule/listofsysformfield", {
        sys_form_field_id: this.currentField.sys_form_field_id
      })
        .then(res => {
          this.codeRuleData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    refreshDicData() {
      this.z_get("api/sys_dic/list", { condition: this.dic_condition })
        .then(res => {
          this.dicData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    setDicClick(row) {
      this.dicSelectingField = row;
    },
    selectDic(row) {
      let field = {
        sys_form_field_id: this.dicSelectingField.sys_form_field_id,
        sys_dic_id: row.sys_dic_id,
        UpdateColumns: ["sys_dic_id"]
      };
      this.z_put("api/sys_form_field", field)
        .then(res => {
          this.$message({
            message: "设置成功",
            type: "success",
            duration: 1000
          });
          this.dicSelectingField.sys_dic_id = row.sys_dic_id;
          this.dicSelectVisible = false;
        })
        .catch(res => {
          this.$alert("设置失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    deleteFieldList(){
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_form_field/list", { data: this.fieldSelection })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.refreshFieldData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onDeleteFormClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_form", { data: this.formModel })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.isEditForm = false;
            this.currentSysForm = {};
            this.refreshSysFormData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onSaveFormClick2() {
      this.$refs.formEditForm.validate(valid => {
        if (valid) {
          this.formModel.UpdateColumns = this.$refs.formEditForm.UpdateColumns;
          if (this.formModel.UpdateColumns) {
            this.z_put("api/sys_form", this.formModel)
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshSysFormData();
                this.isEditForm = false;
              })
              .catch(res => {
                this.$alert("编辑失败" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            tis.isEditForm = false;
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      let h = this.$refs.sysFormTable.$el.parentNode.offsetHeight;
      this.sysFormTableHeight = h;
      h = this.$refs.fieldTable.$el.parentNode.offsetHeight;
      this.fieldTableHeight = h;
      h = this.$refs.codeRuleTable.$el.parentNode.offsetHeight;
      this.codeRuleTableHeight = h;
    });
    this.refreshSysFormData();
  }
};
// 可编辑单元格参考网站 https://blog.csdn.net/q95548854/article/details/83538192
</script>
