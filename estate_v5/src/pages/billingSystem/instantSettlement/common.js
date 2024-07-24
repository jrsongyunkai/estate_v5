import qs from 'qs'

/**
 * 根据配置结算对象生成二维码文本
 * @param {*} row
 * @returns
 */
export const createQrCodeText = row => {
  let domain = window.location.origin
  let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
  let redirectUri = domainStatus ? 'https://dwpay.sndtest.com/wechat' : domain.includes('v5-pre') ? 'https://v5-pre.snd02.com/wechat' : 'https://v5.snd02.com/wechat'
  let params = { projectCode: row.projectCode, deviceId: `${row.resId}_${row.addr}`, deviceType: row.equipmentType || 1 }
  return `${redirectUri}?${qs.stringify(params)}`
}
