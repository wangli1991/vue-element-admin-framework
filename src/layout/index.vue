<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-11-27 13:27:42
-->
<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container hasTagsView">
      <div class="fixed-header">
        <head-navbar />
        <tags-view v-if="config.showTagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, HeadNavbar, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import config from "@/config";
export default {
  name: "Layout",
  components: {
    AppMain,
    HeadNavbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    config() {
      return config;
    },
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
