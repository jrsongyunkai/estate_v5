import store from '@/store'

function setHeight() {
  let _height
  if (window.innerHeight < 1280) {
    _height = 1280
  } else {
    _height = window.innerHeight
  }
  store.commit('setHeight', _height)
}
// 初始化
setHeight()
// 改变窗口大小时重新设置
window.onresize = function () {
  if (document.isFullScreen || document.mozFullScreenElement || document.msFullscreenElement || document.fullScreenElement || document.webkitIsFullScreen) {
    store.commit('mapHeight', window.innerHeight - 185 + 'px')
    return false
  }
  setHeight()
}
