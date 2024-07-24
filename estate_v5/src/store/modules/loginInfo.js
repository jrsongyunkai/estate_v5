export default {
  namespaced: true,
  state: () => ({
    loginPassword: null, // 登录密码
    pwdWeak: null,
    pwdExpire: null,
  }),
  mutations: {
    setPwdWeak(state, payload) {
      state.pwdWeak = payload
    },
    setPwdExpire(state, payload) {
      state.pwdExpire = payload
    },
    setLoginPassword(state, payload) {
      state.loginPassword = payload
    },
  },
}
