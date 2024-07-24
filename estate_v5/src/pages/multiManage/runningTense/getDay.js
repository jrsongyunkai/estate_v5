import dayjs from 'dayjs'

export const getCurrThirtyDay = () => {
  let days = []
  let weekDesc = [window.$t('sunday'), window.$t('monday'), window.$t('tuesday'), window.$t('wednesday'), window.$t('thursday'), window.$t('friday'), window.$t('saturday')]
  for (let i = 30; i > -1; i--) {
    let time = dayjs(new Date()).subtract(i, 'day').format('YYYY-MM-DD')
    days.push({
      time,
      dayNum: weekDesc[new Date(time).getDay()],
      isToday: new Date(time).toDateString() === new Date().toDateString(),
      timeSubstr: time.substr(5),
    })
  }
  return days
}
export const arrProcess = (arr = [], list = []) => {
  let zeroArr = []
  let redArr = []
  let greenArr = []
  let yellowArr = []
  let newArr = arr
  const newList = list
  newArr.forEach((v, i) => {
    if (v === '0') {
      zeroArr.push({ time: newList[i], index: i })
    }
    if (['6', '4', '1'].includes(v)) {
      greenArr.push({ time: newList[i], index: i })
    }
    if (['7', '3', '2'].includes(v)) {
      redArr.push({ time: newList[i], index: i })
    }
    if (v === '5') {
      yellowArr.push({ time: newList[i], index: i })
    }
  })
  let getTime = newArr.map((v, i) => ({
    time: newList[i],
    index: i,
    isGreen: ['6', '3', '1'].includes(v),
    isRed: ['7', '4', '2'].includes(v),
    value: v,
  }))
  let configData = substrTime(getTime)
  configData.forEach((v, i) => {
    v.start = v.time
    if (configData[i + 1]) {
      v.end = configData[i + 1].time
    } else {
      v.end = 1440
    }
  })
  const filterConfig = configData.filter(v => v.value !== '0').map(j => ({ type: j.isGreen ? 0 : j.isRed ? 1 : 2, ...j }))
  return filterConfig
}
export const substrTime = (arr = []) => {
  let flag
  let timer = []
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      flag = arr[0].value
      timer.push({ ...arr[i], start: 0, end: '' })
    }
    if (arr[i].value !== flag) {
      timer.push({ ...arr[i] })
      flag = arr[i].value
    }
    flag = arr[i].value
    if (i === arr.length - 1 && arr[i].value !== flag) {
      timer.push(arr[i])
    }
  }
  return timer
}
export const actionConfigValue = val => {
  const list = [
    { value: 0, label: window.$t('noAction') },
    { value: 1, label: window.$t('opening') },
    { value: 2, label: window.$t('closing') },
    { value: 3, label: window.$t('openAndLock') },
    { value: 4, label: 'ON' },
    { value: 5, label: 'OFF' },
    { value: 7, label: window.$t('inching') },
  ]
  const findItem = list.find(v => v.value === val)
  return findItem ? findItem.label : '-'
}
export const historyClomns = () => [
  {
    title: window.$t('deviceAliases'),
    key: 'boxName',
  },
  {
    title: window.$t('equipmentNo'),
    key: 'mac',
  },
  {
    title: window.$t('actionType'),
    slot: 'actionType',
  },
  {
    title: window.$t('alarmType'),
    key: 'alarmTypeInfo',
  },
  {
    title: window.$t('judgmentalLogic'),
    slot: 'judgeLogic',
  },
  {
    title: window.$t('triggerMechanism'),
    slot: 'triggerRule',
  },
  {
    title: window.$t('alarmTime'),
    key: 'createTime',
  },
]
export const tenseColumns = [
  {
    title: window.$t('ruleName'),
    key: 'name',
  },
  {
    title: window.$t('ruleDescription'),
    key: 'remark',
  },
  {
    title: window.$t('ruleState'),
    slot: 'status',
  },
  {
    title: window.$t('cyclePeriod'),
    key: 'cycleDesc',
  },
  {
    title: window.$t('executionMode'),
    key: 'modelName',
  },
  {
    title: window.$t('createdTime'),
    key: 'createTime',
  },
  {
    title: window.$t('operation'),
    slot: 'action',
    width: 300,
  },
]
