import request from '@/plugins/request'
export const timeingList = params => {
  return request.POST('/timing/list.as', params)
}

export const findById = params => {
  return request.POST('/timing/findById.as', params)
}

export const modifyTiming = params => {
  return request.POST('/timing/modifyTiming.as', params)
}
export const longitudeAndLatitude = params => {
  return request.POST('/timing/longitudeAndLatitude/get.as', params)
}

export const refreshLongitudeLatitude = params => {
  return request.POST('/timing/longitudeAndLatitude/refresh.as', params)
}

export const setLongitudeLatitude = params => {
  return request.POST('/timing/longitudeAndLatitude/set.as', params)
}
export const downGetTime = params => {
  return request.POST('/timing/downGetTime.as', params)
}
export const queryPageAuth = params => {
  return request.POST('/portal/pageAuth.as', params)
}
export const delTiming = params => {
  return request.POST('/timing/delTiming.as', params)
}

export const queryListData = params => {
  return request.POST('/timerConfig/list.as', params)
}

export const saveTimeConfig = params => {
  return request.POST('/timerConfig/config/save.as', params)
}

export const getConfigId = () => {
  return request.POST('/timerConfig/generate/id.as')
}

export const getDeviceSnapshotList = params => {
  return request.POST('/timerConfig/device/snapshot/list.as', params)
}

export const saveDeviceSnapshotList = params => {
  return request.POSTS('/timerConfig/device/snapshot/save.as', params)
}

export const deleteDeviceSnapshotList = params => {
  return request.POST('/timerConfig/device/snapshot/delete.as', params)
}

export const getConfigInfo = params => {
  return request.POST('/timerConfig/timer/detail.as', params)
}

export const batchDel = params => {
  return request.POST('/timerConfig/batchDel.as', params)
}
