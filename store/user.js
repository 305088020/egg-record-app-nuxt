import { getUserInfo, login } from '../api/user'
import { setToken, getToken } from '../libs/utils'

export const state = () => ({
  token: getToken(),
  username: '',
  userId: '',
  role: null,
  avatarImgPath: '',
  hasGetInfo: false
})

export const mutations = {
  setAvatar(state, avatarPath) {
    state.avatarImgPath = avatarPath
  },
  setUserId(state, id) {
    state.userId = id
  },
  setUserName(state, name) {
    state.username = name
  },
  setRole(state, role) {
    state.role = role
  },
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  setHasGetInfo(state, status) {
    state.hasGetInfo = status
  },
  clearAll(state) {
    state.access = null
    state.avatar = ''
    state.userId = ''
    state.role = null
    state.hasGetInfo = false
  }
}

export const getters = {
  get(state) {
    return state.list
  }
}

export const actions = {
  async handleLogin({ commit }, { username, password }) {
    username = username.trim()
    const data = await login({
      username,
      password
    })
    if (data && data.token) {
      commit('setToken', data.token)
    }
  },
  handleLogOut({ state, commit }) {
    // await logout(state.token)
    commit('setToken', '')
    commit('clearAll')
  },
  async getUserInfo({ commit }) {
    const data = await getUserInfo(state.token)
    if (typeof data === 'undefined') {
      return null
    }
    // commit('setAvatar', data.avatar)
    commit('setUserName', data.username)
    commit('setUserId', data.id)
    let role = ''
    if (data.admin) {
      role = 'admin'
    } else {
      role = 'normal'
    }
    commit('setRole', role)
    commit('setHasGetInfo', true)
    return data
  }
}
