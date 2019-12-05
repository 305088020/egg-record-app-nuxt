import Vue from 'vue'
import * as sd from 'silly-datetime'

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return sd.format(new Date(dataStr), pattern)
})
