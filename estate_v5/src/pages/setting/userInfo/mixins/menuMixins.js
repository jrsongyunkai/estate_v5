import { menuListTree, menuObjArr } from '@/menu/controlMenuSider'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      menuList: menuListTree,
      menuListArr: [...menuObjArr.values()],
    }
  },
  computed: {
    indeterminateArr() {
      const arr = this.menuList.map(it => {
        return this.isSomeChildCheck(it) && !this.isAllChildCheck(it)
      })
      return arr
    },
    checkAllArr() {
      return this.menuList.map(it => this.isAllChildCheck(it))
    },
    selectedMenus() {
      const menuTree = cloneDeep(this.menuList)
      return menuTree.map(it => {
        let children = it.children.filter(this.getFilteredMenus).map(this.getMapValueItem)
        let obj = { value: it.value, name: this.getLabelName(it.title), children: children }
        return obj
      })
    },
  },
  methods: {
    // 过滤选择的菜单包含二级菜单的选中
    getFilteredMenus(item) {
      if (item.children && item.children.length > 0) {
        return item.children.some(child => child.isChecked)
      }
      return item.isChecked
    },
    // 输入菜单数据属性
    getMapValueItem(v) {
      let child = { value: v.value, name: this.getLabelName(v.title), path: v.path }
      if (v.children && v.children.length > 0) {
        child.children = v.children.filter(ch => ch.isChecked).map(r => ({ value: r.value, name: this.getLabelName(r.title), path: r.path }))
      }
      return child
    },
    isAllChildCheck(it) {
      return it.children.every(k => {
        if (k.children && k.children.length > 0) return this.isAllChildCheck(k)
        return k.isChecked
      })
    },
    isSomeChildCheck(it) {
      return it.children.some(k => {
        if (k.children && k.children.length > 0) return this.isSomeChildCheck(k)
        return k.isChecked
      })
    },
    getLabelName(label) {
      return label.indexOf('$t:') > -1 ? this.$t(label.split('$t:')[1]) : label
    },
    checkCheckedChild(item) {
      return item.children.every(v => v.isChecked)
    },
    changeChecked(val, item) {
      item.children.forEach(it => (it.isChecked = val))
    },
    isAllCheckedChild(item) {
      return item.children.some(v => v.isChecked) && !item.children.every(v => v.isChecked)
    },
    checkedChecked(value, index) {
      this.menuList[index].children.forEach((v, i) => {
        if (index === 0 && i === 0) {
          v.isChecked = true
        } else if (v.children && v.children.length > 0) {
          v.children.forEach(it => (it.isChecked = value))
        } else {
          v.isChecked = value
        }
      })
    },
  },
}
