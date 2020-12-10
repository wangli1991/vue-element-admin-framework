<template>
  <div
    ref="splitPane"
    :style="{
      userSelect,
      height: this.direction === 'row' ? 'auto' : targetOffset + 'px'
    }"
    class="split"
    :class="{ 'split-direction': this.direction === 'column' }"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <div class="split-pane" :style="baseLeftStyle">
      <slot name="left" />
    </div>
    <div class="split-splitter" @mousedown="onMouseDown"></div>
    <div class="split-pane" :style="baseRightStyle">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: "SplitPane",
  props: {
    direction: {
      type: String,
      default: "row"
    },
    minPercent: {
      type: Number,
      default: 10
    },
    defaultPercent: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      active: false,
      hasMoved: false,
      percent: this.defaultPercent,
      targetOffset: 0
    };
  },
  computed: {
    $splitPane() {
      return this.$refs.splitPane;
    },
    userSelect() {
      return this.active ? "none" : "";
    },
    baseLeftStyle() {
      return this.direction === "row"
        ? { width: this.percent + "%" }
        : { height: this.percent + "%" };
    },
    baseRightStyle() {
      return this.direction === "row"
        ? { width: 100 - this.percent + "%" }
        : { height: 100 - this.percent + "%" };
    }
  },
  watch: {
    defaultPercent(newValue, oldValue) {
      this.percent = newValue;
    }
  },
  mounted() {
    this.calculateHeight();
    window.onresize = () => {
      this.calculateHeight();
    };
  },
  methods: {
    calculateHeight() {
      this.$nextTick(() => {
        if (this.direction === "column") {
          this.targetOffset =
            document.body.offsetHeight - this.$splitPane.offsetTop;
          let topHeight = parseInt((this.targetOffset * this.percent) / 100);
          let bottomHeight = parseInt(
            (this.targetOffset * (100 - this.percent)) / 100
          );
          this.$emit("paneChange", topHeight, bottomHeight);
        }
      });
    },
    onMouseDown() {
      this.active = true;
      this.hasMoved = false;
    },
    onMouseUp() {
      this.active = false;
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false;
      }
      if (this.active) {
        let offset = 0;
        let target = e.currentTarget;

        while (target) {
          offset +=
            this.direction === "row" ? target.offsetLeft : target.offsetTop;
          target = target.offsetParent;
        }

        const currentPage = this.direction === "row" ? e.pageX : e.pageY;
        const targetOffset =
          this.direction === "row"
            ? e.currentTarget.offsetWidth
            : this.targetOffset;
        const percent =
          Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100;

        if (percent > this.minPercent && percent < 100 - this.minPercent) {
          if (this.direction === "row") {
            this.percent = percent;
          } else {
            let topHeight = parseInt(currentPage - offset);
            let bottomHeight = parseInt(targetOffset - currentPage + offset);
            if (topHeight > 140 && bottomHeight > 140) {
              this.percent = percent;
              this.$emit("paneChange", topHeight, bottomHeight);
            }
          }
        }

        this.hasMoved = true;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.split {
  position: relative;
  display: flex;
  &-direction {
    flex-direction: column;
    & > .split-splitter {
      width: auto;
      height: 7px;
      margin-top: -1px;
      &:hover {
        cursor: row-resize;
      }
      &::after,
      &::before {
        left: 0;
        width: 100%;
        height: 1px;
      }
      &::after {
        margin: 1px 0 0 0;
      }
      &::before {
        margin: -2px 0 0 0;
      }
    }
  }
  &-pane {
    overflow: hidden;
  }
  &-splitter {
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 7px;
    margin-left: -1px;
    &:hover {
      cursor: col-resize;
    }
    &::after,
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: rgba(0, 0, 0, 0.15);
      transition: background-color 0.3s;
      transform: translateY(-50%);
      width: 1px;
      height: 30px;
    }
    &::after {
      margin-left: 1px;
    }
    &::before {
      margin-left: -2px;
    }
  }
}
</style>
