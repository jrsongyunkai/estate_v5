import { queryAlarmSound, saveAlarmSound, soundDel } from '@/api/public'
import { Message } from 'view-design'
import { omit, cloneDeep } from 'lodash/fp'
import { playSound, playTTSBuiltin } from '@utils/alarmPlayer'
import { Howler } from 'howler'

export const DEFAULT_SOUND_PATH = require('@/../static/audio/pelic.mp3')
export const DEFAULT_TTS_TEMPLATE = [
  { type: 'text', value: '您位于' },
  { type: 'tag', value: 'address' },
  { type: 'text', value: '的' },
  { type: 'tag', value: 'macName' },
  { type: 'tag', value: 'mac' },
  { type: 'text', value: '设备，' },
  { type: 'tag', value: 'node' },
  { type: 'text', value: '在' },
  { type: 'tag', value: 'datetime' },
  { type: 'text', value: '发生' },
  { type: 'tag', value: 'alarmInfo' },
  { type: 'text', value: '，请留意！' },
]

export default {
  namespaced: true,
  state: () => ({
    configList: [],
    snapshot: [],
    alarmFields: [
      {
        value: 'macName',
        label: window.$t('deviceAliases'),
        audition: '测试网关',
      },
      {
        value: 'mac',
        label: window.$t('deviceId'),
        audition: '98CC4D123456',
      },
      {
        value: 'node',
        label: window.$t('lineName'),
        audition: '线路01',
      },
      {
        value: 'address', // build,unit,room
        label: window.$t('equipmentLocation'),
        audition: '广东省深圳市',
      },
      {
        value: 'datetime',
        label: window.$t('alarmTime1'),
        audition: '2024-01-01 12:00:00',
      },
      {
        value: 'alarmInfo', // info or valueDescribe.cAlmCtn
        label: window.$t('alarmType1'),
        audition: '演示警情',
      },
      {
        value: 'id',
        label: window.$t('alarmId'),
        audition: '123456',
      },
      {
        value: 'projectName',
        label: window.$t('projectSource'),
        audition: '演示项目',
      },
      {
        value: 'projectCode',
        label: window.$t('projectSourceNo'),
        audition: '123456',
      },
      {
        value: 'linkman',
        label: window.$t('concatsName'),
        audition: '演示人员',
      },
      {
        value: 'linkmanTel',
        label: window.$t('concatsPhone'),
        audition: '1374893892',
      },
    ],
    currentPlaying: null,
  }),
  getters: {
    defaultConfig: state => {
      return (
        state.snapshot[0] || {
          id: 'fallback',
          path: DEFAULT_SOUND_PATH, // 声音文件路径
          playLoop: 1, // 轮播次数 默认值0
          ttsStatus: 1, // tts语音状态，0=关闭，1=开启
          ttsTemplateName: window.$t('defaultTpl'), // 语音模版名称
          ttsTemplate: DEFAULT_TTS_TEMPLATE, // 语音模版
          defaultSound: true,
          typeNumberList: [],
          isEdit: false,
        }
      )
    },
    getConfig: (state, getters) => alarmType => {
      const config = state.snapshot.find(item => item.typeNumberList.find(t => t.typeNumber === alarmType))

      return config || getters.defaultConfig
    },
    alarmAuditionMap: state => {
      return state.alarmFields.reduce((map, item) => {
        map[item.value] = item.audition
        return map
      }, {})
    },
    getTemplateText:
      (_, getters) =>
      (template, context = getters.alarmAuditionMap) => {
        return template.map(({ type, value }) => (type === 'text' ? value : context[value])).join('')
      },
    allCheckedAlarmNumber: state => {
      return state.snapshot.flatMap(cfg => cfg.typeNumberList.map(t => t.typeNumber))
    },
    alarmFieldMap: state => {
      return state.alarmFields.reduce((map, item) => {
        map[item.value] = item.label
        return map
      }, {})
    },
  },
  mutations: {
    updateSnapshot(state) {
      state.snapshot = cloneDeep(state.configList)
    },
    setConfigList(state, list) {
      state.configList = list
    },
    addConfig(state) {
      const lastConfig = state.configList.at(-1)
      if (lastConfig.id === null) return
      state.configList.push({
        id: null,
        path: '', // 声音文件路径
        playLoop: 1, // 轮播次数 默认值0
        ttsStatus: 1, // tts语音状态，0=关闭，1=开启
        ttsTemplateName: '', // 语音模版名称
        ttsTemplate: [], // 语音模版
        defaultSound: false,
        typeNumberList: [],
        isEdit: true,
      })
    },
    updateConfig(state, { index, cfg }) {
      state.configList.splice(index, 1, cfg)
    },
    removeConfig(state, index) {
      state.configList.splice(index, 1)
    },
    setCurrentPlaying(state, payload) {
      state.currentPlaying = payload
    },
  },
  actions: {
    async getConfigList({ commit }) {
      const { success, message, data } = await queryAlarmSound()
      if (!success) return Message.error(message)
      const list = data
        .map(({ defaultSound, id, path = '', playLoop = 1, ttsStatus = 1, ttsTemplateName = '', ttsTemplate, typeNumberList = [] }) => {
          return {
            isEdit: false,
            defaultSound,
            id,
            path: defaultSound ? DEFAULT_SOUND_PATH : path,
            playLoop,
            ttsStatus,
            ttsTemplateName,
            ttsTemplate: defaultSound ? DEFAULT_TTS_TEMPLATE : ttsTemplate ? JSON.parse(ttsTemplate) : [],
            typeNumberList,
          }
        })
        .sort((a, b) => (a.defaultSound ? -1 : 0))
      commit('setConfigList', list)
      commit('updateSnapshot')
    },
    async saveConfig({ dispatch, commit }, item) {
      const omitFields = item.id === null ? ['id', 'isEdit'] : ['isEdit']
      const { success, message } = await saveAlarmSound({
        ...omit(omitFields, item),
        typeNumberList: item.typeNumberList.map(item => item.typeNumber),
        ttsTemplate: JSON.stringify(item.ttsTemplate),
      })
      if (!success) return Message.error(message)
      item.isEdit = false
      await dispatch('getConfigList')
    },
    async deleteConfig({ commit, dispatch }, index) {
      const item = this.state.alarmSound.configList[index]
      const { success, message } = await soundDel({ id: item.id })
      if (!success) return Message.error(message)
      await dispatch('getConfigList')
    },
    stopSound({ commit }) {
      commit('setCurrentPlaying', null)
      speechSynthesis.cancel()
      Howler.stop()
      Howler.unload()
    },
    async playSound({ dispatch, commit }, { id, type, srcOrText }) {
      await dispatch('stopSound')
      commit('setCurrentPlaying', `${id}-${type}`)
      if (type === 'url') {
        await playSound(srcOrText)
      } else if (type === 'tts') {
        await playTTSBuiltin(srcOrText)
      }
      commit('setCurrentPlaying', null)
    },
  },
}
