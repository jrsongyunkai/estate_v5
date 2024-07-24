import request from '@/plugins/request'

export const queryList = params => request.POST('/cbSceneV2/getList.as', params)

export const modifyStatus = params => request.POST('/cbSceneV2/modifyStatus.as', params)

export const deleteConfig = params => request.POST('/cbSceneV2/delete.as', params)

export const getDeviceList = params => request.POST('/cbSceneV2/pageQueryAddr.as', params)

export const getStatusConditonOptionList = params => request.POST('/cbSceneV2/getStatusConditonOptionList.as', params)

export const getNumberConditonOptionList = params => request.POST('/cbSceneV2/getNumberConditonOptionList.as', params)

export const getActionOptionList = params => request.POST('/cbSceneV2/getActionOptionList.as', params)

export const saveBaseInfo = params => request.POST('/cbSceneV2/saveBaseInfo.as', params)

export const saveConditon = params => request.POST('/cbSceneV2/saveConditon.as', params)

export const saveAction = params => request.POST('/cbSceneV2/saveAction.as', params)

export const getDetail = params => request.POST('/cbSceneV2/getDetail.as', params)

export const getExecHistory = params => request.POST('/cbSceneV2/getExecHistory.as', params)

export const getExecDetail = params => request.POST('/cbSceneV2/getExecDetail.as', params)

export const getEdgePortTypeList = params => request.POST('/cbSceneV2/getEdgePortTypeList.as', params)

export const getEdgePortValTypeList = params => request.POST('/cbSceneV2/getEdgePortValTypeList.as', params)

export const queryLinkPush = params => request.POST('/cbSceneV2/queryLinkPush.as', params)
