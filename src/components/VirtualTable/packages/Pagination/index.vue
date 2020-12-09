<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <div class="pagination-alert" :class="alertCls">
      <i class="el-icon-warning"></i><span>共 22 条，已选择 0 项</span
      ><em>清空</em>
    </div>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { size } from "@/mixins/sizeMixin";
import { scrollTo } from "@/utils/scroll-to";

export default {
  name: "Pagination",
  mixins: [size],
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: "prev, pager, next,jumper,sizes,total"
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      }
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      }
    },
    alertCls() {
      return {
        [`size--media`]: this.currentSize === "default",
        [`size--small`]: this.currentSize === "small",
        [`size--large`]: this.currentSize === "large"
      };
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", { page: this.currentPage, limit: val });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { page: val, limit: this.pageSize });
      if (this.autoScroll) {
        scrollTo(0, 800);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
.pagination-container {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-container.hidden {
  display: none;
}
.pagination-alert {
  display: flex;
  align-items: center;
  position: relative;
  height: 36px;
  margin-right: $v-module-distance;
  font-size: $v-font-size;
  word-wrap: break-word;
  padding: 0 6px 0 28px;
  border: 1px solid $v-table-border-color;
  border-radius: $v-border-radius;
  background-color: $v-table-header-background-color;
  i {
    position: absolute;
    left: 8px;
    line-height: 0;
    font-size: 16px;
    color: $v-primary-color;
  }
  em {
    display: inline-block;
    color: $v-primary-color;
    padding: 0 $v-module-distance;
    margin-right: -5px;
    font-style: normal;
    cursor: pointer;
  }
  &.size--large {
    height: 36px;
  }
  &.size--media {
    height: 32px;
  }
  &.size--small {
    height: 28px;
    padding-left: 26px;
    font-size: $v-font-size-mini;
    i {
      font-size: 14px;
    }
  }
  &.position--bottom {
    height: 28px !important;
  }
}
</style>
