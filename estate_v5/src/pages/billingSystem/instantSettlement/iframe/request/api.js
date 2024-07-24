import sourceRequest from '@/plugins/request'
import uuid from 'uuid/v1'

const messageHandler = e => {
  if (!messageResolveMap.has(e.data.messageId)) return
  const { resolve } = messageResolveMap.get(e.data.messageId)
  messageResolveMap.delete(e.data.messageId)
  resolve(e.data.res)
}

const methodMap = {
  GET: { method: 'get', dataType: 'json' },
  POST: { method: 'post', dataType: 'json', contentType: 'application/x-www-form-urlencoded' },
  POSTS: { method: 'post', dataType: 'json', contentType: 'application/json', processData: false },
  DOWNLOADFILE: { method: 'post', dataType: 'binary', contentType: 'application/json', processData: false, xhrFields: { responseType: 'blob' } },
}

const messageResolveMap = new Map()
window.addEventListener('message', messageHandler)

const request = Object.keys(sourceRequest).reduce((acc, cur) => {
  acc[cur] = (url, data, fileName = '') => {
    const messageId = uuid()
    let obj = { action: cur === 'DOWNLOADFILE' ? 'DOWNLOADFILE' : 'ajax', messageId }
    if (cur === 'DOWNLOADFILE') {
      obj.filename = fileName
    }
    window.parent.postMessage({ ...obj, ajaxData: { url, ...methodMap[cur], data: cur === 'POSTS' ? JSON.stringify(data) : data } }, '*')
    return new Promise((resolve, reject) => {
      messageResolveMap.set(messageId, { resolve, reject })
    })
  }
  return acc
}, {})

/**
 * 查询设备与线路
 * @param {*} params
 * @returns
 */
export const pageQueryAddrCommon = params => {
  return request.POST('/common/pageQueryAddr.as', params)
}

/**
 * 查询对象列表接口
 * @param {*} params
 * @returns
 */
export const queryTimeSettlementObjPage = params => request.POST('/realTimeSettlement/chnlOrderOverViewrPage.as', params)

/**
 * 查询用户列表接口
 * @param {*} params
 * @returns
 */
export const queryUserPage = params => request.POSTS('/rtSettlement/user/page.as', params)

/**
 * 查询消费记录接口
 * @param {*} params
 * @returns
 */
export const queryConsumption = params => request.POSTS('/rtSettlement/consumption/page.as', params)

/**
 * 导出消费记录接口
 * @param {*} params
 * @returns
 */
export const exportConsumption = (params, fileName) => request.DOWNLOADFILE('/rtSettlement/consumption/page/export.as', params, fileName)

/**
 * 查询线下充值+退费记录接口
 * @param {*} params
 * @returns
 */
export const offlineRechargeAndRefund = params => request.POSTS('/rtSettlement/offlineRechargeAndRefund/page.as', params)

/**
 * 查询线下充值+退费记录接口
 * @param {*} params
 * @returns
 */
export const offlineRechargeAndRefundExport = (params, fileName) => request.DOWNLOADFILE('/rtSettlement/offlineRechargeAndRefund/export.as', params, fileName)

/**
 * 查询线上充值记录接口
 * @param {*} params
 * @returns
 */
export const onlineRecharge = params => request.POSTS('/rtSettlement/onlineRecharge/page.as', params)

/**
 * 导出充值记录接口
 * @param {*} params
 * @returns
 */
export const exportOnlineRecharge = (params, fileName) => request.DOWNLOADFILE('/rtSettlement/onlineRecharge/page/export.as', params, fileName)

/**
 * 查询退费记录接口
 * @param {*} params
 * @returns
 */
export const queryOnlineRefund = params => request.POSTS('/rtSettlement/onlineRefund/page.as', params)

/**
 * 导出退费记录接口
 * @param {*} params
 * @returns
 */
export const exportOnlineRefund = (params, fileName) => request.DOWNLOADFILE('/rtSettlement/onlineRefund/page/export.as', params, fileName)

/**
 * 线下充值
 * @param {*} params
 * @returns
 */
export const rechargeOffline = params => request.POSTS('/rtSettlement/repair/offline/recharge.as', params)

/**
 * 线下赠送费用
 * @param {*} params
 * @returns
 */
export const giveOffline = params => request.POSTS('/rtSettlement/repair/offline/give.as', params)

/**
 * 线下退费
 * @param {*} params
 * @returns
 */
export const refundOffline = params => request.POSTS('/rtSettlement/repair/offline/refund.as', params)

/**
 * 线上退费
 * @param {*} params
 * @returns
 */
export const refundOnline = params => request.POSTS('/rtSettlement/repair/online/refund.as', params)

/**
 * 获取账户余额
 * @param {*} params
 * @returns
 */
export const getAccountAmount = params => request.POSTS('/rtSettlement/repair/account/amount.as', params)

/**
 *  根据充值单号查询退费详情
 */
export const refundOrderByPayOrder = params => request.POSTS('/rtSettlement/repair/refundOrderByPayOrder.as', params)

/**
 * 查询用户列表接口
 * @param {*} params
 * @returns
 */
export const queryUserAllPage = params => request.POSTS('/rtSettlement/user/pageUserStats.as', params)

/**
 * 导出用户
 * @param {*} params
 * @returns
 */
export const exportUserAllPage = (params, fileName) => request.DOWNLOADFILE('/rtSettlement/user/pageUserStats/export.as', params, fileName)
