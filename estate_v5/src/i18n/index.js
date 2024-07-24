import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Languages from '@/i18n/locale'
import util from '@/libs/util'
// import store from '@/store/index'

// store.dispatch('admin/i18n/getLocale')
// const locale = store.state.admin.i18n.locale

Vue.use(VueI18n)

const locale = localStorage.getItem('vuex') ? JSON.parse(localStorage.getItem('vuex')).locale || 'zh-CN' : 'zh-CN'
util.cookies.set('lang', locale)
const i18n = new VueI18n({
  locale: locale,
  messages: Languages,
})

if (window) window.$t = (key, value) => i18n.t(key, value)

export default i18n
