function addWaterMarker(str, str2, parentNode, font, textColor, textRotate) {
  // 水印文字，父元素，字体，文字颜色
  var can = document.createElement('canvas')
  parentNode.appendChild(can)
  can.width = 250
  can.height = 250
  can.fontWeight = 700
  can.style.display = 'none'
  var cans = can.getContext('2d')
  cans.rotate((textRotate * Math.PI) / 180)
  cans.font = font || '26px PingFang SC'
  cans.fillStyle = textColor || 'rgba(234, 84, 32, 0.1)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, 0, can.height)
  cans.fillText(str2, 0, can.height + 30)
  parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
}

export default {
  bind: function (el, binding) {
    let text1 = 'ManTunsci'
    let text2 = '曼顿科技'
    let font = '26px PingFang SC'
    let textColor = 'rgba(234, 84, 32, 0.1)'
    let textRotate = -35
    addWaterMarker(text1, text2, el, font, textColor, textRotate)
  },
}
