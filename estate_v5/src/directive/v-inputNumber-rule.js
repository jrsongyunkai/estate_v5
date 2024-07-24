let findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type)
}

function isRegex(param) {
  return param instanceof RegExp
}

const trigger = (el, type) => {
  const e = new Event(type, { bubbles: true, cancelable: true })
  el.dispatchEvent(e)
}

const getDecimalReg = n => {
  let ruleSrt = new RegExp(`\\d+(\\.\\d{0,${n}})?`)
  return { keyUpRule: ruleSrt, blurRule: ruleSrt }
}

const getRealDecimalReg = n => {
  let ruleSrt = new RegExp(`(^-)?\\d+(\\.\\d{0,${n}})?`)
  return { keyUpRule: ruleSrt, blurRule: ruleSrt }
}
const regMap = {
  Integer: { keyUpRule: /\d+/, blurRule: /\d+/ }, // 正整数
  PositiveNum: { keyUpRule: /\d+(\.\d*)?/, blurRule: /\d+(\.\d+)?/ }, // 正数
  OneDecimal: getDecimalReg(1), // 一位小数正数
  TwoDecimal: getDecimalReg(2), // 两位小数正数
  ThreeDecimal: getDecimalReg(3), // 三位小数正数
  FourDecimal: getDecimalReg(4), // 四位小数正数
  OneRealNumber: getRealDecimalReg(1), // 一位小数正数或负数
  TwoRealNumber: getRealDecimalReg(2), // 两位小数正数或负数
  ThreeRealNumber: getRealDecimalReg(3), // 三位小数正数或负数
  FourRealNumber: getRealDecimalReg(4), // 四位小数正数或负数
}

// 正则规则可根据需求自定义
const inputNumber = {
  bind: function (el, binding, vnode) {
    el.regRuleMap = regMap[binding.value] || regMap.PositiveNum
    el.$inp = findEle(el, 'input')
    el.$inp.handle = () => {
      let value = el.$inp.value
      if (value && isRegex(el.regRuleMap.keyUpRule) && value !== '-') {
        const splits = value.match(el.regRuleMap.keyUpRule)
        el.$inp.value = splits && splits.length ? splits[0] : ''
      }
      trigger(el.$inp, 'input')
    }
    el.$inp.handleBlur = () => {
      let value = el.$inp.value
      if (value && isRegex(el.regRuleMap.blurRule)) {
        const splits = value.match(el.regRuleMap.blurRule)
        el.$inp.value = splits && splits.length ? splits[0] : ''
      }
      trigger(el.$inp, 'input')
    }
    el.$inp.addEventListener('keyup', el.$inp.handle)
    el.$inp.addEventListener('blur', el.$inp.handleBlur)
  },
  unbind: function (el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle)
    el.$inp.removeEventListener('blur', el.$inp.handleBlur)
  },
}

export default inputNumber
