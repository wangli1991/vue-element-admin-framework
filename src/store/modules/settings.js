/*
 * @Author: 王利
 * @Date: 2020-11-27 13:29:12
 * @LastEditors: 王利
 * @LastEditTime: 2020-11-27 13:32:44
 */
import variables from "@/styles/element-variables.scss";

const state = {
  theme: variables.theme
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  }
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
