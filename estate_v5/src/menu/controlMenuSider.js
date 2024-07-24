// 菜单，侧边栏
import visualScreen from './modules/visualScreen'
import console from './modules/console'
import safetyMonitor from './modules/safetyMonitor'
import energyMonitor from './modules/energyMonitor'
import multiManage from './modules/multiManage'
import billingSystem from './modules/billingSystem'

export const sliderList = [visualScreen, console, safetyMonitor, energyMonitor, billingSystem, multiManage]

//  菜单与接口字段的映射关系
export const menuObjArr = new Map([
  ['console', 'zkt'],
  ['safetyMonitor', 'aq'],
  ['energyMonitor', 'nh'],
  ['billingSystem', 'jfxt'],
  ['multiManage', 'zh'],
  // ['energySaving', 'jngl'],
])

const treeMenuChildren = (tree, level = 0) => {
  return tree.map((it, index) => {
    if (index === 0 && level === 0) {
      return { ...it, label: it.title, value: it.isVisibleValue, isChecked: true, isDisabled: true }
    }
    let obj = { ...it, label: it.title, value: it.isVisibleValue, isChecked: false }
    if (it.children && obj.children.length > 0) {
      obj.children = treeMenuChildren(it.children, level + 1)
    }
    return obj
  })
}

let sliderListTemp = JSON.parse(JSON.stringify(sliderList)).filter(it => it.path !== '/visualScreen')
export const menuListTree = sliderListTemp.map((it, index) => {
  return {
    ...it,
    value: [...menuObjArr.values()][index],
    label: it.title,
    children: (it.children && treeMenuChildren(it.children, index)) || [],
  }
})
