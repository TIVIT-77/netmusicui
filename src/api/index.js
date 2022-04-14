import { Loading } from 'element-ui'
import axios from 'axios'
let loadingInstance = null

// loading开始 方法
function startLoading() {
  loadingInstance = Loading.service({ lock: true, text: '拼命加载中...', fullscreen: true })
}

// loading结束 方法
function endLoading() {
  loadingInstance.close()
}

//创建 axios 实例
const Axios = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true, //是否允许跨域
  timeout: 6000,
})

// 添加请求拦截器
Axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log("axios请求拦截器的config：",config);
    startLoading()
    return config
  },
  (error) => {
    // 对请求错误做些什么
    Message.error('接口请求错误')
    console.log(error)
    endLoading()
    return Promise.reject(error)
  }
)

// 添加响应拦截器
Axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log("axios响应拦截器的数据：",response);
    endLoading()
    return response
  },
  (error) => {
    // 对响应错误做点什么
    Message.error('接口响应错误')
    console.log("axios响应拦截器的错误数据：",error);
    endLoading()
    return Promise.reject(error)
  }
)

export default Axios