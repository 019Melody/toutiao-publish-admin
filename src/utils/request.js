/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'

// 创建一个axios实例，说白了就是复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 请求基础路径
})

export default request
