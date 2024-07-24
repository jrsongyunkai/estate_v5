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
    },
    mixins: [eChartMixins],
    data() {
      return {
        echart: '',
        uniqueID: '',
        legendLeft: '70%',
        baseStyle: {
          height: this.$store.state.heightOne + 40 + 'px',
        },
      }
    },
    methods: {
      init() {
        let _this = this
        if (document.documentElement.clientWidth > 1920) {
          this.legendLeft = '45%'
          this.fontSize = '12'
        } else {
          this.legendLeft = '45%'
          this.fontSize = '11'
        }
        const options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}',
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            align: 'left',
            top: '7%',
            left: this.legendLeft,
            icon: 'circle',
            itemHeight: '10',
            textStyle: {
              fontSize: this.fontSize,
              color: '#fff',
            },
            y: 'center',
            data: this.options.legend.data,
          },
          color: ['#f47920', '#2a5caa', '#7fb80e', '#d71345', '#ffc20e', '#33a3dc', '#ffe600', '#45b97c', '#f3715c', '#0000FF', '#2E64FE', '#00FF80', '#FE9A2E'],
          series: this.options.series,
        }
        this.eChartSetOption(options)
        this.eChart.off('legendselectchanged')
        this.eChart.on('legendselectchanged', function (params) {
          _this.options.series[0].data.forEach((v, i) => {
            if (v.name === params.name) {
              if (v.tno === 3) {
                _this.handleQuantity(v.tno + ',' + '4')
              } else if (v.tno === 17) {
                _this.handleQuantity(v.tno + ',' + '18' + ',' + '19')
              } else {
                _this.handleQuantity(v.tno)
              }
              _this.eChart.dispatchAction({
                type: 'legendSelect',
                name: params.name,
              })
            }
          })
        })
      },
      handleQuantity(type) {
        this.$router.push({
          name: 'Alarm',
          params: {
            projectCode: this.$store.state.projectCode,
            typeNumber: type.toString(),
            status: '',
            oqp2: this.$route.path === '/Home' ? 2 : '',
          },
        })
      },
      eChartResize() {
        if (document.getElementById(this.uniqueID)) document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
        // if (document.getElementById(_this.uniqueID)) document.getElementById(_this.uniqueID).style.height = (window.innerHeight * 0.2083333 - 22) + 'px'
        this.eChart && this.eChart.resize()
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
      '$store.state.heightOne': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal + 'px'
          }
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  .nest-pie {
    width: 100%;
  }

  .device-table {
    .el-table,
    .el-table__expanded-cell,
    .el-table {
      th,
      .el-table {
        tr {
          background-color: transparent;
          color: #909399;
        }
      }
    }
    .el-table,
    .el-table {
      th,
      .el-table {
        td {
          border: 1px solid #ebeef5;
        }
      }
    }
    .el-table {
      td,
      .el-table {
        th.is-leaf {
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background-color: #ebeef5;
    }

    .block {
      .el-pagination__total,
      .el-pagination__jump {
        color: #909399;
      }
    }
  }
</style>
