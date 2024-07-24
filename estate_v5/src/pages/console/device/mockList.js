export const euqipment2627Device = [
  {
    activateTime: '2023-04-25 14:24:00',
    boxAddress: '广东省深圳市宝安区料坑大道',
    build: '奋达科技园',
    buildSno: '0',
    cityName: '深圳市',
    countyName: '宝安区',
    creator: 'admin',
    endDate: '2073-04-25 00:00:00',
    equipmentType: 43,
    id: 55374,
    lastUpdateTime: '2023-05-17 11:39:36',
    latitude: 22.676908,
    linkman: '吴静',
    linkman2: '西西',
    linkmanTel: '15019229695',
    linkmanTel2: '',
    longitude: 113.903262,
    mac: '98CC4D11D516',
    model: '',
    name: 'Dev-98CC4D1999',
    others: { enableAdvancedTiming: true, customAlarm: '未知', online: 1, countAddr: 5, type: '120', version: '3.0.90' },
    ownerId: 1,
    projectCode: 'P00000015201',
    provinceName: '广东省',
    registerSource: 0,
    registerTime: '2023-04-25 14:24:00',
    remark: '',
    resId: 51503,
    room: '502',
    roomSno: '0',
    startDate: '2023-04-25 00:00:00',
    status: 'NORMAL',
    statusCnString: 'NORMAL',
    street: '料坑大道',
    unit: '1号楼',
    unitSno: '0',
  },
]

export const timelistData = (val = []) => {
  for (let i = 11; i < 61; i++) {
    val.push({ value: `${i}`, label: `${i}` })
  }
  return val
}
export const SpecificRelateText = window.$t('toolTipText25')
export const toolText = window.$t('toolTipText26')
export const airDisnfectorConfig = [
  // 空气消杀机
  { type: 6, value: 1, label: window.$t('manyLevel', { num: 1 }), text: window.$t('auxiliaryAtomizationPower1') },
  { type: 6, value: 2, label: window.$t('manyLevel', { num: 2 }), text: window.$t('auxiliaryAtomizationPower1') },
  { type: 6, value: 3, label: window.$t('manyLevel', { num: 3 }), text: window.$t('auxiliaryAtomizationPower1') },
  { type: 6, value: 4, label: window.$t('manyLevel', { num: 4 }), text: window.$t('auxiliaryAtomizationPower1') },
  { type: 6, value: 5, label: window.$t('manyLevel', { num: 5 }), text: window.$t('auxiliaryAtomizationPower1') },
  { type: 7, value: 1, label: window.$t('manyLevel', { num: 1 }), text: window.$t('fanWindPower') },
  { type: 7, value: 2, label: window.$t('manyLevel', { num: 2 }), text: window.$t('fanWindPower') },
  { type: 7, value: 3, label: window.$t('manyLevel', { num: 3 }), text: window.$t('fanWindPower') },
  { type: 7, value: 4, label: window.$t('manyLevel', { num: 4 }), text: window.$t('fanWindPower') },
  { type: 7, value: 5, label: window.$t('manyLevel', { num: 5 }), text: window.$t('fanWindPower') },
  { type: 4, value: 1, label: window.$t('parasiticAtomization'), text: window.$t('commandIssuance') },
  { type: 4, value: 2, label: window.$t('humidificationAtomization'), text: window.$t('commandIssuance') },
  { type: 4, value: 3, label: window.$t('cleaningAtomization'), text: window.$t('commandIssuance') },
  { type: 4, value: 5, label: window.$t('stop'), text: window.$t('commandIssuance') },
]
export const labelText = type => {
  if (!type) {
    return ''
  }
  const airDConfig = airDisnfectorConfig.find(v => +v.type === +type)
  return airDConfig ? airDConfig.text : ''
}
export const detailLabel = (type, val1, val2) => {
  if (!type || !val1) {
    return ''
  }
  const detailValue = airDisnfectorConfig.find(v => +v.type === +type && +v.value === +val1)
  return detailValue ? detailValue.label + (val2 ? `(${val2}min)` : '') : ''
}
export const isJSON = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    // 转换出错，抛出异常
    return false
  }
  return true
}
