import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUi from 'element-ui';
import axios from 'axios';
import vuescroll from 'vuescroll';

Vue.use(ElementUi)
Vue.use(vuescroll, {
  ops: {    // 在这里设置全局默认配置
    bar: { //这里的bar是配置属性
      background: '#495060', //这个是滚动条的背景颜色
    },
    rail: {
      background: "#000000", //轨道的背景色。
      opacity: 0, //轨道的透明度。 0是透明，1是不透明
      size: "6px", //轨道的尺寸。
      specifyBorderRadius: false, //是否指定轨道的 borderRadius， 如果不那么将会自动设置。
      gutterOfEnds: null,//轨道距 x 和 y 轴两端的距离
      gutterOfSide: "0px", //距离容器的距离
      keepShow: false, //是否即使 bar 不存在的情况下也保持显示。
    },
  }, 
  name: 'mtwScroll' // 在这里自定义组件名字，默认是vueScroll
});
Vue.prototype.axios = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')