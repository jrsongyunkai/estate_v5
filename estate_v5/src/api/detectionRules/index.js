import request from '@/plugins/request';
export const queryBoxes = (params) => {
    return request.POST('/project/main/query/boxes.as', params)
}
