import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'flow',
    method: 'get'
  })
}
