import request from '@/plugins/request';

export const getCurrentRealtime = (params) => {
    return request.POST('/project/main/v2/leakageCurrentRealtime.as', params)
}
export const getCurrentStats = (params) => {
    return request.POST('/project/main/v2/leakageCurrentStats.as', params)
}
export const queryChannels = (params) => {
    return request.POST('/project/main/query/box/channels.as', params)
}
export const leakageStats = (params) => {
    return request.POST('/project/main/v2/leakageCurrentStats.as', params)
}
export const queryBoxDetails = (params) => {
    return request.POST('/box/queryBoxDetails.as', params)
}
export const modifyMacRate = (params) => {
    return request.POST('/project/main/ctl/boxes/rate.as', params)
}
