export const getHarmObjs = () => {
  const obj = {}
  for (let index = 2; index <= 31; index++) {
    obj[`harm${index}`] = `Hr${index.toString().padStart(2, '0')}`
  }
  return obj
}

export const getHarmPhase = type => {
  const obj = {}
  for (let index = 1; index <= 31; index++) {
    if (index === 1) {
      obj[`harm${type}`] = `${type}${window.$t('phase')}Thd`
    } else {
      obj[`harm${index}${type}`] = `${type}${window.$t('phase')}Hr${index.toString().padStart(2, '0')}`
    }
  }
  return obj
}
