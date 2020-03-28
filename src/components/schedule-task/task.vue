<template>
  <div class="task">
    <el-tabs v-model="activeName" class="taskTabs flexDiv-column">
      <el-tab-pane label="待处理" name="taskManage" class="flexDiv-column">
        <keep-alive>
          <taskManage class="flexDiv-column">
          </taskManage>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="已排班或发布" name="taskReleased" class="flexDiv-column">
        <keep-alive>
          <taskReleased class="flexDiv-column">
          </taskReleased>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import taskManage from "@/components/schedule-task/taskManage";
import taskReleased from "@/components/schedule-task/taskReleased";

export default {
  name: "task",
  components: {
    taskManage,
    taskReleased
  },
  data() {
    return {
      activeName: "taskManage"
    };
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.task {
  width: 100%;
}
</style>
<style>
.taskTabs .el-tabs__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>