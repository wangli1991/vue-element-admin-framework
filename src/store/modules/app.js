/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-11-27 10:06:12
 */
import Cookies from "js-cookie";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false
  },
  size: Cookies.get("size") || "medium"
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set("size", size);
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
