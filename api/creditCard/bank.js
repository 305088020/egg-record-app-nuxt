import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'bank',
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'bank/' + id,
    method: 'get'
  })
}

export const create = name => {
  return request({
    url: 'bank',
    method: 'POST',
    data: {
      name: name
    }
  })
}

export const update = (id, name) => {
  return request({
    url: 'bank/' + id,
    method: 'PUT',
    data: {
      name: name
    }
  })
}

export const destroy = id => {
  return request({
    url: 'bank/' + id,
    method: 'DELETE'
  })
}
