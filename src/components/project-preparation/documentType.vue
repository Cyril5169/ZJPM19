<template>
  <div class="documentType">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入类别名称" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button style="margin-left:10px;" size="small" type="primary" @click="addNewType()">新增类别
          </el-button>
        </div>
        <div class="gridTable">
          <el-table  ref="dataTypeTable" style="width: 100%;" :data="tableData" tooltip-effect="dark"
            highlight-current-row row-key="dept_id" default-expand-all border>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="ddt_name" label="类别名称" align="center" width="150"></el-table-column>
            <el-table-column prop="ddt_note" label="类别说明" align="center">
            </el-table-column>
            <el-table-column label="分类" prop="ddt_type" align="center" width="150">
              <template slot-scope="scope">{{scope.row.ddt_type | dataTypeTrans}}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editDataTypeShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog width="420px" title="新增资料类别" :close-on-click-modal="false" :visible.sync="addDataTypeVisiable" top="25vh"
      @closed="refreshForm">
      <zj-form :newDataFlag='addDataTypeVisiable' :model="dataTypeModel" label-width="130px" ref="dataTypeForm"
        :rules="add_rules">
        <el-form-item label="资料类别名称" prop="ddt_name">
          <el-input class="formItem" v-model="dataTypeModel.ddt_name" placeholder="请输入资料类别名称">
          </el-input>
        </el-form-item>
        <el-form-item label="资料类别分类" prop="ddt_type">
          <el-select class="formItem" v-model="dataTypeModel.ddt_type" placeholder="请选择资料类别分类">
            <el-option v-for="item in dataType_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资料类别说明" prop="ddt_note">
          <el-input class="formItem" type="textarea" :rows="2" v-model="dataTypeModel.ddt_note" placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:100px;margin-top:30px;">
          <el-button type="primary" @click="onSaveDataTypeClick" style="margin-left:-50px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="addDataTypeVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "documentType",
  data() {
    return {
      condition: "",
      tableData: [], //表格数据
      currentRow: {},
      selection: [],
      addDataTypeVisiable: false,
      dataTypeModel: {},
      addOrNot: true, //是否新增
      addDeptText: "",
      showMoveBtn: false,
      dataType_options: [
        {
          value: 1,
          label: "图文档"
        },
        {
          value: 2,
          label: "表格"
        }
      ],
      add_rules: {
        ddt_name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        ddt_type: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ]
      }
    };
  },
  filters: {
    datatrans(value) {
      if (!value || value == "9999-12-31") return "";
      //时间戳转化大法
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " "; /* + h + ':' + m + ':' + s; */
    },
    dataTypeTrans(value) {
      switch (value) {
        case 1:
          return "图文档";
          break;
        case 2:
          return "表格";
          break;
      }
    }
  },
  methods: {
    //查询满足条件的文件类别数据
    refreshData() {
      this.z_get("api/document_data_type", { condition: this.condition })
        .then(res => {
          this.tableData = res.data;
        })
        .catch(res => {});
    },
    //重置表单
    refreshForm() {
      this.$refs.dataTypeForm.resetFields();
    },
    //查询所有的文件类别数据
    search() {
      this.condition = "";
      this.refreshData();
    },
    //显示新增类别界面
    addNewType() {
      this.dataTypeModel = {
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        ddt_name: "",
        ddt_note: "",
        ddt_type: ""
      };
      this.addOrNot = true;
      this.addDataTypeVisiable = true;
    },
    //提交新增或编辑结果
    onSaveDataTypeClick() {
      this.$refs.dataTypeForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/document_data_type", this.dataTypeModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addDataTypeVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.dataTypeModel.UpdateColumns = this.$refs.dataTypeForm.UpdateColumns;
            if (this.dataTypeModel.UpdateColumns) {
              this.z_put("api/document_data_type", this.dataTypeModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.addDataTypeVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    //显示编辑类别界面
    editDataTypeShow(row) {
      this.dataTypeModel = JSON.parse(JSON.stringify(row));
      this.addDeptText = "编辑资料类别";
      this.addOrNot = false;
      this.addDataTypeVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      this.onDeleteClick(row);
    },
    //提交删除结果
    onDeleteClick(row) {
      this.$confirm("是否确认删除？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/document_data_type", { data: row })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1000
              });
              this.refreshData();
            })
            .catch(res => {
              this.$alert("删除失败", "提示", {
                confirmButtonText: "确定",
                type: "warning"
              });
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.search();
  }
};
</script>

<style scoped>
.documentType {
  width: 1000px;
}
.formItem {
  width: 220px;
}
.gridTable {
  flex: 1;
}
</style>