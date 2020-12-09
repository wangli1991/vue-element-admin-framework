/*
 * @Author: 王利
 * @Date: 2020-09-10 14:08:07
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-17 16:03:39
 */
import BaseDialog from './packages/baseDialog';

BaseDialog.install = (Vue, opts = {}) => {
  Vue.component(BaseDialog.name, BaseDialog);
};

export default BaseDialog;
export { BaseDialog };
