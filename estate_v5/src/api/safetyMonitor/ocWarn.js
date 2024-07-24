// 异常状态 api
import request from '@/plugins/request';

export const warnList = (params) => { // 获取列表的接口
    return request.POST('/project/main/v3/projectOpeningAndClosingWarning.as', params);
}

export const warnStates = (params) => {
    return request.POST('/project/main/v2/avgVoltageStats.as', params)
}
