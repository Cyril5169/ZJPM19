<template>
  <div class="userFormPanel">
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
        placeholder="请输入用户名称"
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
        @click="addNewUser"
        size="small"
        >新增</el-button
      >
    </div>
    <div class="gridTable">
      <zj-table
        :data="userData"
        height="100%"
        border
        style="width:100% "
        row-key="user_id"
        tooltip-effect="dark"
      >
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="账号ID"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="login_name"
          label="用户名"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="password"
          label="用户密码"
          width="240"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="emp_id"
          label="账号所属人"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.emp_id | renderFilter(empDataFilter) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="user_type"
          label="账号类别"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.user_type | userTypeTrans }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="账号状态"
          width="149"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.status | statusTrans }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="editUserShow(scope.row)"
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
      :title="addUserText"
      :visible.sync="userFormVisible"
      width="500px"
      close-on-click-model="false"
      @closed="refreshForm"
    >
      <zj-form
        :newDataFlag="userFormVisible"
        :model="userModel"
        :rules="rules"
        label-width="120px"
        label-position="right"
        style="width:400px"
        ref="userForm"
      >
        <el-form-item label="账号ID" prop="user_id">
          <el-input v-model="userModel.user_id"  placeholder="系统自动生成"  disabled ></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="login_name">
          <el-input
            v-model="userModel.login_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="userModel.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="账号所属人" prop="emp_id">
       <!-- <el-input v-model="userModel.emp_id" autocomplete="off"></el-input>-->
         
          <el-select 
          v-model="userModel.emp_id" 
          ref="select_emp" 
          placeholder="请选择账号所属人">
            <el-option 
            :label="userModel.emp_name" 
            :value="userModel.emp_id" 
            style="height:auto;padding:0;">
            <el-tree 
              :data="empData" 
              node-key="emp_id" 
              ref="tree" 
              default-expand-all 
              :expand-on-click-node="false"
              highlight-current 
              :current-node-key="userModel.emp_id">
                <div 
                slot-scope="{node, data}" 
                style="width:100%;user-select:none;"
                  @click="handleSelectTreeDblClick(data)">
                  {{data.emp_name}}</div>
              </el-tree>
            </el-option>
          </el-select>




        </el-form-item>

        <el-form-item label="账号类别" prop="user_type">
          <el-select v-model="userModel.user_type" placeholder="请选择账号类别">
            <el-option label="员工" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账号状态" prop="status">
          <el-select v-model="userModel.status" placeholder="请选择账号状态">
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </zj-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="userFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSaveUserClick('userForm')"
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
      userModel: {},
      userFormVisible: false,
      condition: "",
      addUserText: "",
      userData: [],
      empDataFilter:[],
      currentRow: {},
      empData:[],

      addOrNot: true,
      rules: {
        //新增用户校验规则
        // user_id: [
        //   { required: true, message: "用户ID不能为空", trigger: "blur" }
        // ],
        login_name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        emp_id: [
          { required: true, message: "账号所属人不能为空", trigger: "blur" }
        ],

        user_type: [
          { required: true, message: "账号类别不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "帐号状态不能为空", trigger: "change" }
        ]
      }

      /*  userData: [{
          user_id: '2020',
          login_name: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          emp_id:'大用户',
          user_type:'重要'
        }, {
          user_id: '2020',
          login_name: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          emp_id:'大用户',
          user_type:'重要'
        }, {
          user_id: '2020',
          login_name: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          emp_id:'大用户',
          user_type:'重要'
        }, {
          user_id: '2020',
          login_name: '王小虎',
          password: '上海市普陀区金沙江路 1518 弄',
          emp_id:'大用户',
          user_type:'重要'
        },] */
    };
  },

  filters: {
    userTypeTrans(value) {
      switch (value) {
        case 1:
          return "员工";
          break;
        // case 0:
        //   return "女性";
        //   break;
      }
    },
    statusTrans(value) {
      switch (value) {
        case 1:
          return "停用";
          break;
        case 0:
          return "启用";
          break;
      }
    }
  },

  methods: {
    refreshData() {
      this.userData = [];
      this.currentRow = {};
      this.z_get("api/userinfo/list", { condition: this.condition })
        .then(res => {
          this.userData = res.data;
          this.empDataFilter = res.dict.emp_id;
          
        })
        .catch(res => {});
    },

    addNewUser() {
      this.userFormVisible = true;
      this.addOrNot = true;
      this.addUserText = "新增用户";
      this.userModel = {
        //user_id: "",
        login_name: "",
        password: "",
        user_type: "",
        status: "0",
        emp_id: "",
        c_id: "1"
      };
    },
    //重置表单
    refreshForm() {
      this.$refs.userForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },
        //刷新dialog里的员工数据
    selectEmp() {
      this.z_get("api/employee", { condition: "" }, { loading: false })
        .then(res => {
          //如果不一样才赋值
          if (JSON.stringify(this.empData) != JSON.stringify(res.data)) {
            this.empData = res.data;
          }
        })
        .catch(res => {});
    },
    handleSelectTreeDblClick(data) {
      this.userModel.emp_id = data.emp_id;
      this.userModel.emp_name = data.emp_name;
      this.$refs.select_emp.blur();
    },
    //编辑数据
    editUserShow(row) {
      this.userModel = JSON.parse(JSON.stringify(row));
            this.userModel.emp_name = this.renderFilter(
        this.userModel.emp_id,
        this.empDataFilter
      );
      this.addUserText = "编辑用户信息";
      this.addOrNot = false;
      this.userFormVisible = true;
    },

    //删除一个
    //deletelist
    deleteOne(row) {
      this.z_delete("api/userinfo", { data: row })
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

    onSaveUserClick() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/userinfo", this.userModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.userFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.userModel.UpdateColumns = this.$refs.userForm.UpdateColumns;
            console.log(this.userModel);
            if (this.userModel.UpdateColumns) {
              this.z_put("api/userinfo", this.userModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.userFormVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
            } else {
              this.addUserVisiable = false;
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
    this.selectEmp();
  }
};
</script>

<style scoped>
.userFormPanel {
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
