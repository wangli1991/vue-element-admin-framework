<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:27
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-10 05:56:12
-->
<template>
  <section class="main-wrapper">
    <breadcrumb
      v-if="config.showBreadcrumb"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
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

<style lang="scss" scoped>
.main-wrapper {
  flex: 1;
  padding: 10px 10px 0;
  box-sizing: border-box;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .header {
    padding-right: 15px;
  }
}
</style>
