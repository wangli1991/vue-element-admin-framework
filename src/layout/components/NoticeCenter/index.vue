<!--
 * @Author: 王利
 * @Date: 2020-11-25 14:00:38
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-01 23:50:46
-->
<template>
  <div class="notice-center">
    <el-popover
      v-model="visible"
      trigger="click"
      placement="bottom-end"
      transition="el-zoom-in-top"
    >
      <el-badge slot="reference" :value="3" class="badge">
        <i class="icon el-icon-message-solid"></i>
      </el-badge>
      <notice-info v-if="visible" />
    </el-popover>
  </div>
</template>
<script>
import NoticeInfo from "@/pages/noticeInfo/index";
export default {
  components: { NoticeInfo },
  data() {
    return {
      visible: false
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.notice-center {
  padding: 0 10px 0 4px;
  .badge {
    width: 22px;
    height: 22px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      font-size: 22px;
      cursor: pointer;
    }
    ::v-deep .el-badge__content {
      top: 2px;
      right: 10px;
    }
  }
}
</style>
