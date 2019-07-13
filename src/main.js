import * as OfflinePluginRuntime from 'offline-plugin/runtime';
//OfflinePluginRuntime.install();

import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import './scss/custom.scss';
import router from './router';
import tvmazeController from './tvmazeController';
import db from './database';
import Dexie from 'dexie';

window. tvmc = tvmazeController;
Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

db.open().then(()=>{
  console.log('db opened');
  new Vue({
    router,
    render: h => h(App),
    async created () {
    }
  }).$mount('#app');
}).catch(Dexie.UpgradeError,err=>{
  localStorage.removeItem('lastUpdated');
  window.indexedDB.databases().then((r) => {
    for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
  }).then(() => {
      alert('New database version, refreshing page.');
      location.reload();
  });
});