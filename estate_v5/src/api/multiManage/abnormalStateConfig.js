// 异常状态检测 api
import request from '@/plugins/request';

export const deStatuscan = (params) => { // 获取列表
    return request.POST('/deStatuscan/conf/page.as', params)
}
export const delDeStatuscanConfDetail = (params) => {
    return request.POST('/deStatuscan/confDetail/del.as', params)
}
export const delDeStatuscanConf = (params) => {
    return request.POST('/deStatuscan/conf/del.as', params)
}
export const saveDeStatuscanConf = (params) => {
    return request.POST('/deStatuscan/conf/save.as', params)
}
export const queryBoxes = (params) => {
    return request.POST('/project/main/query/boxes.as', params)
}
export const queryChannels = (params) => {
    return request.POST('/project/main/query/box/channels.as', params)
}
export const saveDeStatuscanConfDetail = (params) => {
    return request.POST('/deStatuscan/confDetail/save.as', params)
}
