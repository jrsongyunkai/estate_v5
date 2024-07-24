import { toCanvas as toQrCodeCanvas } from 'qrcode'
import { toCanvas } from 'html-to-image'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export class QrCode {
  // 二维码样式
  // 导出二维码压缩文件类型
  static picTypeName = [window.$t('conciseQRCode'), window.$t('detailsQRCode'), window.$t('professionalQRCode')]

  // 创建一个二维码简洁实例
  static createSimpleQrCodeCanvas(text, options) {
    return toQrCodeCanvas(text, { errorCorrectionLevel: 'H', width: 240, height: 240, margin: 2, ...options })
  }

  // 创建一个自定义二维码实例
  static async createdCustomQrCodeCanvas(text, selfEl, backgroundColor = '#28313f') {
    const pixelRatio = window.devicePixelRatio || 1
    const qr = await QrCode.createSimpleQrCodeCanvas(text)
    let createQrDiv = document.createElement('div')
    const containerWidth = Math.max(selfEl.clientWidth + 20, 260)
    createQrDiv.style.width = containerWidth + 'px'
    createQrDiv.style.padding = '260px 10px 10px'
    createQrDiv.style.textAlign = 'center'
    createQrDiv.appendChild(selfEl.cloneNode(true))
    document.body.appendChild(createQrDiv)
    const canvas = await toCanvas(createQrDiv, { backgroundColor, skipFonts: true, pixelRatio })
    const ctx = canvas.getContext('2d')
    ctx.drawImage(qr, ((containerWidth - 240) / 2) * pixelRatio, 10 * pixelRatio, 240 * pixelRatio, 240 * pixelRatio)
    createQrDiv.remove()
    return canvas
  }

  /**
   * 压缩包压缩文件导出
   * @param {*} pics {file: 压缩的文件图片,folder:"所属文件夹", fileName:'文件名称'}
   * @param {*} zipName
   */
  static downloadZip(pics, zipName = window.$t('compressedPackage')) {
    const zip = new JSZip()
    for (let index = 0; index < pics.length; index++) {
      const pic = pics[index]
      zip.file(`${pic.folder ? pic.folder + '/' : ''}${pic.fileName}.png`, pic.file) // 文件夹下文件的名字
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, `${zipName}.zip`)
    })
  }

  // 生成图片Blob
  static async canvasToBlob(canvas) {
    return new Promise(resolve => {
      canvas.toBlob(resolve)
    })
  }

  // 导出图片
  static downloadImage(base64Url, fileName) {
    let imgUrl = base64Url
    if (window.navigator.msSaveOrOpenBlob) {
      // 兼容IE浏览器的写法
      let imageStr = atob(imgUrl.split(',')[1])
      let n = imageStr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = imageStr.charCodeAt(n)
      }
      let blob = new Blob([u8arr])
      window.navigator.msSaveOrOpenBlob(blob, `${fileName}.png`)
    } else {
      // 非IE浏览器
      let a = document.createElement('a')
      a.href = imgUrl
      a.setAttribute('download', fileName)
      a.click()
    }
  }

  static blobDownloadImage(blob, fileName = 'chart-download.png') {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName)
    } else {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}
