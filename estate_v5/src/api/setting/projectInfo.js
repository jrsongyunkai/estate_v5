import request from '@/plugins/request'

export const saveAutoPowerWriteBackConfig = params => {
  return request.POST('/project-property/saveAutoPowerWriteBackConfig.as', params)
}

export const getAutoPowerWriteBackConfig = params => {
  return request.POST('/project-property/getAutoPowerWriteBackConfig.as', params)
}

export const getPushObjectListPage = params => {
  return request.POST('/alarmPushConfig/getPushObjectListPage.as', params)
}

export const savePushObject = params => {
  return request.POST('/alarmPushConfig/savePushObject.as', params)
}

export const delPushObject = params => {
  return request.POST('/alarmPushConfig/delPushObject.as', params)
}

export const saveUserNotice = params => {
  return request.POST('/alarmPushConfig/saveUserNotice.as', params)
}

export const getUserNoticeList = params => {
  return request.POST('/alarmPushConfig/getUserNoticeList.as', params)
}

export const delUserNotice = params => {
  return request.POST('/alarmPushConfig/delUserNotice.as', params)
}

export const getAccTypeQuantity = params => {
  return request.POST('/alarmPushConfig/getAccTypeQuantity.as', params)
}

export const modifyStatus4UserNotice = params => {
  return request.POST('/alarmPushConfig/modifyStatus4UserNotice.as', params)
}

// 查询项目瞬时功率极大值参考值
export const getInstantPowerConfig = params => {
  return request.POST('/project-property/getInstantPowerConfig.as', params)
}

// 设置项目瞬时功率极大值参考值
export const saveInstantPowerConfig = params => {
  return request.POST('/project-property/saveInstantPowerConfig.as', params)
}
