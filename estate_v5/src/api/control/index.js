import request from '@/plugins/request'
export const queryBoxDetails = params => {
  return request.POST('/box/queryBoxDetails.as', params)
}
export const checkMacOnlineStatus = params => {
  return request.POST('/project/main/v3/checkMacOnlineStatus.as', params)
}
export const macAlias = params => {
  return request.POST('/box/updateMacNameAndFloor.as', params)
}
export const refreshSim = params => {
  return request.POST('/box/refreshSim.as', params)
}
export const channelHistory = params => {
  return request.POST('/trend/channelHistory.as', params)
}
export const norChannelHistory = params => {
  return request.POST('/trend/norChannelHistory.as', params)
}
export const queryForsafeChnllHistory = params => {
  return request.POST('/forsafe/queryForsafeChnllHistory.as', params)
}
export const queryTlinkChnlHistory = params => {
  return request.POST('/tlink/queryTlinkChnlHistory.as', params)
}
export const zhlora = params => {
  return request.POST('/winextlora/queryChannelHistory.as', params)
}
export const querySmokeHistory = params => {
  return request.POST('/zac/queryZacChnlHistory.as', params)
}
export const getEffectAddr = params => {
  return request.POST('/app/compare/config/getEffectAddr.as', params)
}
export const queryRenkeChnlHistory = params => {
  return request.POST('/renke/queryRenkeChnlHistory.as', params)
}
export const queryChtqdqMeterReadingDataHistory = params => {
  return request.POST('/chtqdq/queryChtqdqMeterReadingDataHistory.as', params)
}
export const queryHuaxuChnlHistory = params => {
  return request.POST('/huaxu/queryHuaxuChnlHistory.as', params)
}
export const zhloraQueryChannelDetails = params => {
  return request.POST('/winextlora/queryChannelDetails.as', params)
}
export const queryChannelDetailsByBoxAndAddr = params => {
  return request.POST('/box/queryChannelDetailsByBoxAndAddr.as', params)
}
export const verifyAuthCode = params => {
  return request.POST('/portal/verifyAuthCode.as', params)
}
export const zhloraCmd = params => {
  return request.POST('/winextlora/down/cmd.as', params)
}
export const modifyBoxsChnlClearAlarm = params => {
  return request.POST('/boxProperties/modifyBoxsChnlClearAlarm.as', params)
}
export const modifyBoxsChnlRemoteMute = params => {
  return request.POST('/boxProperties/modifyBoxsChnlRemoteMute.as', params)
}
export const queryNorChannelByMac = params => {
  return request.POST('/norChannel/queryNorChannelByMac.as', params)
}
export const strlStatusQuery = params => {
  return request.POST('/norProperties/strlStatusQuery.as', params)
}
export const strlAlarmReset = params => {
  return request.POST('/norProperties/strlAlarmReset.as', params)
}
export const strlTripOut = params => {
  return request.POST('/norProperties/strlTripOut.as', params)
}
export const strlRefreshAttr = params => {
  return request.POST('/norProperties/strlRefreshAttr.as', params)
}
export const strlModifyThreshold = params => {
  return request.POST('/norProperties/strlModifyThreshold.as', params)
}
export const queryAlarmByBox = params => {
  return request.POST('/box/queryAlarmByBox.as', params)
}
export const findMaintenance = params => {
  return request.POST('/maintenance/findMaintenance.as', params)
}
export const alarmUrgePush = params => {
  return request.POST('/alarm/urge4Push.as', params)
}
export const listMaintenance = params => {
  return request.POST('/maintenance/listMaintenance.as', params)
}
export const queryAlarmListOfPageById = params => {
  return request.POST('/project/main/v3/queryAlarmListOfPage.as', params)
}

export const switchHover = params => {
  return request.POST('/portal/v5/switchToProject.as', params)
}
export const alarmHandling = params => {
  return request.POST('/project/main/v3/alarmHandling.as', params)
}
export const alarmHistoryStatisticalNumber = params => {
  return request.POST('/project/main/v3/alarmHistoryStatisticalNumber.as', params)
}
export const queryAlarmForConfig = params => {
  return request.POST('/project/main/v3/queryAlarmForConfig.as', params)
}
export const queryChnlAttr = params => {
  return request.POST('/box/findChnlAttrByMac.as', params)
}
export const configgetEffectAddr = params => {
  return request.POST('/app/compare/config/getEffectAddr.as', params)
}
export const updateChnlAttr = params => {
  return request.POST('/box/updateChnlAttr.as', params)
}
export const updateNodeTitle = params => {
  return request.POST('/box/updateChnlAttrTitle.as', params)
}
export const modifyBoxsChnlWiring = params => {
  return request.POST('/boxProperties/modifyBoxsChnlWiring.as', params)
}
export const saveBoxProperty = params => {
  return request.POST('/box/saveBoxProperty.as', params)
}
export const modifyBoxRemoteControl = params => {
  return request.POST('/boxProperties/modifyBoxRemoteControl.as', params)
}
export const terriblePower = params => {
  return request.POST('/boxProperties/modifyBoxsChnl/terriblePower.as', params)
}
export const zhloraQueryBoxConfig = params => {
  return request.POST('/zhlora/queryBoxConfig.as', params)
}
export const queryListData = params => {
  return request.POST('/timing/querySyncSceneToBuiltInTimingList.as', params)
}
export const queryListsync = params => {
  return request.POST('/timing/issueSyncSceneToBuiltInTimingCmd.as', params)
}
export const remotectrl = params => {
  return request.POST('/project/main/v2/batchRemotectrl.as', params)
}
export const abnormalSwitchUnlock = params => {
  return request.POST('/box-control/abnormalSwitchUnlock.as', params)
}
export const remoteSwitchLock = params => {
  return request.POST('/box-control/remoteSwitchLock.as', params)
}
export const winextloraCmd = params => {
  return request.JPOST('/project/main/v2/batchRemotectrl.as?_operate_at=1', params)
}
export const modifyMacRate = params => {
  return request.POST('/project/main/ctl/boxes/rate.as', params)
}
export const queryHistoryAlarmListOfPage = params => {
  return request.POST('/alarm/history/queryAlarmListOfPage.as', params)
}

export const alarmHistoryurge4Push = params => {
  return request.POST('/alarm/history/urge4Push.as', params)
}

export const CorrectConfig = params => {
  return request.POST('/channel/power/correct.as', params)
}

export const getCorrect = params => {
  return request.POST('/channel/power/getCorrect.as', params)
}

export const dingzhidaFlowInfo = params => {
  return request.GET('/thirdDevice/dingzhida/flow/status/query.as', params)
}
export const flowAttributeQuery = params => {
  return request.GET('/thirdDevice/dingzhida/flow/attribute/query.as', params)
}
export const flowAttributeSave = params => {
  return request.POSTS('/thirdDevice/dingzhida/flow/attribute/save.as', params)
}

export const dingzhidaFlowThrend = params => {
  return request.POSTS('/thirdDevice/dingzhida/flow/data/chart.as', params)
}

/**
 * 分合闸增加报警提示接口
 * @param {*} params
 * @returns
 */
export const isAlarmStatus = params => request.POSTS('/alarm/isAlarmStatus.as', params)

// 获取郎鑫烟雾浓度
export const runStatusTrend = params => request.POST('/thirdDevice/langxin/runStatusTrend.as', params)

//  获取海曼烟雾浓度
export const HMrunStatusTrend = params => request.POST('/thirdDevice/haiman/runStatusTrend.as', params)

// 抄表猫下发指令
export const controlSwitch = params => request.POSTS('/chaobiaomao/controlSwitch.as', params)

// 导出报警/预警列表接口
export const exportAlarmListOfPage = params => request.DOWNLOADFILE('/project/main/v3/xls/exportAlarmListOfPage.as', params)

export const statisticalOfBoxAlarmClassified = params => request.DOWNLOADFILE('/project/main/v2/xls/statisticalOfBoxAlarmClassified.as', params)

export const refreshFreezeData = params => request.POST('/chaobiaomao/refreshFreezeData.as', params)
