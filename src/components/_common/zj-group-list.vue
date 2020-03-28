<template>
  <div>
    <div v-for="(group, index) in groupData" :key="index">
      <div class="item" @click="GroupClick($event, group)">
        <i :class="[collapseGroupIds.indexOf(group[groupKey])==-1?'el-icon-caret-bottom':'el-icon-caret-right']"
          style="font-size:16px;"></i>
        <i :class="groupIcon" style="color:#aee4fa;font-size:16px;"></i>
        <span style="font-size:14px;">{{group[groupLabel]}}</span>
      </div>
      <div v-show="collapseGroupIds.indexOf(group[groupKey])==-1">
        <div :class="[
          currentItem[itemKey] == item[itemKey]?'current-item':'item'
        ]" v-for="(item, index) in GetItemData(group[groupKey])" :key="index" @click="ItemClick($event, item)">
          <i :class="itemIcon" style="color:#aee4fa;font-size:16px;margin-left:35px"></i>
          <span style="font-size:14px;">{{item[itemLabel]}}</span>
        </div>
      </div>

    </div>
  </div>
</template>


<style scoped>
.item {
  padding: 10px 0;
  cursor: pointer;
  /* border-top: 1px solid #ebeef5; */
}
.item:hover {
  background-color: #eee;
}
.current-item {
  padding: 10px 0;
  background-color: #0089ff;
  color: #ffffff;
  cursor: pointer;
}
.current-item:hover {
  background-color: #38adff;
}
</style>

<script>
export default {
  data() {
    return {
      collapseGroupIds: [],
      currentItem: {}
    };
  },
  props: {
    groupData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    itemData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //手风琴
    accordion: {
      type: Boolean,
      default: false
    },
    groupKey: {
      type: String,
      default: "group_id"
    },
    itemKey: {
      type: String,
      default: "item_id"
    },
    groupLabel: {
      type: String,
      default: "group_name"
    },
    itemLabel: {
      type: String,
      default: "item_name"
    },
    groupIcon: {
      type: String,
      default: ""
    },
    itemIcon: {
      type: String,
      default: ""
    }
  },
  created() {},
  watch: {},
  computed: {},
  methods: {
    ItemClass(item) {
      if (this.currentItem[this.itemKey] == item[this.itemKey]) {
        return "current-item";
      } else {
        return "item";
      }
    },
    GroupClick(event, group) {
      let index = this.collapseGroupIds.indexOf(group[this.groupKey]);
      if (this.accordion) {
        this.collapseGroupIds = [];
        this.groupData.forEach(g => {
          if (g[this.groupKey] != group[this.groupKey])
            this.collapseGroupIds.push(g[this.groupKey]);
        });
      } else {
        if (index == -1) {
          this.collapseGroupIds.push(group[this.groupKey]);
        } else {
          this.collapseGroupIds.splice(index, 1);
        }
      }

      this.$emit("group-click", group, event);
    },
    ItemClick(event, item) {
      this.currentItem = item;
      this.$emit("item-click", item, event);
    },
    GetItemData(group_id) {
      return this.itemData.filter(item => {
        return item[this.groupKey] == group_id;
      });
    }
  }
};
</script>
