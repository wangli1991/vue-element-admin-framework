/*
 * @Author: 王利
 * @Date: 2020-12-09 09:56:27
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-09 10:12:46
 */
/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const nestedRouter = {
  path: "/nested",
  component: Layout,
  redirect: "/nested/menu1/menu1-1",
  name: "Nested",
  meta: {
    title: "nested",
    icon: "nested"
  },
  children: [
    {
      path: "menu1",
      component: () => import("@/modules/test/pages/nested/menu1/index"), // Parent router-view
      name: "Menu1",
      meta: { title: "menu1" },
      redirect: "/nested/menu1/menu1-1",
      children: [
        {
          path: "menu1-1",
          component: () => import("@/modules/test/pages/nested/menu1/menu1-1"),
          name: "Menu1-1",
          meta: { title: "menu1-1" }
        },
        {
          path: "menu1-2",
          component: () => import("@/modules/test/pages/nested/menu1/menu1-2"),
          name: "Menu1-2",
          redirect: "/nested/menu1/menu1-2/menu1-2-1",
          meta: { title: "menu1-2" },
          children: [
            {
              path: "menu1-2-1",
              component: () =>
                import("@/modules/test/pages/nested/menu1/menu1-2/menu1-2-1"),
              name: "Menu1-2-1",
              meta: { title: "menu1-2-1" }
            },
            {
              path: "menu1-2-2",
              component: () =>
                import("@/modules/test/pages/nested/menu1/menu1-2/menu1-2-2"),
              name: "Menu1-2-2",
              meta: { title: "menu1-2-2" }
            }
          ]
        },
        {
          path: "menu1-3",
          component: () => import("@/modules/test/pages/nested/menu1/menu1-3"),
          name: "Menu1-3",
          meta: { title: "menu1-3" }
        }
      ]
    },
    {
      path: "menu2",
      name: "Menu2",
      component: () => import("@/modules/test/pages/nested/menu2/index"),
      meta: { title: "menu2" }
    }
  ]
};

export default nestedRouter;
