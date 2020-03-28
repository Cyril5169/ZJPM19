<template>
  <div class="taskReleased">
    <div class="containAll">
      <div class="topLayout">
        <!-- <div class="tbar">
          <el-button icon="el-icon-refresh" title="刷新" size="mini" circle @click="search"></el-button>
          <el-input size="small" @keyup.enter.native="refreshData" placeholder="请输入任务名称" v-model="condition" clearable
            style="width:200px;">
          </el-input>
          <span style="font-size:15px;margin-left:10px">项目号:</span>
          <el-select size="small" v-model="select_project" @change="refreshData" ref="select_project"
            placeholder="请选择项目">
            <el-option v-for="item in project_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="small" :disabled="selection.length==0" @click="ReleseTask(1)">
            撤销排班({{selection.length}})
          </el-button>
          <el-button type="primary" size="small" :disabled="selection.length==0" @click="ReleseTask(2)">
            撤销发布({{selection.length}})
          </el-button>
          <el-dropdown style="margin-left:10px;">
            <el-button size="small">
              报工操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="expandAll">展开所有节点</el-dropdown-item>
              <el-dropdown-item @click.native="collapseAll" divided>折叠所有节点</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
        <div class="gridTable">

        </div>
      </div>
      <div class="bottomLayout">

      </div>
    </div>
  </div>
</template>


<script>
import taskExecutor from "@/components/schedule-task/taskTab/taskExecutor";
import taskMaterial from "@/components/schedule-task/taskTab/taskMaterial";
import taskData from "@/components/schedule-task/taskTab/taskData";
import taskDataFile from "@/components/schedule-task/taskTab/taskDataFile";
export default {
  name: "taskReleased",
  components: {
    taskExecutor,
    taskMaterial,
    taskData,
    taskDataFile
  },
  data() {
    return {};
  },
  filters: {
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
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.taskReleased {
  width: 100%;
}
.formItem {
  width: 200px;
}
.gridTable {
  flex: 1;
}
.bottomLayout {
  position: relative;
}
</style>