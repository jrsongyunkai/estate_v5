import dayjs from 'dayjs'
import { getHarmObjs, getHarmPhase } from './commonUtil'
import { retry } from '@utils/common'
export default {
  props: {
    addrInfo: { type: Object, default: () => {} },
    dateValue: { type: String, default: () => '' },
  },
  inject: ['rowDeviceInfo'],
  data() {
    return {
      deviceInfo: this.rowDeviceInfo,
      resId: this.rowDeviceInfo.resId,
      markPoint: {
        data: [
          { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], symbolSize: [65, 50], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
          { type: 'min', symbol: this.$func.echartsSymbolMin, symbolOffset: [0, -30], label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
        ],
        label: { normal: { show: true } },
      },
      colors: ['#da0024', '#f59a36', '#fefe3c', '#91f235', '#00fffe', '#0da7ed', '#1e0ffa', '#880ffa', '#6d0011', '#7b4d1a', '#7efffe', '#8381fb', '#c481fb', '#880ffa', '#bebf2a', '#feff89'],
      harmNameMap: { harm: 'Thd', ...getHarmObjs() },
      harmNameMapAll: { ...getHarmPhase('A'), ...getHarmPhase('B'), ...getHarmPhase('C') },
      phaseMapLabel: { A: this.$t('APhase'), B: this.$t('BPhase'), C: this.$t('CPhase') },
      cancelRetry: null,
      pageSize: 10,
      pageNo: 1,
    }
  },
  computed: {
    addrParams() {
      return { resId: this.rowDeviceInfo.resId, addr: this.addrInfo.addr }
    },
    objOptions() {
      return Object.entries(this.harmNameMap).map(it => ({ value: it[0], label: it[1] }))
    },
    phaseOptions() {
      return Object.entries(this.phaseMapLabel).map(it => ({ label: it[1], value: it[0] }))
    },
  },
  methods: {
    getPhaseMapData(type, data) {
      let obj = {}
      Object.entries(this.harmNameMap).forEach(it => {
        obj[it[0]] = data && data[`${it[0]}${type}`]
      })
      return obj
    },
    changeQueryParams() {
      this.cancelRetry && this.cancelRetry()
      this.cancelRetry = retry(this.init, 0, 800, false)
    },
    handleCurrentChange(e) {
      this.pageNo = e
    },
    getPostResFile(res, fileName = '') {
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(res)
      a.download = `${fileName}_${dayjs().valueOf()}.xlsx`
      a.click()
      document.body.removeChild(a)
    },
  },
  watch: {
    addrInfo: {
      handler() {
        this.changeQueryParams()
      },
      deep: true,
    },
  },
  beforeDestroy() {
    this.cancelRetry && this.cancelRetry()
  },
}
