import uuid from 'uuid/v1'
import echarts from 'echarts'
export default {
  data() {
    return {
      eChart: null,
      uniqueID: '',
    }
  },
  created() {
    this.uniqueID = uuid()
  },
  mounted() {
    this.eChart = echarts.init(this.$refs.eChart || document.getElementById(this.uniqueID))
    window.addEventListener('resize', this.eChartResize)
    this.init()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.eChartResize)
    this.eChart && this.eChart.dispose()
    this.eChart = null
  },
  methods: {
    init() {},
    eChartResize() {
      this.eChart && this.eChart.resize()
    },
    eChartSetOption(option) {
      this.eChart && this.eChart.clear()
      this.eChart && this.eChart.setOption(option, true)
    },
  },
}
