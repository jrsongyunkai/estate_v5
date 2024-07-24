import request from '@/plugins/request'

/**
 * 校验项目是否开启即时结算
 * @param {*} params
 * @returns
 */
export const checkRtSettlement = params => request.GET('/rtSettlement/check.as', params)

/**
 * 激活即时结算系统
 * @param {*} params
 * @returns
 */
export const activeRtSettlement = params => request.POSTS('/rtSettlement/activate.as', params)

/**
 * 添加对象接口
 * @param {*} params
 * @returns
 */
export const saveSettlementObj = params => request.POSTS('/realTimeSettlement/save.as', params)

/**
 * 更新状态接口（解禁、禁用）
 * @param {*} params
 * @returns
 */
export const updateStatusObj = params => request.POST('/realTimeSettlement/updateStatus.as', params)

/**
 * 主配置详情接口
 * @param {*} params
 * @returns
 */
export const getObjDetail = params => request.POST('/realTimeSettlement/detail.as', params)

/**
 * 编辑对象接口
 * @param {*} params
 * @returns
 */
export const updateObj = params => request.POSTS('/realTimeSettlement/update.as', params)

/**
 * 批量修改单价
 * @param {*} params
 * @returns
 */
export const batchModify = params => request.POSTS('/realTimeSettlement/batchModify.as', params)

/**
 * 查询预警配置
 * @param {*} params
 * @returns
 */
export const queryWarnByCfgId = params => request.POST('/realTimeSettlement/warn/queryByCfgId.as', params)

/**
 * 查询单价
 * @param {*} params
 * @returns
 */
export const queryPriceByCfgId = params => request.POST('/realTimeSettlement/price/queryByCfgId.as', params)

/**
 * 查询对象列表接口
 * @param {*} params
 * @returns
 */
export const queryTimeSettlementObjPage = params => request.POST('/realTimeSettlement/chnlOrderOverViewrPage.as', params)

/**
 * 查询监收人列表接口
 * @param {*} params
 * @returns
 */
export const querySupervisor = params => request.POST('/realTimeSettlement/supervisor/page.as', params)

/**
 * 保存监收人接口
 * @param {*} params
 * @returns
 */
export const saveSupervisor = params => request.POSTS('/realTimeSettlement/supervisor/save.as', params)

/**
 * 修改监收人接口
 * @param {*} params
 * @returns
 */
export const updateSupervisor = params => request.POSTS('/realTimeSettlement/supervisor/update.as', params)

/**
 * 删除监收人接口
 * @param {*} params
 * @returns
 */
export const deleteSupervisor = params => request.POST('/realTimeSettlement/supervisor/delete.as', params)

/**
 * 导入监收人接口
 * @param {*} params
 * @returns
 */
export const importSupervisor = params => request.POST('/realTimeSettlement/supervisor/import.as', params)

/**
 * 配置监收人接口
 * @param {*} params
 * @returns
 */
export const configSupervisor = params => request.POSTS('/realTimeSettlement/device/configSupervisor.as', params)

/**
 * 查询用户列表概览接口
 * @param {*} params
 * @returns
 */
export const userOverview = params => request.POSTS('/rtSettlement/user/overview.as', params)

/**
 * 查询用户列表趋势统计接口
 * @param {*} params
 * @returns
 */
export const userChart = params => request.POSTS('/rtSettlement/user/consumptionChart.as', params)

/**
 * 查询用户列表接口
 * @param {*} params
 * @returns
 */
export const queryUserPage = params => request.POSTS('/rtSettlement/user/page.as', params)

/**
 * 导出用户列表接口
 * @param {*} params
 * @returns
 */
export const exportUser = params => request.DOWNLOADFILE('/rtSettlement/user/page/export.as', params)

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
export const exportConsumption = params => request.DOWNLOADFILE('/rtSettlement/consumption/page/export.as', params)

/**
 * 查询消费记录概览接口
 * @param {*} params
 * @returns
 */
export const consumptionOverview = params => request.POSTS('/rtSettlement/consumption/overview.as', params)

/**
 * 查询消费记录趋势接口
 * @param {*} params
 * @returns
 */
export const consumptionChart = params => request.POSTS('/rtSettlement/consumption/chart.as', params)

/**
 * 查询对象统计排行榜
 * @param {*} params
 * @returns
 */
export const consumptionRank = params => request.POSTS('/rtSettlement/consumption/rank.as', params)

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
export const offlineRechargeAndRefundExport = params => request.DOWNLOADFILE('/rtSettlement/offlineRechargeAndRefund/export.as', params)

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
export const exportOnlineRecharge = params => request.DOWNLOADFILE('/rtSettlement/onlineRecharge/page/export.as', params)

/**
 * 查询充值记录概览接口
 * @param {*} params
 * @returns
 */
export const rechargeOverview = params => request.POSTS('/rtSettlement/recharge/overview.as', params)

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
export const exportOnlineRefund = params => request.DOWNLOADFILE('/rtSettlement/onlineRefund/page/export.as', params)

/**
 * 查询退费记录趋势接口
 * @param {*} params
 * @returns
 */
export const refundChart = params => request.POSTS('/realTimeSettlement/refund/chart.as', params)

/**
 * 结算通知配置列表查询
 * @param {*} params
 * @returns
 */
export const chnlSupervisorPage = params => request.POST('/realTimeSettlement/chnlSupervisorPage.as', params)

/**
 * 结算通知监收人下拉框
 * @param {*} params
 * @returns
 */
export const prjSupervisorList = params => request.POST('/realTimeSettlement/supervisor/prjSupervisorList.as', params)

/**
 * 修改结算通知配置监收人
 * @param {*} params
 * @returns
 */
export const modifySupervisor = params => request.POSTS('/realTimeSettlement/supervisor/chnl/modifySupervisor.as', params)

/**
 * 结算历史-对象数据趋势接口
 * @param {*} params
 * @returns
 */
export const realTimeSettlementChart = params => request.POSTS('/rtSettlement/consumption/channel/chart.as', params)

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
 *  强制关闭订单接口
 */
export const forceEndOrder = params => request.POSTS('/rtSettlement/consumption/forceEndOrder.as', params)
