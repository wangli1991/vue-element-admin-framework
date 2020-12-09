<!--
 * @Author: 王利
 * @Date: 2020-11-27 10:11:20
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-04 10:49:08
-->
<template>
  <el-dropdown class="size-select" trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-select-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown" class="size-select-dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size === item.value"
        :class="item.value"
        :command="item.value"
      >
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      sizeOptions: [
        { label: "大尺寸", value: "large" },
        { label: "中等", value: "default" },
        { label: "小尺寸", value: "small" }
      ]
    };
  },
  computed: {
    ...mapState("app", ["size"])
  },
  methods: {
    ...mapActions("app", ["setSize", "createElementSize"]),
    ...mapActions("tagsView", ["delAllCachedViews", "refreshView"]),
    handleSetSize(size) {
      // 全局设置element-ui尺寸
      this.createElementSize(size);
      this.setSize(size);
      // 重新加载路由页面
      this.refreshView(this.$route);
      this.delAllCachedViews();
    }
  }
};
</script>
<style lang="scss" scoped>
.size-select {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  .size-select-icon {
    font-size: 18px;
    cursor: pointer;
  }
}
.size-select-dropdown {
  .large {
    font-size: $textSize + 2px;
  }
  .default {
    font-size: $textSize;
  }
  .small {
    font-size: $textSize - 2px;
  }
}
</style>
