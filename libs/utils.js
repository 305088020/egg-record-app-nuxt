import Cookies from 'js-cookie'
import config from '../config'

export const TOKEN_KEY = 'token'
const { cookieExpires } = config

export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode
  if (parentNode) {
    const classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  return route1.path === route2.path
}

export const showTitle = item => {
  return item.title ? item.title : item.name
}

export const getChildRoutesFromPath = path => {
  return path
    .split('/')
    .splice(1)
    .reduce(
      (prev, next) => {
        return prev.concat(prev[prev.length - 1] + '/' + next)
      },
      ['']
    )
    .splice(1)
}

/**
 * 因为localStorage只能存字符，所以把boolean变成字符1和0
 * @param status
 */
export const setCollapsed = status => {
  localStorage.collapsed = status ? '1' : '0'
}

export const getCollapsed = () => {
  return localStorage.collapsed === '1'
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * 输出替换参数后的路径
 * 示例：path=  'localhost:3000/student/_class/_id'
 *      params = {class: 100, id: 200}
 * 输出：        'localhost:3000/student/100/200'
 */
export const replaceDynamic = (path, params) => {
  const res = extractDynamicKeys(path)
  res.forEach(k => {
    path = path.replace('_' + k, params[k])
  })
  return path
}

/**
 * 输出从路径匹配到字符数组
 * @param path
 * @returns Array
 * 示例：path=  'localhost:3000/student/_class/_id'
 * 输出 ['class', 'id']
 */
export const extractDynamicKeys = path => {
  const res = path.match(/\/_([\w_]+)/g)
  if (res) return res.map(i => i.substring(2))
}

export const extractDynamicPathFromRoute = route => {
  return route.matched[0].path.replace(/:([\w_]+)\?/g, '_$1')
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}
