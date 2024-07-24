import request from '@/plugins/request'
/**
 * 获取电量预测默认方案
 * @param {*} params
 * @returns
 */
export const getKeyValue = params => request.POST('/common/getKeyValue.as', params)

/**
 * 设置电量预测默认方案
 * @param {*} params
 * @returns
 */
export const saveKeyValue = params => request.POST('/common/saveKeyValue.as', params)

/**
 * 获取电量模态预测数据
 * @param {*} params
 * @returns
 */
export const powerModalData = params => request.POSTS('/energy/manage/v5/prediction/powerModalData.as', params)

/**
 * 电量预测数据导出-一元线性回归
 * @param {*} params
 * @returns
 */
export const xLRExport = params => request.DOWNLOADFILE('/energy/manage/v5/prediction/xLRExport.as', params)
