import request from '@/plugins/request';
export const switchHover = (params) => {
    return request.POST('/portal/v5/switchToProject.as', params)
}
export const sessionState = (params) => {
    return request.POST('/portal/sessionState.as?v=' + new Date().getTime(), params)
}
export const checkLogin = (params) => {
    return request.FETCH('/portal/gblinfo.as?callback=loginchk&time=' + new Date().getTime(), params)
}
export const lastAlarm4tip = (params) => {
    return request.POST('/project/main/v2/lastAlarm4tip.as', params)
}
export const queryOperateLog = (params) => {
    return request.POST('/operateLog/pageList.as', params)
}
export const findParamsById = (params) => {
    return request.POST('/operateLog/findParamsById.as', params)
}
export const queryFollwerByStaff = (params) => {
    return request.POST('/project/main/v3/queryFollwerByStaff.as', params)
}
