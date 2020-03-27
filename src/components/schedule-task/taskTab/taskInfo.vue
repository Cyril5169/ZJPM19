<template>
  <div>
     <div class="gridTable">
          <el-table :height="bottomDivShow?'200px':'350px'" ref="tableData" style="width: 100%" :data="tableData"
            tooltip-effect="dark" highlight-current-row border row-key="t_id" @selection-change="handleSelectionChange"
            @select-all="handleSelectAll" @row-click="handleRowClick">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="55" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="emp_id" label="负责人" align="center"></el-table-column>
            <el-table-column prop="dept_id" label="负责部门" align="center">
               <template slot-scope="scope">{{filterDeptName(scope.row.dept_id)}}</template>

            </el-table-column>
            <el-table-column prop="t_early_startdate" label="计划开始时间" align="center">
            </el-table-column>
            <el-table-column prop="t_last_enddate" label="计划结束时间" align="center">
               <template slot-scope="scope">{{scope.row.t_last_enddate | renderFilter(datetrans)}}</template>
            </el-table-column>
            <el-table-column prop="t_note" label="任务备注" align="center"></el-table-column>
            
          </el-table>
        </div>

 
  </div>
</template>


<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
// </script>
// <script>
// export default {
//   props: ["currentRow", "source", "autoHeight"],
//   data() {
//     return {
//       dataCondition: "",
//       dataSelection: [],
//       taskDataData: [],
//       dataTpyeList: [],
//       dataFileModel: {},
//       addOrNot: true,
//       addTaskDataVisible: false,
//       loading: false,
//       tdType_options: [
//         {
//           value: "input",
//           label: "输入"
//         },
//         {
//           value: "output",
//           label: "输出"
//         }
//       ]
//     };
//   },
//   watch: {
//     currentRow: {
//       deep: true,
//       immediate: true,
//       handler() {
//         this.searchData();
//       }
//     }
//   },
//   filters: {
//     tdTypeFilter(value) {
//       switch (value) {
//         case "input":
//           return "输入";
//           break;
//         case "output":
//           return "输出";
//           break;
//       }
//     }
//   },
//   methods: {
//     //查询满足条件的任务的资料需求
//     refreshDataData() {
//       this.loading = true;
//       this.taskDataData = [];
//       this.z_get(
//         "api/task_data",
//         {
//           pp_id: this.source == "plan" ? this.currentRow.pp_id : null,
//           t_id: this.currentRow.t_id,
//           condition: this.dataCondition,
//           source: this.source
//         },
//         { loading: false }
//       )
//         .then(res => {
//           this.loading = false;
//           this.taskDataData = res.data;
//         })
//         .catch(res => {});
//     },
//     //查询任务的所有资料需求
//     searchData() {
//       this.dataCondition = "";
//       this.refreshDataData();
//     },
//     //获取资料类型数据
//     getDataTypeList() {
//       this.dataTpyeList = [];
//       this.z_get("api/document_data_type", {}, { loading: false })
//         .then(res => {
//           if (res.code == 0) {
//             this.dataTpyeList = res.data;
//             for (var i = 0; i < this.dataTpyeList.length; i++) {
//               this.dataTpyeList[i].label = this.dataTpyeList[i].ddt_name;
//               this.dataTpyeList[i].value = this.dataTpyeList[i].ddt_id;
//             }
//           }
//         })
//         .catch(res => {});
//     },
//     //显示新增资料需求
//     addNewTaskDataShow() {
//       this.dataFileModel = {
//         td_id: 0,
//         pp_id: this.currentRow.pp_id,
//         t_id: this.currentRow.t_id,
//         td_name: "",
//         ddt_id: "", //是否是漏了
//         td_note: "",
//         td_quantity: 1,
//         td_type: "output",
//         td_source: this.source,
//         td_isdone: 0
//       };
//       this.addOrNot = true;
//       this.addTaskDataVisible = true;
//     },
//     //新增/编辑资料需求
//     onSaveTaskDataClick() {
//       this.$refs.taskDataForm.validate(valid => {
//         if (valid) {
//           if (this.addOrNot) {
//             this.z_post("api/task_data", this.dataFileModel)
//               .then(res => {
//                 this.$message({
//                   message: "新增成功!",
//                   type: "success",
//                   duration: 1000
//                 });
//                 this.refreshDataData();
//                 this.addTaskDataVisible = false;
//               })
//               .catch(res => {
//                 this.$alert("新增失败!", "提示", {
//                   confirmButtonText: "确定",
//                   type: "error"
//                 });
//               });
//           } else {
//             this.dataFileModel.UpdateColumns = this.$refs.taskDataForm.UpdateColumns;
//             if (this.dataFileModel.UpdateColumns) {
//               this.z_put("api/task_data", this.dataFileModel)
//                 .then(res => {
//                   this.$message({
//                     message: "编辑成功!",
//                     type: "success",
//                     duration: 1000
//                   });
//                   this.refreshDataData();
//                   this.addTaskDataVisible = false;
//                 })
//                 .catch(res => {
//                   this.$alert("编辑失败!", "提示", {
//                     confirmButtonText: "确定",
//                     type: "error"
//                   });
//                 });
//             } else {
//               this.addTaskDataVisible = false;
//             }
//           }
//         }
//       });
//     },
//     //显示编辑资料
//     editTaskDataShow(row) {
//       this.dataFileModel = JSON.parse(JSON.stringify(row));
//       this.addOrNot = false;
//       this.addTaskDataVisible = true;
//     },
//     //删除单个资料需求
//     deleteOneData(row) {
//       var list = [];
//       list.push(row);
//       this.onDeleteDataClick(list);
//     },
//     //删除多个资料需求
//     deleteListData() {
//       if (this.dataSelection.length) {
//         this.onDeleteDataClick(this.dataSelection);
//       }
//     },
//     //确认删除资料需求
//     onDeleteDataClick(list) {
//       this.$confirm("是否删除资料？", "提示", {
//         confirmButtonText: "是",
//         cancelButtonText: "否",
//         type: "warning"
//       })
//         .then(() => {
//           this.z_delete("api/task_data/list", { data: list })
//             .then(res => {
//               this.$message({
//                 message: "删除成功!",
//                 type: "success",
//                 duration: 1000
//               });
//               this.refreshDataData();
//             })
//             .catch(res => {
//               this.$alert("删除失败:" + res.msg, "提示", {
//                 confirmButtonText: "确定",
//                 type: "error"
//               });
//             });
//         })
//         .catch(() => {});
//     },
//     //当前选中的节点
//     handleSelectionChange(val) {
//       this.dataSelection = val;
//     }
//   },
//   created(){
//     this.getDataTypeList();
//   },
// };
// </script>

<style scoped>
.gridTable {
  flex: 1;
}
</style>