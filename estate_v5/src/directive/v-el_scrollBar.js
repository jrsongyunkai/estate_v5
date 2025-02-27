import PerfectScrollbar from 'perfect-scrollbar'
const elScrollBar = el => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, { suppressScrollX: false })
    el._ps_.update()
  }
}
export default {
  inserted(el, binding) {
    const { arg } = binding
    if (arg === 'scrollBar') {
      el = el.querySelector('.el-table__body-wrapper')
      if (!el) {
        return console.warn('未发现className为el-table__body-wrapper的dom')
      }
    }
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  componentUpdated(el, binding, vnode) {
    const { arg } = binding
    if (arg === 'scrollBar') {
      el = el.querySelector('.el-table__body-wrapper')
      if (!el) {
        return console.warn('未发现className为el-table__body-wrapper的dom')
      }
    }
    vnode.context.$nextTick(() => {
      try {
        elScrollBar(el)
      } catch (error) {
        console.error(error)
      }
    })
  },
}