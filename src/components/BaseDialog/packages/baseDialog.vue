<!--
 * @Author: 王利
 * @Date: 2020-08-10 14:28:54
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-27 14:36:42
-->
<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title="title"
      :width="width"
      :fullscreen.sync="dialogFullscreen"
      :top="top"
      :modal="modal"
      :modal-append-to-body="modalAppendToBody"
      :append-to-body="appendToBody"
      :lock-scroll="lockScroll"
      :custom-class="customClass"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="false"
      :before-close="beforeClose"
      :center="center"
      :destroy-on-close="destroyOnClose"
      @open="open"
      @opened="opened"
      @close="close"
      @closed="closed"
    >
      <slot></slot>
      <div slot="title" class="dialog-header">
        <span class="d-title">{{ title }}</span>
        <div class="d-right"><screenfull class="d-screenfull" :fullscreen="dialogFullscreen" @change="screenfullChange" /> <span class="d-close el-icon-close" @click="close"></span></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Screenfull from './screenFull';
export default {
  name: 'BaseDialog',
  components: { Screenfull },
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
    fullscreen: {
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '15vh',
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
    lockScroll: {
      type: Boolean,
      default: true,
    },
    customClass: {
      type: String,
      default: 'dialog-container',
    },
    closeOnClickModal: {
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
    center: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialogFullscreen: this.fullscreen,
    };
  },
  computed: {
    dialogVisible: {
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
      this.dialogVisible = true;
      this.$emit('open');
    },
    opened() {
      this.$emit('opened');
    },
    close() {
      this.dialogVisible = false;
      this.$emit('close');
    },
    closed() {
      this.$emit('closeed');
    },
    screenfullChange(e) {
      this.dialogFullscreen = e.isFullscreen;
    },
  },
};
</script>
<style lang="scss">
.dialog-container {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  .dialog-header {
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
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    height: calc(100% - 48px);
    padding: 0;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>
