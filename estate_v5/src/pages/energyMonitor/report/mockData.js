// 根据开始日期和结束日期获取所有日期的方法
import dayjs from 'dayjs'
export const processLevel = data => {
  const newData = setLevel(data)
  return newData
}

export const setLevel = data => {
  const findParent = (ttPid, level) => {
    let parent = Array.isArray(data) && data.length && data.find(v => v.ttId === ttPid)
    if (!parent) return level
    return findParent(parent.ttPid, level + 1)
  }
  return data.map(item => {
    let obj = { ...item }
    if (item.addr) obj.level = findParent(item.ttPid, 1)
    return obj
  })
}

export const processData = (data, key) => {
  let flag = ''
  let count = 0
  let statrtIndex = 0
  let newArr = []
  data.forEach((v, i) => {
    if (i === 0) {
      flag = v[key]
    }
    if (v[key] !== flag) {
      data[statrtIndex][`${key}row`] = count
      flag = v[key]
      statrtIndex = i
      count = 0
    }
    count++

    if (i === data.length - 1) {
      data[statrtIndex][`${key}row`] = count
    }
    newArr.push(v)
  })
  return newArr
}

export const processAdress = ({ top, left }) => {
  return { left, top }
}

export const getBadgeAdres = ({ left, top }, b, offset) => {
  let newX = b.left - left + offset
  let neWY = b.top - top
  return { x: newX, y: neWY }
}

export const creatLine = (nodeA, nodeB) => {
  const { point: pointA, domId: idA, mac: macA, ttId: ttIdA } = nodeA
  const { point: pointB, domId: idB, mac: macB, ttPid: ttPidB } = nodeB
  const { x: x1, y: y1 } = pointA
  const { x: x2, y: y2 } = pointB
  let dashedLine = macA !== macB && ttIdA === ttPidB
  const commonLong = 10
  // 公高
  const commonHeight = Math.abs(y1 - y2)
  // 公宽
  const commonWidth = Math.abs(x1 - x2)
  const xOffSet = 4
  const yOffSet = 9 + 56
  const newStyle = `hover${(((1 + Math.random()) * 0x10000) | 0).toString(16).substring()}`
  const allHasclass = 'allSelectLineOfone'
  const dataClass = `${idA}-${idB}-${y2}-${x2}-${newStyle}`
  let negative = false
  if (y2 - y1 < 0) {
    negative = true
  }
  const prePoint = document.createElement('div')
  prePoint.style.zIndex = 9
  prePoint.style.left = `${x1 + xOffSet - 2}px`
  prePoint.style.top = `${y1 + yOffSet - 3}px`
  prePoint.classList.add('line-point')
  prePoint.classList.add(`${newStyle}`)
  prePoint.classList.add(allHasclass)
  prePoint.classList.add(dataClass)
  const div1 = document.createElement('div')
  div1.style.height = `${commonLong}px`
  div1.style.zIndex = 9
  div1.style.left = `${x1 + xOffSet}px`
  div1.style.top = `${negative ? y1 - 4 + 56 : y1 + yOffSet + 1}px`
  div1.classList.add(dashedLine ? 'h-line-dashed' : 'h-line')
  div1.classList.add(`${newStyle}`)
  div1.classList.add(allHasclass)
  div1.classList.add(dataClass)

  const div2 = document.createElement('div')
  div2.style.width = `${negative ? commonWidth - commonLong - 10 : commonWidth - commonLong}px`
  div2.style.zIndex = 9
  div2.style.left = `${x1 + xOffSet}px`
  div2.style.top = `${negative ? y1 - commonLong + 5 + 56 : y1 + yOffSet + commonLong + 1}px`
  div2.classList.add(dashedLine ? 'w-line-dashed' : 'w-line')
  div2.classList.add(`${newStyle}`)
  div2.classList.add(allHasclass)
  div2.classList.add(dataClass)

  const div3 = document.createElement('div')
  div3.style.height = `${negative ? commonHeight - commonLong - 3 : commonHeight - commonLong}px`
  div3.style.left = `${negative ? x1 + xOffSet + (commonWidth - commonLong) - 10 : x1 + xOffSet + (commonWidth - commonLong)}px`
  div3.style.zIndex = 9
  div3.style.top = `${negative ? y2 + yOffSet : y1 + yOffSet + commonLong + 1}px`
  div3.classList.add(dashedLine ? 'h-line-dashed' : 'h-line')
  div3.classList.add(`${newStyle}`)
  div3.classList.add(allHasclass)
  div3.classList.add(dataClass)

  const div4 = document.createElement('div')
  div4.style.width = `${negative ? commonLong + 10 : commonLong}px`
  div4.style.zIndex = 9
  div4.style.left = `${negative ? x1 + xOffSet + (commonWidth - commonLong) - 10 : x1 + xOffSet + (commonWidth - commonLong)}px`
  div4.style.top = `${negative ? y2 + yOffSet : y1 + yOffSet + commonLong + (commonHeight - commonLong) + 1}px`
  div4.classList.add(dashedLine ? 'w-line-dashed' : 'w-line')
  div4.classList.add(`${newStyle}`)
  div4.classList.add(allHasclass)
  div4.classList.add(dataClass)

  const nextPoint = document.createElement('div')
  nextPoint.style.zIndex = 9
  nextPoint.style.left = `${x2 + 2}px`
  nextPoint.style.top = `${y2 + 5}px`
  nextPoint.classList.add('line-point')
  nextPoint.classList.add(`${newStyle}`)
  nextPoint.classList.add(allHasclass)
  nextPoint.classList.add(dataClass)

  const arrow = document.createElement('div')
  arrow.style.zIndex = 9
  arrow.style.left = `${x2 - 8}px`
  arrow.style.top = `${y2 - 2 + 56}px`
  arrow.classList.add('arrow-point')
  arrow.classList.add('icon-v5')
  arrow.classList.add('icon-v5-xiangyou')
  arrow.classList.add(`${newStyle}`)
  arrow.classList.add(allHasclass)
  arrow.classList.add(dataClass)

  const tableReport = document.getElementsByClassName('ivu-table-fixed-body')[0]
  tableReport.appendChild(prePoint)
  tableReport.appendChild(div1)
  tableReport.appendChild(div2)
  tableReport.appendChild(div3)
  tableReport.appendChild(div4)
  tableReport.appendChild(nextPoint)
  tableReport.appendChild(arrow)
}

export const drawLine = meta => {
  const pool = meta.filter(v => v.ttPid !== 0 && v.addr)
  const start = meta.filter(v => v.ttPid === 0 && v.addr && v.level === 1)
  start.forEach(v => {
    deepDrawLine(v, pool)
  })
}

const deepDrawLine = (node, pool) => {
  if (pool.length) {
    const nexts = pool.filter(v => v.ttPid === node.ttId)
    if (nexts.length) {
      nexts.forEach((v, i) => {
        const index = pool.findIndex(v => v.ttPid === node.ttId)
        if (index === -1) return
        const cur = pool[index]
        creatLine(node, cur, i * 5)
        pool.splice(index, 1)
        deepDrawLine(cur, pool)
      })
    }
  }
}

export const getAllDate = (start, end) => {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const datesArray = []
  let currentDate = startDate
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
    datesArray.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }
  return datesArray
}

export const format = time => {
  let ymd = ''
  let mouth = time.getMonth() + 1 >= 10 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)
  let day = time.getDate() >= 10 ? time.getDate() : '0' + time.getDate()
  ymd += time.getFullYear() + '-' // 获取年份。
  ymd += mouth + '-' // 获取月份。
  ymd += day // 获取日。
  return ymd // 返回日期。
}

export const getMonthBetween = (start, end) => {
  let result = []
  let min = new Date(start)
  let max = new Date(end)
  let curr = min
  do {
    let month = new Date(curr).getMonth() + 1
    let t = ''
    if (month < 10) {
      t = '0' + month
    } else t = month
    let str = curr.getFullYear() + '-' + t
    result.push(str)
    if (month === 12) {
      curr.setFullYear(new Date(curr).getFullYear() + 1)
      curr.setMonth(0)
    } else curr.setMonth(month)
  } while (curr <= max)
  return result
}

export const getYearBetween = (start, end) => {
  let result = []
  let min = new Date(start).getFullYear()
  let max = new Date(end).getFullYear()
  while (min <= max) {
    result.push(min)
    min = Number(min) + 1
  }
  return result
}
