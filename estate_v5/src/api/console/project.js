import request from '@/plugins/request'
export const getfindMaintenance = params => {
  return request.POST('/maintenance/findMaintenance.as', params)
}
export const alarmUrgePush = params => {
  return request.POST('/alarm/urge4Push.as', params)
}

export const getQueryFastMenus = params => {
  return request.POST('/member/queryFastMenus.as', params)
}
export const getSaveFastMenus = params => {
  return request.POST('/member/saveFastMenus.as', params)
}

export const getEquipClassifys = params => {
  return request.POST('/project/main/v5/queryAlarmEquipClassifys.as', params)
}

export const getByEquipClassify = params => {
  return request.POST('/project/main/v5/queryAlarmListByEquipClassify.as', params)
}

export const getMaintenanceTrand = params => {
  return request.POST('/project/main/v5/queryMaintenanceTrand.as', params)
}

export const getTrendAndProcessRate = params => {
  return request.POST('/project/homePage/v5/alarmTrendAndProcessRate.as', params)
}

export const getStatistics = params => {
  return request.POST('/project/homePage/v5/powerStatistics.as', params)
}

export const getLoadHour = params => {
  return request.POST('/project/homePage/v5/loadHourStatisticsOfDays.as', params)
}

export const getLoadDay = params => {
  return request.POST('/project/homePage/v5/loadDayStatisticsOfWeeks.as', params)
}

export const getLoadYears = params => {
  return request.POST('/project/homePage/v5/loadMonthStatisticsOfYears.as', params)
}
export const indexStatData = params => {
  return request.POST('/project/main/v5/getIndexStatData.as', params)
}

export const getTaskColStatData = params => {
  return request.POST('/project/main/v5/getTaskColStatData.as', params)
}

export const getControlTaskList = params => {
  return request.POST('/project/main/v5/getControlTaskList.as', params)
}
export const switchToProject = params => {
  return request.POST('/portal/v5/switchToProject.as', params)
}

export const loadStatsOfLast2Day = params => request.POST('/project/homePage/v5/loadStatsOfLast2X.as', params)
