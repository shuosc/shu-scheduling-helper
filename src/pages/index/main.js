import Vue from 'vue';
import App from './App';
import store from '../../store';
import VueClipboard from 'vue-clipboard2';
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer';

import '../../plugins/ant-design-vue';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(Viewer);
Viewer.setDefaults({
  inline: false,
  navbar: false,
  title: false,
  toolbar: false,
  rotatable: false,
  scalable: false,
  fullscreen: false,
  minZoomRatio: 0.05,
  maxZoomRatio: 1.5,
});

Vue.config.productionTip = false;

// noinspection JSUnusedGlobalSymbols
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
