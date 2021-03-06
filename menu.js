/**
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  meta{
 *    beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  }
 */
export default {
  '/users': {
    icon: 'ios-person-add-outline',
    index: 2,
    title: '用户',
    hideInBread: false,
    hideInMenu: false,
    access: ['admin']
  },
  '/customer': {
    icon: 'ios-people-outline',
    index: 3,
    title: '客户信息',
    hideInBread: false,
    hideInMenu: false,
    meta: {
      beforeCloseName: 'before_close_normal'
    }
  },
  '/disease': {
    icon: 'ios-people-outline',
    index: 4,
    title: '疾病类型',
    hideInBread: false,
    hideInMenu: false
  }
}
