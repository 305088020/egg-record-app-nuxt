import request from '../libs/request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = token => {
  return request({
    url: 'get_info',
    data: {
      token
    },
    method: 'post'
  })
}

export const logout = token => {
  return request({
    url: 'logout',
    method: 'post'
  })
}
