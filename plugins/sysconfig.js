import Vue from 'vue'
import config from '../config'

export default () => {
  Vue.use({
    install(Vue) {
      Vue.prototype.$config = config
    }
  })
}
