/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建一个axios实例，说白了就是复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 请求基础路径
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  // 所有请求会经过这里
  // config是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如：统一的设置token
    // Do something before request is sent
    // 当这里 return config 之后请求才会真正发出去
    return config
  },
  // 请求失败会经过这里
  function (error) {
  // Do something with request error
    return Promise.reject(error)
  })

export default request
