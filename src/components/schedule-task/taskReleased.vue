<template>
  <div class="taskReleased">
    <div class="containAll">
      <div class="topLayout">
        <div class="tbar">

        </div>
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
    return {

    };
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
    },
  },
  methods: {

  },
  mounted() {

  }
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