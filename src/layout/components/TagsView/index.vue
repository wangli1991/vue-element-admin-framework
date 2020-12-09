<template>
  <div :class="noticeCls">
    <el-tabs
      ref="tagsView"
      v-model="activeName"
      class="tags-view-tab"
      type="card"
      @tab-click="linkSelectedTag"
      @tab-remove="closeSelectedTag"
    >
      <el-tab-pane
        v-for="item in visitedViews"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="!isAffix(item)"
      >
      </el-tab-pane>
    </el-tabs>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新当前</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
      <li
        v-if="selectedTagIndex != 'first' && selectedTagIndex != 'none'"
        @click="closeLeftTags"
      >
        关闭左侧
      </li>
      <li
        v-if="selectedTagIndex != 'last' && selectedTagIndex != 'none'"
        @click="closeRightTags"
      >
        关闭右侧
      </li>
    </ul>
  </div>
</template>

<script>
import path from "path";
import addEventListener from "add-dom-event-listener";
import { size } from "@/mixins/sizeMixin";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [size],
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      selectedTagIndex: "",
      contextmenuEvent: null,
      activeName: ""
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routes() {
      return this.$store.state.permission.routes;
    },
    $tagsView() {
      return this.$refs.tagsView.$el;
    },
    noticeCls() {
      return {
        [`tags-view-container`]: !0,
        [`tags-view-container-sm`]: this.currentSize === "small",
        [`tags-view-container-lg`]: this.currentSize === "large"
      };
    }
  },
  watch: {
    $route(route) {
      this.activeName = route.path;
      this.addTags();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
    this.bindContextmenuEvent();
    this.activeName = this.$route.path;
  },
  destroyed() {
    this.contextmenuEvent.remove();
  },
  methods: {
    ...mapActions("tagsView", [
      "addVisitedView",
      "addView",
      "delOthersViews",
      "delRightViews",
      "delLeftViews",
      "delAllViews",
      "delView",
      "refreshView"
    ]),
    isActive(route) {
      return route.path === this.$route.path;
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix;
    },
    filterAffixTags(routes) {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          tags.push({
            fullPath: route.path,
            path: route.path,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const tabList = JSON.parse(sessionStorage.getItem("tabNav"));
      if (!tabList) {
        const affixTags = (this.affixTags = this.filterAffixTags(this.routes));
        for (const tag of affixTags) {
          if (tag.name) {
            this.addVisitedView(tag);
          }
        }
        return;
      }
      tabList.map(x => {
        this.addVisitedView(x);
      });
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.addView(this.$route);
      }
      return false;
    },
    linkSelectedTag(tab) {
      const route = this.visitedViews.filter(
        item => item.fullPath === tab.name
      )[0];
      this.$router.push({
        path: route.path,
        query: route.query,
        fullPath: route.fullPath
      });
    },
    refreshSelectedTag(view) {
      this.refreshView(view);
    },
    closeSelectedTag(path) {
      const view = this.visitedViews.filter(item => item.fullPath === path)[0];
      this.delView(view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags(view) {
      const activeViews = this.visitedViews.filter(
        x =>
          this.isActive(x) &&
          !this.isAffix(x) &&
          this.selectedTag.fullPath != x.fullPath
      );
      this.delOthersViews(this.selectedTag).then(() => {
        if (activeViews.length > 0) {
          this.$router.push(this.selectedTag);
        }
      });
    },
    closeRightTags() {
      const index = this.visitedViews.findIndex(
        x => x.path === this.selectedTag.path
      );
      const activeViews = this.visitedViews
        .slice(index + 1)
        .filter(x => this.isActive(x) && !this.isAffix(x));
      this.delOthersViews(this.selectedTag).then(() => {
        if (activeViews.length > 0) {
          this.$router.push(this.selectedTag);
        }
      });
    },
    closeLeftTags() {
      const index = this.visitedViews.findIndex(
        x => x.path === this.selectedTag.path
      );
      const activeViews = this.visitedViews
        .slice(0, index)
        .filter(x => this.isActive(x) && !this.isAffix(x));
      this.delOthersViews(this.selectedTag).then(() => {
        if (activeViews.length > 0) {
          this.$router.push(this.selectedTag);
        }
      });
    },
    closeAllTags(view) {
      this.delAllViews().then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        if (view.name === "Dashboard") {
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      console.log(tag, e);
      const index = this.visitedViews.findIndex(x => x.path === tag.path);
      const selectedTagLen = this.visitedViews.length;
      let selectedTagIndex;
      if (selectedTagLen > 0) {
        if (index === 0) {
          selectedTagIndex = "first";
        }
        if (index >= this.visitedViews.length - 1) {
          selectedTagIndex = "last";
        }
      } else {
        selectedTagIndex = "none";
      }
      this.selectedTagIndex = selectedTagIndex;
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left;
      const offsetWidth = this.$el.offsetWidth;
      const maxLeft = offsetWidth - menuMinWidth;
      const left = e.clientX - offsetLeft + 15;

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    bindContextmenuEvent() {
      this.contextmenuEvent = addEventListener(
        this.$tagsView,
        "contextmenu",
        ev => {
          ev.preventDefault();
          const classNames = [...ev.target.classList];
          if (classNames.includes("el-tabs__item")) {
            const path = ev.target
              .getAttribute("aria-controls")
              .replace(/^pane-/, "");
            const view = this.visitedViews.filter(
              item => item.fullPath === path
            )[0];
            this.openMenu(view, ev);
          }
        }
      );
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.tags-view-container {
  width: calc(100% - 300px);
  background: #fff;
  position: absolute;
  left: 50px;
  bottom: -1px;
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__nav {
      .el-tabs__item {
        height: 38px;
        line-height: 38px;
        &.is-active {
          font-weight: bold;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    border: 1px solid #d9d9d9;

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  &.tags-view-container-lg {
    ::v-deep .el-tabs__nav {
      .el-tabs__item {
        padding: 0 18px !important;
        height: 42px !important;
        line-height: 42px !important;
      }
    }
  }
  &.tags-view-container-sm {
    ::v-deep .el-tabs__nav {
      .el-tabs__item {
        padding: 0 14px !important;
        height: 34px !important;
        line-height: 34px !important;
      }
    }
  }
}
</style>
