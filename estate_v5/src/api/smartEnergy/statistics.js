import request from '@/plugins/request'

/**
 * 能源流向图节点查询（懒加载）
 */
export const queryEnergyGraph = params => request.POSTS('/smartEnergy/energy/graph.as', params)

/**
 * 能耗统计-各时间维度至今总用电量：本年、本季、本月、本周、昨日
 * @param {*} params
 * @param {string} params.projectCode
 * @param {string} params.mac
 * @param {number} params.addr
 * @param {number} params.groupId
 * @param {number} params.nodeId
 * @param {string} params.treeType  树类型：1：设备维度树 2：地理位置树 3：分组树
 * @param {string} params.timeType  时间类型：1：小时 2：天 3：月 4：年 5：周 6：季
 * @param {string} params.sTime 开始时间
 * @param {string} params.eTime 结束时间
 * @param {object} params.others
 * @param {string} params.others.provinceName
 * @param {string} params.others.cityName
 * @param {string} params.others.countyName
 * @returns
 */
export const energyOverView = params => request.POSTS('/smartEnergy/energy/overview.as', params)

/**
 * 能耗统计-用电趋势
 * @param {*} params
 * @param {string} params.projectCode
 * @param {string} params.energyType 能耗类型
 * @param {string} params.mac
 * @param {number} params.addr
 * @param {number} params.groupId
 * @param {number} params.nodeId
 * @param {string} params.statType  树类型：1：设备维度树 2：地理位置树 3：分组树
 * @param {string} params.timeType  时间类型：1：小时 2：天 3：月 4：年 5：周 6：季
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {string} params.provinceName
 * @param {string} params.cityName
 * @param {string} params.countyName
 * @returns
 */
export const energyChart = params => request.POSTS('/smartEnergy/energy/chart.as', params)

// 导出能耗趋势
export const energyChartExport = params => request.DOWNLOADFILE('/smartEnergy/energy/chart/export.as', params)

/**
 * 查询能耗异常报警
 */
export const queryEnergyAlarm = params => request.POSTS('/smartEnergy/energy/alarm.as', params)

/**
 * 查询能耗/碳排排名
 * @param {*} params
 * @param {number} params.energyType 能源类型:1.电能、2.水能、3.燃气，4.暖气
 * @param {string} params.dataType  类型:energy 能源，carbon 碳排
 * @param {string} params.rankType   1: 'mac' 设备, 'node'：分组,'channel':线路
 * @param {number} params.timeType   时间类型
 * @param {number} params.startTime   开始时间
 * @param {string} params.endTime   结束时间
 * @param {number} params.page 页码
 * @param {number} params.rows 每页数量
 * @returns
 */
export const energyRank = params => request.POSTS('/smartEnergy/energy/rank.as', params)

// 导出分组能耗趋势
export const energyElecChartGroupExport = params => request.DOWNLOADFILE('/energy/manage/v5/xls/exportEnergyStatisticsPower.as', params)
