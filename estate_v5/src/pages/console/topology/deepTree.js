export const initTreeData = data => {
  // 给第3层数据添加前两级父节点的value值
  // 用于懒加载第4层数据 分别对应楼栋号，单元号，房屋号
  let arr = []
  // 递归处理数据
  function recursive(data) {
    if (data.length > 0) {
      let obj = data.map(item => {
        if (item.childs === undefined) {
        }
        let newobj = { title: item.name, expand: item.childs !== undefined, children: [], loading: false }
        arr.push(item.name)
        newobj['parentNode'] = JSON.parse(JSON.stringify(arr))
        newobj['chnlOcStatus'] = item.chnlOcStatus
        newobj['closeCount'] = item.closeCount
        newobj['isSupportOc'] = item.isSupportOc
        newobj['disabled'] = !item.isSupportOc
        newobj['openCount'] = item.openCount
        if (item.childs) {
          newobj['children'] = recursive(item.childs)
          newobj['children'] = Array.from(new Set(newobj['children']))
        }
        // 每次遍历完删除数组都会删除对应的数据
        // 例：每遍历完一条房屋号之后都会删除房号，下一条房屋号重新添加进去
        // 同理，每次遍历完一条  单元/楼栋  之后都会删除  单元号/楼栋号，  下次调用重新添加
        arr.pop()
        return newobj
      })
      return obj
    }
  }
  return recursive(data)
}
