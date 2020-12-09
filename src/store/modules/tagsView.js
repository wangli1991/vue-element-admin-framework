import router from "@/routes";
import * as types from "../types";

const state = {
  visitedViews: [],
  cachedViews: []
};

const mutations = {
  [types.ADD_VISITED_VIEW]: (state, { data }) => {
    if (state.visitedViews.some(v => v.path === data.path)) return;
    state.visitedViews.push(
      Object.assign({}, data, {
        title: data.meta.title || "no-name"
      })
    );
  },
  [types.ADD_CACHED_VIEW]: (state, { data }) => {
    if (state.cachedViews.includes(data.name)) return;
    if (!data.meta.noCache) {
      state.cachedViews.push(data.name);
    }
  },

  [types.DEL_VISITED_VIEW]: (state, { data }) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === data.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  [types.DEL_CACHED_VIEW]: (state, { data }) => {
    console.log(state.cachedViews);
    const index = state.cachedViews.indexOf(data.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },

  [types.DEL_OTHERS_VISITED_VIEWS]: (state, { data }) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === data.path;
    });
  },
  [types.DEL_OTHERS_CACHED_VIEWS]: (state, { data }) => {
    const index = state.cachedViews.indexOf(data.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      state.cachedViews = [];
    }
  },

  [types.DEL_RIGHT_VISITED_VIEWS]: (state, { data }) => {
    const index = state.visitedViews.findIndex(x => x.path === data.path);
    let visitedViews = [];
    state.visitedViews.forEach((v, i) => {
      if (i <= index) {
        visitedViews.push(v);
      } else {
        if (v.meta.affix) {
          visitedViews.push(v);
        }
      }
    });
    state.visitedViews = visitedViews;
  },
  [types.DEL_RIGHT_CACHED_VIEWS]: (state, { data }) => {
    const index = state.cachedViews.findIndex(name => name === data.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(0, index + 1);
    } else {
      state.cachedViews = [];
    }
  },

  [types.DEL_LEFT_VISITED_VIEWS]: (state, { data }) => {
    const index = state.visitedViews.findIndex(x => x.path === data.path);
    let visitedViews = [];
    state.visitedViews.forEach((v, i) => {
      if (i < index) {
        if (v.meta.affix) {
          visitedViews.push(v);
        }
      } else {
        visitedViews.push(v);
      }
    });
    state.visitedViews = visitedViews;
  },
  [types.DEL_LEFT_CACHED_VIEWS]: (state, { data }) => {
    const index = state.cachedViews.findIndex(name => name === data.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(0, index + 1);
    } else {
      state.cachedViews = [];
    }
  },

  [types.DEL_ALL_VISITED_VIEWS]: state => {
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix);
    state.visitedViews = affixTags;
  },
  [types.DEL_ALL_CACHED_VIEWS]: (state, { data }) => {
    state.cachedViews = data;
  },

  [types.CREAT_VISITED_VIEW]: (state, { data }) => {
    sessionStorage.setItem(
      "tabNav",
      JSON.stringify(
        state.visitedViews.map(x => {
          return {
            fullPath: x.fullPath,
            meta: x.meta,
            name: x.name,
            path: x.path
          };
        })
      )
    );
  }
};

const actions = {
  addView({ dispatch }, view) {
    dispatch("addVisitedView", view);
    dispatch("addCachedView", view);
    dispatch("creatVisitedView", view);
  },
  addVisitedView({ commit }, view) {
    commit({
      type: types.ADD_VISITED_VIEW,
      data: view
    });
  },
  addCachedView({ commit }, view) {
    commit({
      type: types.ADD_CACHED_VIEW,
      data: view
    });
  },

  delView({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delVisitedView", view);
      dispatch("delCachedView", view);
      dispatch("creatVisitedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delVisitedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_VISITED_VIEW,
        data: view
      });
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_CACHED_VIEW,
        data: view
      });
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delOthersVisitedViews", view);
      dispatch("delOthersCachedViews", view);
      dispatch("creatVisitedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_OTHERS_VISITED_VIEWS,
        data: view
      });
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_OTHERS_CACHED_VIEWS,
        data: view
      });
      resolve([...state.cachedViews]);
    });
  },

  delRightViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delRightVisitedViews", view);
      dispatch("delRightCachedViews", view);
      dispatch("creatVisitedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delRightVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_RIGHT_VISITED_VIEWS,
        data: view
      });
      resolve([...state.visitedViews]);
    });
  },
  delRightCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_RIGHT_CACHED_VIEWS,
        data: view
      });
      resolve([...state.cachedViews]);
    });
  },

  delLeftViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delLeftVisitedViews", view);
      dispatch("delLeftCachedViews", view);
      dispatch("creatVisitedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delLeftVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_LEFT_VISITED_VIEWS,
        data: view
      });
      resolve([...state.visitedViews]);
    });
  },
  delLeftCachedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_LEFT_CACHED_VIEWS,
        data: view
      });
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delAllVisitedViews", view);
      dispatch("delAllCachedViews");
      dispatch("creatVisitedView", view);

      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit({
        type: types.DEL_ALL_VISITED_VIEWS
      });
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }) {
    commit({
      type: types.DEL_ALL_CACHED_VIEWS,
      data: []
    });
  },

  creatVisitedView({ commit }, view) {
    commit({
      type: types.CREAT_VISITED_VIEW,
      data: view
    });
  },
  refreshView({ dispatch, commit, state }, view) {
    router.replace({ path: `/redirect${view.path}`, query: view.query });
    dispatch("delCachedView", view);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
