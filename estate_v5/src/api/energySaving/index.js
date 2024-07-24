import request from '@/plugins/request'

/**
 * 模式配置列表详细规则添加
 */
export const modeMatchRuleAdd = params => request.POSTS('/mode/config/add.as', params)

/**
 * 模式配置列表查询
 * @param {*} params
 * @returns
 */
export const modeMatchRuleList = params => request.POSTS('/mode/config/queryPage.as', params)

/**
 * 模式配置修改状态
 */
export const changeStatus = params => request.POST('/mode/config/updateStatusById.as', params)

/**
 * 模式配置列表删除
 */
export const deleteModeMatch = params => request.POST('/mode/config/deleteById.as', params)

/**
 * 模式配置列表详细规则修改
 */
export const updateModeMatch = (id, params) => request.JPOST(`/mode/config/updateById.as?id=${id}`, params)

/**
 * 模式配置列表详细规则查询
 */
export const queryModeMatch = params => request.GET('/mode/config/getDetail.as', params)

/**
 * 查询条件监测能耗趋势
 */
export const conditionEnergyChart = params => {
  return request.POSTS('/smartEnergy/conditionEnergy/chart.as', params)
}

// 导出条件监测能耗趋势
export const conditionEnergyChartExport = params => {
  return request.DOWNLOADFILE('/smartEnergy/conditionEnergy/chart/export.as', params)
}

/**
 * 查询条件能耗排名（位置和分组）
 */
export const conditionEnergyRank = params => request.POSTS('/smartEnergy/conditionEnergy/rank.as', params)

// 导出条件能耗排名（位置和分组）
export const conditionEnergyRankExport = params => request.DOWNLOADFILE('/smartEnergy/conditionEnergy/rank/export.as', params)

/**
 * 能耗规则匹配分页查询
 */
export const queryRulePage = params => request.POSTS('/smartEnergy/rule/queryRulePage.as', params)

/**
 * 能耗规则匹配-更新规则
 */
export const updateRule = params => request.POSTS('/smartEnergy/rule/updateRule.as', params)

/**
 * 能耗规则匹配-删除
 */
export const deleteRule = params => request.POSTS('/smartEnergy/rule/deleteRule.as', params)

/**
 * 能耗规则匹配-新增
 */
export const addRule = params => request.POSTS('/smartEnergy/rule/addRule.as', params)

/**
 * 查询规则详情
 */
export const getRuleInfo = params => request.GET('/smartEnergy/rule/getRule.as', params)
