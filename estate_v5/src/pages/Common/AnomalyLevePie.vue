<template>
  <div>
    <div ref="eChart" style="width: 100%" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'AnomalyLevePie',
    props: ['options', 'type', 'personTotal'],
    data() {
      return {
        baseStyle: { height: '230px' },
        object: {},
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        let that = this
        this.object = { colorList: [], legendData: [], text: this.personTotal, title: this.$t('totalNumberOfCaregivers'), serData: [], data: [], rich: {} }
        if (this.type === 'grade') {
          this.object.colorList = ['#0DD667', '#0097fc', '#E03C3A', '#E0E71C', '#e89039']
          this.object.rich = {
            legend: { width: 100, overflow: 'truncate' },
            legendData: { color: '#fff', padding: [1, 10, 0, 10], width: 40 },
            // 给labelMark添加样式
            labelMark1: { color: '#0DD667' },
            labelMark2: { color: '#E0E71C' },
            labelMark3: { color: '#0096FF' },
            labelMark4: { color: '#EA903A' },
            labelMark5: { color: '#E03C3A' },
          }
          if (Array.isArray(this.options) && this.options.length) {
            this.options.map(val => {
              this.object.legendData.push({ value: val.total, percentage: `${val.ratio}%` })
              this.object.serData.push({ value: val.total, name: `${val.levelName}` })
              this.object.data.push(val.levelName)
            })
          }
        } else {
          this.object.colorList = ['#0DD667', '#e0e623', '#174ffe', '#ec8f35', '#dd3e39', '#0196fa', '#dfe9fa', '#e53180']
          this.object.rich = {
            // 给labelName添加样式
            legend: { width: 60, overflow: 'truncate' },
            legendData: { color: '#fff', padding: [0, 10, 0, 10], width: 40 },
            // 给labelMark添加样式
            labelMark1: { color: '#0DD667' },
            labelMark2: { color: '#e0e623' },
            labelMark3: { color: '#174ffe' },
            labelMark4: { color: '#ec8f35' },
            labelMark5: { color: '#dd3e39' },
            labelMark6: { color: '#0196fa' },
            labelMark7: { color: '#dfe9fa' },
            labelMark8: { color: '#e53180' },
          }
          if (Array.isArray(this.options) && this.options.length) {
            this.options.map(val => {
              this.object.legendData.push({ value: val.total, percentage: `${val.ratio}%` })
              this.object.serData.push({ value: val.total, name: `${val.ageName}` })
              this.object.data.push(val.ageName)
            })
          }
        }
        const option = {
          title: [{ text: this.object.text, subtext: this.object.title, textStyle: { fontSize: 30, color: '#fff' }, subtextStyle: { fontSize: 16, color: '#999999' }, textAlign: 'center', x: '29.5%', y: '38%' }],
          color: (this.object && this.object.colorList) || [],
          legend: {
            icon: 'circle',
            itemGap: that.type === 'grade' ? 20 : 15,
            type: 'scroll',
            orient: 'vertical',
            left: '55%',
            align: 'left',
            top: 'middle',
            textStyle: { color: '#8C8C8C', rich: this.object.rich },
            height: 250,
            data: this.object.data,
            formatter(params) {
              let index = that.object.data.findIndex(v => v === params)
              if (that.type === 'grade') {
                return `{legend|${params}}{legendData|${that.object.legendData[index].percentage}}{labelMark${index + 1}|${that.object.legendData[index].value}}`
              } else {
                return `{legend|${params}}{legendData|${that.object.legendData[index].percentage}}{labelMark${index + 1}|${that.object.legendData[index].value}}`
              }
            },
          },
          series: [
            {
              name: this.$t('title'),
              type: 'pie',
              center: ['30%', '50%'],
              radius: ['80%', '70%'],
              label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '30', fontWeight: 'bold' } } },
              labelLine: { normal: { show: false } },
              data: this.object.serData,
              hoverAnimation: false,
            },
          ],
        }
        this.eChartSetOption(option)
      },
    },
    watch: {
      options: {
        handler(newVal) {
          if (newVal) {
            this.init()
          }
        },
        deep: true,
      },
      '$store.state.manageTowHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal
          }
        },
      },
    },
  }
</script>
