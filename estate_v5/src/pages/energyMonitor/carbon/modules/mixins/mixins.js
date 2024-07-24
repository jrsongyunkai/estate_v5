import { MONTHS } from '@/untils/configuration'
export default {
  data() {
    return {
      isFold: false,
      echarts: null,
      pieEchart: null,
      timeValue: {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM'),
        dateValueText: this.$Date().format('YYYY-MM'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
      },
      timeTypeMap: { year: 0, month: 1, date: 2 },
      pieColors: ['#5A8CF8', '#68CABA', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
      handSeriesData: {
        date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
        year: index => MONTHS[index],
        month: index => this.$t('numberThValue', { num: (index + 1).toString() }),
      },
      markPoint: {
        data: [
          { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 10, align: 'center', offset: [0, -17], padding: [0, 5, 33, 5], color: '#ee4c4f' } },
          { type: 'min', symbol: this.$func.echartsSymbolMin, symbolOffset: [0, -30], label: { fontSize: 10, align: 'center', offset: [0, -17], padding: [0, 5, 33, 5], color: '#02b085' } },
        ],
        label: { normal: { show: true } },
      },
      inverseMarkPoint: {
        data: [
          { type: 'min', symbol: this.$func.echartsSymbolMaxInverse, symbolRotate: 180, symbolOffset: [0, 30], label: { fontSize: 10, align: 'center', offset: [0, 7], padding: [0, 5, 33, 5], color: '#ee4c4f', formatter: ({ value }) => Math.abs(value) } },
          { type: 'max', symbol: this.$func.echartsSymbolMinInverse, symbolRotate: 180, symbolOffset: [0, 30], label: { fontSize: 10, align: 'center', offset: [0, 7], padding: [0, 5, 33, 5], color: '#02b085', formatter: ({ value }) => Math.abs(value) } },
        ],
        label: { normal: { show: true } },
      },
      queryParams: { statType: 1, groupId: null, nodeId: null, mac: null, addr: null, cityName: '', countyName: '', provinceName: '' },
      carbonTopInfo: null,
      carbonTopInfoQuery: { levelRange: 'month' },
      rateMode: 1,
      selectedPieIndexList: [],
      trendTimeValue: null,
      randomKey: null,
      columnsSpanList: [],
      carbonRatios: [],
      carbonRatiosQuery: { levelRange: 'month' },
      tableData: [],
      tableDataRate: [],
    }
  },
  computed: {
    topColMapData() {
      const { current, previousYear, lastCycle } = this.carbonTopInfo || { current: null, previousYear: null, lastCycle: null }
      const lastTitle = this.carbonTopInfoQuery.levelRange === 'year' ? this.$t('previousYearCarbonEmissions') : this.carbonTopInfoQuery.levelRange === 'month' ? this.$t('previousMonthCarbonEmissions') : this.$t('previousDayCarbonEmissions')
      return [
        { title: `${this.$t('carbonEmissions')}(kgCO₂)`, num: (current && current.data) || 0, yoy: (current && current.yoy) || 0, qoq: (current && current.qoq) || 0, image: require('@/assets/images/carbon-top1.png') },
        { title: `${this.$t('carbonEmissionsDuringSamePeriodLastYear')}(kgCO₂)`, num: (previousYear && previousYear.data) || 0, image: require('@/assets/images/carbon-top3.png') },
        { title: `${lastTitle}(kgCO₂)`, num: (lastCycle && lastCycle.data) || 0, image: require('@/assets/images/carbon-top2.png') },
      ]
    },
    seriesData() {
      return this.carbonRatios.map((it, index) => ({
        name: this.handSeriesData[this.timeValue.levelRange](index),
        value: this.rateMode === 1 ? it['statData']['percent'] : it['saveData']['percent'],
      }))
    },
    columnsRate() {
      let { levelRange } = this.carbonRatiosQuery
      let title1 = levelRange === 'year' ? this.$t('annualProportionCarbonEmissions') : levelRange === 'month' ? this.$t('monthProportionCarbonEmissions') : this.$t('dayProportionCarbonEmissions')
      let title2 = levelRange === 'year' ? this.$t('annualProportionCarbonSaving') : levelRange === 'month' ? this.$t('monthProportionCarbonSaving') : this.$t('dayProportionCarbonSaving')
      return [
        { title: this.$t('category'), key: 'category', minWidth: 120, fixed: 'left', align: 'center' },
        ...this.carbonRatios.map((it, index) => ({
          title: this.handSeriesData[this.timeValue.levelRange](index),
          align: 'center',
          children: [
            { title: title1, key: `${index}`, minWidth: 140, align: 'center', slot: 'carbonRatio' },
            { title: title2, key: `${index}`, minWidth: 140, align: 'center', slot: 'savingRatio' },
          ],
        })),
      ]
    },
    columns() {
      return [
        { title: this.$t('category'), key: 'category', width: 150, fixed: 'left', align: 'center' },
        ...this.columnsSpanList,
        {
          title: this.$t('totalCarbonEmissions3'),
          align: 'center',
          fixed: 'right',
          children: [
            { title: `${this.$t('totalCarbonEmissions3')}(kgCO₂)`, fixed: 'right', key: 'carbonTotal', minWidth: 200, align: 'center' },
            { title: `${this.$t('totalCarbonSaving1')}(kgCO₂)`, fixed: 'right', key: 'carbonSavingTotal', minWidth: 200, align: 'center' },
          ],
        },
      ]
    },
  },
  methods: {
    changeFold() {
      this.isFold = !this.isFold
    },
    resetTime() {
      this.timeValue = {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM'),
        dateValueText: this.$Date().format('YYYY-MM'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
      }
      this.queryInit()
    },
    clickItemActive(index, item) {
      const fIndex = this.selectedPieIndexList.findIndex(it => it === index)
      const { name } = item
      fIndex > -1 ? this.selectedPieIndexList.splice(fIndex, 1) : this.selectedPieIndexList.push(index)
      this.pieEchart && this.pieEchart.dispatchAction({ type: 'legendToggleSelect', name })
    },
    echartResize() {
      this.echarts && this.echarts.resize()
      this.pieEchart && this.pieEchart.resize()
    },
    pieEchartSetOption() {
      let option = {
        color: this.pieColors,
        tooltip: {
          show: true,
          confine: true,
          appendToBody: true,
          formatter: '{b}: {c}%',
          textStyle: { color: '#fff' },
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderWidth: 0,
        },
        legend: {
          show: false,
          type: 'scroll',
          orient: 'vertical',
          right: 0,
          tooltip: { show: true },
          icon: 'none',
          textStyle: {
            color: '#fff',
            rich: {
              rate: { fontSize: 12, height: 17, lineHeight: 20, width: 38, color: '#fff', align: 'center', verticalAlign: 'top', borderRadius: 9, backgroundColor: 'red' },
            },
          },
        },
        series: [
          {
            type: 'pie',
            label: { show: false },
            center: '50%',
            radius: ['55%', '80%'],
            percentPrecision: 0,
            emphasis: { scaleSize: 15, itemStyle: { borderWidth: 0 } },
            itemStyle: { borderRadius: 0, borderWidth: 0, borderColor: '#fff' },
            data: [...this.seriesData.sort((a, b) => b.value - a.value)],
          },
        ],
      }
      this.pieEchart && this.pieEchart.setOption(option)
    },
    getSumTypeValue(data, type = 'statData') {
      let sum = (data && data.reduce((sum, item) => sum + +item[type].data, 0)) || 0
      return sum ? sum.toFixed(3) : '0.000'
    },
  },
  mounted() {},
  destroyed() {
    this.echarts && this.echarts.dispose()
    this.pieEchart && this.pieEchart.dispose()
    window.removeEventListener('resize', this.echartResize)
  },
  watch: {
    seriesData: {
      handler(value) {
        this.pieEchartSetOption()
      },
      deep: true,
    },
  },
}
