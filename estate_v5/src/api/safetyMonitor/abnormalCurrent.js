// 过流过载 api
import request from '@/plugins/request';

export const warnList = (params) => {
    return request.POST('/project/main/v2/alarmDetailOfProject.as', params);
}

export const loadStats = (params) => { // 负载状态
    return request.POST('/project/main/v2/loadStats.as', params)
}

export const currentStats = (params) => { // 电流状态
    return request.POST('/project/main/v2/currentStats.as', params)
}
