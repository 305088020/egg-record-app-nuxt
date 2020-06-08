import axios from 'axios'
import { getToken } from '../libs/utils'

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig() {
    return {
      baseURL: this.baseUrl,
      headers: {}
    }
  }

  destroy(url) {
    delete this.queue[url]
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        if (url !== 'login') {
          const token = getToken()
          if (token) {
            // 将token放到请求头发送给服务器,将tokenkey放在请求头中
            config.headers.Authorization = 'Bearer ' + token
          }
        }
        this.queue[url] = true
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        const { data, status } = res
        return { data, status }
      },
      error => {
        this.destroy(url)
        return Promise.reject(error)
      }
    )
  }

  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
