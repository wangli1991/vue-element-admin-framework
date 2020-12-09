/*
 * @Author: 王利
 * @Date: 2020-09-10 14:08:07
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-15 13:25:43
 */
import Table from './packages/table';

Table.install = (Vue, opts = {}) => {
  Vue.component(Table.name, Table);
};

export default Table;
export const VirtualTable = Table;
