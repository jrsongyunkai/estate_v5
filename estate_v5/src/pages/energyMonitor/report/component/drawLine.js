export default {
  data() {
    return {
      isHoverStatus: false,
      hoverCount: 0,
      addDomEvent: [],
    }
  },
  methods: {
    changeLinStyle() {
      this.addDomEvent = Array.from(document.getElementsByClassName('allSelectLineOfone'))
      this.addDomEvent.forEach(v => {
        v.addEventListener('mouseenter', this.domMouseEnter)
        v.addEventListener('click', this.domMouseClick)
        v.addEventListener('mouseleave', this.domMouseLeave)
      })
    },
    domCancelStyle(e) {
      e.stopPropagation()
      const classArr = ['h-line', 'w-line', 'w-line-dashed', 'h-line-dashed', 'icon-v5-xiangyou', 'allSelectLineOfone']
      let arr = Array.from(e.target.classList)
      const isDrawLine = arr.some(v => classArr.includes(v))
      this.addDomEvent.forEach(v => {
        const classList = Array.from(v.classList)
        const includesBadge = classList.filter(v => v.includes('badge')).join()
        const [idA, idB, y2, x2, newStyle] = includesBadge.split('-')
        const doms = Array.from(document.getElementsByClassName(`${newStyle}`))
        if (!isDrawLine || !(Array.isArray(arr) && arr.length)) {
          this.isHoverStatus = false
          doms.forEach(item => {
            const classList = Array.from(item.classList)
            if (classList.includes('h-line') || classList.includes('h-line-dashed')) {
              item.style.width = '1px'
            }
            if (classList.includes('w-line') || classList.includes('w-line-dashed')) {
              item.style.height = '1px'
            }
            if (classList.includes('arrow-point')) {
              item.style.transform = 'scale(0.7)'
              item.style.color = '#999999'
              item.style.top = `${y2 - 2 + 56}px`
            }
            const circleDoms = Array.from(document.getElementsByClassName('circle-line'))
            const domIdAs = circleDoms.filter(v => v.id === idA)
            domIdAs.forEach(v => {
              v.parentNode.parentNode.parentNode.parentNode.parentNode.style.background = '#29303e'
            })
            const domIdBs = circleDoms.filter(v => v.id === idB)
            domIdBs.forEach(v => {
              v.parentNode.parentNode.parentNode.parentNode.parentNode.style.background = '#29303e'
            })
            item.style.zIndex = 10
            if (classList.includes('h-line-dashed') || classList.includes('w-line-dashed')) {
              return
            }
            item.style.background = '#999999'
          })
        }
      })
    },
    domMouseLeave(e) {
      const target = e.target
      const classList = Array.from(target.classList)
      const includesBadge = classList.filter(v => v.includes('badge')).join()
      const [idA, idB, y2, x2, newStyle] = includesBadge.split('-')
      const doms = Array.from(document.getElementsByClassName(`${newStyle}`))
      if (this.hoverCount === 0 && !this.isHoverStatus) {
        doms.forEach(item => {
          const classList = Array.from(item.classList)
          if (classList.includes('h-line') || classList.includes('h-line-dashed')) {
            item.style.width = '1px'
          }
          if (classList.includes('w-line') || classList.includes('w-line-dashed')) {
            item.style.height = '1px'
          }
          if (classList.includes('arrow-point')) {
            item.style.transform = 'scale(0.7)'
            item.style.color = '#999999'
            item.style.top = `${y2 - 2 + 56}px`
          }
          item.style.zIndex = 10
          if (classList.includes('h-line-dashed') || classList.includes('w-line-dashed')) {
            return
          }
          item.style.background = '#999999'
        })
      }
    },
    domMouseEnter(e) {
      const target = e.target
      const classList = Array.from(target.classList)
      const includesBadge = classList.filter(v => v.includes('badge')).join()
      const [idA, idB, y2, x2, newStyle] = includesBadge.split('-')
      const doms = Array.from(document.getElementsByClassName(`${newStyle}`))
      e.stopPropagation()
      if (this.isHoverStatus) return
      doms.forEach(item => {
        this.hoverCount = 0
        const classList = Array.from(item.classList)
        if (classList.includes('h-line') || classList.includes('h-line-dashed')) {
          item.style.width = '3px'
        }
        if (classList.includes('w-line') || classList.includes('w-line-dashed')) {
          item.style.height = '3px'
        }
        if (classList.includes('arrow-point')) {
          item.style.transform = 'scale(0.8)'
          item.style.color = '#007EFF'
          item.style.top = `${y2 - 1 + 56}px`
          item.style.left = `${x2 - 7}px`
        }
        if (classList.includes('h-line-dashed') || classList.includes('w-line-dashed')) {
          return
        }
        item.style.background = '#007EFF'
      })
    },
    domMouseClick(e) {
      const target = e.target
      const classList = Array.from(target.classList)
      const includesBadge = classList.filter(v => v.includes('badge')).join()
      const [idA, idB, y2, x2, newStyle] = includesBadge.split('-')
      const doms = Array.from(document.getElementsByClassName(`${newStyle}`))
      e.stopPropagation()
      doms.forEach(item => {
        this.hoverCount++
        this.isHoverStatus = true
        const classList = Array.from(item.classList)
        if (classList.includes('h-line') || classList.includes('h-line-dashed')) {
          item.style.width = '3px'
        }
        if (classList.includes('w-line') || classList.includes('w-line-dashed')) {
          item.style.height = '3px'
        }
        if (classList.includes('arrow-point')) {
          item.style.transform = 'scale(0.8)'
          item.style.color = '#007EFF'
        }
        const circleDoms = Array.from(document.getElementsByClassName('circle-line'))
        const domIdAs = circleDoms.filter(v => v.id === idA)
        domIdAs.forEach(v => {
          v.parentNode.parentNode.parentNode.parentNode.parentNode.style.background = 'rgba(0, 126, 255, 0.2)'
        })
        const domIdBs = circleDoms.filter(v => v.id === idB)
        domIdBs.forEach(v => {
          v.parentNode.parentNode.parentNode.parentNode.parentNode.style.background = 'rgba(0, 126, 255, 0.2)'
        })
        item.style.zIndex = 11
        if (classList.includes('h-line-dashed') || classList.includes('w-line-dashed')) {
          return
        }
        item.style.background = '#007EFF'
      })
    },
  },
  mounted() {
    document.addEventListener('click', this.domCancelStyle)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.domCancelStyle)
    this.addDomEvent.forEach((v, i) => {
      v.parentNode.removeChild(v)
    })
  },
}
