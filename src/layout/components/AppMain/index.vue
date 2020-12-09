<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:27
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-09 06:19:24
-->
<template>
  <section class="main-wrap">
    <breadcrumb
      v-if="config.showBreadcrumb"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from "../../components/Breadcrumb";
import config from "@/config";

export default {
  components: { Breadcrumb },
  data() {
    return {
      config: config
    };
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss">
.main-wrap {
  height: calc(100%);
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .header {
    padding-right: 15px;
  }
}
</style>
