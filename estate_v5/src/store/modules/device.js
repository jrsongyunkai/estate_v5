export default {
  namespaced: true,
  state: {
    currentAddr: null,
  },
  actions: {},
  mutations: {
    setDeviceAddr(state, value) {
      state.currentAddr = value
    },
  },
}
