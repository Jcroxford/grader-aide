import VueClipboard from 'vue-clipboard2';
import 'vuetify/dist/vuetify.min.css';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VCard,
  VIcon,
  VGrid,
  VToolbar,
  VDivider,
  VExpansionPanel,
  VCheckbox,
  VSubheader,
  VDialog,
  VDataTable,
  VTextField,
  VTooltip,
  VTabs,
  VForm,
  transitions
} from 'vuetify';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.use(VueClipboard);

// vuetify config
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VCard,
    VIcon,
    VGrid,
    VToolbar,
    VDivider,
    VExpansionPanel,
    VCheckbox,
    VSubheader,
    VDialog,
    VDataTable,
    VTextField,
    VTooltip,
    VTabs,
    VForm,
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
