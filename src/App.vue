<!--
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 10:44:54
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState("app", ["theme"])
  },
  created() {
    const themeColor = localStorage.getItem("theme");
    if (themeColor && themeColor !== this.theme) {
      this.createThemeColor(themeColor);
    }
  },
  mounted() {
    window.addEventListener("message", this.messageEventHandle, false);
  },
  destroyed() {
    window.removeEventListener("message", this.messageEventHandle);
  },
  methods: {
    ...mapActions("app", ["createElementSize", "createThemeColor"]),
    messageEventHandle({ data }) {
      if (typeof data !== "object") return;
      if (data.type === "size") {
        this.createElementSize(data.data);
      }
      if (data.type === "theme") {
        this.createThemeColor(data.data);
      }
    }
  }
};
</script>
