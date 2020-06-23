import request from '../../libs/request'

export const index = options => {
  const url = 'users?limit=' + options.limit + '&currentPage=' + options.currentPage + '&sort=' + options.sort
  return request({
    url: url,
    method: 'get'
  })
}

export const list = () => {
  return request({
    url: 'usersList/',
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'users/' + id,
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'users',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'users/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'users/' + id,
    method: 'DELETE'
  })
}
