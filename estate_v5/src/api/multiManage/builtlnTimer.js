import request from '@/plugins/request';
export const timeingList = (params) => {
    return request.POST('/timing/list.as', params)
}
export const delTiming = (params) => {
    return request.POST('/timing/delTiming.as', params)
}
export const findById = (params) => {
    return request.POST('/timing/findById.as', params)
}
export const remotectrl = (params) => {
    return request.POST('/app/remotectrl.as', params)
}
export const downGetTime = (params) => {
    return request.POST('/timing/downGetTime.as', params)
}
export const verifyAuthCode = (params) => {
    return request.POST('/portal/verifyAuthCode.as', params)
}
export const modifyTiming = (params) => {
    return request.POST('/timing/modifyTiming.as', params)
}
export const associateTimerPush = (params) => {
    return request.JPOST('/timing/associateTimerPush.as', params)
}
export const batchModifyTiming = (params) => {
    return request.POST('/timing/batchModifyTiming.as', params)
}
export const linkageSceneList = (params) => {
    return request.POST('/cbScene/list.as', params)
}
export const linkageSceneSave = (params) => {
    return request.POST('/cbScene/save.as', params)
}
export const linkageSceneDel = (params) => {
    return request.POST('/cbScene/del.as', params)
}

export const linkageDetail = (params) => {
    return request.POST('/cbScene/detail.as', params)
}

export const linkagedeLock = (params) => {
    return request.POST('/cbScene/lock.as', params)
}
export const queryBoxes = (params) => {
    return request.POST('/project/main/query/boxes.as', params)
}
export const queryAlarmForConfig = (params) => {
    return request.POST('/project/main/v3/queryAlarmForConfig.as', params)
}
export const getTmpTypeList = (params) => {
    return request.POST('/cbScene/getTmpTypeList.as', params)
}
