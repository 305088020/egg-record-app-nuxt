import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'card',
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'card/' + id,
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'card',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'card/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'card/' + id,
    method: 'DELETE'
  })
}

export const pay = options => {
  return request({
    url: 'flow',
    method: 'POST',
    data: options
  })
}

export const updateBill = id => {
  return request({
    url: 'bill/' + id,
    method: 'PUT'
  })
}

export const updateAllBill = () => {
  return request({
    url: 'updateAllBill/',
    method: 'GET'
  })
}
