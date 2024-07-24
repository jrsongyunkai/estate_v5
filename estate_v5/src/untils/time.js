/**
 * @param {string} time 支持 HH:mm 和 HH:mm:ss
 */
export function time2seconds(time) {
  let [h, m, s = 0] = time.split(':').map(Number)

  return h * 60 * 60 + m * 60 + s
}

export function hour2time(hour) {
  const HH = hour.toString().padStart(2, '0')

  return `${HH}:00`
}

export function time2hour(time) {
  let [h] = time.split(':').map(Number)

  return h
}
