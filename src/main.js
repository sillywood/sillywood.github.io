import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import axios from 'axios';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import cvmain from './components/cvmain'
import home from './components/home'

Vue.prototype.axios=axios;
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter);

const routes=[
  {path:"/",component:home},
  {path:"/cvmain",component:cvmain}
]

const router=new VueRouter({
  mode:'hash',
  routes:routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

