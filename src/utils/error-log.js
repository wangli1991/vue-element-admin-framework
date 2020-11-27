/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-11-27 13:17:55
 */
import Vue from "vue";
import store from "@/store";
import { isString, isArray } from "@/utils/validate";
import config from "@/config";

// you can set in config.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = config;

function checkNeed() {
  const env = process.env.NODE_ENV;
  if (isString(needErrorLog)) {
    return env === needErrorLog;
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env);
  }
  return false;
}

if (checkNeed()) {
  Vue.config.errorHandler = function(err, vm, info, a) {
    // Don't ask me why I use Vue.nextTick, it just a hack.
    // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
    Vue.nextTick(() => {
      store.dispatch("errorLog/addErrorLog", {
        err,
        vm,
        info,
        url: window.location.href
      });
      console.error(err, info);
    });
  };
}
