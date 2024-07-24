export default {
  namespaced: true,
  state: () => ({
    firstEnter: true,
    version: 'old',
    triggerMode: '1',
  }),
  mutations: {
    setFirstEnter(state, payload) {
      state.firstEnter = payload
    },
    setVersion(state, payload) {
      state.version = payload
    },
    setTriggerMode(state, payload) {
      state.triggerMode = payload
    },
  },
}
