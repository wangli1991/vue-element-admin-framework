<!--
 * @Author: 王利
 * @Date: 2020-11-27 09:12:05
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-04 13:54:33
-->
<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserCard from "./components/UserCard";
import Activity from "./components/Activity";
import Timeline from "./components/Timeline";
import Account from "./components/Account";

export default {
  name: "Profile",
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: "activity"
    };
  },
  computed: {
    ...mapState("user", ["avatar", "roles"]),
    userName() {
      return this.userInfo.realname || "管理员";
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      console.log(this.roles);
      this.user = {
        name: this.userName,
        role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar
      };
    }
  }
};
</script>
