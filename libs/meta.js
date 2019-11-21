import meta from '../menu'
import config from '../config'
import { getChildRoutesFromPath, doCustomTimes, routeEqual, extractDynamicPathFromRoute } from './utils'

const { homePath } = config

/**
 * 将'/'路由统一成'/index'
 */
if (meta['/']) {
  meta['/index'] = meta['/']
  delete meta['/']
}

/**
 * 设置home页面默认定义
 */
meta[config.homePath] = {
  hideInMenu: true,
  icon: 'md-home',
  title: '首页'
}

/**
 * 设置login页面默认定义
 */
meta['/login'] = {
  hideInMenu: true
}

export { meta }

export const processRoutes = rawRoutes => {
  return rawRoutes.map(route => {
    const path = route.path.replace(/:([\w_]+)\?/g, '_$1')
    return {
      name: path.split('/').pop(),
      path: path
    }
  })
}

const sortRouteByLength = routes => {
  const routesClone = [...routes]
  return routesClone.sort((a, b) => {
    return b.path.split('/').length - a.path.split('/').length
  })
}

export const getMenuFromRoutes = (rawRoutes, role) => {
  const routes = processRoutes(sortRouteByLength(rawRoutes))

  const menu = []
  // 遍历自动生成的routes

  const pushChildren = (arr, menu, formerPath) => {
    const processMenu = (p, name) => {
      if (!menu.some(m => m.path === p)) {
        if (meta[p] && meta[p].hideInMenu) {
          return
        }

        if (role && meta[p] && meta[p].access) {
          // 如果access不在权限表，则不推入左侧菜单
          const accessList = meta[p].access
          if (!Array.isArray(accessList)) return
          if (Array.isArray(accessList) && !accessList.includes(role)) return
        }
        let pathClone = p
        if (name === 'index') {
          pathClone = pathClone.split('/')
          pathClone.pop()
          pathClone = pathClone.join('/')
        }

        if (meta[p]) {
          const toPush = { name, path: pathClone, ...meta[p] }
          menu.push(toPush)
        } else {
          menu.push({ name, path: pathClone })
        }
      }
    }

    const name = arr.shift()

    let path
    if (formerPath) {
      path = formerPath + '/' + name
    } else {
      path = '/' + name
    }

    if (arr.length === 0) {
      const menuItem = menu.find(m => m.name === name)
      if (menuItem && menuItem.children && menuItem.children.length > 0) {
        arr.push('index')
        pushChildren(arr, menuItem.children, path)
      }
    }
    processMenu(path, name)

    if (arr.length > 0) {
      const menuItem = menu.find(m => m.name === name)
      menuItem.children = menuItem.children || []
      pushChildren(arr, menuItem.children, path)
    }
    return menu
  }

  routes.forEach(route => {
    /**
     * nuxt生成的路由为{component:Object, name: 'a-b-c',path:'a/b/c'}
     * 我们需要处理路径，使它成为正常形式。
     */
    const routes = route.path.split('/')
    // 数组第一个值，没有意义，删除掉。
    routes.shift()
    // 当路径为空，说明是index.vue生成的路由，我们把它改回来。
    if (routes[0] === '') routes[0] = 'index'

    pushChildren(routes, menu)
  })
  return menu
}

export const sortMenu = menu => {
  const sortIndex = (a, b) => {
    const indexA = a.index || 9999
    const indexB = b.index || 9999
    return indexA - indexB
  }

  const menuRes = menu.sort(sortIndex)
  return menuRes.map(mitem => {
    if (mitem.children && mitem.children.length > 1) {
      mitem.children.sort(sortIndex)
    }
    return mitem
  })
}

export const getHomeRoute = () => {
  return getSingleRoute(homePath)
}

export const getSingleRoute = (path, params) => {
  if (meta[path]) {
    return {
      name: path.split('/').pop(),
      path: path,
      to: path,
      ...meta[path],
      params
    }
  } else {
    return { name: path.split('/').pop(), path: path, to: path, params }
  }
}

export const getBreadCrumbList = route => {
  const homeRoute = getHomeRoute()
  const routeMatched = route.matched
  if (routeMatched.some(item => item.name === homeRoute.name)) return [homeRoute]
  const childRoutes = getChildRoutesFromPath(routeMatched[0].path)
  const keys = Object.keys(route.params)
  const processedRoutes = childRoutes.map(path => {
    // 动态路由
    const rawName = path.split('/').pop()

    if (/:([\w_]+)\?/.test(rawName)) {
      const key = keys.shift()
      const value = route.params[key]

      path = path.replace(/:([\w_]+)\?/g, '_$1')
      let result = {}
      if (meta[path]) {
        result = { path, name: path.split('/').pop(), ...meta[path] }
        result.title = result.title ? result.title + `(${key}=${value})` : `${key}=${value}`
        return result
      } else {
        result = { path, name: path.split('/').pop() }
        result.title = `${key}=${value}`
        return result
      }
    } else {
      // 非动态路由
      const item = {
        path: path,
        name: rawName
      }
      if (meta[path]) {
        return { ...item, ...meta[path] }
      } else {
        return item
      }
    }
  })

  return [homeRoute, ...processedRoutes]
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNavList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNavList
  return list ? JSON.parse(list) : []
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const path = extractDynamicPathFromRoute(newRoute)
  const name = path.split('/').pop()
  const params = newRoute.params
  const newList = [...list]
  if (newList.findIndex(item => item.path === path) >= 0) {
    const index = newList.findIndex(item => item.path === path)
    // newList[index].params = params
    newList[index] = { ...newList[index], params }
    return newList
  } else {
    if (meta[path]) {
      newList.push({ name, path, params, ...meta[path] })
    } else {
      newList.push({ name, path, params })
    }
    return newList
  }
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length
  let res = false

  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute()
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}
