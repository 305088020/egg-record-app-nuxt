import CommonIcon from '../../../components/common-icon'
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle(item) {
      return item.title ? item.title : item.name
    },
    showChildren(item) {
      return item.children && item.children.length >= 1
    },
    getNameOrHref(item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : children0 ? item.children[0].path : item.path
    }
  }
}
