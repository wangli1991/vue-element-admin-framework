<template>
  <div class="navbar">
    <hamburger class="hamburger-container hover-effect" />
    <tags-view v-if="needTagsView" />
    <div class="right-menu">
      <head-search v-if="config.showBreadcrumb" class="right-menu-item" />

      <el-tooltip content="错误日志" effect="dark" placement="bottom">
        <error-log class="right-menu-item hover-effect" />
      </el-tooltip>
      <el-tooltip
        v-if="config.showScreenFull"
        content="页面全屏"
        effect="dark"
        placement="bottom"
      >
        <screenfull class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip
        v-if="config.showThemePicker"
        content="主题切换"
        effect="dark"
        placement="bottom"
      >
        <theme-picker class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-tooltip
        v-if="config.showSizeSelect"
        content="布局大小"
        effect="dark"
        placement="bottom"
      >
        <size-select class="right-menu-item hover-effect" />
      </el-tooltip>
      <el-tooltip
        v-if="config.showNotification"
        content="系统消息"
        effect="dark"
        placement="bottom"
      >
        <notice-center class="right-menu-item hover-effect" />
      </el-tooltip>
      <user-center />
    </div>
  </div>
</template>

<script>
import config from "@/config";
import { mapGetters } from "vuex";
import {
  Hamburger,
  TagsView,
  ErrorLog,
  Screenfull,
  ThemePicker,
  SizeSelect,
  HeadSearch,
  NoticeCenter
} from "../../components";
import UserCenter from "@/pages/UserCenter";

export default {
  components: {
    Hamburger,
    TagsView,
    ErrorLog,
    Screenfull,
    ThemePicker,
    SizeSelect,
    HeadSearch,
    NoticeCenter,
    UserCenter
  },
  computed: {
    config() {
      return config;
    },
    needTagsView() {
      return config.showTagsView;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
  .hamburger-container {
    line-height: 46px;
    height: 50px;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 10px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      font-size: 16px;
      color: #606060;
      text-align: center;
      width: 26px;
      height: 26px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin: 0 2px;
    }
  }
}
</style>
