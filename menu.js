export default {
  '/multilevel': {
    index: 1,
    icon: 'md-menu',
    title: '多级菜单',
    access: ['admin']
  },
  '/multilevel/level1': {
    icon: 'md-menu',
    title: '级别一',
    access: ['admin'],
    index: 2
  },
  '/student': {
    title: '学生列表',
    icon: 'ios-contact'
  },
  '/student/_class': {
    title: '班级'
  },
  '/student/_class/_id': {
    title: '学号'
  },
  '/bank': {
    title: '学号',
    icon: 'ios-contact'
  }
}
