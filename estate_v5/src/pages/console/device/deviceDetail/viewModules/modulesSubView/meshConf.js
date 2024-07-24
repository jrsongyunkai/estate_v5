export const meshMap = {
  k11p: {
    url: 'k1_1p_asm.glb',
    width: 1.75,
  },
  k12p: {
    url: 'k1_2p_asm.glb',
    width: 3.6,
  },
  k13p: {
    url: 'k1_3p_asm.glb',
    width: 5.4,
  },
  k14p: {
    url: 'k1_4p_asm.glb',
    width: 7.2,
  },
  k1Power: {
    url: 'k1_电源_P25_asm.glb',
    width: 3.6,
  },
  k1Gateway: {
    url: 'k1_通迅模块_asm.glb',
    width: 1.75,
  },
  k51p: {
    url: 'k5_1p_19.glb',
    width: 2.65,
  },
  k52p: {
    url: 'k5_2p_19.glb',
    width: 5.3,
  },
  k53p: {
    url: 'K5_3P.glb',
    width: 7.1,
  },
  k54p: {
    url: 'K5_4P.glb',
    width: 8.83,
  },
  k5Power: {
    url: 'p25_asm.glb',
    width: 3.5,
  },
  k5Gateway: {
    url: 'T30.glb',
    width: 1.75,
  },
  S600: {
    url: '600s.glb',
    width: 0,
  },
}

const deviceGroupMap = {
  '2-1P': 'k51p',
  '2-2P': 'k52p',
  '2-3P': 'k53p',
  '2-4P': 'k54p',
  '7-1P': 'k11p',
  '7-2P': 'k12p',
  '7-3P': 'k13p',
  '7-4P': 'k14p',
}

// 2=K5   7=K1
const deviceGroupArr = ['2-1P', '2-2P', '2-3P', '2-4P', '7-1P', '7-2P', '7-3P', '7-4P']

export const processGroup = addrGroup => {
  if (!addrGroup || !addrGroup.length) {
    return []
  }
  const devices = addrGroup.filter(v => !deviceGroupArr.includes(v))
  if (devices.length) {
    // case 1  有其他的型号，就算是没有匹配上 返回空数组
    return []
  } else {
    // case 2 匹配上了 分析型号并且追加上电源和网关 返回结果
    const device1 = addrGroup[0]
    const devices = addrGroup.map(v => deviceGroupMap[v])
    const deviceType = device1.split('-')[0]
    if (Number(deviceType) === 2) {
      return ['k5Power', 'k5Gateway', ...devices]
    }
    if (Number(deviceType) === 7) {
      return ['k1Power', 'k1Gateway', ...devices]
    }
  }

  return []
}
// equipmentType 23
const columnsAir = [
  { title: window.$t('source'), key: 'remark' },
  { title: window.$t('operator'), slot: 'staffName', width: 100 },
  { title: window.$t('time'), key: 'createTime' },
  { title: `${window.$t('waterPressureAlarmThreshold')}（Mpa）`, slot: 'warm' },
  { title: window.$t('waterPressureChangeRateThreshold'), slot: 'ChgRate' },
  { title: window.$t('collectionDateMin'), slot: 'period' },
  { title: window.$t('result'), slot: 'result', width: 100 },
]
// equipmentType 24
const columnsWater = [
  { title: window.$t('source'), key: 'remark' },
  { title: window.$t('operator'), slot: 'staffName', width: 100 },
  { title: window.$t('time'), key: 'createTime' },
  { title: `${window.$t('liquidLevelAlarmThreshold')}（mm）`, slot: 'warm' },
  { title: window.$t('liquidLevelChangeThreshold'), slot: 'ChgRate' },
  { title: window.$t('collectionReportingCycleMinutes'), slot: 'period' },
  { title: window.$t('result'), slot: 'result', width: 100 },
]
// equipmentType  28 40
const columns4G = [
  { title: window.$t('source'), key: 'remark' },
  { title: window.$t('operator'), key: 'staffName' },
  { title: window.$t('time'), key: 'createTime' },
  { title: window.$t('instructionContent'), slot: 'value' },
  { title: window.$t('result'), slot: 'result', width: 100 },
]
// equipmentType 41 42
const columnsSmoke = [
  { title: window.$t('operator'), key: 'staffName' },
  { title: window.$t('time'), key: 'createTime' },
  { title: window.$t('executionActionType'), slot: 'value' },
  { title: window.$t('remark'), slot: 'result', width: 100 },
]
// equipmentType 30
const columnsIntelligentWater = [
  { title: window.$t('source'), slot: 'actionType_desc' },
  { title: window.$t('operator'), key: 'staffName', width: 100 },
  { title: window.$t('time'), key: 'createTime' },
  { title: window.$t('operationType'), slot: 'oprType' },
  { title: window.$t('result'), slot: 'result', width: 100 },
  { title: window.$t('remark'), slot: 'remark', align: 'center' },
]
export const getColumns = {
  23: columnsAir,
  24: columnsWater,
  28: columns4G,
  40: columns4G,
  41: columnsSmoke,
  42: columnsSmoke,
  30: columnsIntelligentWater,
  44: columnsSmoke,
}
// equipmentType 23, 24, 28, 41, 42
const alarmColumnPressure = [
  { title: window.$t('eventId'), key: 'id' },
  { title: window.$t('time'), key: 'dateTime' },
  { title: window.$t('eventInfo'), key: 'info' },
  { title: window.$t('progress'), slot: 'progress' },
  { title: window.$t('spentTime'), slot: 'passTime' },
  { title: window.$t('state'), slot: 'processStatus', align: 'center' },
]
// equipmentType 25
const alarmColumnGas = [
  { title: window.$t('eventId'), key: 'id' },
  { title: window.$t('time'), key: 'dateTime' },
  { title: window.$t('position'), slot: 'address' },
  { title: window.$t('alarmType'), key: 'info' },
  { title: window.$t('progress'), slot: 'progress' },
  { title: window.$t('spentTime'), slot: 'passTime' },
  { title: window.$t('state'), slot: 'processStatus', align: 'center' },
]
// equipmentType 29
const alarmSmokeColumn = [
  { title: window.$t('eventId'), key: 'id' },
  { title: window.$t('time'), key: 'dateTime' },
  { title: window.$t('eventType'), key: 'info' },
  { title: window.$t('numValue'), slot: 'valueDescribe', align: 'center' },
  { title: window.$t('progress'), slot: 'progress' },
  { title: window.$t('spentTime'), slot: 'passTime' },
  { title: window.$t('state'), slot: 'processStatus', align: 'center' },
]
export const getAlarmColumns = {
  23: alarmColumnPressure,
  24: alarmColumnPressure,
  28: alarmColumnPressure,
  41: alarmColumnPressure,
  42: alarmColumnPressure,
  44: alarmColumnPressure,
  25: alarmColumnGas,
  29: alarmSmokeColumn,
}
