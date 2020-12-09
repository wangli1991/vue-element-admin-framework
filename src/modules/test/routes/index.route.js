/*
 * @Author: 王利
 * @Date: 2020-09-29 15:02:40
 * @LastEditors: 王利
 * @LastEditTime: 2020-09-29 16:19:43
 */
export default {
  routes: [
    {
      path: '/sys/dictionary',
      meta: { title: '系统管理', keepAlive: true },
      component: () => import('@SYS/pages/dictionary/index'),
    },
  ],
  // 注意：通过 iframe 形式加载的路由页面，路由路径必须以 /iframe 开头，
  // path 的值与 iframeRoutePath 相等
  iframes: [],
};
