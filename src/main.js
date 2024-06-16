import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'; //引入核心js组件
import 'element-ui/lib/theme-chalk/index.css';//引入依赖的样式
import md5 from 'js-md5';

Vue.prototype.$md5 = md5;
Vue.use(ElementUI) //引用
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖


import { request } from './network/request';
Vue.prototype.$request = request;

// 导入全局css
import 'assets/css/base.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
