export default function({ app, store }) {
  // 获取nuxt自动生成的routes
  const rawMenu = app.router.options.routes
  // 创建空数组，用来保存处理后的menuList
  store.commit('app/setRoutes', rawMenu)
  // metaData = menu
  store.commit('app/setHomeRoute')
}
