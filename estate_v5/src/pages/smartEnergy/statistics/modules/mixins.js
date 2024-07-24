import { cloneDeep } from 'lodash'
import { MONTHS, WEEKS } from '@/untils/configuration'
export default {
  data() {
    return {
      isFold: false,
      initTimeValue: {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM-01'),
        dateValueText: this.$Date().format('YYYY-MM'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        dateValueComparison: '',
        dateValueComparisonText: '',
        dataRangeComparison: ['', ''],
      },
      timeValue: {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM-01'),
        dateValueText: this.$Date().format('YYYY-MM'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        dateValueComparison: '',
        dateValueComparisonText: '',
        dataRangeComparison: ['', ''],
      },
      levelRange: 'month',
      searchMarkPoint: {
        data: [
          { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ee4c4f' } },
          { type: 'min', symbol: this.$func.echartsSymbolMin, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#02b085' } },
        ],
      },
      xAxisData: [],
      seriesData: [
        // { name: '2021-10-12', data: [820, 932, 300, 934, 1290, 1330, 1320] },
        // { name: '2021-10-13', data: [820, 334, 566, 895, 234, 24, 455] },
      ],
      trendLabelMarksNamePrefix: { date: this.$t('day'), year: this.$t('year'), quarter: this.$t('season'), month: this.$t('month'), week: this.$t('week') },
      levelRangeMap: { date: '2', month: '3', year: '4', quarter: '6', week: '5' },
      trendLabelMarksLabel: {
        max: { value: 0, time: '' },
        min: { value: 0, time: '' },
        average: 0,
      },
      columnNameMap: { date: this.$t('dailyProportion'), year: this.$t('annualProportion'), quarter: this.$t('quarterlyProportion'), month: this.$t('monthlyProportion'), week: this.$t('weeklyProportion') },
      handSeriesDataTrendLabel: {
        date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
        year: index => `${(index + 1).toString().padStart(2, '0')}`,
        month: index => `${(index + 1).toString().padStart(2, '0')}`,
        quarter: index => [this.$t('firstMonth'), this.$t('secondMonth'), this.$t('thirdMonth')][index],
        week: index => WEEKS[index],
      },
      handSeriesData: {
        date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
        year: index => MONTHS[index],
        month: index => this.$t('numberThValue', { num: (index + 1).toString() }),
        quarter: index => [this.$t('firstMonth'), this.$t('secondMonth'), this.$t('thirdMonth')][index],
        week: index => WEEKS[index],
      },
      tableData: [],
      chart: null,
      trendTimeValue: null,
    }
  },
  methods: {
    changeFold() {
      this.isFold = !this.isFold
    },
    search() {},
    reset() {
      this.timeValue = cloneDeep(this.initTimeValue)
      this.search()
    },
    // 查询条件修改
    clickNode(e) {
      this.queryParams.mac = e.mac || null
      this.queryParams.addr = e.addr || null
      this.queryParams.provinceName = e.provinceName || null
      this.queryParams.cityName = e.cityName || null
      this.queryParams.countyName = e.countyName || null
      this.queryParams.groupId = e.groupId || null
      this.queryParams.nodeId = e.nodeId || null
      this.queryParams.statType = e.statType || null
      if (!e.mac && e.statType === 1) {
        this.timeValue = cloneDeep(this.initTimeValue)
      }
      this.$nextTick(() => {
        this.$refs.rightTopColModule && this.$refs.rightTopColModule.getTopColSpanData()
        this.search()
      })
    },
    drawChart() {
      const { unit } = this.energyTipsMap[this.energyType - 1]
      let options = {
        color: ['#00FFFF', '#0da7ed'],
        tooltip: { show: true, trigger: 'axis' },
        grid: { left: '6%', right: 30, top: '20%', bottom: 30 },
        legend: { show: true, right: 30, top: 0, textStyle: { color: '#fff' } },
        xAxis: { type: 'category', boundaryGap: true, axisTick: { show: true, alignWithLabel: true }, axisLine: { lineStyle: { color: '#fff' } }, data: this.xAxisData },
        yAxis: { type: 'value', name: this.$t('unitLabelWithValue', { unit }), axisLine: { lineStyle: { color: '#fff' } }, splitLine: { lineStyle: { type: 'dashed', color: ['#666'] } } },
        series: this.seriesData.map(it => ({
          ...it,
          type: 'line',
          smooth: true,
          itemStyle: { opacity: 0 },
          markPoint: this.searchMarkPoint,
        })),
      }
      this.chart && this.chart.setOption(options, true)
      this.chart && this.chart.hideLoading()
    },
    handleUrge(id) {
      this.$emit('handleUrge', id)
    },
    queryMaintenance(row) {
      this.$emit('handleMaintenance', row)
    },
    resize() {
      this.chart && this.chart.resize()
    },
  },
  beforeDestroy() {
    this.chart && this.chart.dispose()
    this.chart = null
  },
}
