export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

export const loadScript = src =>
  new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

/**
 * 重试执行方法
 * @param {Function} handle 执行动作函数
 * @param {number} times 执行追加次数
 * @param {number} interval 执行间隔时长(ms)
 * @param {Boolean} immediate 是否立即执行
 * @param {Function} changeInterval 修改间隔时长策略
 * @returns {Function}  清除定时执行方法
 */
export const retry = (handle, times, interval, immediate = true, changeInterval = n => 2 * n) => {
  let count = 0
  let timeout = null
  const run = async () => {
    try {
      await handle()
    } catch (e) {}
    if (count >= times) {
      return
    }
    timeout = setTimeout(run, interval)
    interval = changeInterval(interval)
    count++
  }
  if (immediate) {
    run()
  } else {
    timeout = setTimeout(run, interval)
    interval = changeInterval(interval)
  }
  return () => clearTimeout(timeout)
}

/**
 * 数字与excel列互转
 * 1 - A
 * 26 - Z
 * 27 - AA
 * 702 - ZZ
 * 703 - AAA
 * @param {number} num
 * @returns
 */
export const numberToLetter = num => {
  let temp = 0
  let letter = ''
  while (num > 0) {
    num--
    temp = num % 26
    letter = String.fromCharCode(temp + 65) + letter
    num = Math.floor(num / 26)
  }
  return letter
}

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max)
}

export const clampLng = num => {
  return clamp(num, -180, 180)
}

export const clampLat = num => {
  return clamp(num, -90, 90)
}
