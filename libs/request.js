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
      throw new Error(e)
    })
}

export default request
