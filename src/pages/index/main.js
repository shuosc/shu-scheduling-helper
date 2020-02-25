import Vue from 'vue';
import App from './App';
import store from '../../store';
import VueClipboard from 'vue-clipboard2';

import '../../plugins/ant-design-vue';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.config.productionTip = false;

// noinspection JSUnusedGlobalSymbols
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
