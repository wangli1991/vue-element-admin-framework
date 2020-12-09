<!--
 * @Author: 王利
 * @Date: 2020-09-25 14:14:48
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-27 14:09:08
-->
<template>
  <div class="screenfull">
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="clickHandle" />
  </div>
</template>

<script>
export default {
  name: 'Screenfull',
  props: {
    fullscreen: {
      type: Boolean,
    },
  },
  data() {
    return {
      isFullscreen: this.fullscreen,
    };
  },
  methods: {
    clickHandle() {
      this.isFullscreen = !this.isFullscreen;
      this.$emit('change', { isFullscreen: this.isFullscreen });
    },
  },
};
</script>

<style lang="scss" scoped>
.screenfull {
  .svg-icon {
    display: inline-block;
    cursor: pointer;
    fill: #909399;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
}
</style>
