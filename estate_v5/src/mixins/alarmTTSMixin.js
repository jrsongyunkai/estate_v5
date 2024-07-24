import { AlarmPlayer } from '@utils/alarmPlayer'
import { mapGetters } from 'vuex'

export default {
  mounted() {
    this.initAlarmReader()
  },
  beforeDestroy() {
    this.destroyedAlarmReader()
  },
  computed: {
    ...mapGetters('alarmSound', ['getConfig', 'getTemplateText']),
  },
  methods: {
    initAlarmReader() {
      this.alarmPlayer = new AlarmPlayer()
      window.addEventListener('onmessageWS', this.onAlarmMessage)
    },
    onAlarmModalVisibleChange(visible) {
      if (!visible) {
        this.alarmPlayer.clear()
      }
    },
    destroyedAlarmReader() {
      this.alarmPlayer.clear()
      window.removeEventListener('onmessageWS', this.onAlarmMessage)
    },
    onAlarmMessage(e) {
      if (!e.detail.data) return
      const res = JSON.parse(e.detail.data)
      if (!res.data) return
      const { msgType, dataList } = res.data
      if (msgType !== 1) return
      if (this.$store.state.muted) return
      dataList.forEach(async item => {
        // 自定义报警 主报警 子报警，自定义报警为数字，其余为字符串
        const { mainTypeNo, typeNo, valueDescribe } = item
        const alarmType = this.isCustomAlarm(typeNo) ? valueDescribe.cAlmId : mainTypeNo === 0 ? typeNo.toString() : mainTypeNo.toString()
        const { path, playLoop, ttsStatus, ttsTemplate } = this.getConfig(alarmType)
        const ringCfg = path ? { soundSrc: path, loop: playLoop } : null
        const context = this.getTemplateContext(item)
        const text = ttsStatus === 1 ? this.getTemplateText(ttsTemplate, context) : null
        this.alarmPlayer.add(ringCfg, text)
      })
    },
    getTemplateContext({ status, typeNo, build, unit, room, macName, mac, node, datetime, info, id, projectName, projectCode, linkman, linkmanTel, valueDescribe }) {
      const address = !build && !unit && !room ? this.$t('unknownLocation') : `${build},${unit},${room}`
      const alarmInfo = `${status ? '' : this.$t('rescission')}${this.isCustomAlarm(typeNo) ? valueDescribe.cAlmCtn : info}`
      return {
        macName,
        mac,
        node,
        address,
        datetime,
        alarmInfo,
        id,
        projectName,
        projectCode,
        linkman,
        linkmanTel,
      }
    },
    isCustomAlarm(typeNo) {
      // 1015 为自定义报警类型
      return typeNo === 1015
    },
    msgTemplateFactory({ build, unit, room, mac, node, datetime, info }) {
      const address = !build && !unit && !room ? this.$t('unknownLocation') : `${build},${unit},${room}`
      return this.$t('alarmInfoTpl', { address, mac, node, datetime, info })
    },
  },
}
