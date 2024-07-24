import { getAllPageAuth } from '@/api/public'

export default {
  namespaced: true,
  state: () => ({
    roKeys: [],
  }),
  mutations: {
    setRoKeys(state, payload) {
      state.roKeys = payload
    },
  },
  actions: {
    async getPageAuth({ commit }) {
      commit('setRoKeys', [])
      const res = await getAllPageAuth()
      commit('setRoKeys', res.success ? res.data.roKeys : [])
    },
  },
}
