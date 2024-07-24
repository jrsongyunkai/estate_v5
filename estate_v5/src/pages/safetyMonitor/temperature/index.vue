<template>
  <div>
    <warnS v-show="!showDetail" :datas="datas" @lookDeviceDetails="lookDeviceDetails" @sendPage="changePage" @sendSize="changesize" @search="search" @reset="reset" @sendDate="changeDM" @sendDates="changeDMs" @sendmacs="changemacs" @sendPages="changePages">
      <div class="typeC">
        <span>
          <div class="active active1"></div>
          <h6>{{ $t('safety') }}</h6>
        </span>
        <span>
          <div class="active active2"></div>
          <h6>{{ $t('earlyWarning') }}</h6>
        </span>
        <span>
          <div class="active active3"></div>
          <h6>{{ $t('alarm') }}</h6>
        </span>
      </div>
      <bar-chart :options="options"></bar-chart>
      <div slot="history">
        <div class="typeC">
          <span>
            <div class="active active1"></div>
            <h6>{{ $t('safety') }}</h6>
          </span>
          <span>
            <div class="active active2"></div>
            <h6>{{ $t('earlyWarning') }}</h6>
          </span>
          <span>
            <div class="active active3"></div>
            <h6>{{ $t('alarm') }}</h6>
          </span>
        </div>
        <bar-chart :options="optionss"></bar-chart>
      </div>
    </warnS>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import warnS from '@/components/seftcontrol/tem.vue'
  import { warnList, warnStates, tempOfRealtimeOrStatistic } from '@/api/safetyMonitor/temperature'
  import BarChart from '@/pages/Common/Bars'
  import echarts from 'echarts'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-temperature',
    components: {
      warnS,
      BarChart,
      detailView,
    },
    mixins: [deviceDetails],
    data() {
      return {
        datas: {
          data: [],
          tableData1: [],
          tableColumns1: [
            { title: this.$t('deviceAliases'), key: 'boxName' },
            { title: this.$t('equipmentNo'), slot: 'mac' },
            { title: this.$t('place'), key: 'address', sortable: true },
            { title: `${this.$t('lineBodyTemperature')}(℃)`, slot: 'gtList', align: 'center', width: 400 },
            { title: this.$t('operation'), slot: 'action', width: 200, align: 'center' },
          ],
          tableData1s: [],
          total: 0,
          totals: 0,
          options: {
            xAxis: [],
            series: [{ type: 'bar', barMaxWidth: '30', name: this.$t('temperatureValue'), data: [], itemStyle: { normal: { color: {}, label: { show: true, position: 'top' } } } }],
            title: { show: true, text: '' },
            tooltip: { trigger: 'item', formatter: '' },
            monitor: true,
            dateType: '',
          },
          tem: true,
        },
        params: { page: 1, rows: 10, projectCode: this.$store.state.projectCode, mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), nodeIds: '' },
        paramss: { page: 1, projectCode: this.$store.state.projectCode, mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), limit: 31 },
        options: { legendStatus: false, xAxis: [], series: [], title: { show: true, text: this.$t('temperatureConditionsFor24ours') }, nameY: `${this.$t('celsius')}（°C）`, tooltip: { show: true, trigger: '', formatter: '' } },
        optionss: { legendStatus: false, xAxis: [], series: [], title: { show: true, text: this.$t('temperatureConditionsFor24ours') }, nameY: `${this.$t('celsius')}（°C）`, tooltip: { show: true, trigger: '', formatter: '' } },
      }
    },
    methods: {
      init() {
        this.getTableData()
        this.getEchartsData()
      },
      getEchartsData() {
        let that = this
        this.$nextTick(() => {
          warnStates(this.params).then(res => {
            // 获取echarts的数据
            // 还得先清空数据
            this.options.xAxis = []
            this.options.series = []
            if (this.params.dateType === 2) {
              this.options.title.text = this.$t('temperatureConditionsForCurrentMonth')
            } else {
              this.options.title.text = this.$t('temperatureConditionsFor24ours')
            }
            if (res.success) {
              let barData = []
              this.trendData = res.data
              let value = []
              res.data.forEach(function (item, index) {
                value.push(item.number1)
                barData.push({
                  value: item.number1,
                  name: that.$t('temperatureSituation') + '(℃)',
                  type: 'bar',
                  itemStyle: { color: '' },
                })
                that.options.xAxis.push(item.time)
                if (item.number1 < 300 || item.number1 === '-') {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#87cf86' },
                  ])
                } else if (item.number1 >= 300 && item.number1 < 1500) {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#E79C27' },
                  ])
                } else {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#F26665' },
                  ])
                }
              })
              this.options.series.push({ type: 'bar', data: barData, barMaxWidth: '15', itemStyle: { normal: { color: {} } } })
              if (this.$func.isSameArray(value)) {
                this.options.series[0].markPoint = {
                  data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                  normal: { show: true },
                }
              } else {
                this.options.series[0].markPoint = {
                  data: [
                    { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                    { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                  ],
                  label: { normal: { show: true } },
                }
              }
            }
          })
        })
      },
      getEchartsDatas() {
        // let that = this;
        if (this.paramss.dateType === 2) {
          this.optionss.title.text = this.$t('temperatureConditionsForCurrentMonth')
        } else {
          this.optionss.title.text = this.$t('temperatureConditionsFor24ours')
        }
        let that = this
        this.$nextTick(function () {
          // 温度弹出层
          warnStates(this.paramss).then(res => {
            this.optionss.xAxis = []
            this.optionss.series = []
            if (res.success) {
              let Datamax = []
              res.data.forEach(function (item, index) {
                Datamax.push({ value: item.number1, itemStyle: { color: '' } })
                that.optionss.xAxis.push(item.time)
                if (item.number1 < 70) {
                  Datamax[index].itemStyle.color = '#87CF86'
                } else if (item.number1 >= 70 && item.number1 < 90) {
                  Datamax[index].itemStyle.color = '#E79C27'
                } else {
                  Datamax[index].itemStyle.color = '#F26665'
                }
              })
              this.optionss.series.push({
                type: 'bar',
                barMaxWidth: '30',
                name: this.$t('temperatureValueA'),
                data: Datamax,
                itemStyle: {
                  normal: { color: {}, label: { show: true, position: 'top' } },
                },
                markPoint: {
                  data: [
                    { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                    { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                  ],
                  label: { normal: { show: true } },
                },
              })
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      getTableData() {
        warnList(this.params).then(res => {
          if (res.success) {
            this.datas.tableData1 = res.datas
            this.datas.total = res.total
          }
        })
      },
      async getTableDatas() {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.paramss.mac,
          date: this.paramss.date,
          dateType: this.paramss.dateType,
          timeFlag: '',
        }
        const res = await tempOfRealtimeOrStatistic(params)
        if (res.success) {
          this.datas.tableData1s = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeDM(e) {
        // 改变日期
        this.params.dateType = e[0]
        this.params.date = e[1]
        this.getTableData()
        this.getEchartsData()
      },
      changePage(e) {
        // 改变页码
        this.params.page = e
        this.getTableData()
      },
      changesize(e) {
        // 改变每页显示数据
        this.params.rows = e
        this.getTableData()
      },
      changemac(e) {
        // 搜索设备号
        this.params.mac = e
        this.getTableData()
        this.getEchartsData()
      },
      getline(e) {},
      gethistory(e) {},
      changeID(e) {
        this.params.nodeIds = e
        this.getTableData()
        this.getEchartsData()
      },
      search(e) {
        this.params.page = 1
        this.params.mac = e.mac
        this.params.dateType = e.dateType
        this.params.date = e.date
        this.params.nodeIds = e.nodeIds
        this.getTableData()
        this.getEchartsData()
      },
      reset() {
        this.params = { page: 1, rows: 10, projectCode: this.$store.state.projectCode, mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), nodeIds: '' }
        this.init()
      },
      changemacs(e) {
        this.paramss.mac = e
        this.getEchartsDatas()
        this.getTableDatas()
      },
      changeDMs(e) {
        this.paramss.dateType = e[0]
        this.paramss.date = e[1]
        this.getEchartsDatas()
        this.getTableDatas()
      },
      changePages(e) {
        this.paramss.page = e
        this.getTableDatas()
        this.getTableDatas()
      },
    },
    created() {
      this.init()
    },
  }
</script>
<style lang="less" scoped>
  .bar-label {
    text-align: center;
    margin: -20px 0 20px 0;
  }
  .typeC {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
    position: relative;
    top: 20px;
    left: -32px;
    span {
      display: flex;
      align-items: center;
      .active {
        width: 10px;
        height: 10px;
        margin: 0px 10px;
      }
      .active1 {
        background: #87cf86;
      }
      .active2 {
        background: #e79c27;
      }
      .active3 {
        background: #f26665;
      }
      h6 {
        font-size: 8px;
      }
    }
  }
  .fs {
    font-size: 50px;
  }
</style>
