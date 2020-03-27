<template>
  <div class="custFormPanel">
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
        placeholder="请输入客户名称"
        style="width:250px"
        size="small"
      >
        <el-button
          @click="refreshData"
          slot="append"
          size="small"
          icon="el-icon-search"
          >搜索</el-button
        >
      </el-input>

      <el-button
        type="primary"
        style="margin-left:10px;"
        @click="addNewCust"
        size="small"
        >新增</el-button
      >
      <el-button type="primary" size="small">导入</el-button>
    </div>
    <div class="gridTable">
      <zj-table
        :data="tableData"
        height="100%"
        border
        style="width:100% "
        row-key="c_no"
        tooltip-effect="dark"
      >
        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column
          prop="c_code"
          label="客户代码"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_name"
          label="客户名称"
          width="300"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_address"
          label="客户地址"
       
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_scale"
          label="客户规模"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="c_Importance_level"
          label="客户重要程度"
          width="120"
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
              @click="editCustShow(scope.row)"
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

    <el-dialog
      :title="addCustText"
      :visible.sync="custFormVisible"
      width="500px"
      close-on-click-model="false"
      @closed="refreshForm"
    >
      <zj-form
        :newDataFlag="custFormVisible"
        :model="custModel"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="width:400px"
        ref="custForm"
      >
        <el-form-item label="客户代码" prop="c_code">
          <el-input v-model="custModel.c_code" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="c_name">
          <el-input v-model="custModel.c_name" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>

        <el-form-item label="客户地址" prop="c_address">
          <el-input v-model="custModel.c_address" autocomplete="off" style="width:300px"></el-input>
        </el-form-item>

        <el-form-item label="客户规模">
          <el-select v-model="custModel.c_scale" placeholder="请选择客户规模"  style="width:300px">
            <el-option label="小型客户" value="小型客户"></el-option>
            <el-option label="大型客户" value="大型客户"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户重要程度" prop="c_Importance_level">
          <el-select
            v-model="custModel.c_Importance_level"
            placeholder="请选择客户重要程度"
            style="width:300px"
          >
            <el-option label="一般" value="一般"></el-option>
            <el-option label="重要" value="重要"></el-option>
            <el-option label="非常重要" value="非常重要"></el-option>
          </el-select>
        </el-form-item>
      </zj-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="custFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveCustClick('custForm')"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      custModel: {},
      custFormVisible: false,
      condition: "",
      addCustText: "",
      tableData: [],
      currentRow: {},
      //custDataFilter: [],

      addOrNot: true,
      rules: {
        //新增客户校验规则
        c_code: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        c_name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        c_address: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],

        c_Importance_level: [
          { required: true, message: "重要程度不能为空", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    refreshData() {
      this.tableData = [];
      this.currentRow = {};
      this.z_get("api/customer", { condition: this.condition })
        .then(res => {
          //this.custDataFilter = res.dict.c_name;
          this.tableData = res.data;
        })
        .catch(res => {});
    },

    addNewCust() {
      this.custFormVisible = true;
      this.addOrNot = true;
      this.addCustText = "新增客户";
      this.custModel = {
        c_no: 0,
        ct_id: "",
        c_code: "",
        c_name: "",
        c_address: "",
        c_Importance_level: "",
        c_scale: ""
      };
    },
    //重置表单
    refreshForm() {
      this.$refs.custForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //编辑数据
    editCustShow(row) {
      this.custModel = JSON.parse(JSON.stringify(row));
      this.addCustText = "编辑客户信息";
      this.addOrNot = false;
      this.custFormVisible = true;
    },

    //删除一个
    deleteOne(row) {
      this.z_delete("api/customer", { data: row })
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

    onSaveCustClick() {
      this.$refs.custForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/customer", this.custModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.custFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.custModel.UpdateColumns = this.$refs.custForm.UpdateColumns;
            console.log(this.custModel);
            if (this.custModel.UpdateColumns) {
              this.z_put("api/customer", this.custModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.custFormVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addCustVisiable = false;
            }
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>


.custFormPanel {
  /*position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;*/
  width: 1400px;
}

.gridTable {
  flex: 1;
}
</style>
