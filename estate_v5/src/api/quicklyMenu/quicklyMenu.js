import request from '@/plugins/request'
export const queryPageListByProjectCode = params => {
  return request.POST('/quick/menu/queryPageListByProjectCode.as', params)
}

export const saveMenu = params => {
  return request.POST('/quick/menu/saveMenu.as', params)
}

export const updateMenu = params => {
  return request.POST('/quick/menu/updateMenu.as', params)
}

export const changeStatus = params => {
  return request.POST('/quick/menu/changeStatus.as', params)
}

export const deleteMenu = params => {
  return request.POST('/quick/menu/deleteMenu.as', params)
}

export const buildMenuTree = params => {
  return request.POST('/quick/menu/buildMenuTree.as', params)
}
export const queryMenusByProjectCode = params => {
  return request.POST('/quick/menu/queryMenusByProjectCode.as', params)
}
