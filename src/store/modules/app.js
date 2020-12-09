/*
 * @Author: 王利
 * @Date: 2020-10-26 15:09:10
 * @LastEditors: 王利
 * @LastEditTime: 2020-12-08 12:46:35
 */
import Cookies from "js-cookie";
// mutations函数名
import * as types from "../types";
// 公用配置
import config from "@/config";
// 主题换肤
import variables from "@/assets/css/variables.scss";
import client from "webpack-theme-color-replacer/client";
import forElementUI from "webpack-theme-color-replacer/forElementUI";
// 公用方法
import { setLocal, getLocal } from "@/utils";
const state = {
  sidebarOpened: true,
  size: getLocal("size") || config.size, // 尺寸
  theme: variables.theme, // 主题
  errorLogs: [] // 错误日志
};

const mutations = {
  [types.TOGGLE_SIDEBAR]: state => {
    state.sidebarOpened = !state.sidebarOpened;
  },
  [types.SIZE](state, { data }) {
    state.size = data;
    setLocal("size", data);
  },
  [types.THEME_COLOR]: (state, { data }) => {
    state.theme = data;
  },
  [types.ADD_ERROR_LOG]: (state, { data }) => {
    state.errorLogs.push(data);
  },
  [types.CLEAR_ERROR_LOG]: state => {
    state.errorLogs.splice(0);
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit({
      type: types.TOGGLE_SIDEBAR,
      data: []
    });
  },
  setSize({ commit }, params) {
    commit({
      type: types.SIZE,
      data: params
    });
  },
  createElementSize({ commit, state }, params) {
    this._vm.$ELEMENT.size = config.toElementSize[params];
  },
  createThemeColor({ commit }, params) {
    const options = {
      newColors: [...forElementUI.getElementUISeries(params), params]
    };
    commit({
      type: types.THEME_COLOR,
      data: params
    });
    client.changer.changeColor(options, Promise).then(() => {
      setLocal("theme", params);
    });
  },
  addErrorLog({ commit }, params) {
    commit({
      type: types.ADD_ERROR_LOG,
      data: params
    });
  },
  clearErrorLog({ commit }) {
    commit({
      type: types.CLEAR_ERROR_LOG
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
