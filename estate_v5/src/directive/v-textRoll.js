export default {
  inserted: (el, binding, vNode) => {
    el.style.overflow = 'hidden'
    el.style.whiteSpace = 'nowrap'
    const speed = binding.value || 60
    el.__text__ = `${vNode.children[0].text.trim()}`
    el.__span__ = document.createElement('span')
    el.__span__.innerHTML = el.__text__
    el.__span__.style.display = 'inline-block'
    el.innerHTML = ''
    el.appendChild(el.__span__)
    el.__spanWidth__ = el.__span__.offsetWidth
    el.isRoll = () => {
      if (el.__spanWidth__ > el.offsetWidth) {
        const times = binding.value || Math.max(Number(2 * el.__span__.offsetWidth - el.offsetWidth) / speed, 8)
        el.__span__.style.animation = `roll-text linear ${times}s normal infinite`
        el.__span__.innerHTML = `${el.__text__}&nbsp;&nbsp;&nbsp;&nbsp;${el.__text__}&nbsp;&nbsp;&nbsp;&nbsp;`
      } else {
        el.__span__.style.animation = 'none'
        el.__span__.innerHTML = `${el.__text__}`
      }
    }
    el.__observe__ = new ResizeObserver(el.isRoll)
    el.__observe__.observe(el, { box: 'border-box' })
  },
  componentUpdated(el, _, vNode) {
    el.__text__ = `${vNode.children[0].text.trim()}`
    el.__span__.innerHTML = el.__text__
    el.innerHTML = ''
    el.appendChild(el.__span__)
    el.__spanWidth__ = el.__span__.offsetWidth
    el.isRoll()
  },
  unbind: el => {
    el.__observe__.disconnect()
  },
}
