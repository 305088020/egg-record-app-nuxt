import { Message } from 'view-design'
import config from '../config'
import HttpRequest from './axios'

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

const request = options => {
  return axios
    .request(options)
    .then(({ data }) => {
      return data
    })
    .catch(e => {
      const status = e.response.status
      const message = e.response.data.message || ''
      switch (status) {
        case 400:
          Message.error(message || '请求无效')
          break
        case 401:
          Message.error(message || '未授权：登录失败')
          break
        case 403:
          Message.error(message || '禁止访问')
          break
        case 404:
          Message.error(message || '请求路径不对')
          break
        case 500:
          Message.error(message || '服务器错误！')
          break
      }
    })
}

export default request
