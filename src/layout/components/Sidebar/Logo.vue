<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-04 08:38:54
-->
<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="config.sidebarLogo"
          :src="config.sidebarLogo"
          class="sidebar-logo"
        />
        <h1 v-else class="sidebar-title">{{ config.title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img
          v-if="config.sidebarLogo"
          :src="config.sidebarLogo"
          class="sidebar-logo"
        />
        <h1 class="sidebar-title">{{ config.title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import config from "@/config";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    config() {
      return config;
    }
  }
};
</script>
