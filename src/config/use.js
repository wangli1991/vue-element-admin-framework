/*
 * @Author: 王利
 * @Date: 2020-12-01 16:50:31
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 14:39:53
 */
import Vue from "vue";
import ElementUI from "element-ui";
import vDesign from "@/components";
import config from "@/config";

const APP_ENV = (function(env) {
  if (env === "development") {
    // ...
  } else {
    console.log = console.warn = console.info = () => {};
  }
  return { env };
})(process.env.NODE_ENV);

// 全局挂载 ElementUI
Vue.use(ElementUI, {
  size: config.toElementSize[localStorage.getItem("size") || config.size],
  zIndex: 1000
});

// 全局挂载自定义组件
Vue.use(vDesign, {
  size: localStorage.getItem("size") || config.size,
  config: config.vDesign
});
