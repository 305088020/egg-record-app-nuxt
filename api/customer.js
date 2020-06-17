import request from '../libs/request'

export const index = options => {
  const url =
    'customer?limit=' +
    options.limit +
    '&currentPage=' +
    options.currentPage +
    '&sort=' +
    options.sort +
    '&user_id=' +
    options.user_id +
    '&search=' +
    options.search
  return request({
    url: url,
    method: 'get'
  })
}

export const show = id => {
  return request({
    url: 'customer/' + id,
    method: 'get'
  })
}

export const create = options => {
  return request({
    url: 'customer',
    method: 'POST',
    data: options
  })
}

export const update = (id, options) => {
  return request({
    url: 'customer/' + id,
    method: 'PUT',
    data: options
  })
}

export const destroy = id => {
  return request({
    url: 'customer/' + id,
    method: 'DELETE'
  })
}

export const loadCity = id => {
  let url = 'http://apis.map.qq.com/ws/district/v1/getchildren?key=ZBABZ-SNM3R-SP4WE-WWDUX-6H4UH-PSBT7'
  if (id) {
    url = url + '&id=' + id
  }

  return request({
    url: url,
    method: 'GET'
  })
}
