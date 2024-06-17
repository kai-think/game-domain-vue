import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import vueconfig from "@/../vue.config"

let path = Object.keys(vueconfig.devServer.proxy)[0];
let target = vueconfig.devServer.proxy[path].target;
let timeout = 10000
// console.log(path, target)
//axios初始化
axios.defaults.baseURL = target + path;
//带验证token的请求头
axios.defaults.headers.common['Authorization'];
// 现在，在超时前，所有请求都会等待 5 秒
axios.defaults.timeout = timeout;
// 添加请求拦截器
let resquestIntercepter = axios.interceptors.request.use(
  function (config) {
      // 在发送请求之前做些什么
      // console.log("axios 请求前", config)
      return config;
  },
  function (error) {
      // 对请求错误做些什么
      // console.log("axios 请求错误", error)
      return Promise.reject(error);
  }
);

// 添加响应拦截器
let responseInterceptor = axios.interceptors.response.use(
  function (response) {
      // 对响应数据做点什么
      // console.log("axios 响应", response)
      let result = response.data;
      if (result.success)
        return result.data;
      
      console.log()
      if (result.status === 401)
      {
        store.dispatch("logout");
        // router.push("/login");
      }

      return Promise.reject(result.message);
  },
  function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
  }
);


Vue.config.productionTip = false;

Vue.prototype.toBook = function(bookId) {
  this.$router.push("/book/" + bookId);
};

import mixin from "@/common/mixin"

Vue.mixin({
  ...mixin
})

new Vue({
  router,
  store,
  vuetify,
  axios,
  render: h => h(App)
}).$mount('#app')
