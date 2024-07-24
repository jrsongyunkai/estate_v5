import request from '@/plugins/request'

export const loadAllLocationTree = () => {
  return request.POSTS('/project/main/v5/loadAllLocationTree.as')
}
export const selectProjectTree = params => {
  return request.POSTS('/project/main/v5/selectProjectTree.as', params)
}
export const loadProjectGroupTree = params => {
  return request.POST('/projectGroup/loadProjectGroupTree.as', params)
}
export const getStaffProjectGroupList = params => {
  return request.POSTS('/projectGroup/getStaffProjectGroupList.as', params)
}
export const addProjectGroupTreeNode = params => {
  return request.POSTS('/projectGroup/addProjectGroupTreeNode.as', params)
}

export const removeProjectGroupTreeNode = params => {
  return request.POSTS('/projectGroup/removeProjectGroupTreeNode.as', params)
}
export const saveProjectGroupTreeNode = params => {
  return request.POSTS('/projectGroup/saveProjectGroupTreeNode.as', params)
}

export const saveProjectGroupTree = params => {
  return request.POST('/projectGroup/saveProjectGroupTree.as', params)
}
export const addStaffProjectGroup = params => {
  return request.POST('/projectGroup/addStaffProjectGroup.as', params)
}

export const removeStaffProjectGroup = params => {
  return request.POSTS('/projectGroup/removeStaffProjectGroup.as', params)
}

export const loadAllProject = () => {
  return request.POST('/project/main/loadAllHoldingProject.as')
}
export const globalAlarmSound = params => {
  return request.POST('/alarmPopup/gblSoundInfo.as', params)
}
export const loadMetaData = () => {
  return request.POST('/project/main/v3/loadMetadata.as')
}
export const getClosestRealTimeByAlarmTime = params => {
  return request.POST('/project/main/v3/getClosestRealTimeByAlarmTime.as', params)
}
export const alarmTypeStats = params => {
  return request.POST('/project/main/v2/alarmOfProjectStats.as', params)
}
export const realtimeAlarm = params => {
  return request.POST('/project/main/v5/queryRealtimeAlarm.as', params)
}
export const findMaintenance = params => {
  return request.POST('/maintenance/findMaintenance.as', params)
}
export const switchHover = params => {
  return request.POST('/portal/v5/switchToProject.as', params)
}
export const energyStatistics = params => {
  return request.POST('/large/screen/v5/energyStatistics.as', params)
}
export const energyTrend = params => {
  return request.POST('/large/screen/v5/energyTrend.as', params)
}
export const workOrderStatistics = params => {
  return request.POST('/large/screen/v5/workOrderStatistics.as', params)
}
export const alarmTypeDistribution = params => {
  return request.POST('/large/screen/v5/alarmTypeDistribution.as', params)
}
export const alarmTrend = params => {
  return request.POST('/large/screen/v5/alarmTrend.as', params)
}
export const getEquipClassifyStatList = params => {
  return request.POST('/project/main/v5/getEquipClassifyStatList.as', params)
}
export const getIndexStatData = params => {
  return request.POST('/project/main/v5/getIndexStatData.as', params)
}
export const statisticalNumber = params => {
  return request.POST('/project/main/v3/statisticalNumber.as', params)
}
export const getLeftTreeView = params => {
  return request.POST('/project/main/v2/loadGroupTreeProject.as', params)
}

export const queryProjectDetails = params => {
  return request.POSTS('/project/main/v5/queryProjectDetails.as', params)
}

export const loadTree = params => {
  return request.POST('/projectGroup/loadTree.as', params)
}
export const saveProjectGroup = params => {
  return request.POST('/projectGroup/save.as', params)
}
export const delProjectGroup = params => {
  return request.POST('/projectGroup/del.as', params)
}
export const pageRsOfProject = params => {
  return request.POST('/projectGroup/pageRsOfProject.as', params)
}
export const pageProject4SelectOfGroup = params => {
  return request.POST('/projectGroup/pageProject4SelectOfGroup.as', params)
}
export const saveProjectOfGroup = params => {
  return request.POST('/projectGroup/saveProjectOfGroup.as', params)
}
export const queryPageAuth = params => {
  return request.POST('/portal/pageAuth.as', params)
}

export const queryGroupProjectNodes = params => {
  return request.POSTS('/projectGroup/queryGroupProjectNodes.as', params)
}

export const powerTrend = params => {
  return request.POST('/large/screen/v5/powerTrend.as', params)
}

export const alarmUnprocessedTrend = params => {
  return request.POSTS('/large/screen/v5/alarmUnprocessedTrend.as', params)
}

export const getCityWeather = params => {
  return request.POSTS('/common/getCityWeather.as', params)
}

export const powerTrendAggregate = params => {
  return request.POST('/large/screen/v5/powerTrend/aggregate.as', params)
}
