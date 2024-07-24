import request from '@/plugins/request'

const { POST } = request

export const queryChannelPowerByTimeRange = params => POST('/energy/power030/queryChannelPowerByTimeRange.as', params)

export const pageByType = params => POST('/stats-group/pageByType.as', params)

export const queryCustomizePowerStatistics = params => POST('/energy/power030/queryCustomizePowerStatistics.as', params)

export const powerTrendNew = params => POST('/energy/manage/v5/powerTrendNew.as', params)

export const powerStatByGroupNew = params => POST('/energy/manage/v5/powerStatByGroupNew.as', params)

export const powerDataNew = params => POST('/energy/manage/v5/powerDataNew.as', params)

export const userGroupPowerStats = params => POST('/project/main/v5/userGroupPowerStats.as', params)
