<template>
  <div class="content">
    <div class="pie-chart" ref="chartDom"></div>
    <div class="pie-legend">
      <div class="legend-item" v-for="([code, name, _, percent], index) in dataWithPercent" :key="code || name" :style="{ '--rateBg': pieColors[index % pieColors.length] }" @click.stop="clickItemActive(index, code)" :class="{ hasActive: selectedPieIndexList.includes(index) }">
        <span class="icon-span"></span>
        <span class="name-span">{{ name }}</span>
        <span class="rate-span">({{ percent }})</span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'

  const DATA_INDEX = 6

  export default {
    props: {
      data: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        pieColors: ['#f47920', '#2a5caa', '#7fb80e', '#d71345', '#ffc20e', '#33a3dc', '#ffe600', '#45b97c', '#f3715c', '#0000FF', '#2E64FE', '#00FF80', '#FE9A2E'],
        selectedPieIndexList: [],
      }
    },
    computed: {
      dataWithPercent() {
        const total = this.data.reduce((acc, cur) => {
          const value = cur[DATA_INDEX] === '-' ? 0 : Number(cur[DATA_INDEX])
          return acc + value
        }, 0)
        const calcPercent = (v, total) => {
          if (v === null || v === '-') return '-'
          if (total === 0) return '0%'
          return `${((v / total) * 100).toFixed(2)}%`
        }
        return this.data
          .map(([code, name, ...rest]) => {
            const value = rest[DATA_INDEX - 2]
            return [code, name, value, calcPercent(value, total)]
          })
          .sort((a, b) => {
            const aValue = a[2]
            const bValue = b[2]
            if (aValue === '-' && bValue === '-') {
              return 0
            }
            if (aValue === '-') return 1
            if (bValue === '-') return -1
            return bValue - aValue
          })
      },
      options() {
        return {
          tooltip: {
            trigger: 'item',
            formatter({ data }) {
              const [, name, value, percent] = data

              return `${name} ${value} (${percent})`
            },
          },
          color: this.pieColors,
          legend: {
            show: false,
          },
          series: [
            {
              type: 'pie',
              data: this.dataWithPercent,
              encode: {
                itemName: 0,
                value: 2,
              },
              radius: [60, 100],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
            },
          ],
        }
      },
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
      this.chart && this.chart.dispose()
    },
    watch: {
      options: {
        handler(newVal) {
          this.chart && this.chart.setOption(newVal)
        },
        deep: true,
      },
    },
    methods: {
      init() {
        this.chart = echarts.init(this.$refs.chartDom)
        this.chart.setOption(this.options)
        window.addEventListener('resize', this.onResize)
      },
      onResize() {
        this.chart && this.chart.resize()
      },
      clickItemActive(index, code) {
        const fIndex = this.selectedPieIndexList.findIndex(it => it === index)
        fIndex > -1 ? this.selectedPieIndexList.splice(fIndex, 1) : this.selectedPieIndexList.push(index)
        this.chart && this.chart.dispatchAction({ type: 'legendToggleSelect', name: code })
      },
    },
  }
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    display: flex;
    .pie-chart {
      width: 240px;
      height: 100%;
    }
    .pie-legend {
      flex: 1;
      overflow: auto;
      .legend-item {
        line-height: 28px;
        height: 28px;
        width: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;
        .icon-span {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: var(--rateBg);
          margin-right: 3px;
          flex-shrink: 0;
        }
        .rate-span {
          display: inline-block;
          width: 50px;
          height: 20px;
          font-size: 12px;
          text-align: center;
          line-height: 20px;
          margin-right: 10px;
          color: #fff;
          flex-shrink: 0;
        }
        .name-span {
          display: inline-block;
          color: '#fff';
          max-width: 100%;
          margin-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .legend-item.hasActive {
        .rate-span,
        .name-span {
          color: #999;
        }
        .icon-span {
          background: #dedede;
        }
      }
    }
  }
</style>
