import request from '@/plugins/request'
export const cmdFeedBack = params => {
  return request.POST('/cmd-feedback/page.as', params)
}
export const cmdQueryHistory = params => {
  return request.POST('/cmd-feedback/queryHistory.as', params)
}
export const queryChannels = params => {
  return request.POST('/project/main/query/box/channels.as', params)
}
export const saveDeStatuscanConfDetail = params => {
  return request.POST('/deStatuscan/confDetail/save.as', params)
}

export const retryCmdFeedback = params => {
  return request.POST('/cmd-feedback/retry.as', params)
}

export const saveKeyValue = params => {
  return request.POST('/common/saveKeyValue.as', params)
}

export const getKeyValue = params => {
  return request.POST('/common/getKeyValue.as', params)
}

/**
 * 根据设备类型查询设备列表
 */
export const smartEnergyDeviceList = params => request.POSTS('/smartEnergy/generic/device/list.as', params)

/**
 * 根据设备类型查询分组结构树-全量加载
 */
export const smartEnergyDeviceGroupTree = params => request.POSTS('/smartEnergy/generic/device/groupTree.as', params)

/**
 * 设备位置结构树-全量加载
 */
export const smartEnergyLocationTree = params => request.POSTS('/smartEnergy/generic/device/locationTree.as', params)

/**
 * 获取项目下能耗设备分类
 * @param {*} params
 * @returns
 */
export const getProjectEquipmentType = params => request.GET('/smartEnergy/generic/equipmentType.as', params)
// 地址逆解析返回
export const geocodingAnalysis = params => request.POST('/common/getLocation.as', params)
