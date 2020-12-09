// mutations函数名
import * as types from "../types";
// 公用session处理
import {
  getUserInfo,
  getToken,
  getAvatar,
  setToken,
  setUser,
  setUserInfo,
  setUserId,
  setLoginTimestamp,
  setAvatar,
  removeLoginTimestamp,
  removeUserId,
  removeToken,
  removeUserInfo,
  removeUser,
  removeAvatar
} from "@/utils/cookies";
// 引入路由
import router, { resetRouter } from "@/routes";

const state = {
  loginInfo: {}, // 登录信息
  userInfo: getUserInfo(), // 用户信息
  avatar: getAvatar(),
  roles: []
};

const mutations = {
  [types.LOGININFO](state, { data }) {
    state.loginInfo = data;
    state.userInfo = JSON.stringify(data.userinfo);
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  createLoginInfo({ commit, state }, params) {
    setToken(params.token);
    setUser(params.username);
    setUserId(params.id);
    setUserInfo(params.userinfo);
    setAvatar(require("@/assets/img/avatar.gif"));
    commit({
      type: types.LOGININFO,
      data: params
    });
  },
  setRoles({ commit }, roles) {
    commit("SET_ROLES", roles);
  },
  // user logout
  createLogout({ commit, state, dispatch }) {
    removeToken();
    removeUserId();
    removeUser();
    removeUserInfo();
    removeAvatar();
    removeLoginTimestamp();
    resetRouter();
    commit("SET_ROLES", []);

    // dispatch("tagsView/delAllViews", null, { root: true });
    if (process.env.NODE_ENV === "development") {
      const path = "/login";
      router.push({ path }).catch(() => {});
    } else {
      // 刷新浏览器，释放内存
      setTimeout(() => window.history.go(0), 300);
    }
  },
  async changeRoles({ commit, dispatch }, role) {
    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  }
};
// getters
const getters = {
  userInfo(state) {
    return state.userInfo ? JSON.parse(state.userInfo) : {};
  },
  avatar(state) {
    return state.avatar ? state.avatar : require("@/assets/img/avatar.gif");
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
