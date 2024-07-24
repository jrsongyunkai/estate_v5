// 分组类型和筛选 api
import request from '@/plugins/request';

export const groupingList = (params) => { // 分组类型
    return request.POST('/v5/boxGroup/listBoxGroupTypes.as', params);
}

export const tree = (params) => { // 分组树
    return request.POST('/v5/boxGroup/queryBoxGroupTree.as', params)
}
