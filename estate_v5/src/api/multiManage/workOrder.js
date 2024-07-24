// 新建工单 api
import request from '@/plugins/request'

export const detailInput = ({ workOrderType, id }) => {
  return request.GET(`/wo/detail/info.as?type=${workOrderType}&id=${id}`)
}

export const inquireInput = params => {
  return request.POST('/wo/page.as', params)
}

export const createinput = params => {
  return request.POST('/inspection/detail/save.as', params)
}

export const inquireDetail = params => {
  return request.POST('/wo/detail/record.as', params)
}

export const pushinput = params => {
  return request.POST('/maintenance/updateMaintenance.as', params)
}

export const saveCutomWorkOrder = params => {
  return request.POSTS('/wo/detail/save.as', params)
}

// 获取项目所有用户
export const getPrjStaffList = params => request.POST('/member/getPrjStaffList.as', params)

// 获取创建人列表
export const getCreatorInfoList = params => request.POST('/maintenanceNew/getCreatorInfoList.as', params)

// 获取维保工单列表
export const getListMaintenanceNew = params => request.POST('/maintenanceNew/getList.as', params)

//
export const handleMaintenance = params => request.POSTS('/maintenanceNew/handle.as', params)

// 工单保存
export const saveInfoMaintenanceNew = params => request.POSTS('/maintenanceNew/saveInfo.as', params)

// 工单详情
export const getDetailMaintenanceNew = params => request.POST('/maintenanceNew/getDetail.as', params)
