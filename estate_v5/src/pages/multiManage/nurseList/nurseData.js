export const cloneTree = (score, parentId = 0) => {
  let tree = []
  score.map(item => {
    if (item.parentId === parentId) {
      // 递归寻找
      item.children = cloneTree(score, item.id)
      tree.push(item)
    }
  })

  return tree
}
export const getTree = (tree = []) => {
  let arr = []
  if (!!tree && tree.length !== 0) {
    tree.forEach(item => {
      let obj = {}
      obj.id = item.id
      obj.value = item.id
      obj.parentId = item.parentId
      obj.title = item.name
      // 其他你想要添加的属性
      obj.expand = true
      obj.selected = false
      obj.checked = false
      obj.children = getTree(item.children) // 递归调用
      arr.push(obj)
    })
  }
  return arr
}
export const timeListData = [
  { value: true, time: '0' },
  { value: true, time: '1' },
  { value: true, time: '2' },
  { value: true, time: '3' },
  { value: true, time: '4' },
  { value: true, time: '5' },
  { value: true, time: '6' },
  { value: true, time: '7' },
  { value: true, time: '8' },
  { value: true, time: '9' },
  { value: true, time: '10' },
  { value: true, time: '11' },
  { value: true, time: '12' },
  { value: true, time: '13' },
  { value: true, time: '14' },
  { value: true, time: '15' },
  { value: true, time: '16' },
  { value: true, time: '17' },
  { value: true, time: '18' },
  { value: true, time: '19' },
  { value: true, time: '20' },
  { value: true, time: '21' },
  { value: true, time: '22' },
  { value: true, time: '23' },
]
export const titleList = [
  { text: window.$t('detectionPeriod') },
  { text: window.$t('correctionParameters') },
  { text: window.$t('detectionPeriod') },
  { text: window.$t('correctionParameters') },
  { text: window.$t('detectionPeriod') },
  { text: window.$t('correctionParameters') },
  { text: window.$t('detectionPeriod') },
  { text: window.$t('correctionParameters') },
]
