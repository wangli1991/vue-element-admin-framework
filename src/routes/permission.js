/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-07 11:12:42
 */
import router from "@/routes";
import store from "@/store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { getToken } from "@/utils/cookies";
import { getUserInfo } from "@/utils/cookies";
import config from "@/config";

// 设置浏览器标题
const systemTitle = config.systemName;
function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${systemTitle}`;
  }
  return `${systemTitle}`;
}
// 设置 NProgress 样式
NProgress.configure({ showSpinner: false });

// 权限白名单
const whiteList = ["/login", "/auth-redirect"];
// 登录判断
const isLogin = () => {
  if (process.env.MOCK_DATA === "true") {
    return true;
  } else {
    return getToken();
  }
};
// 路由重定向
const redirect = (next, path) => {
  path ? next({ path }) : next(false);
  NProgress.done();
};
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();

  // 设置浏览器标题
  document.title = getPageTitle(to.meta.title);
  if (isLogin()) {
    if (to.path === "/login") {
      redirect(next, "/");
    } else {
      const hasRoles =
        store.state.user.roles && store.state.user.roles.length > 0;
      // const userInfo = getUserInfo();
      if (hasRoles) {
        next();
      } else {
        try {
          const roles = ["admin"];
          store.dispatch("user/setRoles", roles);
          const accessRoutes = await store.dispatch(
            "permission/generateRoutes",
            roles
          );
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          console.log(error);
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          redirect(next, `/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // 白名单，直接进入
    if (whiteList.includes(to.path)) {
      next();
    } else {
      redirect(next, `/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
