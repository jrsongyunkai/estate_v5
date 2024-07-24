import request from '@/plugins/request'

/**
 * 碳排警报查询配置
 * @param {*} params
 * @returns
 */
export const queryByProjectCode = params => request.POST('/ceCfg/queryByProjectCode.as', params)

/**
 * 碳排警报配置新增、修改
 * @param {*} params
 */
export const saveOrUpdate = params => request.POST('/ceCfg/saveOrUpdate.as', params)

/**
 * 碳排首页概览栏统计
 * @param {*} params
 * @returns
 */
export const queryCarbonOverview = params => request.POSTS('/smartEnergy/carbon/overview.as', params)

/**
 * 碳排趋势
 * @param {*} params
 * @returns
 */
export const queryCarbonTrend = params => {
  return request.POSTS('/smartEnergy/carbon/chart.as', params)
}

// 导出碳排表
export const carbonChartExport = params => request.DOWNLOADFILE('/smartEnergy/carbon/chart/export.as', params)
