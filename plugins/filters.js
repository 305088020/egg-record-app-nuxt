import Vue from 'vue'
import * as sd from 'silly-datetime'

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr === undefined || dataStr === '') return ''
  return sd.format(new Date(dataStr), pattern)
})

Vue.filter('currency', function(val) {
  return (
    '$ ' +
    Number(val)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  )
})
