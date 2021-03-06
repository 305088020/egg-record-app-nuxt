import request from '../libs/request'

export const index = options => {
  let url = ''
  if (typeof options.userId !== 'undefined') {
    url = 'wechat?userId=' + options.userId
  } else {
    url = 'wechat'
  }
  return request({
    url: url,
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'wechat/' + id,
    method: 'get'
  })
}
export const list = () => {
  return request({
    url: 'wechatList/',
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'wechat',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'wechat/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'wechat/' + id,
    method: 'DELETE'
  })
}
