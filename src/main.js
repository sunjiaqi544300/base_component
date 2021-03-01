/*
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-12 18:49:29
 * @LastEditTime: 2020-10-21 19:00:16
 * @FilePath: /bm-oa-components/src/main.js
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/reset.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/common.scss';
Vue.use(ElementUI);
// 本地存储
import Storage from 'vue-ls';
const storageOptions = {
  namespace: 'vue_', // key 键的前缀（随便起）
  name: 'ls', // 变量名称（随便起） 使用方式：Vue.变量名称 或 this.$变量名称
  storage: 'session', // 作用范围：local、session、memory
};
Vue.use(Storage, storageOptions);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#ifreamApp');
