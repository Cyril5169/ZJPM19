<template>
  <div class="s_dept">
    <div class="containAll">
      <div class="leftContent">
        <div>
          <div class="tbar">
            <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search()"></el-button>
            <el-input size="small" @keyup.enter.native="getDeptShiftData" placeholder="请输入部门名称" v-model="condition"
              style="width:180px;">
              <el-button @click="getDeptShiftData" slot="append" icon="el-icon-search"></el-button>
            </el-input>
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
          <div class="topContent" style="height:432px">
            <el-table ref="deptTable" style="width: 100%" height="100%" :data="s_deptData" tooltip-effect="dark"
              highlight-current-row row-key="dept_id" default-expand-all @row-click="handleRowClick">
              <el-table-column prop="dept_name" label="部门名称" style="width:95%" align="left"></el-table-column>
              <el-table-column prop="sg_name" label="班次" width="100px" align="center">
                <!-- <template slot-scope="scope">
                  <span @click="showDeptShift(scope.row.dept_id)" class="buttonLike">
                    {{scope.row.sg_name|sg_nameFilter}}
                  </span>
                </template> -->
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="rightContent">
        <el-tabs style="display:inline-block;width:100%;" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="排班人员维护" name="deptEmployee">
              <keep-alive>
            <sdEmplyoee v-if="isChildEmployee" :currentRow='currentRow' ></sdEmplyoee>
              </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="排班班次维护"  name="deptShift">
            <keep-alive>
            <sdShift v-if="isChildEmployee" :currentRow='currentRow' @getDeptShiftData="getDeptShiftData" ></sdShift>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>

 
  </div>
</template>

<script>
import sdShift from "./sd_shift";
import sdEmplyoee from "./sd_emplyoee";
export default {
  name: "s_dept",
  components: {
    sdShift,
    sdEmplyoee,
  },
  data() {
    return {
      s_deptData: [], //部门联合班次组数据
      s_deptDataFlat: [],//扁平化一维数组
      currentRow:{},//用来传递选中的一条部门数据对象

      editSdShiftVisiable: false,
      condition: "",
     
  
      shiftListData: [],
      selection: [],
      addDeptVisiable: false,
      deptModel: {},
      addOrNot: true, //是否新增
      addDeptText: "",
      activeName: "deptShift",
      deptIdSelect: 0, //传入tab的部门id，注意类型
 
      isChildEmployee: true, //保证tab不会同时渲染所有tab，且每次点击某tab都会重新渲染该tab
      
      add_rules: {
        dept_name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        dept_type_id: [
          { required: true, message: "请输入部门类型", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getDeptShiftData();
    // this.refreshShiftOptionsModel();
  },
  filters: {
    sg_nameFilter(value) {
      if (value == null) return "前往设置"
      return value
    },
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
    deptTypeTrans(value) {
      switch (value) {
        case 1:
          return "部门";
          break;
        case 2:
          return "小组";
          break;
      }
    },
  },
  methods: {

  fatherMethod() {
        console.log('测试刷新');
      },
    //平铺部门班次
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
  
 
    getDeptShiftData() {
      this.z_get("api/dept/shift")
        .then(res => {
          this.s_deptData = res.data;
          this.s_deptDataFlat = this.arrayChildrenFlatten(res.data, []);

        })
        .catch(res => { });
    },
  
    //重置表单
    refreshForm() {
      this.$refs.deptForm.resetFields();
    },
    search() {
      this.condition = "";
      this.getDeptShiftData();
    },
    //标签页切换
    handleClick(tab) {
      // var tabName = tab.name;
      // switch (tab.name) {
      //   case "deptEmployee":
      //     this.isChildEmployee = true,
      //     this.isChildShift = false; 
      //     break;
      //      case "deptShift":
      //     this.isChildEmployee = false,
      //     this.isChildShift = true; 
      //     break;
      // }
    },
      //点击任务行显示下面
    handleRowClick(row, column) {
        //错误示例：Vue不能监听此种赋值变化
    //   this.currentRow.sg_id=row.sg_id;
    //   this.currentRow.dept_id = row.dept_id;
    //   this.currentRow.dept_name = row.dept_name;
      if (column.property == "handle") {
        return;
      }
      if (JSON.stringify(this.currentRow) != JSON.stringify(row)) {
        this.currentRow = row;
      }
      //this.bottomDivShow = true;
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
    }
  },

};
</script>

<style scoped>
.s_dept {
  width: 1200px;
}
.formItem {
  width: 300px;
}
.leftContent {
  width: 40%;
  position: absolute;
  display: flex;
  display: -webkit-flex;
}
.rightContent {
  float: right;
  width: 69%;
}
.buttonLike {
  /* background-color: #409eff; */
  cursor: pointer;
  color: #409eff;
  font-weight: bold;
}
</style>