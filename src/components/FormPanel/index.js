/*
 * @Author: 王利
 * @Date: 2020-09-10 14:08:07
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-18 06:51:36
 */
import FormPanel from './index.vue';

FormPanel.install = (Vue, opts = {}) => {
  Vue.component(FormPanel.name, FormPanel);
};

export default FormPanel;
export { FormPanel };
