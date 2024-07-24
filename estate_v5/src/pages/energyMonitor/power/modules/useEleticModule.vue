<template>
  <div class="use-eletic">
    <Col :span="24">
      <div class="pd content" style="background-color: #1a202e; padding: 15px; border-radius: 4px">
        <div style="display: flex; justify-content: space-between">
          <Col style="margin-left: 40px">
            <h3 style="margin-left: -40px">{{ $t('eachMonthPower') }}</h3>
          </Col>
          <div style="display: flex">
            <div class="active active1"></div>
            <h6>{{ new Date().getFullYear() - 1 }}</h6>
            <div class="active active2"></div>
            <h6>{{ new Date().getFullYear() }}</h6>
          </div>
        </div>
        <BarCharts :options="optionsFirst"></BarCharts>
      </div>
    </Col>
    <Row style="margin-top: 10px" :gutter="5">
      <Col :span="12">
        <div class="pd content" style="background-color: #1a202e; padding: 15px; border-radius: 4px">
          <LineCharts :options="optionsSecond"></LineCharts>
        </div>
      </Col>
      <Col :span="12">
        <div class="pd content" style="background-color: #1a202e; padding: 15px; border-radius: 4px">
          <BarCharts :options="optionsThird"></BarCharts>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { getLoadYears } from '@/api/console/project'
  import BarCharts from '../Bars.vue'
  import LineCharts from '../eleclines.vue'
  export default {
    data() {
      return {
        gauge: true,
        firstCommand: '',
        powerHeight: {},
        powerTableHeight: {
          height: window.innerHeight < 969 ? 969 - 225 + 'px' : window.innerHeight - 225 + 'px',
        },
        groupTableHeight: {
          height: window.innerHeight < 969 ? 969 - 388 + 'px' : window.innerHeight - 388 + 'px',
        },
        optionsFirst: {
          legendStatus: true,
          legend: [],
          series: [],
          xAxis: [],
          title: { show: true, text: '', left: 0 },
          tooltip: { show: true, trigger: 'axis', formatter: '{b}<br/>{a0}' + this.$t('year') + '：{c0} ' + this.$t('kilowattHour') + '<br/>{a1}' + this.$t('year') + '：{c1} ' + this.$t('kilowattHour') },
        },
        optionsSecond: {
          series: [],
          xAxis: [],
          title: { show: true, text: this.$t('yearOnYearPower2') },
        },
        optionsThird: {
          legendStatus: false,
          xAxisType: 'value',
          yAxisType: 'category',
          xAxis: [{ max: null }],
          series: [],
          title: { show: true, text: '', padding: 2 },
          tooltip: { show: false, trigger: '', formatter: '' },
        },
      }
    },
    components: {
      BarCharts,
      LineCharts,
    },
    mounted() {
      this.initCharts()
    },
    methods: {
      async initCharts() {
        this.optionsFirst.series = []
        this.optionsFirst.xAxis = []
        this.optionsSecond.series = []
        this.optionsSecond.xAxis = []
        let params = { projectCode: this.$store.state.projectCode }
        let that = this
        const res = await getLoadYears(params)
        if (res.success) {
          let year = [new Date().getFullYear() - 1, new Date().getFullYear()]
          let month = new Date().getMonth() + 1
          let bardata = { lastyear: [], thisyear: [] }
          let bardata2 = { value: [0, 0] }
          let value = 0
          let linedata = { value: [] }
          this.optionsFirst.legend = year
          this.optionsFirst.xAxis = [
            that.$t('January'),
            that.$t('February'),
            that.$t('March'),
            that.$t('April'),
            that.$t('May'),
            that.$t('June'),
            that.$t('July'),
            that.$t('August'),
            that.$t('September'),
            that.$t('October'),
            that.$t('November'),
            that.$t('December'),
          ]
          this.optionsSecond.xAxis = this.optionsFirst.xAxis.slice(0, month)
          res.data.forEach(function (v, i) {
            if (v.prePower === '-' || v.prePower === '0.000') {
              v.prePower = 0.0
            }
            if (v.afterPower === '-' || v.afterPower === '0.00') {
              v.afterPower = 0.0
            }
            bardata.lastyear[i] = v.prePower
            bardata.thisyear[i] = v.afterPower
            linedata.value[i] = Math.abs(v.afterPower === '-' ? '0' : v.prePower === 0 ? (v.afterPower === 0 ? 0 : '0') : ((v.afterPower - v.prePower) / v.prePower).toFixed(1))
            if (i < month) {
              bardata2.value[0] += Number(v.afterPower) === '-' ? 0 : Number(v.afterPower)
              bardata2.value[1] += Number(v.prePower)
            }
          })

          // '用电量对比去年{monthRange}月多出{value}度' powerCompareTitle1
          // '用电量对比去年{monthRange}月节约{value}%' powerCompareTitle2
          // '用电量对比去年{monthRange}月超出{value}%' powerCompareTitle3
          // '用电量对比去年{monthRange}月持平' powerCompareTitle4
          const monthRange = month <= 1 ? '1' : `1-${month}`
          if (bardata2.value[1] === 0) {
            value = bardata2.value[0].toFixed(1)
            this.optionsThird.title.text = this.$t('powerCompareTitle1', { monthRange, value })
          } else {
            value = Math.abs((((bardata2.value[0] - bardata2.value[1]) / bardata2.value[1]) * 100).toFixed(1))
            if (bardata2.value[0] - bardata2.value[1] < 0) {
              this.optionsThird.title.text = this.$t('powerCompareTitle2', { monthRange, value })
            } else if (bardata2.value[0] - bardata2.value[1] > 0) {
              this.optionsThird.title.text = this.$t('powerCompareTitle3', { monthRange, value })
            } else {
              this.optionsThird.title.text = this.$t('powerCompareTitle4', { monthRange, value })
            }
          }
          this.optionsThird.xAxis.max = bardata2.value[0] > bardata2.value[1] ? bardata2.value[0] * 1.2 : bardata2.value[1] * 1.2
          this.optionsFirst.series.push({
            name: year[0],
            type: 'bar',
            barWidth: '20%',
            data: bardata.lastyear,
            itemStyle: {
              emphasis: { barBorderRadius: 0 },
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 1, color: '#21F27F' },
                  { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                ]),
                barBorderRadius: 0,
              },
            },
          })
          this.optionsFirst.series.push({
            name: year[1],
            type: 'bar',
            barWidth: '20%',
            data: bardata.thisyear,
            itemStyle: {
              emphasis: { barBorderRadius: 0 },
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 1, color: '#007EFF' },
                  { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                ]),
                barBorderRadius: 0,
              },
            },
          })

          if (this.$func.isSameArray(bardata.lastyear)) {
            this.optionsFirst.series[0].markPoint = {
              data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
              normal: { show: true },
            }
          } else {
            this.optionsFirst.series[0].markPoint = {
              data: [
                { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
              ],
              label: {
                normal: { show: true },
              },
            }
          }
          if (this.$func.isSameArray(bardata.thisyear)) {
            this.optionsFirst.series[1].markPoint = {
              data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
              normal: { show: true },
            }
          } else {
            this.optionsFirst.series[1].markPoint = {
              data: [
                { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
              ],
              label: {
                normal: { show: true },
              },
            }
          }
          this.optionsSecond.series = {
            name: this.$t('yearOnYearPower3'),
            type: 'line',
            smooth: true,
            data: linedata.value,
            itemStyle: { normal: { color: '#007EFF' } },
            symbol: 'emptyCircle',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                  { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                ],
                global: false,
              },
            },
          }
          if (this.$func.isSameArray(linedata.value)) {
            this.optionsSecond.series.markPoint = {
              data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
              normal: { show: true },
            }
          } else {
            this.optionsSecond.series.markPoint = {
              data: [
                { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
              ],
              label: { normal: { show: true } },
            }
          }
          this.optionsThird.series = {
            type: 'bar',
            barMaxWidth: 10,
            data: bardata2.value,
            itemStyle: {
              emphasis: { barBorderRadius: 0 },
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 1, color: '#007EFF' },
                  { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                ]),
                barBorderRadius: 0,
                label: { show: true, position: 'right', textStyle: { color: '#fff' } },
              },
            },
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .use-eletic {
    height: calc(~'100vh - 211px');
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .active {
      width: 10px;
      height: 10px;
      margin-top: 3px;
      margin-right: 5px;
    }
    .active1 {
      margin-left: 40px;
      background: #0dd667;
    }
    .active2 {
      background: #1c57ff;
      margin-left: 35px;
    }
  }
</style>
