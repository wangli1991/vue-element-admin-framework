/*
 * @Author: 王利
 * @Date: 2020-08-10 14:32:43
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 12:30:55
 */
import { default as Drawer } from "./Drawer";
import { default as BaseDialog } from "./BaseDialog";
import { default as FormPanel } from "./FormPanel";
import { default as VirtualTable } from "./VirtualTable";
const components = [Drawer, BaseDialog, FormPanel, VirtualTable];
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

// istanbul ignore if
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
export default {
  version: "1.0.0",
  install,
  Drawer,
  BaseDialog,
  FormPanel,
  VirtualTable
};
