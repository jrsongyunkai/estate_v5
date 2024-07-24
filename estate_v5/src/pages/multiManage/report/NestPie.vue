<template>
  <div>
    <div :id="uniqueID" :style="baseStyle" style="width: '100%'"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'nest-pie-chart',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
      height: {
        type: [Number, String],
        default: 324,
      },
      legendPos: {
        type: Object,
        default: () => {
          return { left: '20%', right: 'auto', top: 'auto', bottom: 'auto' }
        },
      },
    },
    data() {
      return {
        uniqueID: '',
        legendLeft: '20%',
        baseStyle: {
          height: `${this.height}px`,
        },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        const options = {
          tooltip: {},
          legend: {
            // type: 'scroll',
            orient: 'vertical',
            align: 'left',
            ...this.legendPos,
            icon: 'circle',
            itemHeight: '10',
            textStyle: { color: '#000' },
            data: this.options.legend.data,
          },
          color: ['#f47920', '#2a5caa', '#7fb80e', '#d71345', '#ffc20e', '#33a3dc', '#ffe600', '#45b97c', '#f3715c', '#0000FF', '#2E64FE', '#00FF80', '#FE9A2E'],
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options.series = newVal.series
            this.init()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .nest-pie {
    width: 100%;
  }
</style>
