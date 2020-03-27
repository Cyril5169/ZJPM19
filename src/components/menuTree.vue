<template>
  <div style="display:inline-block;min-width:200px;">
    <template v-for="item in menuTreeItem">
      <!-- 有子节点，用el-submenu -->
      <el-submenu v-if="
      item.children &&
        item.children.length >= 1
    " :index="item.menu_id.toString()" :key="item.menu_id">
        <template slot="title">
          <i v-if="item.menu_icon != ''" :class="item.menu_icon"></i>
          <span>{{ item.menu_name }}</span>
          <el-badge v-if="getChildrenBadge(item.children) > 0" class="r" :class="{'pr20': item.menu_pid}"
            :value="getChildrenBadge(item.children)">
          </el-badge>
        </template>
        <el-menu-item-group>
          <menuTree :menuTreeItem="item.children" />
        </el-menu-item-group>
      </el-submenu>
      <!-- 没有子节点，直接el-menu-item -->
      <el-menu-item v-else :index="item.menu_link" :route="'/' + item.menu_link" :key="item.menu_id">
        <template slot="title">
          <i v-if="item.menu_icon != ''" :class="item.menu_icon"></i>
          <span>{{ item.menu_name }}</span>
        </template>
        <el-badge v-if="getAllBadge(item.menu_link) > 0" class="r" :value="getAllBadge(item.menu_link)"></el-badge>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "menuTree",
  props: {
    menuTreeItem: {
      type: Array,
      required: true
    }
  },
  methods: {
    getAllBadge(value) {
      var count = 0;
      if (value) {
        if (this.$store.state.badge[value] != undefined) {
          count = this.$store.state.badge[value];
        } else {
          //动态添加
          this.$store.state.badge[value] = 0;
        }
      }
      return count;
    },
    getChildrenBadge(array) {
      var count = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i].children && array[i].children.length > 0) {
          //有子节点
          count += this.getChildrenBadge(array[i].children);
        } else {
          //没有子节点
          count += this.getAllBadge(array[i].menu_link);
        }
      }
      return count;
    }
  }
};
</script>

<style scoped>
* {
  outline: none;
}
</style>