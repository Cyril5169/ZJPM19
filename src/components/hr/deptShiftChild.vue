<template>
  <div class="deptShiftTab">
    <el-card shadow="hover" class="centerCard">
      <div>
        <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入班次名称" v-model="condition"
            style="width:300px;">
            <el-button @click="refreshData" slot="append" icon="el-icon-search">搜 索</el-button>
          </el-input>
          <el-button size="small" type="primary" style="margin-left:10px;" @click="addNewDeptShiftShow()">新增部门班次</el-button>
          <el-button size="small" type="danger" :disabled="selection.length==0" @click="deleteList">
            批量删除({{selection.length}})
          </el-button>
        </div>
        <div style="width:100%;height:370px;">
          <el-table ref="deptShiftTable" style="width: 100%" height="100%" :data="deptShiftData" tooltip-effect="dark"
            highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column type="index" width="70" align="center" label="序号">
            </el-table-column>
            <el-table-column prop="sg_name" label="班次名称" align="center" width="140"></el-table-column>
            <el-table-column prop="sg_note" label="班次说明" align="center"></el-table-column>
            <el-table-column prop="dsg_startdate" label="开始使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_startdate| datetrans}}
              </template>
            </el-table-column>
            <el-table-column prop="dsg_enddate" label="结束使用时间" align="center" width="130">
              <template slot-scope="scope">{{ scope.row.dsg_enddate | datetrans}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110" prop="handle">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editShow(scope.row)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteOne(scope.row)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <!-- 新增部门班次 -->
    <el-dialog :width=" deptShiftModelList.length? '820px':'400px'" title="新增部门班次" :close-on-click-modal="false"
      :visible.sync="addDeptShiftVisiable">
      <div class="transferDiv">
        <div class="leftTransferItem">
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="searchShift"></el-button>
            <el-input size="small" @keyup.enter.native="refreshShiftList" placeholder="请输入班次组名称" v-model="shiftCondition"
              clearable style="width:250px;">
              <el-button size="small" @click="refreshShiftList" slot="append" icon="el-icon-search">搜索</el-button>
            </el-input>
          </div>
          <div>
            <span style="color:gray;font-size:12px;">*双击选择班次组</span>
            <el-table ref="itemListTable" style="width:100%;" height="300" :data="shiftListData" tooltip-effect="dark"
              @row-dblclick="handleRowDbClcik" border stripe>
              <el-table-column prop="sg_name" label="班次组名称" align="center"></el-table-column>
              <el-table-column prop="sg_note" label="班次组说明" align="center"></el-table-column>
            </el-table>
            <div style="margin:0 15%;">
              <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="limit"
                layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
        <div class="rightTransferItem" v-if="deptShiftModelList.length">
          <fieldset class="oneItem" v-for="(item,index) in deptShiftModelList" :key="index">
            <legend>班次组{{index+1}} <el-button type="danger" icon="el-icon-delete" size="mini" circle
                @click="deleteSelectShift(index)"></el-button>
            </legend>
            <el-form size="small" :model="item" label-width="110px" :rules="add_rules">
              <el-form-item label="班次组" prop="sg_id">
                <el-select v-model="item.sg_id" placeholder="请选择班次组" disabled>
                  <el-option v-for="item in shiftDataFilter" :key="item.value" :label="item.display" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开始使用日期" prop="dsg_startdate">
                <el-date-picker v-model="item.dsg_startdate" type="date" format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束使用日期" prop="dsg_enddate">
                <el-date-picker v-model="item.dsg_enddate" type="date" format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </fieldset>
        </div>
        <div class="bottomButton" v-if="deptShiftModelList.length">
          <el-button size="medium" @click="addDeptShiftVisiable = false">取&nbsp;&nbsp;消</el-button>
          <el-button type="primary" size="medium" @click="onSaveDeptShiftListClick" style="margin-left:30px;">
            保&nbsp;&nbsp;存
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 保存部门班次至待提交部门班次集合/编辑部门班次记录 -->
    <el-dialog width="400px" :title="addDeptShiftText" :close-on-click-modal="false"
      :visible.sync="selectDeptShiftVisiable" top="25vh" @closed="refreshForm" :append-to-body="true">
      <zj-form :newDataFlag='selectDeptShiftVisiable' :model="deptShiftModel" label-width="100px" ref="deptShiftForm"
        :rules="add_rules">
        <el-form-item label="班次组" prop="sg_id">
          <el-select v-model="deptShiftModel.sg_id" ref="select_shift" placeholder="请选择班次组" disabled>
            <el-option v-for="item in shiftDataFilter" :key="item.value" :label="item.display" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始使用日期" prop="dsg_startdate">
          <el-date-picker v-model="deptShiftModel.dsg_startdate" type="date" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束使用日期" prop="dsg_enddate">
          <el-date-picker v-model="deptShiftModel.dsg_enddate" type="date" format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="text-align:center;margin-right:20px;">
          <el-button type="primary" @click="onSaveDeptShiftClick" style="margin-left:-60px;">保&nbsp;&nbsp;存</el-button>
          <el-button @click="selectDeptShiftVisiable = false">取&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </zj-form>
    </el-dialog>
  </div>
</template>

<script>
import print from "print-js";
import Axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "depShiftChild",
  props: ["deptName", "deptId"],
  data() {
    return {
      condition: "", //部门班次中的班次数据筛选关键字
      shiftCondition: "", //新增部门班次中的班次数据的筛选关键字
      deptShiftData: [], //表格数据
      deptShiftModel: {}, //待提交的部门班次实例
      deptShiftModelList: [], //待提交的部门班次集合
      addDeptShiftText: "",
      addOrNot: true,
      selection: [], //选中项
      selectDeptShiftVisiable: false, //显示保存部门班次实例至待提交部门班次集合或编辑部门班次记录
      addDeptShiftVisiable: false, //显示新增部门班次界面
      shiftListData: [], //所有班次组数据
      shiftDataFilter:[],//班次数据的渲染
      currentPage: 1, //当前页（所有班次组）
      limit: 10, //每页最多展示的记录数
      total: 0, //查询到的总记录数
      add_rules: {
        sg_id: [{ required: true, message: "请选择班次", trigger: "change" }]
      }
    };
  },
  watch: {
    deptId(val) {
      if (val) {
        this.refreshData();
      }
    },
    // selectDeptShiftVisiable(val) {
    //   if (val) {
    //     this.selectShift();
    //   }
    // }
  },
  methods: {
    //查找所有班次组数据
    searchShift() {
      this.shiftCondition = "";
      this.refreshShiftList();
    },
    //查找带筛选条件的班次组数据
    refreshShiftList() {
      this.shiftListData = [];
      this.z_get(
        "api/shift_group/page",
        {
          condition: this.shiftCondition,
          page: this.currentPage,
          limit: this.limit
        },
        { loading: false }
      )
        .then(res => {
          if (res.code == 0) {
            this.shiftDataFilter = res.dict.sg_id;
            this.shiftListData = res.data;
            this.total = res.total;
          }
        })
        .catch(res => {});
    },
    //查找当前部门班次数据
    search() {
      this.condition = "";
      this.refreshData();
    },
    //查找带筛选条件的部门班次数据
    refreshData() {
      this.z_get("api/dept_shift_group/dept_shift", {
        condition: this.condition,
        deptId: this.deptId
      })
        .then(res => {
          this.deptShiftData = res.data.dic;
        })
        .catch(res => {});
    },
    addNewDeptShiftShow() {
      this.deptShiftModelList = [];
      this.addOrNot = true;
      this.addDeptShiftVisiable = true;
    },
    //保存实例至待提交部门班次集合/编辑部门班次记录
    onSaveDeptShiftClick() {
      this.$refs.deptShiftForm.validate(valid => {
        if (valid) {
          if (this.addOrNot) {
            //新增
            this.deptShiftModelList.push(
              JSON.parse(JSON.stringify(this.deptShiftModel))
            );
            this.selectDeptShiftVisiable = false;
          } else {
            this.deptShiftModel.UpdateColumns = this.$refs.deptShiftForm.UpdateColumns;
            if (this.deptShiftModel.UpdateColumns) {
              this.z_put("api/dept_shift_group", this.deptShiftModel)
                .then(res => {
                  this.$message({
                    message: "编辑成功",
                    type: "success",
                    duration: 1000
                  });
                  this.refreshData();
                  this.selectDeptShiftVisiable = false;
                })
                .catch(res => {
                  this.$alert("编辑失败", "提示", {
                    confirmButtonText: "确定",
                    type: "error"
                  });
                  console.log(res);
                });
            }
          }
        } else {
          return false;
        }
      });
    },
    //编辑数据
    editShow(row) {
      this.deptShiftModel = JSON.parse(JSON.stringify(row));
      this.addDeptShiftText = "编辑部门班次";
      this.addOrNot = false;
      this.selectDeptShiftVisiable = true;
    },
    refreshForm() {
      this.$refs.deptShiftForm.resetFields();
    },
    //表格选中改变
    handleSelectionChange(val) {
      this.selection = val;
    },
    //删除一个
    deleteOne(row) {
      var list = [];
      list.push(row);
      this.onDeleteClick(list);
    },
    //批量删除
    deleteList() {
      if (this.selection.length) {
        this.onDeleteClick(this.selection);
      }
    },
    onDeleteClick(list) {
      this.$confirm("是否删除选中项？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_delete("api/dept_shift_group/dept_shift_list", { data: list })
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
              console.log(res);
            });
        })
        .catch(() => {});
    },
    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.refreshShiftList();
    },
    //删除待提交的部门班次集合中的班次组
    deleteSelectEmp(index) {
      this.deptShiftModelList.splice(index, 1);
    },
    //双击选中班次
    handleRowDbClcik(row) {
      this.deptShiftModel = {
        dsg_id:0,
        c_id: 1, //现在先写死，到时候通过缓存给该变量赋值
        dept_id: this.deptId,
        sg_id: row.sg_id,
        dsg_startdate: "",
        dsg_enddate: ""
      };
      var isContain = false;
      for (var i = 0; i < this.deptShiftData.length; i++) {
        if (this.deptShiftData[i].sg_id == this.deptShiftModel.sg_id) {
          isContain = true;
          break;
        }
      }
      for (var i = 0; i < this.deptShiftModelList.length; i++) {
        if (this.deptShiftModelList[i].sg_id == this.deptShiftModel.sg_id) {
          isContain = true;
          break;
        }
      }
      if (isContain) {
        this.$alert("已存在该班次组!", "提示", {
          confirmButtonText: "好的",
          type: "warning"
        });
      } else {
        this.addOrNot = true;
        this.selectDeptShiftVisiable = true;
      }
    },
    //提交新增的部门班次集合
    onSaveDeptShiftListClick() {
      this.$confirm("是否提交新增的部门班次？", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.z_post("api/dept_shift_group/dept_shift_list", this.deptShiftModelList)
            .then(res => {
              this.$message({
                message: "新增成功!",
                type: "success",
                duration: 1000
              });
              this.addDeptShiftVisiable = false;
              this.refreshData();
            })
            .catch(res => {
              this.$alert("新增失败!", "提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            });
        })
        .catch(() => {});
    }
  },
  filters: {
    transIsScheduling: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsAuthority: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsMainDept: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    transIsManager: function(value) {
      switch (value) {
        case true:
          return "是";
          break;
        case false:
          return "否";
          break;
      }
    },
    datetrans(value) {
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
    }
  },
  created() {
    // this.searchShift();
  }
};
</script>

<style scoped>
.centerCard {
  margin: 0 auto;
  position: relative;
}
.formItem {
  width: 200px;
}
.transferDiv {
  display: inline;
}
.leftTransferItem {
  display: inline-block;
  vertical-align: middle;
  width: 360px;
  height: 400px;
}
.rightTransferItem {
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: 380px;
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