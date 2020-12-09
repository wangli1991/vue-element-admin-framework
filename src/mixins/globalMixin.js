/*
 * @Author: 王利
 * @Date: 2020-11-06 14:09:52
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-01 15:34:52
 */
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("user", ["userInfo"])
  },
  methods: {}
};
