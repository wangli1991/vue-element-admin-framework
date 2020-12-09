<!--
 * @Author: 王利
 * @Date: 2020-11-25 15:29:28
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 10:48:23
-->
<template>
  <div :class="noticeCls">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="first">
        <ul v-if="noticeList.list.length">
          <li v-for="item in noticeList.list" :key="item.id">
            {{ item.title }}
          </li>
        </ul>
        <dl v-else class="no-info">
          <span>暂无数据</span>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <ul v-if="notice1List.list.length">
          <li v-for="item in notice1List.list" :key="item.id">
            {{ item.title }}
          </li>
        </ul>
        <dl v-else class="no-info">
          <span>暂无数据</span>
        </dl>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
        <ul v-if="notice2List.list.length">
          <li v-for="item in notice2List.list" :key="item.id">
            {{ item.title }}
          </li>
        </ul>
        <dl v-else class="no-info">
          <span>暂无数据</span>
        </dl>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { size } from "@/mixins/sizeMixin";
import dataList from "@/mock/noticeData";

export default {
  name: "NoticeInfo",
  mixins: [size],
  data() {
    return {
      activeName: "first",
      noticeList: {
        title: "用户管理",
        list: []
      },
      notice1List: {
        title: "用户管理",
        list: []
      },
      notice2List: {
        title: "用户管理",
        list: []
      }
    };
  },
  computed: {
    noticeCls() {
      return {
        [`notice-wrapper`]: !0,
        [`notice-wrapper-sm`]: this.currentSize === "small",
        [`notice-wrapper-lg`]: this.currentSize === "large"
      };
    }
  },
  mounted() {
    this.noticeList.list = dataList.data;
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.notice-wrapper {
  margin: -12px;
  width: 340px;
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap {
      padding-left: 20px;
    }
  }

  ::v-deep .el-tabs__content {
    ul {
      padding-top: 5px;
      li {
        padding: 6px 15px;
        font-size: 14px;
        border-bottom: 1px solid #dfe4ed;
        font-size: $textSize;
        border-bottom: 1px solid $borderColorSecondary;
      }
    }
    .no-info {
      text-align: center;
      padding: 40px 0;
      color: $disabledColor;
      span {
        display: inline-block;
        width: 100%;
        font-size: $textSize;
      }
    }
    &-sm {
      .list {
        ul > li {
          font-size: $textSizeSecondary;
        }
        .no-info {
          span {
            font-size: $textSizeSecondary;
          }
        }
      }
    }
  }
}
</style>
