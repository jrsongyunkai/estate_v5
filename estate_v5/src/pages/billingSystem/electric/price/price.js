import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
export const checkIntegralPoint = data => {
  if (!data) return ''
  const cloneData = cloneDeep(data)
  const splitArr = cloneData.split(',')
  const mapArr = splitArr.map(item => {
    let itemStr = item.split('~')
    if (itemStr[1].split(':')[1] === '00') {
      itemStr[1] = dayjs('2024-03-15 ' + itemStr[1])
        .subtract(1, 'minute')
        .format('HH:mm')
    }
    return itemStr[0] + '~' + itemStr[1]
  })
  return mapArr.join(',')
}
