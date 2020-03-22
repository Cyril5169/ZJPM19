<template>
  <div class="tClassFormPanel">
    

    
      

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
          placeholder="请输入任务类型名称"
          style="width:300px;"
          size="small"
        >
          <el-button @click="refreshData" slot="append" icon="el-icon-search" size="small"
            >搜索</el-button
          >
        </el-input>

        <el-button
          type="primary"
          style="margin-left:10px;"
          @click="addNewTClass" size="small"
          >新增</el-button
        >
      </div>
      <div class="gridTable">
      <zj-table :data="tableData" height="100%"  border style="width:100% " row-key="t_class_id"  tooltip-effect="dark">
        <el-table-column type="index" label="序号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="t_class_name"
          label="任务分类名称"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="t_class_note"
          label="任务分类说明"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="t_upload_ornot"
          label="是否需要上传"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="t_create_bill_ornot"
          label="是否生单"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="t_bill_type"
          label="生单类型"
          width="150"
          align="center">
        </el-table-column>
        
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <!--<el-button size="mini"
              >详情</el-button>-->
            
            <el-button type="primary" icon="el-icon-edit" size="mini" circle  @click="editTClassShow(scope.row)"
              ></el-button>
            
            <el-button
              type="danger" icon="el-icon-delete" size="mini" circle
              @click="deleteOne(scope.row)"
              ></el-button>
            
          </template>
        </el-table-column>
      </zj-table>
    </div>


    <el-dialog :title="addTClassText" :visible.sync="tClassFormVisible" width="500px" close-on-click-model="false" @closed="refreshForm">
  <zj-form  :newDataFlag="tClassFormVisible" :model="tClassModel" :rules="rules"  label-width="120px" label-position="right" style="width:400px" ref="tClassForm" >
    <el-form-item label="任务分类名称"  prop="t_class_name" >
      <el-input v-model="tClassModel.t_class_name" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="任务分类说明" >
      <el-input v-model="tClassModel.t_class_note" autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item label="是否需要上传" prop="t_upload_ornot">
      <el-select v-model="tClassModel.t_upload_ornot" autocomplete="off">
      <el-option label="是" value="是"></el-option>
      <el-option label="否" value="否"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="是否生单" prop="t_create_bill_ornot">
      <el-select v-model="tClassModel.t_create_bill_ornot" autocomplete="off">
      <el-option label="是" value="是"></el-option>
      <el-option label="否" value="否"></el-option>
      </el-select>
    </el-form-item>
    

    <el-form-item label="生单类型" >
      <el-select v-model="tClassModel.t_bill_type" placeholder="请选择账号类别">
        <el-option label="物料单" value="物料单"></el-option>
      </el-select>
    </el-form-item>

    

  </zj-form>
  <div slot="footer" class="dialog-footer" style="text-align:center">
    <el-button @click="tClassFormVisible = false">取 消</el-button>
    <el-button type="primary" @click ="onSaveTClassClick('tClassForm')">保 存</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
export default {
    
  data() {
    return {
      tClassModel:{},
      tClassFormVisible: false,
      condition: "", 
      addTClassText: "",
      tableData: [],
      //currentRow: {},
      
      
      addOrNot: true,
      rules:{//新增用户校验规则
        t_class_name:[
          {required:true, message:'任务分类名称不能为空', trigger:'blur'}
        ],
       
        t_upload_ornot:[
          {required:true, message:'不能为空', trigger:'blur'}
        ],
        t_create_bill_ornot:[
          {required:true, message:'不能为空', trigger:'blur'}
        ],
      
       
        
      }
      
     
    };
  },



  
  methods: {
    refreshData() {

      this.tableData = [];
      this.z_get("api/task_classification/list", { condition: this.condition})
        .then(res => {
          
          this.tableData = res.data;
         
        })
        .catch(res => {});
    },


    addNewTClass() {
          this.tClassFormVisible = true;
          this.addOrNot = true;
          this.addTClassText = "新增任务分类";
          this.tClassModel = {
        
        t_class_id:"0",
        t_class_name: "",
        t_class_note: "",
        t_upload_ornot: "",
        t_bill_type: "",
        t_create_bill_ornot:"",
        
    }
        
    },
    //重置表单
    refreshForm() {
      this.$refs.tClassForm.resetFields();
    },

    search() {
      this.condition = "";
      this.refreshData();
    },

    //编辑数据
    editTClassShow(row) {
      this.tClassModel = JSON.parse(JSON.stringify(row));
      this.addTClassText = "编辑任务分类信息";
      this.addOrNot = false;
      this.tClassFormVisible = true;
    },

    //删除一个
    //deletelist
    deleteOne(row) {
      this.z_delete("api/task_classification", { data: row })
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

    
 

    onSaveTClassClick(){
      this.$refs.tClassForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/task_classification", this.tClassModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.tClassFormVisible = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
              });
          } else {
            this.tClassModel.UpdateColumns = this.$refs.tClassForm.UpdateColumns;
            console.log(this.tClassModel)
            if (this.tClassModel.UpdateColumns) {
              this.z_put("api/task_classification", this.tClassModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功!",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.tClassFormVisible = false;
                })
                .catch(res => {
                  this.$alert("编辑失败!", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                });
                } else {
              this.addTClassVisiable = false;
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


.tClassFormPanel {
 /*position: absolute;
  top: 80px;
  left: 230px;
  right: 0px;*/
  width:1100px;
}
.tbar {
  margin: 10px;
}
.gridTable {
  flex: 1;
}</style>
