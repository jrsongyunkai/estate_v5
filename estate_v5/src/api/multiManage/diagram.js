import request from '@/plugins/request'

export const sketchList = params => {
  return request.GET('/sketch/list.as', params)
}

/**
 * 删除配电图
 * @param {id} params
 * @returns
 */
export const delSketch = params => {
  return request.POST('/sketch/del.as', params)
}

/**
 * 保存配电图
 * @param {*} params
 * @returns
 */
export const saveSketch = params => {
  return request.POSTS('/sketch/save.as', params)
}

/**
 * 上传配电图
 *  sketch/upload.as?id=1&projectCode=1001
 * @param {*} params
 * @returns
 */
export const uploadSketch = params => {
  return request.POST(`/sketch/upload.as`, params, { 'Content-Type': 'multipart/form-data' })
}

/**
 * 获取配电图基本信息
 *  sketch/upload.as?id=1&projectCode=1001
 * @param {*} params
 * @returns
 */
export const getSketchBaseInfo = params => {
  return request.GET('/sketch/find.as', params)
}

/**
 * 获取配电图分享基本信息
 *  sketch/upload.as?id=1&projectCode=1001
 * @param {*} params
 * @returns
 */
export const getSketchBaseInfoShare = params => {
  return request.GET('/sketch/findByCode.as', params)
}

/**
 * 获取设备组态数据
 * @param {*} params
 * @returns
 */
export const getChannelData = params => {
  return request.POSTS(`/sketch/getChannelData.as?projectCode=${params.projectCode}`, params)
}

/**
 * 获取配电图中的菜单信息
 * @param {*} params
 * @returns
 */
export const getSketchMenu = params => {
  return request.GET('/sketch/getMenu.as', params)
}

/**
 * 个人组件-项目
 * @param {*} params
 * @returns
 */
export const getUnitClassList = params => request.GET('/sketch/getUnitClassList.as', params)

export const saveUnitClass = params => request.POSTS(`/sketch/saveUnitClass.as`, params)

export const delUnitClass = params => request.POSTS(`/sketch/delUnitClass.as`, params)

export const addUnit = params => request.POSTS(`/sketch/addUnit.as`, params)

export const getUnitList = params => request.GET('sketch/getUnitList.as', params)

export const delUnit = params => request.POSTS(`/sketch/delUnit.as`, params)
