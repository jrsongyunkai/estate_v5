// 控制任务清单 api
import request from '@/plugins/request';

export const typeList = () => { // 类型列表
    return request.POST('/project/main/v5/controlTaskTypes.as')
}

export const workList = (params) => { // 任务列表
    return request.POST('/project/main/v5/listControlTasks.as', params)
}
