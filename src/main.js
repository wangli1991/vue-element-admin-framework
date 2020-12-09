/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 14:40:04
 */
import Vue from "vue";
import App from "@/App";
import store from "@/store";
import router from "@/routes";
import * as filters from "@/filters";
import "@/routes/permission";
import "@/config/use";
// 自定义主题
import "@/icons";
// a modern alternative to CSS resets
import "normalize.css/normalize.css";
// global css
import "@/assets/css/index.scss";
// error log
import "@/utils/error-log";
import global from "@/mixins/globalMixin";
Vue.mixin(global);

// 全局过滤
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 关闭生产环境的提示
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
