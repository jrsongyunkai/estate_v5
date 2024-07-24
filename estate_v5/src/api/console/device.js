import request from '@/plugins/request'
export const checkingSpecificRelateConfig = params => {
  return request.POST('/boxConfig/checkingSpecificRelateConfig.as', params)
}

export const deleteSpecificRelateConfig = params => {
  return request.POST('/boxConfig/deleteSpecificRelateConfig.as', params)
}

export const checkEnableLongAndLatitude = params => {
  return request.POST('/box/checkEnableLongAndLatitude.as', params)
}

export const getConfigDataThirdDevice = params => {
  return request.POST('/thirdDevice/common/getConfigData.as', params)
}

export const getRealTimeDataThirdDevice = params => {
  return request.POST('/thirdDevice/common/getRealTimeData.as', params)
}

export const downCommandThirdDevice = params => {
  return request.POST('/thirdDevice/common/downCommand.as', params)
}

export const operationLogThirdDevice = params => {
  return request.POST('/thirdDevice/common/operationLog.as', params)
}

export const cameraPTZControl = params => {
  return request.POST('/camera/PTZCtrl.as', params)
}

export const getPlatformConfData = params => request.POST('/thirdDevice/common/getPlatformConfData.as', params)

export const outputLevel = params => request.POST('/thirdDevice/wanlin/command.as', params)

export const wanLinAepCommand = params => request.POST('/thirdDevice/wanlin/aep/command.as', params)

export const instantPowerHistory = params => request.POST('/trend/instantPowerHistory.as', params)

// 修改电流参数
export const modifyCurrentParam = params => request.POST('/boxConfig/modifyCurrentParam.as', params)

// 获取郎鑫实时参数
export const LXfindRealParam = params => request.POST('/thirdDevice/langxin/findRealParam.as', params)

// 郎鑫设备下发指令
export const LXcommand = params => request.POST('/thirdDevice/langxin/commandDown.as', params)

// 获取海曼烟感实时参数 /thirdDevice/haiman/findRealParam.as
export const HMfindRealParam = params => request.POST('/thirdDevice/haiman/findRealParam.as', params)

//  海曼烟感设备下发指令
export const HMcommandDown = params => request.POST('/thirdDevice/haiman/commandDown.as', params)

//   获取三级报警阈值
export const getThreeLevelAlarmThreshold = params => request.POST('/project/main/v5/getThreeLevelAlarmThreshold.as', params)

//  保存三级报警阈值
export const setThreeLevelAlarmThreshold = params => request.POST('/project/main/v5/setThreeLevelAlarmThreshold.as', params)

// 查询摄像头预览图片
export const getCameraPicUrl = params => request.POST('/camera/getPicUrl.as', params)

// 修改设备参数
export const modifyParams = params => request.POST('/boxConfig/modifyParams.as', params)
