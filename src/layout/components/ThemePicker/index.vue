<template>
  <el-color-picker
    v-model="theme"
    :predefine="predefine"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    @change="themeChangeHandle"
  />
</template>

<script>
import { mapActions } from "vuex";
const predefineColors = [
  "#409EFF",
  "#1890ff",
  "#304156",
  "#212121",
  "#11a983",
  "#13c2c2",
  "#6959CD",
  "#f5222d"
];
export default {
  data() {
    return {
      predefine: predefineColors,
      theme: localStorage.getItem("theme") || this.$store.state.app.theme
    };
  },
  methods: {
    ...mapActions("app", ["createThemeColor"]),
    themeChangeHandle(newColor) {
      this.createThemeColor(newColor);
    }
  }
};
</script>

<style lang="scss">
.theme-picker {
  width: 26px;
  height: 26px;
  .el-color-picker__trigger {
    height: 100% !important;
    width: 100% !important;
    padding: 2px;
  }
}

.theme-picker-dropdown {
  margin-top: 10px;
  margin-left: -230px;
  .el-color-dropdown__link-btn {
    display: none;
  }
}
</style>
