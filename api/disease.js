import request from '../libs/request'

export const index = options => {
  const url = 'disease?limit=' + options.limit + '&currentPage=' + options.currentPage + '&sort=' + options.sort
  return request({
    url: url,
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'disease/' + id,
    method: 'get'
  })
}
export const list = () => {
  return request({
    url: 'diseaseList/',
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'disease',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'disease/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'disease/' + id,
    method: 'DELETE'
  })
}
