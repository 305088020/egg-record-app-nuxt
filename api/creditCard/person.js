import request from '../../libs/request'

export const index = () => {
  return request({
    url: 'person',
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'person/' + id,
    method: 'get'
  })
}

export const create = name => {
  return request({
    url: 'person',
    method: 'POST',
    data: {
      name: name
    }
  })
}

export const update = (id, name) => {
  return request({
    url: 'person/' + id,
    method: 'PUT',
    data: {
      name: name
    }
  })
}

export const destroy = id => {
  return request({
    url: 'person/' + id,
    method: 'DELETE'
  })
}
