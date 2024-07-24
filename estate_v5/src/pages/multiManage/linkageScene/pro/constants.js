export const TABLE_COLUMNS = [
  {
    title: window.$t('index'),
    type: 'index',
    width: 80,
    align: 'center',
  },
  {
    title: window.$t('linkageName'),
    slot: 'name',
  },
  {
    title: window.$t('configId'),
    key: 'linkId',
  },
  {
    title: window.$t('loopMode2'),
    key: 'loopModeName',
  },
  {
    title: window.$t('cyclePeriod'),
    slot: 'loopCycle',
  },
  {
    title: window.$t('effectivePeriod'),
    slot: 'timeRangeList',
  },
  {
    title: window.$t('executionMode'),
    key: 'linkageModeName',
  },
  {
    title: window.$t('createdTime'),
    key: 'createTime',
  },
  {
    title: window.$t('state'),
    slot: 'status',
  },
  {
    title: window.$t('deliveryStatus'),
    key: 'downStatusName',
  },
  {
    title: window.$t('operation'),
    slot: 'action',
    width: 340,
    align: 'center',
  },
]

export const LINKAGE_MODE_FILTERS = [
  {
    value: 1,
    label: window.$t('executeAtEdge'),
  },
  {
    value: 2,
    label: window.$t('executeInCloud'),
  },
]

export const LINKAGE_STATUS_FILTERS = [
  {
    value: 1,
    label: window.$t('enabled'),
  },
  {
    value: 2,
    label: window.$t('disabled'),
  },
]
export const copyCloudsObj = () => {
  return {
    cloudsValue: '1',
    titleVal: '',
    visible: false,
    groupLetter: `${window.$t('conditionGroup')}A`,
    conditionList: [
      {
        letter: 0,
        grandsonItemButtonShow: true,
        conditionType: '1',
        conditional: '',
        conditionalType: '',
        conditonDetermineValue: 0,
        children: [
          {
            equipmentType: null,
            conditionObject: '',
            resId: '',
            conditionLineList: [],
            conditionLinePortList: [],
            conditionLineStatusTypeList: [],
            conditionStatusValueList: [],
            conditionLineNumTypeList: [],
            factorCloudsValue: 0,
            conditionCloudsFactor: '1',
            conditionNumType: '',
            alarmValue: [],
            conditionLetter: 'A',
            conditionAddr: '',
            conditionPort: '',
            conditionStatusType: '',
            conditionStatusValue: '',
          },
        ],
      },
    ],
  }
}
export const copyMarginalObj = () => [
  {
    marginalValue: '1',
    titleVal: '',
    groupLetter: `${window.$t('conditionGroup')}A`,
    visible: false,
    conditionList: [
      {
        conditionType: '1',
        letter: 0,
        grandsonItemButtonShow: true,
        conditional: '',
        conditonDetermineValue: 0,
        conditionalType: '',
        children: [
          {
            conditionLetter: 'A',
            conditionAddr: '',
            conditionPortList: [],
            conditionStatusTypeList: [],
            conditionPort: '',
            conditionStatusType: '',
            conditionValueType: '',
          },
        ],
      },
    ],
  },
]
export const copyConditionObj = () => {
  return {
    letter: 0,
    grandsonItemButtonShow: true,
    visible: false,
    conditionType: '',
    conditional: '',
    conditonDetermineValue: 0,
    conditionalType: '',
    children: [
      {
        equipmentType: null,
        conditionObject: '',
        resIds: '',
        conditionLineList: [],
        conditionLinePortList: [],
        conditionLineStatusTypeList: [],
        conditionStatusValueList: [],
        conditionLineNumTypeList: [],
        conditionCloudsFactor: '1',
        factorCloudsValue: 0,
        conditionNumType: '',
        alarmValue: [],
        conditionLetter: 'A',
        conditionAddr: '',
        conditionPort: '',
        conditionStatusType: '',
        conditionStatusValue: '',
      },
    ],
  }
}
export const copyChildern = () => {
  return {
    equipmentType: null,
    conditionObject: '',
    resId: '',
    conditionLetter: 'A',
    conditionLineList: [],
    conditionLinePortList: [],
    conditionLineStatusTypeList: [],
    conditionStatusValueList: [],
    conditionLineNumTypeList: [],
    factorCloudsValue: 0,
    conditionCloudsFactor: '1',
    conditionNumType: '',
    alarmValue: [],
    conditionAddr: '',
    conditionPort: '',
    conditionStatusType: '',
    conditionStatusValue: '',
  }
}
export const copyActions = () => {
  return {
    resType: 'hasResId',
    deviceName: '',
    resId: '',
    lineTypeList: [],
    lineValue: '',
    portValue: '',
    equipmentType: null,
    portTypeList: [],
    conditionEvenType: '',
    modifyValue: '',
    actionType: [],
    actionValue: '',
    conditionEventLists: [],
    actionEventLists: [],
    eventValue: [],
  }
}
export const conditionalList = [
  { value: 'any', label: window.$t('anyValue') },
  { value: 'all', label: window.$t('allValue') },
  { value: 'max', label: window.$t('maxValue') },
  { value: 'min', label: window.$t('minValue') },
  { value: 'avg', label: window.$t('averageValue') },
  { value: 'sum', label: window.$t('sumValue') },
  { value: 'sub', label: window.$t('differenceValue') },
]
export const conditionalTypeList = [
  { value: 'eq', label: window.$t('equal') },
  { value: 'neq', label: window.$t('notEqual') },
  { value: 'gt', label: window.$t('greaterThan') },
  { value: 'lt', label: window.$t('lessThan') },
  { value: 'gte', label: window.$t('gte') },
  { value: 'lte', label: window.$t('lte') },
]
export const deviceTypeList = [
  {
    value: '1',
    label: window.$t('gateway'),
  },
  {
    value: '2',
    label: window.$t('airSwitch'),
  },
  {
    value: '3',
    label: '808',
  },
  {
    value: '4',
    label: window.$t('monitoring'),
  },
]
export const allDeviceTypeList = [
  { label: window.$t('intelligentAirSwitch'), value: '1' },
  { label: window.$t('electricalFire'), value: '2,3' },
  // { label: '智能面板', value: '19' },
  { label: window.$t('intelligentModule'), value: '40' },
  { label: window.$t('industrialGas'), value: '26' },
  { label: window.$t('waterImmersionWaterLevelAndPressure'), value: '18,23,24' },
  { label: window.$t('smokeAndCombustibleGases'), value: '25,29,39,41,42,45' }, // 6,7,10,13,,29
  { label: window.$t('temperatureHumidityLightingInfraredRemoteControl'), value: '22' },
  { label: window.$t('airDisinfector'), value: '33' },
]
export const getLineId = (mac, line) => {
  if (mac && `${line}` === '101') {
    return `(${mac})`
  }
  if ([0, '0'].includes(line) && mac) {
    return `(${mac}--)`
  }
  if (!mac || (![0, '0'].includes(line) && !line) || (Array.isArray(line) && !line.length)) {
    return ''
  }
  const StringLine = Array.isArray(line) ? line.join() : `${line}`
  const lineID = `(${mac}-${StringLine.padStart(2, '0')})`
  return lineID
}
export const toolCloudsTipText = window.$t('edgeStateModeTooltip')

export const regexMac = val => {
  const str = val
  const regex = /\((.*?)\)/ // 匹配括号中的内容

  const match = str.match(regex) // 使用正则表达式匹配字符串中的内容
  if (match) {
    const result = match[1] // 获取匹配到的括号中的内容
    return result
  } else {
    return ''
  }
}
export const onehundredLetters = val => {
  let arr = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  let result = arr.reduce(
    (acc, curr) => {
      let arr1 = acc[0].concat(curr)
      let arr2 = acc[1].concat(`A${curr}`)
      let arr3 = acc[2].concat(`B${curr}`)
      let arr4 = acc[3].concat(`C${curr}`)
      return [arr1, arr2, arr3, arr4]
    },
    [[], [], [], []]
  )
  let arr5 = result.flat()
  return arr5[val]
}
