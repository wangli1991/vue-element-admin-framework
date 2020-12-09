/*
 * @Author: 王利
 * @Date: 2020-09-10 14:08:07
 * @LastEditors: 王利
 * @LastEditTime: 2020-10-12 11:04:18
 */
import Drawer from './packages/drawer';

Drawer.install = (Vue, opts = {}) => {
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
export { Drawer };
