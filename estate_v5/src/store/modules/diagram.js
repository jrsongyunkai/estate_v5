import { diagramIndexedDB } from '@/plugins/indexDB/index'
export default {
  namespaced: true,
  state: {
    // 绘制配电图
    editorScale: 100,
    oftenIcons: [],
    editorActiveType: 0,
    currentPen: {},
    currentPenRect: {},
    editDiagram: {},
    activePenIds: [],
  },
  actions: {},
  mutations: {
    setEditorScale(state, value) {
      state.editorScale = value
    },
    setEditorActiveType(state, type) {
      state.editorActiveType = type
    },
    setCurrentPen(state, value) {
      state.currentPen = value
    },
    setCurrentPenRect(state, value) {
      state.currentPenRect = value
    },
    setEditDiagram(state, value) {
      state.editDiagram = value
    },
    setOftenIcons(state, value) {
      state.oftenIcons = value
    },
    addOftenIcon(state, icon) {
      const iconArr = state.oftenIcons
      const index = iconArr.findIndex(item => {
        return item.name === icon.name
      })
      if (index > -1) {
        iconArr.splice(index, 1)
      }
      const newLength = iconArr.unshift(icon)
      if (newLength > 8) {
        iconArr.splice(8, 1)
      }
      diagramIndexedDB.setItem('oftenIcons', iconArr)
    },
    setActivePens(state, value) {
      state.activePenIds = value
    },
  },
}
