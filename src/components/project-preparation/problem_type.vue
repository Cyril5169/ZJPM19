<template>
  <div>
    

    <div class="problem_type">
      

      <div class="tbar">
        <el-button
          icon="el-icon-refresh"
          title="刷新"
          size="mini"
          circle
          @click="search"
        ></el-button>
        <el-input
          @keyup.enter.native="refreshData" v-model="condition"
          placeholder="请输入异常分类名称"
          style="width:300px;"
        >
          <el-button @click="refreshData" slot="append" icon="el-icon-search"
            >搜索</el-button
          >
        </el-input>

        <el-button
          type="primary"
          style="margin-left:10px;"
          @click="addNewCust" size="small"
          >新增</el-button
        >
        <el-button type="primary" size="small">导入</el-button>
      </div>

      <el-table 
      :data="tableData" 
      height="100%"  
      border style="width:100% "  
      row-key="c_no" 
      tooltip-effect="dark">
        <el-table-column type="index" label="序号" width="120" align="center">
        </el-table-column>

        <el-table-column
          prop="pt_name"
          label="异常分类名称"
          width="300"
          align="center"
        >
        </el-table-column>


        <el-table-column
          prop="pt_note"
          label="异常分类说明"
          width="480"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <!--<el-button size="mini"
              >详情</el-button>-->
            
            <el-button type="primary" icon="el-icon-edit" size="mini" circle  @click="editCustShow(scope.row)"
              ></el-button>
            
            <el-button
              type="danger" icon="el-icon-delete" size="mini" circle
              @click="deleteOne(scope.row)"
              ></el-button>
            
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog :title="addProText" :visible.sync="proFormVisible" width="500px" close-on-click-model="false" @closed="refreshForm">
  <zj-form  :newDataFlag="proFormVisible" :model="problemModel" :rules="rules"  label-width="120px" label-position="right" style="width:400px" ref="problemForm" >
    
    
    <el-form-item label="异常分类名称" prop="pt_name">
      <el-input 
      v-model="problemModel.pt_name" 
      autocomplete="off"
      placeholder="请填写异常分类名称"
      ></el-input>
    </el-form-item>

    
    <el-form-item label="异常分类说明" prop="pt_note">
        <el-input 
        v-model="problemModel.pt_note" 
        placeholder="请填写异常分类说明">
        </el-input>
    </el-form-item>

  </zj-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="proFormVisible = false">取 消</el-button>
    <el-button type="primary" @click ="onSaveMeetClick('problemForm')">保 存</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
export default {
    
  data() {
    return {
      problemModel:{},
      proFormVisible: false,
      condition: "", 
      addProText: "",
      tableData: [],
      currentRow: {},
      //custDataFilter: [],
      
      addOrNot: true,
      rules:{//新增客户校验规则
        pt_note:[
          {required:true, message:'编号不能为空', trigger:'blur'}
        ],
        pt_name:[
          {required:true, message:'姓名不能为空', trigger:'blur'}
        ],
  
      }

    };
  },



  
  methods: {
    refreshData() {

      this.tableData = [];
      this.currentRow = {};
      this.z_get("api/problem_type/list", { condition: this.condition })
        .then(res => {
          //this.custDataFilter = res.dict.c_name;
          this.tableData = res.data;
        })
        .catch(res => {});
    },


  addNewCust() {
          this.proFormVisible = true;
          this.addOrNot = true;
          this.addProText = "新增客户";
          this.problemModel = {

        pt_name: "",
        pt_note: "",

        
      
    }},
    //重置表单
    refreshForm() {
      this.$refs.problemForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //编辑数据
    editCustShow(row) {
      this.problemModel = JSON.parse(JSON.stringify(row));
      this.addProText = "编辑客户信息";
      this.addOrNot = false;
      this.proFormVisible = true;
    },

    //删除一个
    deleteOne(row) {
      this.z_delete("api/problem_type", { data: row })
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

    
 

    onSaveMeetClick(){
      this.$refs.problemForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/problem_type", this.problemModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.proFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.problemModel.UpdateColumns = this.$refs.problemForm.UpdateColumns;
            console.log(this.problemModel)
            if (this.problemModel.UpdateColumns) {
              this.z_put("api/problem_type", this.problemModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.proFormVisible = false;
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
    },  
    

     
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.custTypePanel {
  text-align: center;
  position: absolute;
  width: 220px;
  top: 85px;
  left: 3px;
  bottom: 0px;
  
  padding: 2px;
  background-color: #ffffff;
}

.problemFormPanel {
 /*position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;*/
  width:1100px;
}
.tbar {
  margin: 10px;
}</style>
