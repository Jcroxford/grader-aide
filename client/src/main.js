import 'vuetify/dist/vuetify.min.css';

import Vue from 'vue';
import App from './App';
import router from './router';

// vuetify config
import { Vuetify, VApp, VNavigationDrawer, VFooter, VList, VBtn, VIcon, VGrid, VToolbar, transitions } from 'vuetify';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
