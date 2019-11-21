import {
  getTagNavListFromLocalstorage,
  setTagNavListInLocalstorage,
  getMenuFromRoutes,
  getHomeRoute,
  sortMenu,
  getBreadCrumbList,
  routeHasExist,
  getSingleRoute,
  getNextRoute
} from '../libs/meta'
import config from '../config'
import { getCollapsed, setCollapsed, routeEqual, extractDynamicPathFromRoute } from '../libs/utils'

const { homePath } = config

const closePage = (state, route, router) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push({ path: nextRoute.path })
}

export const state = () => {
  return {
    routes: [],
    breadCrumbList: [],
    homeRoute: {},
    tagNavList: [],
    collapsed: getCollapsed()
  }
}

export const mutations = {
  setRoutes(state, routes) {
    state.routes = routes
  },
  setBreadCrumb(state, route) {
    state.breadCrumbList = getBreadCrumbList(route)
  },
  setHomeRoute(state) {
    state.homeRoute = getHomeRoute()
  },
  addTag(state, { route, type = 'unshift' }) {
    const params = route.params
    const path = extractDynamicPathFromRoute(route)
    const singleRoute = getSingleRoute(path, params)
    if (!routeHasExist(state.tagNavList, singleRoute)) {
      if (type === 'push') state.tagNavList.push(singleRoute)
      else if (path === homePath) state.tagNavList.unshift(singleRoute)
      else state.tagNavList.splice(1, 0, singleRoute)
      setTagNavListInLocalstorage([...state.tagNavList])
    }
  },
  setTagNavList(state, list) {
    let tagList = []
    if (list) {
      tagList = [...list]
    } else {
      tagList = getTagNavListFromLocalstorage() || []
    }

    if (tagList[0] && tagList[0].path !== homePath) tagList.shift()
    const homeTagIndex = tagList.findIndex(item => item.path === homePath)
    if (homeTagIndex > 0) {
      const homeTag = tagList.splice(homeTagIndex, 1)[0]
      tagList.unshift(homeTag)
    }
    state.tagNavList = tagList
    setTagNavListInLocalstorage([...tagList])
  },
  closeTag(state, route) {
    const tag = state.tagNavList.filter(item => routeEqual(item, route))
    route = tag[0] ? tag[0] : null
    if (!route) return
    closePage(state, route, this.app.router)
  },
  setCollapsed(state, status) {
    state.collapsed = status
    setCollapsed(status)
  }
}

export const getters = {
  menuList(state, getters, rootState) {
    return sortMenu(getMenuFromRoutes(state.routes, rootState.user.role))
  }
}
