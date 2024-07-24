import request from '@/plugins/request'

export const getBuildings = params => {
  return request.POST('/project/main/getBuildings.as', params)
}
export const syncScene = params => {
  return request.POST('/timing/syncSceneToBuiltInTiming.as', params)
}
export const queryChannels = params => {
  return request.POST('/project/main/query/box/channels.as', params)
}
export const queryScenes = params => {
  return request.POST('/project/main/query/scenes.as', params)
}
export const scenesLock = params => {
  return request.POST('/project/main/scene/lock.as', params)
}
export const scenesUpdate = params => {
  return request.POST('/project/main/scene/add.as', params)
}
export const scenesDel = params => {
  return request.POST('/project/main/scene/del.as', params)
}
export const scenesCtlOc = params => {
  return request.POST('/project/main/scene/oc.as', params)
}
export const remoteCtrl = params => {
  return request.POST('/scene/remoteCtrl.as', params)
}
export const addrMod = params => {
  return request.POST('/project/main/scene/addr/mod.as', params)
}

export const timerMod = params => {
  return request.POST('/project/main/scene/timer/mod.as', params)
}

export const sceneInfo = params => {
  return request.POST('/project/main/scene/info.as', params)
}
export const queryChnlAttr = params => {
  return request.POST('/box/findChnlAttrByMac.as', params)
}

export const macAlias = params => {
  return request.POST('/box/updateMacNameAndFloor.as', params)
}
export const updateNodeTitle = params => {
  return request.POST('/box/updateChnlAttrTitle.as', params)
}

export const updateChnlAttr = params => {
  return request.POST('/box/updateChnlAttr.as', params)
}
export const modActionType = params => {
  return request.POST('/project/main/scene/addr/modActionType.as', params)
}

export const checkRemoteCtrlAlm = params => {
  return request.POST('/scene/checkRemoteCtrlAlm.as', params)
}
