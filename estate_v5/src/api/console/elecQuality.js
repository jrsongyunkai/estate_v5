import request from '@/plugins/request'

/**
 * 实时谐波数据
 * @param {*} params
 * @param {number} params.resId 设备id
 * @param {number} params.addr 线路Id
 * @param {string} params.type 谐波类型 电流：cur 电压：vol
 * @returns
 */
export const elecQualityHarm = params => request.POSTS('/elecQuality/realtime/harm.as', params)

/**
 * 谐波趋势数据
 * @param {*} params
 * @param {number} params.resId 资源id
 * @param {number} params.addr 线路addr
 * @param {string} params.type 谐波类型 电流：cur 电压：vol
 * @param {Array} params.phaseList 相位集合 可选项 A B C
 * @param {Array} params.choiceList 谐波数据展示相 可选项 见原型
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @returns
 */
export const elecQualityTrendHarm = params => request.POSTS('/elecQuality/statistics/harm.as', params)

/**
 * 实时三相不平衡
 * @param {*} params
 * @param {number} params.resId  资源id
 * @param {number} params.addr 线路addr
 * @returns
 */
export const thirdPhaseInBalance = params => request.POSTS('/elecQuality/realtime/thirdPhaseInBalance.as', params)

/**
 *电能趋势数据
 * @param {*} params
 * @param {number} params.resId 资源id
 * @param {number} params.addr 线路addr
 * @param {Array} params.choiceList 谐波数据展示相 可选项 见原型
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {*} params
 * @returns
 */
export const elecPowerTrend = params => request.POSTS('/elecQuality/statistics/elecMeter.as', params)

/**
 * 频率趋势数据
 * @param {*} params
 * @param {number} params.resId 资源id
 * @param {number} params.addr 线路addr
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @returns
 */
export const freqTrend = params => request.POSTS('/elecQuality/statistics/freq.as', params)

/**
 * 三相不平衡度趋势数据
 * @param {*} params
 * @param {number} params.resId 资源id
 * @param {number} params.addr 线路addr
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @returns
 */
export const thirdPhaseInBalanceTrend = params => request.POSTS('/elecQuality/statistics/elecBal.as', params)

/**
 * 导出实时谐波数据
 * @param {*} params
 * @returns
 */
export const xLRExportRealtimeHarm = params => request.DOWNLOADFILE('/elecQuality/export/realtimeHarm.as', params)

/**
 * 导出谐波数据
 * @param {*} params
 * @returns
 */
export const xLRExportStatisticsHarm = params => request.DOWNLOADFILE('/elecQuality/export/statisticsHarm.as', params)

/**
 * 导出频率
 * @param {*} params
 * @returns
 */
export const xLRExportStatisticsFreq = params => request.DOWNLOADFILE('/elecQuality/export/statisticsFreq.as', params)

/**
 * 导出电能趋势
 * @param {*} params
 * @returns
 */
export const xLRExportStatisticsMeter = params => request.DOWNLOADFILE('/elecQuality/export/statisticsMeter.as', params)

/**
 * 导出三相不平衡
 * @param {*} params
 * @returns
 */
export const xLRExportStatisticsBal = params => request.DOWNLOADFILE('/elecQuality/export/statisticsBal.as', params)
