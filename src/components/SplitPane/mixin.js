/*
 * @Author: 王利
 * @Date: 2020-12-08 12:52:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-09 21:53:08
 */
export const splitPaneData = {
  data() {
    return {
      tableTopHeight: 0,
      tableBottomHeight: 0
    };
  },
  methods: {
    // 展开/收起 状态变化
    collapseChangeHandle(val) {
      this.$refs.splitPane && this.$refs.splitPane.calculateHeight();
    },
    handleSplitPaneChange(top, bottom) {
      this.tableTopHeight = top - 81;
      this.tableBottomHeight = bottom - 81;
    }
  }
};
