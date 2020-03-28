<template>
  <div class="task">
    <div class="containAll">
      <el-tabs v-model="activeName">
        <el-tab-pane label="待处理" name="taskManage">
          <keep-alive>
            <taskManage >
            </taskManage>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="已排班或发布" name="taskReleased">
          <keep-alive>
            <taskReleased >
            </taskReleased>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>


<script>
import taskManage from "@/components/schedule-task/taskManage";
import taskReleased from "@/components/schedule-task/taskReleased";

export default {
  name: "task",
  components: {
    taskManage,
    taskReleased,
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