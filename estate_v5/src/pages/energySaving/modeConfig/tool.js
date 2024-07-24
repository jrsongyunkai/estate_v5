const parseTimeToMinutes = timeString => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

// 判断时间段是否存在重合部分
export const hasOverlapIntervals = intervals => {
  for (let i = 0; i < intervals.length; i++) {
    const [start1, end1] = intervals[i].map(parseTimeToMinutes)
    for (let j = i + 1; j < intervals.length; j++) {
      const [start2, end2] = intervals[j].map(parseTimeToMinutes)
      if ((start1 <= start2 && start2 < end1) || (start2 <= start1 && start1 < end2)) {
        return true
      }
    }
  }
  return false
}
