<template>
  <div>
    <!--<div class="custTypePanel">
      <div style="float:left;margin:2px 10px 2px 50px">客户分类</div>

      <el-button icon="el-icon-plus" circle size="mini"></el-button>
      <el-button icon="el-icon-minus" circle size="mini"></el-button>
    </div>-->

    <div class="meeting_type">
      

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
          placeholder="请输入会议类型名称"
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
          prop="mt_name"
          label="会议类型名称"
          width="300"
          align="center"
        >
        </el-table-column>


        <el-table-column
          prop="mt_note"
          label="会议类型说明"
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


    <el-dialog :title="addMetText" :visible.sync="metFormVisible" width="500px" close-on-click-model="false" @closed="refreshForm">
  <zj-form  :newDataFlag="metFormVisible" :model="meetModel" :rules="rules"  label-width="120px" label-position="right" style="width:400px" ref="meetForm" >
    
    
    <el-form-item label="会议类型名称" prop="mt_name">
      <el-input 
      v-model="meetModel.mt_name" 
      autocomplete="off"
      placeholder="请填写会议类型名称"
      ></el-input>
    </el-form-item>

    
    <el-form-item label="会议类型说明" prop="mt_note">
        <el-input 
        v-model="meetModel.mt_note" 
        placeholder="请填写会议类型说明">
        </el-input>
    </el-form-item>

  </zj-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="metFormVisible = false">取 消</el-button>
    <el-button type="primary" @click ="onSaveMeetClick('meetForm')">保 存</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
export default {
    
  data() {
    return {
      meetModel:{},
      metFormVisible: false,
      condition: "", 
      addMetText: "",
      tableData: [],
      currentRow: {},
      //custDataFilter: [],
      
      addOrNot: true,
      rules:{//新增客户校验规则
        mt_note:[
          {required:true, message:'编号不能为空', trigger:'blur'}
        ],
        mt_name:[
          {required:true, message:'姓名不能为空', trigger:'blur'}
        ],
  
      }

    };
  },



  
  methods: {
    refreshData() {

      this.tableData = [];
      this.currentRow = {};
      this.z_get("api/meeting_type/list", { condition: this.condition })
        .then(res => {
          //this.custDataFilter = res.dict.c_name;
          this.tableData = res.data;
        })
        .catch(res => {});
    },


  addNewCust() {
          this.metFormVisible = true;
          this.addOrNot = true;
          this.addMetText = "新增客户";
          this.meetModel = {

        mt_name: "",
        mt_note: "",

        
      
    }},
    //重置表单
    refreshForm() {
      this.$refs.meetForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //编辑数据
    editCustShow(row) {
      this.meetModel = JSON.parse(JSON.stringify(row));
      this.addMetText = "编辑客户信息";
      this.addOrNot = false;
      this.metFormVisible = true;
    },

    //删除一个
    deleteOne(row) {
      this.z_delete("api/meeting_type", { data: row })
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
      this.$refs.meetForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/meeting_type", this.meetModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.metFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.meetModel.UpdateColumns = this.$refs.meetForm.UpdateColumns;
            console.log(this.meetModel)
            if (this.meetModel.UpdateColumns) {
              this.z_put("api/meeting_type", this.meetModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.metFormVisible = false;
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

.meetFormPanel {
 /*position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;*/
  width:1100px;
}
.tbar {
  margin: 10px;
}</style>
