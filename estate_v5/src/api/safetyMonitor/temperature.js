// 温度页面 api
import request from '@/plugins/request';

export const warnList = (params) => {
    return request.POST('/project/main/v2/temperatureRealtime.as', params);
}

export const warnStates = (params) => {
    return request.POST('/project/main/v2/rangeTemperatureStats.as', params)
}
export const tempOfRealtimeOrStatistic = (params) => {
    return request.POST('/project/main/v3/tempOfRealtimeOrStatistic.as', params)
}
