<template>
  <div>
    <div ref="eChart" class="GenderPie" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'GenderPie',
    props: ['options'],
    data() {
      return {
        baseStyle: { height: '230px' },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        let data = []
        let sex = []
        if (Array.isArray(this.options) && this.options.length) {
          this.options.map(val => {
            data.push({ value: val.total <= 0 ? '' : val.total, name: val.name })
            sex.push(val.name)
          })
        }
        const option = {
          legend: {
            itemGap: 30,
            orient: 'vartical',
            x: 'left',
            top: 'center',
            left: '70%',
            bottom: '0%',
            icon: 'circle',
            textStyle: {
              color: '#8C8C8C',
              rich: {
                legendData1: { color: '#0097fc', padding: [1, 20, 0, 20] },
                legendData2: { color: '#ea8e3b', padding: [1, 20, 0, 20] },
                legendData3: { color: '#e1e9fa', padding: [1, 20, 0, 20] },
              },
            },
            data: sex,
            formatter(params) {
              let index = sex.findIndex(v => v === params)
              return `${params}{legendData${index + 1}|${data[index].value === '' ? 0 : data[index].value}}`
            },
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              center: ['30%', '50%'],
              radius: ['00%', '80%'],
              color: ['#0097ff', '#e8903a', '#e1e9fa'],
              itemStyle: { normal: { borderColor: '#1b1f2e', borderWidth: 2 } },
              label: { normal: { position: 'inner', formatter: `{d}%\n\n{b}`, textStyle: { color: '#fff', fontWeight: 'bold', fontSize: 14 } } },
              labelLine: { normal: { show: false } },
              data: data,
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
