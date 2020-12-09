<!--
 * @Author: 王利
 * @Date: 2020-11-06 15:23:33
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-04 10:01:46
-->
<template>
  <div class="user-center">
    <el-dropdown :size="currentSize" class="el-dropdown" trigger="click">
      <span class="el-dropdown-link">
        <span class="avatar fl">
          <img :src="avatar" class="img" />
        </span>
        <span class="text text-overflow-ellipsis fl">{{ userName }}</span>
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/profile/index">
          <el-dropdown-item icon="el-icon-user">个人中心</el-dropdown-item>
        </router-link>
        <el-dropdown-item icon="el-icon-setting">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-refresh" @click.native="clearHandle">
          清理缓存
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-switch-button"
          divided
          @click.native="logoutHandle"
        >
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { size } from "@/mixins/sizeMixin";

export default {
  mixins: [size],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("user", ["avatar"]),
    userName() {
      return this.userInfo.realname || "管理员";
    }
  },
  methods: {
    ...mapActions("user", ["createLogout"]),
    async logoutHandle() {
      this.createLogout();
    },
    clearHandle() {
      this.$store.dispatch("tagsView/delAllCachedViews", this.$route);
      setTimeout(() => window.history.go(0), 0);
    }
  }
};
</script>
<style lang="scss" scoped>
.user-center {
  margin-left: 10px;
  ::v-deep .el-dropdown {
    height: 24px;
    position: relative;
    color: #606060;
    font-size: 14px;
    .el-dropdown-link {
      display: block;
      font-size: 14px;
      line-height: 24px;
      cursor: pointer;
      .avatar {
        overflow: hidden;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 4px;
        .img {
          object-fit: scale-down;
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .text {
        max-width: 70px;
      }
    }
  }
}
</style>
