export default {
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  baseUrl: {
    dev: 'http://localhost:7300/mock/5dd4ec305da8a70020b93224/',
    pro: 'https://produce.com'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homePath: '/home'
}
