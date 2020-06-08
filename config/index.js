export default {
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  baseUrl: {
    // dev: 'http://localhost:7300/mock/5dd6984f5da8a70020b9322a/creditCard/',
    dev: 'http://' + window.location.hostname + ':7001/',
    pro: 'http://114.215.82.206:7001/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homePath: '/home'
}
