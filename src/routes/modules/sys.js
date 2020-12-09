/*
 * @Author: wangli
 * @Date: 2020-07-19 13:23:29
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-09 10:32:04
 */

import Layout from "@/layout";

const sysRouter = {
  path: "/sys",
  component: Layout,
  redirect: "/sys/dictionary",
  name: "SYS",
  meta: {
    title: "系统管理",
    icon: "table"
  },
  children: [
    {
      path: "dictionary",
      component: () => import("@SYS/pages/dictionary"),
      name: "Dictionary",
      meta: { title: "数据字典", keepAlive: true }
    }
  ]
};

export default sysRouter;
