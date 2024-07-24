// 过欠压 api
import request from '@/plugins/request';

export const warnList = (params) => {
    return request.POST('/project/main/v2/alarmDetailOfProject.as', params);
}

export const warnStates = (params) => {
    return request.POST('/project/main/v2/avgVoltageStats.as', params)
}
