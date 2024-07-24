export default {
  namespaced: true,
  state: {
    loadOverflowTableFirst: true, // 是否初次加载表格溢出横向滚动提示
    loadZoomPageFirst: true, // 是否初次加载缩放页面操作提示
  },
  actions: {},
  mutations: {
    setLoadOverflowTableFirst(state, value) {
      state.loadOverflowTableFirst = value
    },
    setLoadZoomPageFirst(state, value) {
      state.loadZoomPageFirst = value
    },
  },
}
