import request from '@/plugins/request'

// 区域层级管理
export const assetRegionalLevelList = params => request.POST('/assetRegionalLevel/childList.as', params)

// 类别管理列表
export const assetCategoryList = params => request.POST('/assetCategory/list.as', params)

// 获取资产列表 表格
export const listPageAssetManagement = params => request.POST('/assetManagement/listPage.as', params)

//  区域层级管理 新增
export const assetRegionalLevelAdd = params => request.POSTS('/assetRegionalLevel/add.as', params)

//  区域层级管理 修改
export const assetRegionalLevelUpdate = params => request.POSTS('/assetRegionalLevel/update.as', params)

//  区域层级管理 删除
export const assetRegionalLevelDelete = params => request.POST('/assetRegionalLevel/delete.as', params)

// /assetRegionalLevel/dragNode.as 区域层级管理 拖拽
export const assetRegionalLevelDragNode = params => request.POST('/assetRegionalLevel/dragNode.as', params)

// 资产类别管理 新增
export const assetCategoryAdd = params => request.POSTS('/assetCategory/add.as', params)

// 资产类别管理 修改
export const assetCategoryUpdate = params => request.POSTS('/assetCategory/update.as', params)

// 资产类别管理 删除
export const assetCategoryDelete = params => request.POST('/assetCategory/delete.as', params)

// 资产信息 添加 /assetManagement/add.as
export const assetManagementAdd = params => request.POSTS('/assetManagement/add.as', params)

// 资产信息详情查询
export const assetManagementDetail = params => request.POST('/assetManagement/detail.as', params)

// 资产信息 修改
export const assetManagementUpdate = params => request.POSTS('/assetManagement/update.as', params)

// 资产信息 删除
export const assetManagementDelete = params => request.POST('/assetManagement/delete.as', params)

// 资产信息 批量删除
export const assetManagementBatchDelete = params => request.POST('/assetManagement/batchDelete.as', params)

// 资产信息 导入
export const assetManagementImportBatch = params => request.POST('/assetManagement/importBatch.as', params)

// 获取资产编号
export const getIncId = params => request.POST('/assetManagement/getIncId.as', params)
