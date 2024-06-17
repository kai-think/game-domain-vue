import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    token: "",
    dicMap: {},
    showNotification: false,
    isInit: false,

    manufacturerMap: {} //管理员用户id映射用户详情 {"1": {userId: 1, circleId: 1}}
  },
  getters: {
    isLogin(state) {
      return state.user != null
    }
  },
  mutations: {
    user(state, user) {
      state.user = user;
    },
    token(state, token) {
      state.token = token;

      axios.defaults.headers.common['Authorization'] = token
    },
    showNotification(state, show) {
      state.showNotification = show;
    },
    isInit(state, init) {
      state.isInit = init;
    }
  },
  actions: {
    save({state}) {
      localStorage.setItem("user", JSON.stringify(state.user))
      localStorage.setItem("token", state.token)
    },
    load({commit}) {
      let user = localStorage.getItem("user");
      if (user != null)
      {
        user = JSON.parse(user);
        commit("user", user);
      }
      
      let token = localStorage.getItem("token")
      if (token != null)
      {
        commit("token", token);
      }

      commit("isInit", true);
    },
    clear() {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    },
    login({commit, dispatch}, {user, token}) {
      commit("user", user);
      commit("token", token);

      dispatch("save");
    },
    logout({commit, dispatch}) {
      commit("user", null);
      commit("token", "");

      dispatch("clear");
    },
    pushDic({state}, dic) {
      if (typeof dic !== "object")
      {
        console.error("store pushDic: dic not a object")
        return;
      }

      if (!Array.isArray(dic.children))
      {
        console.error("store pushDic: dic.children not a array")
        return;
      }

      state.dicMap[dic.id] = dic;
      state.dicMap[dic.value] = dic;
    },
    putManufacturer({state}, list) {
      if (!Array.isArray(list)) {
        return;
      }
      for (let m of list) {
        if (typeof m !== "object")
         continue
        
        state.manufacturerMap[m.id] = m;
      }
    },
    listManufacturer({state}, {circleId, callback}) {
      if (circleId == null || circleId <= 0)
        return;

      if (typeof callback !== "function")
        return;

      let arr = [];

      for (let key in state.manufacturerMap) {
        let m = state.manufacturerMap[key]
        if (m.circleId == circleId)
          arr.push(m)
      }

      callback(arr)
    }
  },
  modules: {
  }
});
