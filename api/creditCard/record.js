import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'record',
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'record/' + id,
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'record',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'record/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'record/' + id,
    method: 'DELETE'
  })
}
