<template>
  <div class="skill">
    <div class="containALL">
      <div class="topLayout">
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input @keyup.enter.native="refreshData" placeholder="请输入技能名称" v-model="condition"
            style="width:320px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
          <el-button type="primary" size="small" style="margin-left:10px;" @click="addNewskillShow('root')">新增技能信息</el-button>
         <el-button type="primary" size="small">导入</el-button>
          <el-button type="primary" size="small" :disabled="selection.length!=1" @click="addNewskillShow('children')">新增子节点</el-button>
          <el-button type="danger" size="small" :disabled="selection.length==0" @click="deleteList">删除选中节点({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
             
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
              <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="gridTable">
          <el-table ref="skillTable"  style="width: 100%" :data="skill" tooltip-effect="dark"
            highlight-current-row row-key="pc_no" default-expand-all @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>  
            <el-table-column prop="skill_name" label="技能名称" align="center" width="150"></el-table-column>
            <el-table-column prop="skill_note" label="技能说明" align="center" width="480"></el-table-column>
            <el-table-column label="操作" width="375" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editskillShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <el-dialog width="500px" :title="addskillText" :close-on-click-modal="false" :visible.sync="addskillVisiable"
      top="5vh" @closed="refreshForm">
   <zj-form :newDataFlag="addskillVisiable" :model="skillModel" :rules="rules"  label-width="120px" label-position="right" style="width:400px" ref="skillForm" >

        <el-form-item label="技能名称" prop="skill_name">
          <el-input class="formItem" v-model="skillModel.skill_name" placeholder="技能名称">
          </el-input>
        </el-form-item>

        <el-form-item label="技能说明">
          <el-input class="formItem" type="textarea" :rows="4" v-model="skillModel.skill_note" placeholder="技能说明">
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:center;margin-right:30px;">
          <el-button @click="addskillVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" @click="onSaveskillClick" style="margin-left:30px;">保&nbsp;&nbsp;存</el-button>
        </el-form-item>
        </zj-form>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "skill",
  data() {
    return {
      condition: "",
     
      skill: [], //表格数据
      selection: [],
      addskillVisiable: false,
      addskillFormVisiable:true,
      skillFormVisiable:false,
      skillModel: {},
      addOrNot: true, //是否新增
      addskillText: "",

      
    
      rules:{ skill_name:[
          {required:true, message:'技能名称不能为空', trigger:'blur'}
        ],
          skill_note:[
          {required:true, message:'技能说明不能为空', trigger:'blur'}
        ],    


      },
      
      add_rules: {
        skill_name: [{ required: true, message: "请填写技能名称", trigger: "blur" }]        
      },
    };
  },
  mounted() {
    this.refreshData();
  },
  
  methods: {
    refreshData() {      
      this.z_get("api/skill/list", {
        condition: this.condition
      })
        .then(res => {
          this.skill = res.data;
        })
        .catch(res => {});
    },

    //重置表单
    refreshForm() {
      this.$refs.skillForm.resetFields();
    },
    search() {
      this.condition = "";
      this.refreshData();
    },
    //表格树选中改变
    handleSelectionChange(val) {
      this.selection = val;      
    },
   
    addNewskillShow() {
      this.skillModel = {
        // skill_name: 1,
        // skill_name: skill_name,
        skill_name: "",
        skill_note: ""
      };
      this.addOrNot = true;
      this.addskillVisiable = true;
    },
    onSaveskillClick() {
      this.$refs.skillForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            this.z_post("api/skill", this.skillModel)
              .then(res => {
                this.$message({
                  message: "新增成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addskillVisiable = false;
              })
              .catch(res => {
                this.$alert("新增失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          } else { 
               this.skillModel.UpdateColumns = this.$refs.skillForm.UpdateColumns;
            if (this.skillModel.UpdateColumns) {
            
          
            this.z_put("api/skill", this.skillModel) 
              .then(res => {
                this.$message({
                  message: "编辑成功",
                  type: "success",
                  duration: 1000
                });
                this.refreshData();
                this.addskillVisiable = false;
              })
              .catch(res => {
                this.$alert("编辑失败", "提示", {
                  confirmButtonText: "确定",
                  type: "error"
                });
                console.log(res);
              });
          
          }
          else{
            this.refreshData();
                this.addskillVisiable = false;
          }
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    editskillShow(row) {
      this.skillModel = JSON.parse(JSON.stringify(row));
     
      this.addOrNot = false;
      this.addskillVisiable = true;
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //删除树
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除？节点下的子节点将一并删除！", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          //var realSelect = this.arrayChildrenFlatten(list, []);
          this.z_delete("api/skill/list", { data: list })
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
                type: "error"
              });
              console.log(res);
            });
        })
        .catch(() => {});
    },

    //多维数组扁平化
    arrayChildrenFlatten(array, result) {
      for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item.children && item.children.length > 0) {
          result.push(item);
          result = this.arrayChildrenFlatten(item.children, result);
        } else {
          result.push(item);
        }
      }
      return result;
    },

    //点击行可以切换选中状态
    handleRowClick(row, column) {
      if (column.property != "handle")
        this.$refs.skillTable.toggleRowSelection(row);
    },
    expandAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") == -1) {
            icon[i].click();
          }
        }
      }
    },
    collapseAll() {
      var icon = this.$el.getElementsByClassName("el-table__expand-icon");
      if (icon && icon.length) {
        for (var i = 0; i < icon.length; i++) {
          var classList = [];
          for (var j = 0; j < icon[i].classList.length; j++) {
            classList.push(icon[i].classList[j]);
          }
          if (classList.indexOf("el-table__expand-icon--expanded") > -1) {
            icon[i].click();
          }
        }
      }
    },
      //全选选中子节点
    handleSelectAll(selection) {
      var val = this.skill;
      var select = false;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].pc_no == val[0].pc_no) {
          select = true;
          break;
        }
      }
      for (var i = 0; i < val.length; i++) {
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },
    //选中子节点
    selectChildren(val, select) {
      for (var i = 0; i < val.length; i++) {
        if (select && this.selection.indexOf(val[i]) == -1) {
          this.$refs.proclassTable.toggleRowSelection(val[i]);
        } else if (!select && this.selection.indexOf(val[i] > -1)) {
          this.$refs.proclassTable.toggleRowSelection(val[i]);
        }
        if (val[i].children && val[i].children.length) {
          this.selectChildren(val[i].children, select);
        }
      }
    },

  }
};
</script>


<style scoped>
.skill {
  width: 1100px;
}
.formItem {
  width: 300px;
  /* margin-left: 55px; */
}


</style>-->


              
 






    <!-- <el-input 
          size="small" 
          @keyup.enter.native="refreshData" 
          placeholder="请输入技能名称" 
          v-model="condition" clearable
            style="width:250px;">
            <el-button 
            size="small" 
            @click="refreshData" 
            slot="append" 
            icon="el-icon-search"
            >搜索</el-button>
       </el-input>

     <el-button 
          type="primary" 
          size="small" 
          style="margin-left:10px;" 
          @click="addEmpShow('root')"
          >新增
          </el-button>

      <el-button 
          type="danger" 
          size="small" :disabled="selection.length==0" >
            导入
          </el-button>
        </div>
      <div class="gridTable">

          <el-table 
          ref="taskTable" 
          style="width: 100%;" 
          height="250px" 
          :data="taskData" tooltip-effect="dark"
          highlight-current-row row-key="emp_no" 
          default-expand-all 
          @selection-change="handleSelectionChange"
          @select-all="handleSelectAll" 
          @row-click="handleRowClick">
           </el-table>

      <el-table-column 
            prop="skill_name" 
            label="技能名称" 
            align="center" 
            width="100"
            ></el-table-column>
      
       <el-table-column 
            prop="skill_note" 
            label="技能说明" 
            align="center" 
            width="100"
            ></el-table-column>
          </el-tabs>
          </div>
        </div>
      </div>
    </div>

    

<!--<style scoped>
.employee {
  width: 1100px;
}
.formItem {
  width: 300px;
}
.formItem2 {
  width: 200px;
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