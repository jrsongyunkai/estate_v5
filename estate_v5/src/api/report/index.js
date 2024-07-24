import request from '@/plugins/request'

// 根据项目查询用电
export const userPrjPowerStatsNew = params => {
  return request.POST('/project/main/v5/userPrjPowerStatsNew.as', params)
}
