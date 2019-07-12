import * as OfflinePluginRuntime from 'offline-plugin/runtime';
//OfflinePluginRuntime.install();

import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import './scss/custom.scss';
import router from './router';
import tvmazeController from './tvmazeController';
window. tvmc = tvmazeController;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  async created () {
  }
}).$mount('#app');
