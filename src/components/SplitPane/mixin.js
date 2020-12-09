/*
 * @Author: 孙锦涵
 * @Date: 2020-08-13 12:43:44
 * @LastEditors: 孙锦涵
 * @LastEditTime: 2020-08-18 09:50:40
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
