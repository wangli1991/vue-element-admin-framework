<!--
 * @Author: 王利
 * @Date: 2020-08-10 14:28:54
 * @LastEditors: 王利
 * @LastEditTime: 2020-10-15 13:46:17
-->
<template>
  <div>
    <c-drawer
      direction="rtl"
      :visible.sync="drawerVisible"
      :size="width"
      :modal="modal"
      :modal-append-to-body="modalAppendToBody"
      :append-to-body="appendToBody"
      :custom-class="customClass"
      :wrapperClosable="wrapperClosable"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="false"
      :withHeader="true"
      :before-close="beforeClose"
      :destroy-on-close="destroyOnClose"
      @open="open"
      @opened="opened"
      @close="close"
      @closed="closed"
    >
      <slot></slot>
      <div slot="title" class="drawer-header">
        <span class="d-title">{{ title }}</span>
        <div class="d-right"><span class="d-close el-icon-close" @click="close"></span></div>
      </div>
    </c-drawer>
  </div>
</template>
<script>
import CDrawer from './cdrawer';
export default {
  name: 'Drawer',
  components: { CDrawer },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    width: {
      type: String,
      default: '50%',
    },
    modal: {
      type: Boolean,
      default: true,
    },
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: 'drawer-container',
    },
    wrapperClosable: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    beforeClose: {
      type: Function,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    open() {
      this.drawerVisible = true;
      this.$emit('open');
    },
    opened() {
      this.$emit('opened');
    },
    close() {
      this.drawerVisible = false;
      this.$emit('close');
    },
    closed() {
      this.$emit('closeed');
    },
  },
};
</script>
<style lang="scss">
.drawer-container {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 10px 0 15px;
    border-bottom: 1px solid #d9d9d9;
    .d-right {
      display: flex;
      align-items: center;

      .d-close {
        width: 20px;
        height: 20px;
        font-size: 20px;
        cursor: pointer;
      }
      .d-screenfull {
        width: 20px;
        height: 20px;
      }
    }
    .d-title {
      font-size: 16px;
    }
  }
  .el-drawer__header {
    padding: 0;
    margin: 0;
  }
  .el-drawer__body {
    padding: 0;
    padding-bottom: 50px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>
