import textRoll from './v-textRoll'
import watermark from './v-waterMark'
import inputNumber from './v-inputNumber'
import scrollBar from './v-el_scrollBar'
import inputNumberRule from './v-inputNumber-rule'
import decimalTwo from './v-decimal-two'
import clickOutside from './v-clickOutside'
const directives = {
  textRoll,
  watermark,
  inputNumber,
  el_scrollBar: scrollBar,
  inputNumberRule,
  decimalTwo,
  clickOutside,
}

export default {
  install(Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })
  },
}
