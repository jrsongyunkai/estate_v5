export const getTree = (arr = []) => {
  const dataFunc = (arr = []) => {
    arr.forEach(val => {
      val.title = val.name
      val.expand = false
      val.selected = false
      val.checked = false
      val.value = val.id
      if (Array.isArray(val.children) && val.children.length) {
        return dataFunc(val.children)
      } else {
        return val
      }
    })
    return arr
  }
  let aaa = dataFunc(arr)
  return aaa
}
