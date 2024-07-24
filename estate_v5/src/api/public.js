import request from '@/plugins/request'

export const getGroupType = params => {
  return request.POST('/v5/boxGroup/listBoxGroupTypes.as', params)
}
export const getGroupTree = params => {
  return request.POST('/v5/boxGroup/queryBoxGroupTree.as', params)
}
export const queryBoxes = params => {
  return request.POST('/project/main/query/boxes.as', params)
}
export const getBuildings = params => {
  return request.POST('/project/main/getBuildings.as', params)
}
export const queryAssociatedUsers = params => {
  return request.POST('/project/main/v3/queryAssociatedUsers.as', params)
}
export const saveFollowerForAssign = params => {
  return request.POST('/project/main/v3/saveFollowerForAssign.as', params)
}
export const findStaffInfo = params => {
  return request.POST('/project/main/v3/findStaffInfo.as', params)
}
export const updateStaffInfo = params => {
  return request.POST('/project/main/v3/updateStaffInfo.as', params)
}
export const listProjectForConfig = params => {
  return request.POST('/alarmPushConfig/listProjectForSelect.as', params)
}
export const preferences = params => {
  return request.POST('/prjAlarmConfig/v5/preferences.as', params)
}
export const prjAlarmConfigSave = params => {
  return request.JPOST('/prjAlarmConfig/v5/save.as', params)
}
export const prjAlarmConfigDel = params => {
  return request.POST('/prjAlarmConfig/v5/del.as', params)
}
export const queryAlarmForConfig = params => {
  return request.POST('/project/main/v3/queryAlarmForConfig.as', params)
}
export const queryPoPup = params => {
  return request.POST('/alarmPopup/queryAlarmPoPupConfig.as', params)
}
export const updatePoPup = params => {
  return request.POST('/alarmPopup/updateAlarmPoPupConfig.as', params)
}
export const delAlarmSound = params => {
  return request.POST('/alarmPopup/soundFileDel.as', params)
}
export const saveAlarmSound = params => {
  return request.JPOST('/alarmPopup/v5/soundSave.as', params)
}
export const queryAlarmSound = params => {
  return request.POST('/alarmPopup/v5/soundList.as', params)
}
export const soundDel = params => {
  return request.POST('/alarmPopup/v5/soundDel.as', params)
}
export const getPayQuotaConfig = params => {
  return request.POST('/app/wxPay/getPayQuotaConfig.as', params)
}
export const saveAlarmPushConfigInfo = params => {
  return request.POST('/alarmPushConfig/saveAlarmPushConfigInfo.as', params)
}
export const SMSPush = params => {
  return request.POST('/alarmPushConfig/getAlarmPushConfigInfoOfStaff.as', params)
}
export const delAlarmPushConfig = params => {
  return request.POST('/alarmPushConfig/del.as', params)
}
export const modifyMacRate = params => {
  return request.POST('/project/main/ctl/boxes/rate.as', params)
}
export const queryStaffByAccount = params => {
  return request.POST('/project/main/v3/queryStaffByAccount.as', params)
}
export const saveStaffProperty = params => {
  return request.POST('/project/main/v3/updateStaff4CustomMap.as', params)
}
export const findStaffProperty = params => {
  return request.POST('/project/main/v3/findCustomMapOfEnable.as', params)
}
export const queryProject4Select = params => {
  return request.POST('/customMap/queryProject4Select.as', params)
}
export const queryMapInfo = params => {
  return request.POST('/customMap/queryMapInfo.as', params)
}
export const delMapDetail = params => {
  return request.POST('/customMap/delMapDetail.as', params)
}
export const saveMapDetail = params => {
  return request.POST('/customMap/saveMapDetail.as', params)
}
export const last2xLoadStats = params => {
  return request.POST('/project/main/v2/last2xLoadStats.as', params)
}
export const powerConsumptionTrend = params => {
  return request.POST('/energy/manage/v5/powerTrend.as', params)
}
export const getUserMessageListElecDetail = params => {
  return request.POST('/energy/manage/v5/powerData.as', params)
}
export const chgPwd = params => {
  return request.POST('/portal/chgpwd.as', params)
}
export const queryPower = params => {
  return request.POST('/project/main/query/project/mainline/power.as', params)
}
export const chnlPowerStatsOfBox = params => {
  return request.POST('/project/main/v2/chnlPowerStatsOfBox.as', params)
}
export const queryTimeRangePowerOfProject = params => {
  return request.POST('/project/main/v3/queryTimeRangePowerOfProject.as', params)
}
export const statsPowerByTimeRange = params => {
  return request.POST('/project/main/v3/statsPowerByTimeRange.as', params)
}
export const last2yPowerStats = params => {
  return request.POST('/project/main/v2/last2yPowerStats.as', params)
}
export const queryGroup = params => {
  return request.POST('/stats-group/page.as', params)
}
export const chnlDetails = params => {
  return request.POST('/stats-group/queryChnlDetails.as', params)
}
export const delDetail = params => {
  return request.POST('/stats-group/delDetail.as', params)
}
export const addrEditGroup = params => {
  return request.POST('/stats-group/save.as', params)
}
export const delGroup = params => {
  return request.POST('/stats-group/del.as', params)
}
export const queryChannels = params => {
  return request.POST('/project/main/query/box/channels.as', params)
}
export const inspectionDetailQuery = params => {
  return request.POST('/inspection/detail/query.as', params)
}
export const inspectionDetailSave = params => {
  return request.POST('/inspection/detail/save.as', params)
}
export const remotectrl = params => {
  return request.POST('/app/remotectrl.as', params)
}
export const seekAreaListTreeByProject = params => {
  return request.GET('/energy/seekAreaListTreeByProject.as', params)
}
export const addAreaBoxMapping = params => {
  return request.POST('/energy/addAreaBoxMapping.as', params)
}
export const seekAreaBoxMapping = params => {
  return request.FETCH('/energy/seekAreaBoxMapping.as', params)
}
export const delAreaBoxMapping = params => {
  return request.POST('/energy/delAreaBoxMapping.as', params)
}
export const disableSelection = params => {
  return request.POST('/boxConfig/channel/disableSelection.as', params)
}
export const updateNodeTitle = params => {
  return request.POST('/box/updateChnlAttrTitle.as', params)
}
export const abnormalSwitchUnlock = params => {
  return request.POST('/box-control/abnormalSwitchUnlock.as', params)
}
export const getChannelCategory = params => {
  return request.FETCH('/energy/getChannelCategory.as', params)
}
export const addChannelCategory = params => {
  return request.POST2('/energy/addChannelCategory.as', params)
}
export const payQrCode = params => {
  return request.POST('/app/wxPay/getPayQrCode.as', params)
}
export const payStatus = params => {
  return request.POST('/app/wxPay/getTradeNoPayStatu.as', params)
}
export const confirmPayStatus = params => {
  return request.POST('/app/wxPay/confirmPayStatu.as', params)
}
export const getEffectAddr = params => {
  return request.POST('/app/compare/config/getEffectAddr.as', params)
}
export const saveServerPoint = params => {
  return request.POST('/project/saveServerPoint.as', params)
}
export const findProject = params => {
  return request.POST('/project/findProject.as', params)
}
export const getGblinfo = params => {
  return request.FETCH('/portal/gblinfo.as?v=' + new Date().getTime(), params)
}
export const queryAlarms4Custom = params => {
  return request.POST('/project-property/queryAlarms4Custom.as', params)
}
export const resetCustomAlarm = params => {
  return request.POST('/project-property/resetCustomAlarm.as', params)
}
export const saveCustomAlarms = params => {
  return request.POST('/project-property/saveCustomAlarms.as', params)
}
export const queryProjectMacDetails = params => {
  return request.POST('/project/main/v3/queryProjectMacDetails.as', params)
}
export const switchHover = params => {
  return request.POST('/portal/v5/switchToProject.as', params)
}
export const queryMacOcState = params => {
  return request.POST('/project/main/v2/queryMacOcState.as', params)
}
export const batchRemotectrl = params => {
  return request.POST('/project/main/v2/batchRemotectrl.as', params)
}
export const queryProjectMacAddrDetails = params => {
  return request.POST('/project/main/v2/queryProjectMacAddrDetails.as', params)
}
export const updateAlarmSound = params => {
  return request.JPOST('/alarmPopup/soundFileUpload.as', params)
}
export const pageInfoById = params => {
  return request.POST('/message/pageInfoById.as', params)
}
export const updateReadStatus = params => {
  return request.POST('/message/updateReadStatus.as', params)
}
export const delNewsStatus = params => {
  return request.POST('/message/del.as', params)
}
export const modifyBoxsChnlTripEnable = params => {
  return request.POST('/boxProperties/modifyBoxsChnlTripEnable.as', params)
}
export const modifyBoxsChnlAlarmEbable = params => {
  return request.POST('/boxProperties/modifyBoxsChnlAlarmEbable.as', params)
}
export const queryTlinkChannelByMac = params => {
  return request.POST('/tlink/queryTlinkChannelByMac.as', params)
}
export const macAlias = params => {
  return request.POST('/box/updateMacNameAndFloor.as', params)
}
export const tlinkDeviceCommand = params => {
  return request.POST('/norProperties/tlinkDeviceCommand.as', params)
}
export const queryTlinkConfig = params => {
  return request.POST('/tlink/queryTlinkConfig.as', params)
}
export const queryForsafeChannelByMac = params => {
  return request.POST('/forsafe/queryForsafeChannelByMac.as', params)
}
export const forsafeDeviceCommand = params => {
  return request.POST('/norProperties/forsafeDeviceCommand.as', params)
}
export const queryForsafeMsgTypeConfig = params => {
  return request.POST('/forsafe/queryForsafeMsgTypeConfig.as', params)
}
export const queryTlinkChnlHistory = params => {
  return request.POST('/tlink/queryTlinkChnlHistory.as', params)
}
export const querySmokeHistory = params => {
  return request.POST('/zac/queryZacChnlHistory.as', params)
}
export const queryRenkeChnlHistory = params => {
  return request.POST('/renke/queryRenkeChnlHistory.as', params)
}
export const winextlora = params => {
  return request.POST('/winextlora/queryChannelHistory.as', params)
}
export const queryChtqdqMeterReadingDataHistory = params => {
  return request.POST('/chtqdq/queryChtqdqMeterReadingDataHistory.as', params)
}
export const queryZacChannelMac = params => {
  return request.POST('/zac/findZacChannelByMac.as', params)
}
export const findByMacAndNode = params => {
  return request.POST('/renke/findByMacAndNode.as', params)
}
export const queryParamByMac = params => {
  return request.POST('/renke/queryParamByMac.as', params)
}
export const updateParam = params => {
  return request.POST('/renke/updateParam.as', params)
}
export const refreshParam = params => {
  return request.POST('/renke/refreshParam.as', params)
}
export const updateAlarmEnable = params => {
  return request.POST('/renke/updateAlarmEnable.as', params)
}
export const queryChtqdqMeterReadingData = params => {
  return request.POST('/chtqdq/queryChtqdqMeterReadingData.as', params)
}
export const eleRead = params => {
  return request.POST('/chtqdq/eleRead.as', params)
}
export const workOrderStatistics = params => {
  return request.POST('/large/screen/v5/workOrderStatistics.as', params)
}
export const findHuaxuChannelByMac = params => {
  return request.POST('/huaxu/findHuaxuChannelByMac.as', params)
}
export const valveControl = params => {
  return request.POST('/huaxu/valveControl.as', params)
}
export const queryPageAuth = params => {
  return request.POST('/portal/pageAuth.as', params)
}
export const findLastChannelByMac = params => {
  return request.POST('/chaobiaomao/findLastChannelByMac.as', params)
}
export const queryChaobiaomaoChannel = params => {
  return request.POST('/chaobiaomao/queryChaobiaomaoChannel.as', params)
}
export const pageBoxsSelect = params => {
  return request.POST('/stats-group/pageBoxs4Select.as', params)
}
export const queryChnlSelect = params => {
  return request.POST('/stats-group/queryChnl4Select.as', params)
}
export const saveDetail = params => {
  return request.POST('/stats-group/saveDetail.as', params)
}
export const queryTable = params => {
  return request.POST('/project/main/v5/queryEquipmentPowerSort.as', params)
}
export const infoDetail = params => {
  return request.GET('/wo/detail/info.as', params)
}
export const changeStatus = params => {
  return request.JPOST('/project/main/v2/batchRemotectrl.as?_operate_at=1', params)
}
export const changeStatus2 = params => {
  return request.JPOST('/project/main/v2/batchRemotectrl.as?_operate_at=2', params)
}
export const powerReport = params => {
  return request.POST('/energy/manage/v5/new/powerReport.as', params)
}
export const findPowerConfigure = params => {
  return request.POST('/energy/manage/v5/findPowerConfigure.as', params)
}
export const powerConfigure = params => {
  return request.JPOST('/energy/manage/v5/powerConfigure.as', params)
}

export const updateProjectInfo = params => {
  return request.POST('/project/main/v3/updateProjectInfo.as', params)
}
export const periodPowerReport = params => {
  return request.POST('/energy/manage/v5/new/periodPowerReport.as', params)
}
export const periodPowerTrend = params => {
  return request.POST('/energy/manage/v5/periodPowerTrend.as', params)
}
export const queryTypeList = params => {
  return request.POST('/load/queryTypeList.as', params)
}
export const checkKeyLoadExist = params => {
  return request.POST('/load/checkKeyLoadExist.as', params)
}
export const saveLoad = params => {
  return request.POST('/load/saveLoad.as', params)
}
export const queryDetail = params => {
  return request.POST('/load/queryDetail.as', params)
}
export const loadDelete = params => {
  return request.POST('/load/delete.as', params)
}
export const queryList = params => {
  return request.POST('/load/queryList.as', params)
}
export const saveBoxGroup = params => {
  return request.POST('/v5/boxGroup/saveBoxGroup.as', params)
}
export const listBoxGroups = params => {
  return request.POST('/v5/boxGroup/listBoxGroups.as', params)
}
export const delBoxGroup = params => {
  return request.POST('/v5/boxGroup/delBoxGroup.as', params)
}
export const queryBoxGroupTreeDetail = params => {
  return request.POST('/v5/boxGroup/queryBoxGroupTreeDetail.as', params)
}
export const saveBoxGroupNode = params => {
  return request.POST('/v5/boxGroup/saveBoxGroupNode.as', params)
}
export const delBoxGroupNode = params => {
  return request.POST('/v5/boxGroup/delBoxGroupNode.as', params)
}
export const queryBoxGroupAttributes = params => {
  return request.POST('/v5/boxGroup/queryBoxGroupAttributes.as', params)
}
export const saveBoxGroupAttributes = params => {
  return request.JPOST('/v5/boxGroup/saveBoxGroupAttributes.as', params)
}
export const getQueryBoxes = params => {
  return request.POST('/project/main/v5/query/boxes.as', params)
}
export const deviceSelect = params => {
  return request.POST('/thresholdConfig/deviceSelect.as', params)
}
export const listBoxGroupDevices = params => {
  return request.POST('/v5/boxGroup/listBoxGroupDevices.as', params)
}
export const saveBoxGroupDevices = params => {
  return request.JPOST('/v5/boxGroup/saveBoxGroupDevices.as', params)
}
export const listBoxGroupLoads = params => {
  return request.POST('/v5/boxGroup/listBoxGroupLoads.as', params)
}
export const saveBoxGroupLoads = params => {
  return request.JPOST('/v5/boxGroup/saveBoxGroupLoads.as', params)
}
export const querySafePageShowMenus = params => {
  return request.POST('/member/querySafePageShowMenus.as', params)
}
export const saveSafePageShowMenus = params => {
  return request.POST('/member/saveSafePageShowMenus.as', params)
}
export const trand = params => {
  return request.POST('/load/trand.as', params)
}
export const loadBoxMap = params => {
  return request.POST('/project/homePage/v5/loadBoxCoordinate4Map.as', params)
}
export const findBoxByMac = params => {
  return request.POST('/box/findBoxByMac.as', params)
}
export const userPrjPowerStats = params => {
  return request.POST('/project/main/v5/userPrjPowerStats.as', params)
}
export const getConfigByLoginUser = params => {
  return request.POST('/individual/getConfigByLoginUser.as', params)
}
export const saveConfig = params => {
  return request.POST('/individual/saveConfig.as', params)
}
export const queryDateConfig = params => {
  return request.POST('/member/queryDateConfig.as', params)
}
export const saveDateConfig = params => {
  return request.POST('/member/saveDateConfig.as', params)
}
export const thresholdList = params => {
  return request.POST('/thresholdConfig/list.as', params)
}
export const thresholdStatus = params => {
  return request.POST('/thresholdConfig/status.as', params)
}
export const thresholdDel = params => {
  return request.POST('/thresholdConfig/del.as', params)
}
export const thresholdBaseInfoSave = params => {
  return request.POST('/thresholdConfig/baseInfoSave.as', params)
}
export const thresholdGetBaseInfo = params => {
  return request.POST('/thresholdConfig/getBaseInfo.as', params)
}
export const thresholdDeviceList = params => {
  return request.POST('/thresholdConfig/deviceList.as', params)
}
export const thresholdDeviceAdd = params => {
  return request.POST('/thresholdConfig/deviceAdd.as', params)
}
export const thresholdCycleSave = params => {
  return request.POST('/thresholdConfig/cycleSave.as', params)
}
export const deviceAddrUpdate = params => {
  return request.POST('/thresholdConfig/deviceAddrUpdate.as', params)
}
export const deviceAddrDel = params => {
  return request.POST('/thresholdConfig/deviceAddrDel.as', params)
}
export const thresholdSave = params => {
  return request.POST('/thresholdConfig/save.as', params)
}
export const thresholdCancel = params => {
  return request.POST('/thresholdConfig/cancel.as', params)
}
export const thresholdTypeList4Simple = params => {
  return request.POST('/thresholdConfig/thresholdTypeList4Simple.as', params)
}
export const threTypleList = params => {
  return request.POST('/thresholdConfig/threTypleList.as', params)
}
export const threTypleListSave = params => {
  return request.POST('/thresholdConfig/thresholdSave.as', params)
}
export const thresholdTypeList4Time = params => {
  return request.POST('/thresholdConfig/thresholdTypeList4Time.as', params)
}
export const thresholdEditList = params => {
  return request.POST('/thresholdConfig/thresholdList.as', params)
}
export const getMacAddrConflictList = params => {
  return request.POST('/thresholdConfig/getMacAddrConflictList.as', params)
}
export const handleThresholdDel = params => {
  return request.POST('/thresholdConfig/thresholdDel.as', params)
}
export const alarmPageCustom = params => {
  return request.POST('/prj/alarm/custom/page.as', params)
}

export const saveCustomAlarm = params => {
  return request.POST('/prj/alarm/custom/save.as', params)
}
export const changeStatusCustom = params => {
  return request.POST('/prj/alarm/custom/changeStatus.as', params)
}

export const delCustomAlarm = params => {
  return request.POST('/prj/alarm/custom/del.as', params)
}
export const pageQueryAddr = params => {
  return request.POST('/common/pageQueryAddr.as', params)
}
export const queryParams = params => {
  return request.POST('/project/main/v5/queryParams.as', params)
}
export const saveDefaultThresholdConfig = params => {
  return request.POST('/project/main/v5/saveThresholdConfigSnapshot.as', params)
}
export const getDefaultThreshold = params => {
  return request.POST('/thresholdConfig/getDefaultThreshold.as', params)
}
export const timeThresholdConflictMsgPush = params => {
  return request.POST('/thresholdConfig/timeThresholdConflictMsgPush.as', params)
}
export const getEquipmentClassifyTab = params => {
  return request.POST('/project-property/getEquipmentClassifyTab.as', params)
}
export const saveEquipmentClassifyTab = params => {
  return request.POST('/project-property/saveEquipmentClassifyTab.as', params)
}
export const sceneQueryTimer = params => {
  return request.POST('/scene/queryTimer.as', params)
}
export const scenePageQueryAddr = params => {
  return request.POST('/scene/pageQueryAddr.as', params)
}
export const sceneyAddrmod = params => {
  return request.POST('/scene/addrs/mod.as', params)
}
export const pageQueryAddrCommon = params => {
  return request.POST('/common/pageQueryAddr.as', params)
}
export const getChannelInOutConfig = params => {
  return request.POST('/box/getChannelInOutConfig.as', params)
}
export const setChannelInOutConfig = params => {
  return request.JPOST('/box/setChannelInOutConfig.as', params)
}
export const loadAllProject = params => {
  return request.POST('/project/main/loadAllHoldingProject.as', params)
}
export const batchFloorRemotectrl = params => {
  return request.JPOST('/box-control/batchFloorRemotectrl.as', params)
}
export const getConfigInfo = params => {
  return request.POST('/boxCustomMap/getConfigInfo.as', params)
}
export const getMapData = params => {
  return request.POST('/boxCustomMap/getMapData.as', params)
}
export const pageQueryDevice = params => {
  return request.POST('/boxCustomMap/getBoxList.as', params)
}
export const setMapData = params => {
  return request.POST('/boxCustomMap/setMapData.as', params)
}
export const delMapData = params => {
  return request.POST('/boxCustomMap/delMapData.as', params)
}
export const simPageList = params => {
  return request.POST('/sim/page.as', params)
}
export const automaticRemindConfigure = params => {
  return request.POST('/sim/automaticRemindConfigure.as', params)
}
export const findAutomaticRemindConfigure = params => {
  return request.POST('/sim/findAutomaticRemindConfigure.as', params)
}
export const saveThresholdConfigTimeRange = params => {
  return request.POST('/project/main/v5/saveThresholdConfigTimeRange.as', params)
}
export const savePowerFeeThresholdAttributes = params => {
  return request.POST('/v5/boxGroup/savePowerFeeThresholdAttributes.as', params)
}
export const queryPowerFeeThresholdAttributes = params => {
  return request.POST('/v5/boxGroup/queryPowerFeeThresholdAttributes.as', params)
}
export const powerStatByGroup = params => {
  return request.POST('/energy/manage/v5/powerStatByGroup.as', params)
}
export const pauseTip = params => {
  return request.POST('/msg/remind/pauseTip.as', params)
}
export const triggerAction = params => {
  return request.POST('/msg/remind/triggerAction.as', params)
}
export const queryChannelsCamera = params => {
  return request.POST('/camera/queryChannels.as', params)
}
export const getPlayUrlCamera = params => {
  return request.POST('/camera/getPlayUrl.as', params)
}
export const mosaicPlayCamera = params => {
  return request.JPOST('/camera/mosaicPlay.as', params)
}
export const setStatus = params => {
  return request.POST('/boxCustomMap/setStatus.as', params)
}
export const checkSupportTimeCloseLock = params => {
  return request.POST('/timing/checkSupportTimeCloseLock.as', params)
}
export const openRemoteLock = params => {
  return request.POST('/timing/openRemoteLock.as', params)
}
export const neverRemind = params => {
  return request.POST('/sim/neverRemind.as', params)
}
export const searchCapacity = params => {
  return request.JPOST('/camera/searchCapacity.as', params)
}
export const stopPtzControl = params => {
  return request.POST('/camera/stopPtzControl.as', params)
}
export const startPtzControl = params => {
  return request.POST('/camera/startPtzControl.as', params)
}
export const keepAliveas = params => {
  return request.POST('/pages/keep-alive.as', params)
}
export const digitalOutRemotectrl = params => {
  return request.POST('/box-control/digitalOutRemoteCtrl.as', params)
}

export const sceneDetailPage = params => {
  return request.POST('/scene/detail/page.as', params)
}
export const sceneDetailDel = params => {
  return request.POST('/scene/detail/del.as', params)
}
export const sceneDetailQuerys = params => {
  return request.POST('/scene/detail/query.as', params)
}

export const sceneDetailSaves = params => {
  return request.JPOST('/scene/detail/save.as', params)
}

export const sceneDetailConfigDel = params => {
  return request.JPOST('/scene/detail/config/del.as', params)
}

export const macAndAddrs = params => {
  return request.POST('/scene/query/macAndAddrs.as', params)
}
export const LineConfig = params => {
  return request.POST('/project-property/getMainLineConfig.as', params)
}
export const mainLineConfig = params => {
  return request.POST('/project-property/mainLineConfig.as', params)
}

export const saveSnapshot = params => {
  return request.POST('/scene/snapshot/save.as', params)
}

export const rollbackSnapshot = params => {
  return request.POST('/scene/snapshot/rollback.as', params)
}
export const getDigitalInfo = params => {
  return request.POST('/project/main/v5/getDigitalInfo.as', params)
}
export const checkMenuEnable = params => {
  return request.JPOST('/project/main/v5/checkMenuEnable.as', params)
}

export const cameraQueryAlarmType = params => {
  return request.POST('/camera/queryAlarmType.as', params)
}

export const sceneGroupList = params => {
  return request.POST('/project/main/scene/groupList.as', params)
}

export const statusBatchModify = params => {
  return request.POST('/project/main/scene/status/batchModify.as', params)
}

export const timerConfigBatchModify = params => {
  return request.POST('/timerConfig/batchModify.as', params)
}

export const timerConfigList = params => {
  return request.POST('/timerConfig/list.as', params)
}

export const timerConfigAllList = params => {
  return request.POST('/timerConfig/all/list.as', params)
}

export const createTimerConfigCnapshot = params => {
  return request.POST('/timerConfig/snapshot/create.as', params)
}

export const rollbackTimerConfig = params => {
  return request.POST('/timerConfig/snapshot/rollback.as', params)
}

export const execTimerConfig = params => {
  return request.POST('/timerConfig/exec.as', params)
}

export const batchDelTimerConfig = params => {
  return request.POST('/timerConfig/batchDel.as', params)
}

export const saveTimerConfig = params => {
  return request.POST('/timerConfig/save.as', params)
}
export const deviceTimerConfigList = params => {
  return request.POST('/timerConfig/device/list.as', params)
}

export const queryTimerConfigDevice = params => {
  return request.POST('/timerConfig/device/query.as', params)
}

export const delTimerConfigDevice = params => {
  return request.POST('/timerConfig/device/del.as', params)
}

export const detailTimerConfigDevice = params => {
  return request.POST('/timerConfig/device/detail.as', params)
}

export const modifyTimerConfigDevice = params => {
  return request.POST('/timerConfig/device/modify.as', params)
}

export const addTimerConfigDevice = params => {
  return request.POST('/timerConfig/device/add.as', params)
}

export const detailTimerConfigTimer = params => {
  return request.POST('/timerConfig/timer/detail.as', params)
}

export const saveTimerConfigTimer = params => {
  return request.POST('/timerConfig/timer/save.as', params)
}

export const floorDetail = params => {
  return request.POST('/topology/floorDetail.as', params)
}
export const boxOrAddrDetail4Alarm = params => {
  return request.POST('/topology/boxOrAddrDetail4Alarm.as', params)
}
export const boxOrAddrDetail4Power = params => {
  return request.POST('/topology/boxOrAddrDetail4Power.as', params)
}
export const ct808PortDetail = params => {
  return request.POST('/topology/ct808PortDetail.as', params)
}
export const updateFloor = params => {
  return request.POST('/topology/updateFloor.as', params)
}

export const modifyStatusTimerConfig = params => {
  return request.POST('/timerConfig/modifyStatus.as', params)
}
export const feedbacksubmit = params => {
  return request.POST('/user_feedback/submit.as', params)
}
export const felist = params => {
  return request.POST('/platform_feature/fe/list.as', params)
}
export const findContent = params => {
  return request.POST('/platform_feature/fe/findContent.as', params)
}
export const doRate = params => {
  return request.POST('/platform_feature/fe/doRate.as', params)
}
export const getRate = params => {
  return request.POST('/platform_feature/fe/getRate.as', params)
}
export const mainLineModeConfig = params => {
  return request.JPOST('/project-property/mainLineModeConfig.as', params)
}
export const getMainLineMode = params => {
  return request.POST('/project-property/getMainLineMode.as', params)
}
export const queryChannel4MainLine = params => {
  return request.POST('/project-property/queryChannel4MainLine.as', params)
}
export const elecTopology4BoxTree = params => {
  return request.POST('/topology/elecTopology4BoxTree.as', params)
}
export const elecTopology4ChnlTree = params => {
  return request.POST('/topology/elecTopology4ChnlTree.as', params)
}
export const updateFloorProperty = params => {
  return request.POST('/topology/updateFloorProperty.as', params)
}
export const chnlParentNodeConfig = params => {
  return request.POST('/project/main/v5/chnlParentNodeConfig.as', params)
}
export const queryPrjFloor = params => {
  return request.POST('/project/main/v5/queryPrjFloor.as', params)
}
export const delPrjFloor = params => {
  return request.POST('/project/main/v5/delPrjFloor.as', params)
}
export const forTip = params => {
  return request.POST('/deStatuscan/result/forTip.as', params)
}

export const queryChtqdqMeterReadingDataStastic = params => {
  return request.POST('/chtqdq/queryChtqdqMeterReadingDataStastic.as', params)
}
export const effectiveCheck = params => {
  return request.POST('/questionnaire/effectiveSubject/check.as', params)
}
export const effectiveGet = params => {
  return request.POST('/questionnaire/subject/get.as', params)
}
export const effectiveSubmit = params => {
  return request.POST('/questionnaire/subject/userAnswer/submit.as', params)
}
export const tenselist = params => {
  return request.POST('/boxAbnormal/list.as', params)
}
export const tensebaseInfoSave = params => {
  return request.POST('/boxAbnormal/baseInfo/save.as', params)
}
export const tenseDeviceQuery = params => {
  return request.POST('/boxAbnormal/device/query.as', params)
}
export const tenseDeviceAdd = params => {
  return request.POST('/boxAbnormal/device/add.as', params)
}
export const tenseModifyStatus = params => {
  return request.POST('/boxAbnormal/baseInfo/modifyStatus.as', params)
}
export const tenseDeviceList = params => {
  return request.POST('/boxAbnormal/device/list.as', params)
}
export const tenseDeviceDel = params => {
  return request.POST('/boxAbnormal/device/del.as', params)
}
export const tenseDeviceAlarmList = params => {
  return request.POST('/boxAbnormal/alarm/list.as', params)
}
export const tenseDeviceDetail = params => {
  return request.POST('/boxAbnormal/baseInfo/detail.as', params)
}
export const tenseinfosave = params => {
  return request.POST('/boxAbnormal/save.as', params)
}
export const tenseListdel = params => {
  return request.POST('/boxAbnormal/del.as', params)
}
export const tenseTimesave = params => {
  return request.POST('/boxAbnormal/time/save.as', params)
}
export const tenseTimelist = params => {
  return request.POST('/boxAbnormal/time/list.as', params)
}
export const tenseTimedel = params => {
  return request.POST('/boxAbnormal/time/del.as', params)
}
export const tensecycleSave = params => {
  return request.POST('/boxAbnormal/cycle/save.as', params)
}
export const tensesnapshotcreate = params => {
  return request.POST('/boxAbnormal/snapshot/create.as', params)
}
export const configAndOperate = params => {
  return request.POST('/thirdDevice/airConditioner/configAndOperate.as', params)
}

export const getCmdStudyStatus = params => {
  return request.POST('/thirdDevice/airConditioner/getCmdStudyStatus.as', params)
}

export const findParamConfigure = params => {
  return request.POST('/thirdDevice/airConditioner/findParamConfigure.as', params)
}

export const queryCmdLearn = params => {
  return request.POST('/thirdDevice/airConditioner/queryCmdLearn.as', params)
}

export const findAlarmEnable = params => {
  return request.POST('/thirdDevice/airConditioner/findAlarmEnable.as', params)
}

export const findAutoRunConfigure = params => {
  return request.POST('/thirdDevice/airConditioner/findAutoRunConfigure.as', params)
}
export const findRealParam = params => {
  return request.POST('/thirdDevice/airConditioner/findRealParam.as', params)
}
export const runEnvironTrend = params => {
  return request.POST('/thirdDevice/airConditioner/runEnvironTrend.as', params)
}
export const runStatusTrend = params => {
  return request.POST('/thirdDevice/airConditioner/runStatusTrend.as', params)
}

export const elecNursekeeperList = params => {
  return request.POST('/elecNurse/keeperList.as', params)
}

export const keeperSaveelecNurse = params => {
  return request.POST('/elecNurse/keeperSave.as', params)
}

export const keeperDelelEcNurse = params => {
  return request.POST('/elecNurse/keeperDel.as', params)
}

export const getAreaInfoList = params => {
  return request.POST('/portal/getAreaInfoList.as', params)
}

export const channelListElecNurse = params => {
  return request.POST('/elecNurse/channelList.as', params)
}

export const channelSelectelecNurse = params => {
  return request.POST('/elecNurse/channelSelect.as', params)
}

export const channelDelelecNurse = params => {
  return request.POST('/elecNurse/channelDel.as', params)
}

export const personInfoEcNurse = params => {
  return request.POST('/elecNurse/personInfo.as', params)
}

export const personListEcNurse = params => {
  return request.POST('/elecNurse/personList.as', params)
}

export const personRelateEcNurse = params => {
  return request.POST('/elecNurse/personRelate.as', params)
}

export const personSaveEcNurse = params => {
  return request.POST('/elecNurse/personSave.as', params)
}

export const channelAddEcNurse = params => {
  return request.POST('/elecNurse/channelAdd.as', params)
}

export const paramInfoEcNurse = params => {
  return request.POST('/elecNurse/paramInfo.as', params)
}

export const paramConfig = params => {
  return request.POST('/elecNurse/paramConfig.as', params)
}

export const keeperListSimple = params => {
  return request.POST('/elecNurse/keeperListSimple.as', params)
}
export const channelLevelTrend = params => {
  return request.POST('/elecNurse/channelLevelTrend.as', params)
}
export const projectLevelTrend = params => {
  return request.POST('/elecNurse/projectLevelTrend.as', params)
}

export const pageAlarmHistory = params => {
  return request.POST('/elecNurse/pageAlarmHistory.as', params)
}
export const peopleStat = params => {
  return request.POST('/elecNurse/peopleStat.as', params)
}
export const dayStat = params => {
  return request.POST('/elecNurse/dayStat.as', params)
}
export const modifyAdj = params => {
  return request.POST('/elecNurse/modifyAdj.as', params)
}
export const snapshotCreate = params => {
  return request.POST('/elecStealing/snapshotCreate.as', params)
}
export const snapshotsave = params => {
  return request.POST('/elecStealing/save.as', params)
}
export const snapshotcancel = params => {
  return request.POST('/elecStealing/cancel.as', params)
}
export const warnList = params => {
  return request.POST('/project/main/v2/alarmDetailOfProject.as', params)
}

export const queryTrendStealing = params => {
  return request.POST('/elecStealing/query/stats.as', params)
}

export const queryAlarmTimes = params => {
  return request.POST('/elecStealing/query/alarmTimes.as', params)
}
export const snapshotbaseInfosave = params => {
  return request.POST('/elecStealing/baseInfo/save.as', params)
}
export const snapshotbaseInfodetail = params => {
  return request.POST('/elecStealing/baseInfo/detail.as', params)
}

export const snapshotdeviceselect = params => {
  return request.POST('/elecStealing/device/select.as', params)
}
export const snapshotdeviceadd = params => {
  return request.POST('/elecStealing/device/add.as', params)
}
export const snapshotdevicelist = params => {
  return request.POST('/elecStealing/device/list.as', params)
}
export const snapshotdevicemodify = params => {
  return request.POST('/elecStealing/device/modify.as', params)
}
export const snapshotdevicedel = params => {
  return request.POST('/elecStealing/device/del.as', params)
}
export const snapshotaddrdel = params => {
  return request.POST('/elecStealing/addr/del.as', params)
}
export const snapshottimeconfig = params => {
  return request.POST('/elecStealing/time/config.as', params)
}
export const elecStealingconfiglist = params => {
  return request.POST('/elecStealing/config/list.as', params)
}
export const elecStealingstatusmodify = params => {
  return request.POST('/elecStealing/status/modify.as', params)
}
export const elecStealingconfigdel = params => {
  return request.POST('/elecStealing/config/del.as', params)
}
export const elecStealingtimedel = params => {
  return request.POST('/elecStealing/time/del.as', params)
}
export const elecStealingtimelist = params => {
  return request.POST('/elecStealing/time/list.as', params)
}
export const elecStealingconflictCheck = params => {
  return request.POST('/elecStealing/config/conflictCheck.as', params)
}
export const getScanLoginQrCode = params => {
  return request.POST('/portal/v5/getScanLoginQrCode.as', params)
}
// 灯控用电统计
export const electricStatistics = params => {
  return request.POST('/thirdDevice/yzs/electricStatistics.as', params)
}
// 当月用电量
export const monthlyElectricityConsumption = params => {
  return request.POST('/thirdDevice/yzs/monthlyElectricityConsumption.as', params)
}
// 设备实时参数
export const realTimePara = params => {
  return request.POST('/thirdDevice/yzs/realTimePara.as', params)
}
// 获取sim流量信息
export const cartInfo = params => {
  return request.POST('/thirdDevice/yzs/cartInfo.as', params)
}
// 灯控复位
export const resetthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/reset.as', params)
}
// 设备详情
export const detailsthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/details.as', params)
}

export const rebootthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/reboot.as', params)
}
export const paramthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/param.as', params)
}

export const setParamthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/setParam.as', params)
}

export const historicalDatathirdDevice = params => {
  return request.POST('/thirdDevice/yzs/historicalData.as', params)
}

export const logsthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/logs.as', params)
}

export const dimmingthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/dimming.as', params)
}
export const resetBatch = params => {
  return request.POST('/thirdDevice/yzs/resetBatch.as', params)
}
export const dimming = params => {
  return request.POST('/thirdDevice/yzs/dimming.as', params)
}
export const rebootBatch = params => {
  return request.POST('/thirdDevice/yzs/rebootBatch.as', params)
}
export const brightnessthirdDevice = params => {
  return request.POST('/thirdDevice/yzs/brightness.as', params)
}
export const checkScanCodeLogin = params => {
  return request.POST('/portal/checkScanCodeLogin.as', params)
}
export const getBindStatusByCode = params => {
  return request.POST('/portal/thirdLogin/getBindStatusByCode.as', params)
}
export const bindSystemAccout = params => {
  return request.POST('/portal/thirdLogin/bindSystemAccout.as', params)
}
export const identify3 = params => {
  return request.POST('/app/sms/identify3.as', params)
}
export const unbindThirdAccout = params => {
  return request.POST('/portal/thirdLogin/unbindThirdAccout.as', params)
}
export const modifyBindThirdAccout = params => {
  return request.POST('/portal/thirdLogin/modifyBindThirdAccout.as', params)
}
export const forgotcheckCode = params => {
  return request.POST('/app/sms/checkCode.as', params)
}
export const resetPwdByPhone = params => {
  return request.POST('/portal/resetPwdByPhone.as', params)
}
export const chgPhoneByOldPhone = params => {
  return request.POST('/portal/chgPhoneByOldPhone.as', params)
}
export const checkLoginPwd = params => {
  return request.POST('/portal/checkLoginPwd.as', params)
}
export const chgPhoneByPwd = params => {
  return request.POST('/portal/chgPhoneByPwd.as', params)
}
export const checkNamePhoneMatch = params => {
  return request.POST('/portal/checkNamePhoneMatch.as', params)
}

export const queryBoxDetails = params => {
  return request.POST('/box/queryBoxDetails.as', params)
}
export const queryutInfo = params => {
  return request.POST('/ut/info.as', params)
}

export const pageInnerLog = params => {
  return request.POSTS('/ut/pageInnerLog.as', params)
}

export const checkUtDevice = params => {
  return request.POSTS('/ut/check.as', params)
}

export const refreshRealTime = params => {
  return request.POSTS('/ut/refreshRealTime.as', params)
}

export const syncTimeUt = params => {
  return request.POSTS('/ut/syncTime.as', params)
}

export const refreshLog = params => {
  return request.POSTS('/ut/refreshLog.as', params)
}

export const initUt = params => {
  return request.POSTS('/ut/init.as', params)
}

export const queryCheckInfo = params => {
  return request.POSTS('/ut/queryCheckInfo.as', params)
}
export const zadfindRealParam = params => {
  return request.POST('/thirdDevice/zad/findRealParam.as', params)
}
export const zadsetParam = params => {
  return request.POST('/thirdDevice/zad/setParam.as', params)
}
export const zadrunStatusTrend = params => {
  return request.POST('/thirdDevice/zad/runStatusTrend.as', params)
}
// export const queryBoxDetails = (params) => {
//     return request.POST('/box/queryBoxDetails.as', params)
// }
export const queryAlarmByBox = params => {
  return request.POST('/box/queryAlarmByBox.as', params)
}
export const getTrendData = params => {
  return request.POST('/thirdDevice/common/getTrendData.as', params)
}

export const listDaily = params => {
  return request.POSTS('/daily/list.as', params)
}
export const lqfindRealParam = params => {
  return request.POST('/thirdDevice/lqWaterMeter/findRealParam.as', params)
}
export const sendOrder = params => {
  return request.POST('/thirdDevice/lqWaterMeter/sendOrder.as', params)
}
export const lqrunStatusTrend = params => {
  return request.POST('/thirdDevice/lqWaterMeter/runStatusTrend.as', params)
}

export const hasSetSecondPwd = params => {
  return request.POSTS('/portal/hasSetSecondPwd.as', params)
}

export const updateSecondPwd = params => {
  return request.POSTS('/portal/updateSecondPwd.as', params)
}

export const findBackSecondPwd = params => {
  return request.POSTS('/portal/findBackSecondPwd.as', params)
}

export const checkSecondPwd = params => {
  return request.POSTS('/portal/checkSecondPwd.as', params)
}
export const wlfindRealParam = params => {
  return request.POST('/thirdDevice/wanlin/findRealParam.as', params)
}
export const getBaseInfo = params => {
  return request.POST('/scene/getBaseInfo.as', params)
}
export const wlrunStatusTrend = params => {
  return request.POST('/thirdDevice/wanlin/runStatusTrend.as', params)
}
export const tqWaterMeterRealParam = params => {
  return request.POST('/chtqdq/queryChtqdqWaterMeterRealTimeParameter.as', params)
}

export const checkValidConfigId = params => {
  return request.POST('/daily/checkValidConfigId.as', params)
}

export const stopSecondPwd = params => {
  return request.POST('/portal/stopSecondPwd.as', params)
}
export const chtqdqwaterRead = params => {
  return request.POST('/chtqdq/waterRead.as', params)
}
export const chtqdqwaterValveOnOrOff = params => {
  return request.POST('/chtqdq/waterValveOnOrOff.as', params)
}
export const chtqdqreset = params => {
  return request.POST('/chtqdq/reset.as', params)
}
export const chtqdqWaterMeterHistory = params => {
  return request.POST('/chtqdq/queryChtqdqWaterMeterReadingDataHistory.as', params)
}
export const chtqdqWaterMeterParameter = params => {
  return request.POST('/chtqdq/queryChtqdqWaterMeterReadingDataHistoryPage.as', params)
}
export const channelMarkedPowerHistory = params => {
  return request.POST('/trend/channelMarkedPowerHistory.as', params)
}
export const queryMenuConfig = params => {
  return request.POST('/member/queryMenuConfig.as', params)
}

export const saveMenuConfig = params => {
  return request.POST('/member/saveMenuConfig.as', params)
}

export const queryUserProjectMemu = params => {
  return request.POST('/common/queryUserProjectMemu.as', params)
}

export const projectQueryMenuConfig = params => {
  return request.POST('/project-property/queryMenuConfig.as', params)
}

export const projectsaveMenuConfig = params => {
  return request.POST('/project-property/saveMenuConfig.as', params)
}
export const setPower = params => {
  return request.POST('/boxConfig/setPower.as', params)
}

export const transformerRatio = params => {
  return request.POST('/chtqdq/transformerRatio.as', params)
}
export const seekAreaEnergyPlanList = params => {
  return request.GET('/energy/seekAreaEnergyPlanList.as', params)
}
export const seekAreaEnergyPlanByYear = params => {
  return request.GET('/energy/seekAreaEnergyPlanLastYear.as', params)
}
export const addAreaEnergyPlan = params => {
  return request.POSTS('/energy/addAreaEnergyPlan.as', params)
}
export const delAreaEnergyPlan = params => {
  return request.POST('/energy/delAreaEnergyPlan.as', params)
}
export const energyOverview = params => {
  return request.POST('/energyReport/energyOverview.as', params)
}
export const queryBoxByArea = params => {
  return request.POST('/energyReport/queryBoxByArea.as', params)
}
export const queryChannelOfLevel = params => {
  return request.POST('/energyReport/queryChannelOfLevel.as', params)
}
export const energyAnalysis = params => {
  return request.POST('/energyReport/analysis.as', params)
}
export const statistics = params => {
  return request.POST('/energyReport/statistics.as', params)
}
export const energyContrast = params => {
  return request.POST('/energyReport/contrast.as', params)
}
export const sameCompare = params => {
  return request.POST('/energyReport/sameCompare.as', params)
}
export const energyGeneralArea = params => {
  return request.GET('/energyReport/generalArea.as', params)
}
export const energyGeneralByMonth = params => {
  return request.GET('/energyReport/generalByMonth.as', params)
}
export const energyCategory = params => {
  return request.GET('/energyReport/category.as', params)
}
export const energyGeneralCategory = params => {
  return request.GET('/energyReport/generalCategory.as', params)
}
export const energyAreaBaseInfo = params => {
  return request.GET('/energyReport/areaBaseInfo.as', params)
}
export const energyAreaOrder = params => {
  return request.GET('/energyReport/areaOrder.as', params)
}
export const energyGeneral = params => {
  return request.GET('/energyReport/general.as', params)
}
export const energyArea = params => {
  return request.GET('/energyReport/area.as', params)
}
export const reportPage = params => {
  return request.POST('/energyReport/page.as', params)
}
export const energyTrend = params => {
  return request.POST('/energyReport/energyTrend.as', params)
}

export const getCorrectFactor4Chn = params => {
  return request.POST('/powerPrice/getCorrectFactor4Chn.as', params)
}

export const getPowerCycle = params => {
  return request.POST('/powerPrice/getPowerCycle.as', params)
}

export const getCorrectFactor4Prj = params => {
  return request.POST('/powerPrice/getCorrectFactor4Prj.as', params)
}

export const configCorrectFactor = params => {
  return request.POST('/powerPrice/configCorrectFactor.as', params)
}

export const getCorrectFactor4Grp = params => {
  return request.POST('/powerPrice/getCorrectFactor4Grp.as', params)
}

export const getCorrectFactorLog = params => {
  return request.POST('/powerPrice/getCorrectFactorLog.as', params)
}
export const configPowerCycle = params => {
  return request.POST('/powerPrice/configPowerCycle.as', params)
}
export const configTargetAndPrice = params => {
  return request.POST('/powerPrice/configTargetAndPrice.as', params)
}

export const batchConfigTargetAndPrice = params => {
  return request.POST('/powerPrice/batchConfigTargetAndPrice.as', params)
}

export const queryPowerFeeMonitorConfig = params => {
  return request.POST('/project-property/queryPowerFeeMonitorConfig.as', params)
}

export const savePowerFeeMonitorConfig = params => {
  return request.POST('/project-property/savePowerFeeMonitorConfig.as', params)
}

export const chnPlatAttrFeeMonitorConfig = params => {
  return request.POST('/chnPlatAttr/queryPowerFeeMonitorConfig.as', params)
}

export const chnPlatAttrsavePowerFeeMonitorConfig = params => {
  return request.POST('/chnPlatAttr/savePowerFeeMonitorConfig.as', params)
}

export const boxGroupPowerFeeMonitorConfig = params => {
  return request.POST('/v5/boxGroup/queryPowerFeeMonitorConfig.as', params)
}

export const boxGroupsavePowerFeeMonitorConfig = params => {
  return request.POST('/v5/boxGroup/savePowerFeeMonitorConfig.as', params)
}
export const deletePriceStep = params => {
  return request.POST('/powerPrice/deletePriceStep.as', params)
}
export const getTargetAndPrice4Prj = params => {
  return request.POST('/powerPrice/getTargetAndPrice4Prj.as', params)
}
export const getTargetAndPriceChn = params => {
  return request.POST('/powerPrice/getTargetAndPriceChn.as', params)
}
export const deleteTarget = params => {
  return request.POST('/powerPrice/deleteTarget.as', params)
}

export const batchDeleteTarget = params => {
  return request.POST('/powerPrice/batchDeleteTarget.as', params)
}

export const getTargetAndPriceGrp = params => {
  return request.POST('/powerPrice/getTargetAndPriceGrp.as', params)
}

export const findPower4ReCalc = params => {
  return request.POST('/energy/manage/v5/findPower4ReCalc.as', params)
}

export const reCalcPower = params => {
  return request.POST('/energy/manage/v5/reCalcPower.as', params)
}

export const upload = params => {
  return request.POST('/common/file/upload.as?fileType=1&urlAbsolute=true', params, { 'Content-Type': 'multipart/form-data' })
}
export const billingActivate = params => {
  return request.POST('/billing/billingActivate.as', params)
}
export const billingCheck = params => {
  return request.POST('/billing/billingCheck.as', params)
}
export const onlineAccountCharge = params => {
  return request.POST('/billing/onlineAccountCharge.as', params)
}

export const findPowerSmoothHandleConf = params => {
  return request.POST('/energy/manage/v5/findPowerSmoothHandleConf.as', params)
}

export const savePowerSmoothHandleConf = params => {
  return request.POST('/energy/manage/v5/savePowerSmoothHandleConf.as', params)
}

export const queryElectricityUserList = params => {
  return request.POST('/billing/queryElectricityUserList.as', params)
}

export const queryPaymentNotifierList = params => {
  return request.POST('/billing/queryPaymentNotifierList.as', params)
}

export const delPaymentNotifier = params => {
  return request.POST('/billing/delPaymentNotifier.as', params)
}

export const delElectricityUser = params => {
  return request.POST('/billing/delElectricityUser.as', params)
}

export const saveElectricityUser = params => {
  return request.POST('/billing/saveElectricityUser.as', params)
}

export const findStaffByName = params => {
  return request.POST('/member/findStaffByName.as', params)
}

export const savePaymentNotifier = params => {
  return request.POST('/billing/savePaymentNotifier.as', params)
}

export const queryNotifyConfList4Prj = params => {
  return request.POST('/billing/queryNotifyConfList4Prj.as', params)
}

export const queryNotifyConfList4Chn = params => {
  return request.POST('/billing/queryNotifyConfList4Chn.as', params)
}

export const configPaymentNotifier = params => {
  return request.POST('/billing/configPaymentNotifier.as', params)
}

export const configElectricityUser = params => {
  return request.POST('/billing/configElectricityUser.as', params)
}

export const getMacChnQueryCondition = params => {
  return request.POST('/billing/getMacChnQueryCondition.as', params)
}

export const getGroupTypeQueryCondition = params => {
  return request.POST('/billing/getGroupTypeQueryCondition.as', params)
}

export const getGroupNodeQueryCondition = params => {
  return request.POST('/billing/getGroupNodeQueryCondition.as', params)
}

export const queryNotifyConfList4Grp = params => {
  return request.POST('/billing/queryNotifyConfList4Grp.as', params)
}

export const powerOperateLog = params => {
  return request.POST('/energy/manage/v5/powerOperateLog.as', params)
}
export const accountBalanceList = params => {
  return request.POST('/billing/query/accountBillBalanceList.as', params)
}

export const balanceAndDeviceInfo = params => {
  return request.POST('/billing/getCurrentBalanceAndTargetName.as', params)
}
export const getAppId = params => {
  return request.POST('/app/wxoa/getAppId.as', params)
}
export const offlineAccountCharge = params => {
  return request.POST('/billing/offlineAccountCharge.as', params)
}
export const billCharge = params => {
  return request.POST('/billing/billCharge.as', params)
}
export const billPeriodList = params => {
  return request.POST('/billing/query/billPeriodTimeList.as', params)
}
export const chargeHistory = params => {
  return request.POST('/billing/query/chargeHistory.as', params)
}

export const billingBalance = params => {
  return request.POST('/billing/getAddrBalance.as', params)
}

export const priceUsageDetails = params => {
  return request.POST('/energy/manage/v5/priceUsageDetails.as', params)
}
export const accountGift = params => {
  return request.POST('/billing/accountGift.as', params)
}
export const refundHistory = params => {
  return request.POST('/billing/query/refundHistory.as', params)
}

export const refundCreate = params => {
  return request.POST('/billing/onlineRefundCreate.as', params)
}
export const billingOverviewAccount = params => {
  return request.POST('/billing/query/billingOverviewAccount.as', params)
}
export const billList = params => {
  return request.POST('/billing/query/billList.as', params)
}
export const UserElectricity = params => {
  return request.POST('/billing/query/notifierOrUser.as', params)
}
export const billingOverviewCurve = params => {
  return request.POST('/billing/query/billingOverviewCurve.as', params)
}
export const getConfigTripProperty = params => {
  return request.POST('/billing/getConfigTripProperty.as', params)
}
export const updateConfigTripProperty = params => {
  return request.POST('/billing/updateConfigTripProperty.as', params)
}
export const deleteConfigTripProperty = params => {
  return request.POST('/billing/deleteConfigTripProperty.as', params)
}
export const tripEnable = params => {
  return request.POST('/billing/config/tripEnable.as', params)
}
export const batchCall = params => {
  return request.POST('/billing/batchCall.as', params)
}

export const powerFeeReport = params => {
  return request.POST('/energy/manage/v5/powerFeeReport.as', params)
}

export const importPaymentNotifier = params => {
  return request.POST('/billing/importPaymentNotifier.as', params)
}
export const importElectricityUser = params => {
  return request.POST('/billing/importElectricityUser.as', params)
}
export const billDetailList = params => {
  return request.POST('/billing/query/billDetailList.as', params)
}
export const repairBill = params => {
  return request.POST('/billing/query/repairBill.as', params)
}
export const offlineRechargeAndRefund = params => {
  return request.POST('/billing/query/offlineRechargeAndRefund.as', params)
}
export const generatePdf = params => {
  return request.POST('/common/generatePdf.as', params)
}
export const ephemeralStore = params => {
  return request.POST('/common/ephemeralStore.as', params)
}
export const getMacChnList4Select = params => {
  return request.POST('/powerPrice/getMacChnList4Select.as', params)
}
export const refundOrderByPayOrder = params => {
  return request.POST('/billing/query/refundOrderByPayOrder.as', params)
}
export const restoreFactorySetting = params => {
  return request.POST('/boxConfig/restoreFactorySetting.as', params)
}

export const findProperty = params => {
  return request.POST('/box/findProperty.as', params)
}

export const loadDayStatisticsOfMonths = params => {
  return request.POST('/project/homePage/v5/loadDayStatisticsOfMonths.as', params)
}

export const querySwitchQuantityAlarmDetails = params => {
  return request.POST('/box/querySwitchDigitalAlarmCfg.as', params)
}

export const getAllPageAuth = () => {
  return request.JPOST('/portal/allPageAuth.as')
}

export const queryProjectMacDetailsV5 = params => {
  return request.POST('/project/main/v5/queryProjectMacDetails.as', params)
}

export const queryProjectMacAddrDetailsV5 = params => {
  return request.POST('/project/main/v5/queryProjectMacAddrDetails.as', params)
}

export const queryBoxGroupTreeAll = params => {
  return request.POST('/v5/boxGroup/queryBoxGroupTreeAll.as', params)
}

export const queryDeviceDimensionTree = params => {
  return request.POST('/v5/boxGroup/queryDeviceDimensionTree.as', params)
}

export const queryLocationTreeAll = params => {
  return request.POST('/v5/boxGroup/queryLocationTreeAll.as', params)
}

export const uploadSketch = params => {
  return request.POST('/sketch/file/upload.as?fileType=1&urlAbsolute=true', params, { 'Content-Type': 'multipart/form-data' })
}

export const queryDeviceDimensionChildsTree = params => {
  return request.POST('/v5/boxGroup/queryDeviceDimensionChildsTree.as', params)
}

export const flowAttributeQuery = params => {
  return request.GET('/thirdDevice/dingzhida/flow/attribute/query.as', params)
}
export const flowAttributeSave = params => {
  return request.POSTS('/thirdDevice/dingzhida/flow/attribute/save.as', params)
}

export const batchSetEnergyCfg = params => {
  return request.POSTS('/box/batchSetEnergyCfg.as', params)
}

export const uploadSketchVideo = params => {
  return request.POSTVIDEO('/sketch/file/upload.as?fileType=3&urlAbsolute=true', params, { 'Content-Type': 'multipart/form-data' })
}
