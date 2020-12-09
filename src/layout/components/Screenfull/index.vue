<!--
 * @Author: 王利
 * @Date: 2020-11-27 10:11:20
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-02 06:26:43
-->
<template>
  <div class="screenfull-svg">
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script>
import screenfull from "screenfull";

export default {
  name: "Screenfull",
  data() {
    return {
      isFullscreen: false
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.screenfull-svg {
  ::v-deep .svg-icon {
    font-size: 18px;
    fill: #5a5e66;
  }
}
</style>
