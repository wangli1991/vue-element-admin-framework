<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 14:57:44
-->
<template>
  <el-container class="layout">
    <el-aside :width="asideWidth" class="sidebar">
      <sidebar />
    </el-aside>
    <el-container>
      <el-header height="" :class="headerCls">
        <head-navbar />
      </el-header>
      <el-main class="app-main">
        <app-main />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { AppMain, HeadNavbar, Sidebar } from "./components";
import { mapState } from "vuex";
import config from "@/config";
import { size } from "@/mixins/sizeMixin";

export default {
  name: "Layout",
  components: {
    AppMain,
    HeadNavbar,
    Sidebar
  },
  mixins: [size],
  computed: {
    config() {
      return config;
    },
    ...mapState("app", ["sidebarOpened"]),
    asideWidth() {
      return this.sidebarOpened ? "210px" : "54px";
    },
    headerCls() {
      return {
        [`header`]: !0,
        [`header-sm`]: this.currentSize === "small",
        [`header-lg`]: this.currentSize === "large"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  .sidebar {
    transition: width 0.3s ease;
    overflow: visible;
  }
  .header {
    height: 52px;
    padding: 0;
  }
  &-sm {
    height: 48px;
  }
  &-lg {
    height: 56px;
  }
  .app-main {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 10px 10px 0;
    box-sizing: border-box;
  }
}
</style>
