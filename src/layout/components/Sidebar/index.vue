<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-09 08:21:31
-->
<template>
  <div :class="sidebarCls">
    <logo v-if="config.showSidebarLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/css/variables.scss";
import config from "@/config";
import { size } from "@/mixins/sizeMixin";

export default {
  components: { SidebarItem, Logo },
  mixins: [size],
  computed: {
    ...mapGetters(["permission_routes"]),
    ...mapState("app", ["sidebarOpened"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebarOpened;
    },
    config() {
      return config;
    },
    sidebarCls() {
      return {
        [`sidebar-wrapper`]: !0,
        [`sidebar-wrapper-sm`]: this.currentSize === "small",
        [`sidebar-wrapper-lg`]: this.currentSize === "large",
        "has-logo": config.showSidebarLogo,
        collapse: !this.sidebarOpened
      };
    }
  }
};
</script>
