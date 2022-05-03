import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUi from 'element-ui'
import { Message, Loading } from 'element-ui'
import axios from 'axios'
import vuescroll from 'vuescroll'
import dayjs from 'dayjs'
import '../src/assets/fontsStyle/iconfont.js'
import '../src/assets/fontsStyle/iconfont.css'
let loadingInstance = null
let loadingCount = 0//请求的个数
// loading开始 方法
function startLoading() {
  if (loadingCount == 0) {
    loadingInstance = Loading.service({
      lock: true,
      text: '拼命加载中...',
      target: '#app',
      background: 'rgba(0, 0, 0,0.3)', // 遮罩层颜色
    })
  }
  loadingCount++
}

// loading结束 方法
function endLoading() {
  loadingCount--
  if (loadingCount == 0) {
    loadingInstance.close()
  }
}
axios.defaults.crossDomain = true;
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    startLoading()
    return config
  },
  (error) => {
    // 对请求错误做些什么
    Message.error('接口请求错误')
    // console.log(error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    endLoading()
    if (response.data.code != 200 && response.data.success != true) {
      Message.error(response.data.msg||response.data.message||'接口返回失败')
    }
    return response
  },
  (error) => {
    // 对响应错误做点什么
    Message.error(error.response.data.msg||error.response.data.message||'接口响应错误')
    console.log(error.response);
    // console.log('axios响应拦截器的错误数据：', error)
    endLoading()
    return Promise.reject(error)
  }
)
Vue.use(ElementUi)
Vue.use(vuescroll, {
  ops: {
    // 在这里设置全局默认配置
    bar: {
      //这里的bar是配置属性
      background: '#495060', //这个是滚动条的背景颜色
    },
    rail: {
      background: '#000000', //轨道的背景色。
      opacity: 0, //轨道的透明度。 0是透明，1是不透明
      size: '6px', //轨道的尺寸。
      specifyBorderRadius: false, //是否指定轨道的 borderRadius， 如果false那么将会自动设置。
      gutterOfEnds: null, //轨道距 x 和 y 轴两端的距离
      gutterOfSide: '0px', //距离容器的距离
      keepShow: false, //是否即使 bar 不存在的情况下也保持显示。
    },
  },
  name: 'mtwScroll', // 在这里自定义组件名字，默认是vueScroll
})
Vue.prototype.axios = axios
Vue.prototype.dayjs = dayjs
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
