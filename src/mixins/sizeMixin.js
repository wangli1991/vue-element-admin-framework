/*
 * @Author: 王利
 * @Date: 2020-11-25 15:38:27
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-02 08:27:25
 */
import store from "@/store";

export const size = {
  computed: {
    currentSize() {
      return store.state.app.size;
    }
  }
};
