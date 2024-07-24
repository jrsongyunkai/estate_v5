import cookies from './util.cookies'
import log from './util.log'
import db from './util.db'

import Setting from '@/setting'
// import store from '@/store/index'
const util = {
  cookies,
  log,
  db,
}

function tTitle(title = '') {
  if (window && window.$t) {
    if (title.indexOf('$t:') === 0) {
      return window.$t(title.split('$t:')[1])
    } else {
      return title
    }
  } else {
    return title
  }
}

/**
 * @description 更改标题
 * @param {Object} title 标题
 * @param {Object} count 未读消息数提示（可视情况选择使用或不使用）
 */
util.title = function ({ title, count }) {
  title = tTitle(title)
  // const text = (!store.state.individual || !store.state.individual.loginPageTitle) ? '' : store.state.individual.loginPageTitle.text
  let fullTitle = title ? `${title} - ${Setting.titleSuffix}` : Setting.titleSuffix
  // let fullTitle = text === '' ? `${title} - ${Setting.titleSuffix}` : text
  if (count) fullTitle = window.$t('manyInfo', { count, fullTitle })
  window.document.title = fullTitle
}

function requestAnimation(task) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(task)
  }

  setTimeout(task, 16)
}

export { requestAnimation }

export default util
