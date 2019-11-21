import { meta } from '../libs/meta'
import { getChildRoutesFromPath } from '../libs/utils'

export default async function({ store, route, redirect, error }) {
  const path = route.path
  const token = store.state.user.token

  // 如果是user页面，则无需鉴权
  if (path === '/login') return

  // 如果缺少token，则
  if (!token) {
    return redirect('/login')
  }

  // 获取不到正确的user信息，则退出登录
  const res = await store.dispatch('user/getUserInfo')
  if (!res) {
    await store.dispatch('user/handleLogOut')
    return redirect('/login')
  }

  const role = res.role

  let canAccess = true
  getChildRoutesFromPath(path).forEach(child => {
    if (meta[child] && meta[child].access && Array.isArray(meta[child].access)) {
      const accessList = meta[child].access
      if (!accessList.includes(role)) {
        canAccess = false
      }
    }
  })
  if (!canAccess) {
    return error({ statusCode: 401, message: '无访问权限' })
  }

  if (path === '/') {
    return redirect('/home')
  }
}
