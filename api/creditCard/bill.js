import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'bill',
    method: 'get'
  })
}

export const update = id => {
  return request({
    url: 'card/' + id,
    method: 'PUT'
  })
}
