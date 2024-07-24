export const toolTipText = window.$t('deviceTip')

const sortByKey = target => {
  let arr = []
  target.forEach(item => {
    let obj = {}
    Object.keys(item)
      .sort()
      .forEach(key => {
        // sort进行排序
        obj[key] = item[key]
      })
    arr.push(obj)
  })
  return arr
}
const removeDuplicate = target => {
  let arrStringify = target.map(item => JSON.stringify(item))
  let newArrStringify = Array.from(new Set([...arrStringify]))
  return newArrStringify.map(item => JSON.parse(item))
}
export const end = arr => {
  return removeDuplicate(sortByKey(arr))
}
export const timeOptions = [
  {
    value: '0',
    label: '0',
  },
  {
    value: '1800',
    label: window.$t('min30'),
  },
  {
    value: '3600',
    label: window.$t('min60'),
  },
  {
    value: '10800',
    label: window.$t('hour3'),
  },
  {
    value: '21600',
    label: window.$t('hour6'),
  },
  {
    value: '43200',
    label: window.$t('hour12'),
  },
  {
    value: '86400',
    label: window.$t('hour24'),
  },
]
export const findSilenceTimeoutValue = val => {
  const value = timeOptions.find(v => v.value === val)
  return value.label || ''
}
