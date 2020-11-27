<template>
  <div class="navbar">
    <hamburger class="hamburger-container" />

    <breadcrumb v-if="config.showBreadcrumb" class="breadcrumb-container" />

    <div class="right-menu">
      <head-search v-if="config.showBreadcrumb" class="right-menu-item" />

      <error-log class="errLog-container right-menu-item hover-effect" />

      <screenfull
        v-if="config.showScreenFull"
        class="right-menu-item hover-effect"
      />

      <theme-picker
        v-if="config.showThemePicker"
        class="right-menu-item hover-effect"
      />

      <el-tooltip
        v-if="config.showSizeSelect"
        content="布局大小"
        effect="dark"
        placement="bottom"
      >
        <size-select class="right-menu-item hover-effect" />
      </el-tooltip>

      <el-dropdown
        size="medium"
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import { mapGetters } from "vuex";
import {
  Breadcrumb,
  Hamburger,
  ErrorLog,
  Screenfull,
  ThemePicker,
  SizeSelect,
  HeadSearch
} from "../../components";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker,
    SizeSelect,
    HeadSearch
  },
  computed: {
    ...mapGetters(["avatar"]),
    config() {
      return config;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
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
    line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      display: flex;
      align-items: center;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
