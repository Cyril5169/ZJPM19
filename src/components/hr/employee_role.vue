<template>
  <div>
    <div class="main">
      <div class="left">
        <div class="title">
          <div class="title-content">
            <span style="font-size:16px;">角色列表</span>
          </div>
        </div>
        <div style="padding:10px">
          <el-input size="small" placeholder="搜索" prefix-icon='el-icon-search' @input="filterRoleData" v-model="role_condition" clearable>
          </el-input>
        </div>
        <div class="center-tbar">
          <el-button size="mini" round type="primary">新增角色组
          </el-button>
          <el-button size="mini" round type="primary" @click="isAddRole=true">新增角色
          </el-button>
        </div>
        <div class="table_ct">
          <zj-group-list style="position:absolute;height:100%;width:100%" :group-data="groupData" :item-data="roleData"
            group-key="r_group_id" item-key="role_id" group-label="r_group_name" item-label="role_name"
            group-icon="el-icon-s-fold" item-icon="el-icon-user-solid" @item-click="handleItemClick">
          </zj-group-list>

        </div>

      </div>
      <div class="splitter"></div>
    </div>
  </div>
</template>


<style scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.table_ct {
  flex: 1;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
}
.left {
  box-sizing: border-box;
  width: 250px;
  border: 1px solid #dedede;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
.center-tbar {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
.c-tbar {
  background: #f4f6f8;
  padding: 5px 10px;
  margin-bottom: 10px;
}
.table_ct {
  flex: 1;
  box-sizing: border-box;
}
.splitter {
  background: #eee;
  width: 5px;
  margin: 0 5px;
}
.splitter1 {
  background: #eee;
  height: 5px;
  margin: 5px 0;
}
.center {
  box-sizing: border-box;
  width: 565px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  border: 1px solid #dedede;
}
.title {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  border-bottom: 1px solid #dedede;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.title-content {
  font-size: 16px;
  padding: 0 10px;
}
</style>

<script>
import { mapMutations } from "vuex";
import zjGroupList from "@/components/_common/zj-group-list";

export default {
  components: {
    zjGroupList: zjGroupList
  },
  data() {
    return {
      groupMetaData: [],
      groupData: [],
      roleMetaData: [],
      roleData: [],
      collapseGroupIds: [],
      role_condition: "",
      employeeData: [],

      currentRole: {},

      roleTableHeight: 300
    };
  },
  computed: {},
  methods: {
    handleItemClick(row, event) {
      console.log(row);
      this.currentRole = row;
    },
    refreshGroupData() {
      this.z_get("api/roleinfo/list")
        .then(res => {
          this.roleMetaData = res.data;
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
      this.z_get("api/r_group/list")
        .then(res => {
          this.groupMetaData = res.data;
          this.filterRoleData();
        })
        .catch(res => {
          this.$alert("加载失败" + res.msg, "提示", {
            confirmButtonText: "确定",
            type: "error"
          });
        });
    },
    filterRoleData() {
      if (this.role_condition != "") {
        this.roleData = this.roleMetaData.filter(item => {
          return item.role_name.indexOf(this.role_condition) != -1;
        });
        var ids = [];
        this.roleData.forEach(item => {
          ids.push(item.r_group_id);
        });
        this.groupData = this.groupMetaData.filter(item => {
          return ids.indexOf(item.r_group_id) != -1;
        });
      } else {
        this.roleData = this.roleMetaData;
        this.groupData = this.groupMetaData;
      }
    }
  },

  mounted() {
    this.refreshGroupData();
  }
};
</script>
