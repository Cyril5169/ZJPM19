<template>
  <div>
    <div class="main">
      <div class="top">
        <div class="c-tbar">
          <el-input size="small" @keyup.enter.native="refreshDicData" placeholder="名称/CODE" v-model="dic_condition"
            clearable style="width:200px;">
            <el-button slot="append" icon="el-icon-search" @click="refreshDicData"></el-button>
          </el-input>
          <el-button type="primary" size="small" @click="dicModel={sd_status:true,sd_is_sys:false};isAddDic=true;">新增
          </el-button>
          <el-button type="primary" size="small" :disabled="!currentDic.sys_dic_id"
            @click="dicModel=JSON.parse(JSON.stringify(currentDic));isEditDic=true;">编辑</el-button>
          <el-button size="small" plain type="danger" :disabled="dicSelection.length==0" @click="onDeleteDicListClick">
            删除选中({{dicSelection.length}}) </el-button>
          <el-button size="small" :disabled="!currentDic.sys_dic_id || !clearDicCondition" @click="UpDic">上移</el-button>
          <el-button size="small" :disabled="!currentDic.sys_dic_id || !clearDicCondition" @click="DownDic">下移
          </el-button>
        </div>
        <div class="table_ct">
          <el-table ref="dicTable" style="width:100%;" :height="dicTableHeight" :data="dicData" tooltip-effect="dark"
            highlight-current-row fit row-key="sys_dic_id" :current-row-key="currentDic.sys_dic_id"
            @current-change="handleDicRowClick" @row-click="handleDicRowClick"
            @selection-change="handleDicSelectionChange" border>
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="sd_name" label="名称" align="left" width="120"></el-table-column>
            <el-table-column prop="sd_code" label="CODE" align="left" width="100"></el-table-column>
            <el-table-column label="可着色" width="90" align="center" prop="sd_can_color">
              <template slot-scope="scope">
                <span v-if="scope.row.sd_can_color">√</span>
              </template>
            </el-table-column>
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
        </div>
      </div>
      <div class="bottom">
        <div class="c-tbar">
          <el-input size="small" @input="filterDicItemData" placeholder="名称过滤" v-model="dicItem_condition" clearable
            style="width:200px;">
          </el-input>
          <el-button type="primary" size="small" :disabled="!currentDic.sys_dic_id"
            @click="isAddDicItem=true;dicItemModel={sys_dic_id:currentDic.sys_dic_id,sdi_status:true};">新增
          </el-button>
          <el-button type="primary" size="small" :disabled="!currentDicItem.sys_dic_item_id"
            @click="dicItemModel=JSON.parse(JSON.stringify(currentDicItem));isEditDicItem=true;">编辑</el-button>
          <el-button size="small" plain type="danger" :disabled="dicItemSelection.length==0"
            @click="onDeleteDicItemListClick">
            删除选中({{dicItemSelection.length}})
          </el-button>
          <el-button size="small" :disabled="!currentDicItem.sys_dic_item_id || !clearDicItemCondition"
            @click="UpDicItem">上移</el-button>
          <el-button size="small" :disabled="!currentDicItem.sys_dic_item_id || !clearDicItemCondition"
            @click="DownDicItem">下移</el-button>
        </div>
        <div class="table_ct">
          <el-table ref="dicItemTable" style="width:100%;" :height="dicItemTableHeight" :data="dicItemData"
            tooltip-effect="dark" highlight-current-row fit row-key="sys_dic_item_id"
            :current-row-key="currentDicItem.sys_dic_item_id" @current-change="handleDicItemRowClick"
            @row-click="handleDicItemRowClick" @selection-change="handleDicItemSelectionChange" border>
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="sdi_name" label="显示的名称" align="left" width="120">
            </el-table-column>
            <el-table-column prop="sdi_code" label="存储的CODE" align="left" width="120">
            </el-table-column>
            <el-table-column label="背景色" width="90" align="center" prop="sdi_bgcolor">
              <template slot-scope="scope">
                <div :style="'color:#000;background-color:'+scope.row.sdi_bgcolor">{{scope.row.sdi_bgcolor}}</div>
              </template>
            </el-table-column>
            <el-table-column label="是否可用" width="90" align="center" prop="sdi_status">
              <template slot-scope="scope">
                <span v-if="scope.row.sdi_status">√</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 新增编辑数据字典 -->
    <el-dialog width="450px" :title="isAddDic?'新增数据字典':'编辑数据字典'" :close-on-click-modal="false"
      :visible.sync="dicFormVisible" @closed="dicModel={};$refs.dicForm.resetFields()">
      <zj-form size="small" :newDataFlag='isEditDic' :model="dicModel" label-width="120px" ref="dicForm"
        :rules="dic_rules">
        <el-form-item label="名称" prop="sd_name">
          <el-input class="form-item" v-model="dicModel.sd_name" placeholder="请填写名称">
          </el-input>
        </el-form-item>
        <el-form-item label="CODE" prop="sd_code">
          <el-input class="form-item" v-model="dicModel.sd_code">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="dicModel.sd_status" label="启用"></el-checkbox>
          <el-checkbox v-model="dicModel.sd_is_sys" label="系统级"></el-checkbox>
          <el-checkbox v-model="dicModel.sd_can_color" label="着色"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="dicFormVisible=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditDic" @click="onDeleteDicClick">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveDicClick">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>

    <!-- 新增编辑数据字典 -->
    <el-dialog width="450px" :title="isAddDicItem?'新增数据字典明细':'编辑数据字典明细'" :close-on-click-modal="false"
      :visible.sync="dicItemFormVisible" @closed="dicItemModel={};$refs.dicItemForm.resetFields()">
      <zj-form size="small" :newDataFlag='isEditDicItem' :model="dicItemModel" label-width="110px" ref="dicItemForm"
        :rules="dicItem_rules">
        <el-form-item label="显示的名称" prop="sdi_name">
          <el-input class="form-item" v-model="dicItemModel.sdi_name" placeholder="请填写显示的名称">
          </el-input>
        </el-form-item>
        <el-form-item label="存储的CODE" prop="sdi_code">
          <el-input class="form-item" v-model="dicItemModel.sdi_code" placeholder="请填写存储的CODE">
          </el-input>
        </el-form-item>
        <el-form-item label="背景色" prop="sdi_bgcolor">
          <el-color-picker class="form-item" v-model="dicItemModel.sdi_bgcolor" :predefine="predefineColors">
          </el-color-picker>
        </el-form-item>
        <el-form-item prop="sdi_status">
          <el-checkbox v-model="dicItemModel.sdi_status" label="是否启用"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" @click="dicItemFormVisible=false;isEditDicItem=false;">取&nbsp;&nbsp;消</el-button>
          <el-button type="danger" size="medium" v-show="isEditDicItem" @click="onDeleteDicItemClick">删&nbsp;&nbsp;除
          </el-button>
          <el-button type="primary" size="medium" @click="onSaveDicItemClick">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>


<style scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 700px;
}
.top {
  flex: 1;
  border: 1px solid #dedede;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.bottom {
  flex: 1;
  border: 1px solid #dedede;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.c-tbar {
  background: #eee;
  padding: 5px 10px;
}
.table_ct {
  flex: 1;
  box-sizing: border-box;
}
.form-item {
  width: 300px;
}
</style>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      dicData: [],
      dicItemData: [],
      codeRuleData: [],

      dic_condition: "",
      clearDicCondition: true,
      dicItem_condition: "",
      clearDicItemCondition: "",

      currentDic: {},
      currentDicItem: {},
      currentCodeRule: {},

      dicTableHeight: 100,
      dicItemTableHeight: 100,
      codeRuleTableHeight: 100,

      isAddDic: false,
      isEditDic: false,
      isAddDicItem: false,
      isEditDicItem: false,
      isAddCodeRule: false,
      isEditCodeRule: false,

      dicModel: {},
      dicItemModel: {},

      dicSelection: [],
      dicItemSelection: [],

      dic_rules: {
        sd_name: [{ required: true, message: "请填写名称" }]
      },
      dicItem_rules: {
        sdi_name: [{ required: true, message: "请填写显示的名称" }],
        sdi_code: [{ required: true, message: "请填写存储的CODE" }]
      },
      predefineColors: [
        "#67C23A", //success
        "#E6A23C", //warning
        "#F56C6C", //danger
        "#909399", //info
        "#ff0000", //红色
        "#ffff00", //黄色
        "#00ff00", //绿色
        "#00ffff", //青色
        "#0000ff", //蓝色
        "#f0e68c", //黄褐色
      ]
    };
  },
  computed: {
    dicFormVisible: {
      get: function() {
        return this.isAddDic || this.isEditDic;
      },
      set: function(v) {
        if (!v) {
          this.isAddDic = false;
          this.isEditDic = false;
        }
      }
    },
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
    }
  },
  methods: {
    handleDicRowClick(row) {
      this.currentDic = row == null ? {} : row;
      this.$refs.dicTable.toggleRowSelection(row);
      this.refreshDicItemData();
    },
    handleDicItemRowClick(row) {
      this.currentDicItem = row == null ? {} : row;
      this.$refs.dicItemTable.toggleRowSelection(row);
    },
    handleDicSelectionChange(val) {
      this.dicSelection = val;
    },
    handleDicItemSelectionChange(val) {
      this.dicItemSelection = val;
    },
    refreshDicData() {
      this.z_get("api/sys_dic/list", { condition: this.dic_condition })
        .then(res => {
          this.clearDicCondition = this.dic_condition == "";
          this.dicData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    refreshDicItemData() {
      this.z_get("api/sys_dic_item/listofsysdic", {
        sys_dic_id: this.currentDic.sys_dic_id
      })
        .then(res => {
          this.dicItemMetaData = res.data;
          this.filterDicItemData();
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    //本地过滤
    filterDicItemData() {
      var th = this;
      this.clearDicItemCondition = this.dicItem_condition == "";
      this.dicItemData =
        this.dicItem_condition == ""
          ? this.dicItemMetaData
          : this.dicItemMetaData.filter(function(value) {
              return value.sdi_name.indexOf(th.dicItem_condition) != -1;
            });
    },
    onDeleteDicClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_dic", { data: this.dicModel })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.isEditDic = false;
            this.currentDic = {};
            this.refreshDicData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onSaveDicClick() {
      this.$refs.dicForm.validate(valid => {
        if (valid) {
          if (this.isAddDic) {
            this.z_post("api/sys_dic", this.dicModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshDicData();
                this.isAddDic = false;
              })
              .catch(res => {
                this.$alert("新增失败：" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.dicModel.UpdateColumns = this.$refs.dicForm.UpdateColumns;
            if (this.dicModel.UpdateColumns) {
              this.z_put("api/sys_dic", this.dicModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshDicData();
                  this.isEditDic = false;
                })
                .catch(res => {
                  this.$alert("编辑失败" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              tis.isEditDic = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    onDeleteDicListClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_dic/list", { data: this.dicSelection })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.refreshDicData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onDeleteDicItemListClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_dic_item/list", { data: this.dicItemSelection })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.refreshDicItemData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onDeleteDicItemClick() {
      this.$confirm("确定删除吗？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        this.z_delete("api/sys_dic_item", { data: this.dicItemModel })
          .then(res => {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.isEditDicItem = false;
            this.currentDicItem = {};
            this.refreshDicItemData();
          })
          .catch(res => {
            this.$alert("删除失败：" + res.msg, "提示", {
              confirmButtonText: "确定",
              type: "error"
            });
          });
      });
    },
    onSaveDicItemClick() {
      this.$refs.dicItemForm.validate(valid => {
        if (valid) {
          if (this.isAddDicItem) {
            this.z_post("api/sys_dic_item", this.dicItemModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshDicItemData();
                this.isAddDicItem = false;
              })
              .catch(res => {
                this.$alert("新增失败：" + res.msg, "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.dicItemModel.UpdateColumns = this.$refs.dicItemForm.UpdateColumns;
            if (this.dicItemModel.UpdateColumns) {
              this.z_put("api/sys_dic_item", this.dicItemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshDicItemData();
                  this.isEditDicItem = false;
                })
                .catch(res => {
                  this.$alert("编辑失败" + res.msg, "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.isEditDicItem = false;
            }
          }
        } else {
          return false;
        }
      });
    },
    UpDic() {
      var index = this.dicData.indexOf(this.currentDic);
      if (index == 0) {
        this.$message({
          message: "第一行不能上移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.dicData.splice(index, 1)[0];
      this.dicData.splice(index - 1, 0, this.currentDic);
      for (let i = 0; i < this.dicData.length; i++) {
        const item = this.dicData[i];
        item.sd_sort = i;
        item.UpdateColumns = ["sd_sort"];
      }
      this.z_put("api/sys_dic/list", this.dicData)
        .then(res => {
          this.$message({
            message: "上移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("上移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    DownDic() {
      var index = this.dicData.indexOf(this.currentDic);
      if (index == this.dicData.length - 1) {
        this.$message({
          message: "最后一行不能下移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.dicData.splice(index, 1)[0];
      this.dicData.splice(index + 1, 0, this.currentDic);
      for (let i = 0; i < this.dicData.length; i++) {
        const item = this.dicData[i];
        item.sd_sort = i;
        item.UpdateColumns = ["sd_sort"];
      }
      this.z_put("api/sys_dic/list", this.dicData)
        .then(res => {
          this.$message({
            message: "下移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("下移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    UpDicItem() {
      var index = this.dicItemData.indexOf(this.currentDicItem);
      if (index == 0) {
        this.$message({
          message: "第一行不能上移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.dicItemData.splice(index, 1)[0];
      this.dicItemData.splice(index - 1, 0, this.currentDicItem);
      for (let i = 0; i < this.dicItemData.length; i++) {
        const item = this.dicItemData[i];
        item.sdi_sort = i;
        item.UpdateColumns = ["sdi_sort"];
      }
      this.z_put("api/sys_dic_item/list", this.dicItemData)
        .then(res => {
          this.$message({
            message: "上移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("上移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    DownDicItem() {
      var index = this.dicItemData.indexOf(this.currentDicItem);
      if (index == this.dicItemData.length - 1) {
        this.$message({
          message: "最后一行不能下移",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.dicItemData.splice(index, 1)[0];
      this.dicItemData.splice(index + 1, 0, this.currentDicItem);
      for (let i = 0; i < this.dicItemData.length; i++) {
        const item = this.dicItemData[i];
        item.sdi_sort = i;
        item.UpdateColumns = ["sdi_sort"];
      }
      this.z_put("api/sys_dic_item/list", this.dicItemData)
        .then(res => {
          this.$message({
            message: "下移成功",
            type: "success",
            duration: 1000
          });
        })
        .catch(res => {
          this.$alert("下移失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      let h = this.$refs.dicTable.$el.parentNode.offsetHeight;
      this.dicTableHeight = h;
      h = this.$refs.dicItemTable.$el.parentNode.offsetHeight;
      this.dicItemTableHeight = h;
    });
    this.refreshDicData();
  }
};
</script>
