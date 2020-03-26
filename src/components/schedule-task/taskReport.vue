<template>
  <div class="taskManage">
    <div class="containAll">
      <el-tabs v-model="activeName">
        <el-tab-pane label="待确认" name="confirmedTask">
          <keep-alive>
            <taskConfirmed >
            </taskConfirmed>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="我的任务" name="myTask">
          <keep-alive>
            <myTask >
            </myTask>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="已完成任务" name="completedTask">
          <keep-alive>
            <finishedTask>
            </finishedTask>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import taskConfirmed from "@/components/schedule-task/taskTab/taskConfirmed";
import myTask from "@/components/schedule-task/taskTab/myTask";
import finishedTask from "./taskTab/finishedTask";

export default {
  name: "taskManage",
  components: {
    finishedTask,
    taskConfirmed,
    myTask
  },
  data() {
    return {      
      activeName: "myTask"
    };
  },
    methods: {},
  mounted() {}
};
</script>

<style scoped>
.taskManage {
  width: 100%;
}
</style>