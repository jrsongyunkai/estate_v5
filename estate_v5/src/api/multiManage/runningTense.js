// 运行时态api
import request from '@/plugins/request'
export const selectBoxAbnormalList = params => {
  return request.POST('/boxAbnormal/select/list.as', params)
}
export const generateBoxAbnormalId = params => {
  return request.POST('/boxAbnormal/generate/id.as', params)
}
export const snapshotSave = params => {
  return request.JPOST('/boxAbnormal/device/snapshot/save.as', params)
}

export const snapshotList = params => {
  return request.POST('/boxAbnormal/device/snapshot/list.as', params)
}

export const deleteSnapshotDevice = params => {
  return request.POST('/boxAbnormal/device/snapshot/delete.as', params)
}

export const queryBoxAbnormalConfig = params => {
  return request.POST('/boxAbnormal/config/query.as', params)
}

export const saveBoxAbnormalConfig = params => {
  return request.JPOST('/boxAbnormal/config/save.as', params)
}

export const configHistory = params => {
  return request.POST('/boxAbnormal/configHistory.as', params)
}

export const invalidTimeList = params => {
  return request.POST('/boxAbnormal/invalidTime/list.as', params)
}

export const saveInvalidTime = params => {
  return request.POST('/boxAbnormal/invalidTime/save.as', params)
}

export const delInvalidTime = params => {
  return request.POST('/boxAbnormal/invalidTime/del.as', params)
}

export const statisticStart = params => {
  return request.POST('/boxAbnormal/statisticStart.as', params)
}

export const statisticStatus = params => {
  return request.POST('/boxAbnormal/statisticStatus.as', params)
}

export const statisticHistory = params => {
  return request.POST('/boxAbnormal/statisticHistory.as', params)
}
