import { switchHover } from '@/api/public'
import store from '@/store'
import router from '../router'
import { Message } from 'view-design'
import dayjs from 'dayjs'
export default {
  echartsSymbolMax: `image://${require('@/assets/images/max.png')}`,
  echartsSymbolMin: `image://${require('@/assets/images/min.png')}`,
  echartsSymbolOverlap: `image://${require('@/assets/images/merge.png')}`,
  echartsSymbolOverlapInverse: `image://${require('@/assets/images/merge-inverse.png')}`,
  echartsSymbolMaxInverse: `image://${require('@/assets/images/max-inverse.png')}`,
  echartsSymbolMinInverse: `image://${require('@/assets/images/min-inverse.png')}`,
  isSameArray(array) {
    if (Array.isArray(array)) {
      return [...new Set(array.filter(v => v !== '-'))].length === 1
    }
    return false
  },
  // 金额补零
  NumFormat(value) {
    if (!value) return '0.00'
    value = value.toFixed(2)
    var intPart = Math.trunc(value) // 获取整数部分
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1') // 将整数部分逢三一断
    var floatPart = '.00' // 预定义小数部分
    var value2Array = value.split('.')
    // =2表示数据有小数位
    if (value2Array.length === 2) {
      floatPart = value2Array[1].toString() // 拿到小数部分
      if (floatPart.length === 1) {
        return intPartFormat + '.' + floatPart + '0'
      } else {
        return intPartFormat + '.' + floatPart
      }
    } else {
      return intPartFormat + floatPart
    }
  },
  // 秒转换时分秒
  getTime(time) {
    // 转换为式分秒
    let h = parseInt((time / 60 / 60) % 24)
    h = h < 10 ? '0' + h : h
    let m = parseInt((time / 60) % 60)
    m = m < 10 ? '0' + m : m
    let s = parseInt(time % 60)
    s = s < 10 ? '0' + s : s
    // 作为返回值返回
    return h + window.$t('hour2') + m + window.$t('minute1') + s + window.$t('sec')
  },
  getNowFormatDate() {
    return dayjs().format('YYYY-MM-DD')
  },
  getCurrentYearMonth() {
    return dayjs().format('YYYY-MM')
  },
  getpreTherrYearMonth() {
    return dayjs().subtract(2, 'month').format('YYYY-MM')
  },
  getFuTime(date, time) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (time === 'month') {
      return year + '-' + month
    } else if (time === 'date') {
      return year + '-' + month + '-' + strDate
    } else if (time === 'hour') {
      return year + '-' + month + '-' + strDate + ' ' + hour
    } else if (time === 'year') {
      return year + ''
    }
  },
  getYearMonth(date, time) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (time === 'year') {
      return year + ''
    } else if (time === 'all') {
      return year + '-' + month
    } else if (time === 'month') {
      return month + ''
    }
  },
  getNowFormatDateTime(e) {
    if (e === 'time') {
      return dayjs().format('HH:mm:ss')
    } else {
      return dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  formatDate(format, time) {
    let date = new Date(time)
    let seperator = '-'
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let strDate = date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    let formatDate
    if (format === 'yyyy-MM-dd HH:mm:ss') {
      formatDate = year + seperator + month + seperator + strDate + ' ' + [hour, minute, second].join(':')
    } else if (format === 'yyyy-MM-dd') {
      formatDate = year + seperator + month + seperator + strDate
    } else if (format === 'HH:mm') {
      formatDate = [hour, minute].join(':')
    } else if (format === 'yyyy-MM-dd HH') {
      formatDate = year + seperator + month + seperator + strDate + ' ' + hour
    }
    return formatDate
  },
  getDaysBetween(dateString1, dateString2) {
    let startDate = dateString1
    let endDate = dateString2
    let days = Math.floor((endDate - startDate) / (1 * 24 * 60 * 60 * 1000))
    return days
  },
  getMonthText(date) {
    if (!date) return
    let monthText = date.split('-')[1]
    let i18n = store.state.locale === 'zh-CN' ? 'zh' : 'en'
    const monthMap = {
      '01': { zh: window.$t('January'), en: 'January' },
      '02': { zh: window.$t('February'), en: 'February' },
      '03': { zh: window.$t('March'), en: 'March' },
      '04': { zh: window.$t('April'), en: 'April' },
      '05': { zh: window.$t('May'), en: 'May' },
      '06': { zh: window.$t('June'), en: 'June' },
      '07': { zh: window.$t('July'), en: 'July' },
      '08': { zh: window.$t('August'), en: 'August' },
      '09': { zh: window.$t('September'), en: 'September' },
      10: { zh: window.$t('October'), en: 'October' },
      11: { zh: window.$t('November'), en: 'November' },
      12: { zh: window.$t('December'), en: 'December' },
    }
    return monthMap[monthText][i18n]
  },
  checkDateOneYear(start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - 366 * 24 * 60 * 60 * 1000
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkDateOneMonth(start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - 30 * 24 * 60 * 60 * 1000
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkPhone(phone) {
    let tel = /^(\+?[0-9]{2,4}-)?[0-9]{2,15}$/
    if (tel.test(phone)) {
      return phone
    }
  },
  checkDateThreeMonths(start, end) {
    let diff = new Date(end).getTime() - new Date(start).getTime() - 91 * 24 * 60 * 60 * 1000
    let result = diff <= 0 ? 'true' : 'false'
    return result
  },
  checkDataType(val) {
    return val === undefined || val === ''
  },
  windowCountDown(url) {
    console.log(url)
    let TIME_COUNT = 59
    let count = TIME_COUNT
    let myWindow = window.open('', '_blank', 'toolbar=no, location=no, directories=no, status=no, menubar=no, titlebar=no, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400')
    myWindow.document.write(`<div style="text-align: center;margin-top: 160px;font-size: 20px"><p>${window.$t('PleaseExportFinishCloseThisPage')}</p><p>${window.$t('page')}<span id="count-down">${count}</span>${window.$t('manySecAutoClose')}</p></div>`)
    myWindow.location.href = url
    let windowTime = setInterval(() => {
      if (count > 0 && count <= TIME_COUNT) {
        count--
        myWindow.document.getElementById('count-down').innerHTML = count
      } else {
        myWindow.close()
        clearInterval(windowTime)
        windowTime = null
      }
    }, 1000)
  },
  BD09_To_GCJ02(lat, lng) {
    var xPi = (3.14159265358979324 * 3000.0) / 180.0
    var x = lng - 0.0065
    var y = lat - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi)
    var lngs = z * Math.cos(theta)
    var lats = z * Math.sin(theta)
    return { lng: lngs, lat: lats }
  },
  GCJ02_To_BD09(lat, lng) {
    var xPi = (3.14159265358979324 * 3000.0) / 180.0
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPi)
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPi)
    var lngs = z * Math.cos(theta) + 0.0065
    var lats = z * Math.sin(theta) + 0.006
    return { lng: lngs, lat: lats }
  },
  setCookie(name, value) {
    let days = 30
    let exp = new Date()
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + value + ';expires=' + exp.toGMTString()
  },
  getCookie(name) {
    let _cookie = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
    return _cookie ? _cookie[2] : null
  },
  ctxPaths() {
    var ctxName = ''
    var hostName = document.location.protocol + '//' + window.location.host
    var ctxPaths = hostName + ctxName // 为空时为相对地址
    return ctxPaths
  },
  // 判断数组内元素是否相同
  isAllEqual(array) {
    if (array.length > 0) {
      return !array.some(function (value, index) {
        return value !== array[0]
      })
    } else {
      return true
    }
  },
  // 修改本方法请同步修改 src\layouts\basic-layout\header-search\index
  switchToProject(obj, url, type) {
    store.commit('projectCode', obj.projectCode)
    let params = { projectCode: obj.projectCode }
    store.commit('fullName', obj.projectName)
    store.commit('distributionDateType', 1)
    store.commit('admin/page/keepAliveClean')
    switchHover(params).then(function (res) {
      if (res.success) {
        store.commit('prjTitle', res.data.prjTitle)
        store.commit('prjName', res.data.prjName)
        store.commit('switchData', res.data)
        if (type === '1') {
          router.push({ name: url, params: { projectCode: obj.projectCode, status: 0, workOrderType: 1 } })
        } else if (type === '2') {
          router.push({ name: url, params: { projectCode: obj.projectCode, status: 1, workOrderType: 1 } })
        } else {
          router.push({ path: url })
        }
      } else if (res.code === '-1') {
      } else {
        Message.error({ content: res.message })
      }
    })
  },
  /**
   * 获取post请求导出表格转文件输出
   * @param {*} res 接口请求返参
   * @param {*} fileName 输出文件名称
   */
  getPostResFile(res, fileName = '') {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(res)
    a.download = `${fileName}_${dayjs().valueOf()}.xlsx`
    a.click()
    document.body.removeChild(a)
  },
  /**
   * 获取截止时间大于时间取当前时间
   * @param {String} date 'YYYY-MM-DD HH:mm:ss'
   * @returns
   */
  getEndTime(date) {
    return dayjs().isBefore(dayjs(date)) ? dayjs().format('YYYY-MM-DD HH:mm:ss') : date
  },
}
