<template>
  <div>
    <warnS v-show="!showDetail" :datas="datas" @lookDeviceDetails="lookDeviceDetails" @sendPage="changePage" @sendSize="changesize" @search="search" @reset="reset" @sendDate="changeDM">
      <line-chart :options="options"></line-chart>
    </warnS>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import warnS from '@/components/seftcontrol'
  import LineChart from '@/pages/Common/Line'
  import { warnList, warnStates } from '@/api/safetyMonitor/leakageSelfChecking'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-leakageSelfChecking',
    data() {
      return {
        datas: {
          data1: [],
          data2: [],
          tableData1: [],
          tableColumns1: [
            { title: this.$t('deviceAliases'), key: 'boxName' },
            { title: this.$t('equipmentNo'), key: 'mac', slot: 'mac' },
            { title: this.$t('eventId'), key: 'id' },
            { title: this.$t('place'), key: 'address' },
            { title: this.$t('line'), key: 'channel' },
            { title: this.$t('alarmTime'), key: 'time' },
          ],
          total: 0,
        },
        options: { nameY: this.$t('unitPiece'), xAxis: [], series: [], title: { show: true, text: this.$t('leakageSelfInspection24hour') } },
        params: { page: 1, rows: 10, projectCode: this.$store.state.projectCode, mac: '', dateType: 1, typeNumbers: '9,10', date: this.$Date().format('YYYY-MM-DD'), nodeIds: '' },
      }
    },
    mixins: [deviceDetails],
    methods: {
      search(e) {
        this.params.page = 1
        this.params.mac = e.mac
        this.params.dateType = e.dateType
        this.params.date = e.date
        this.params.nodeIds = e.nodeIds
        this.init()
      },
      init() {
        this.getTableData()
        this.getEchartsData()
      },
      getEchartsData() {
        this.$nextTick(() => {
          warnStates(this.params).then(res => {
            this.options.xAxis = []
            this.options.series = []
            let arrData = []
            this.options.series.push({
              name: this.$t('numberOfSelfTestsLeakageProtection'),
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(224, 74, 73, 0.2)' },
                    { offset: 1, color: 'rgba(224, 74, 73, 0.3)' },
                  ],
                  global: false,
                },
              },
              itemStyle: { color: '#ab3f42' },
              showSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 4,
            })
            if (this.params.dateType === 2) {
              this.options.title.text = this.$t('sameMonthleakedSelfTestSituation')
            } else {
              this.options.title.text = this.$t('tfleakedSelfTestSituation')
            }
            for (let i = 0; i < res.data.length; i++) {
              this.options.xAxis.push(res.data[i].time)
              this.options.series[0].data.push(res.data[i].number)
              arrData.push(res.data[i].number)
            }
            if (this.$func.isSameArray(arrData)) {
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
          })
        })
      },
      getTableData() {
        warnList(this.params).then(res => {
          this.datas.tableData1 = res.datas
          this.datas.total = res.total
        })
      },

      changeDM(e) {
        // 改变日期
        this.params.dateType = e[0]
        this.params.date = e[1]
        this.getEchartsData()
        this.getTableData()
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
      },
      changeID(e) {
        this.params.nodeIds = e
        this.getTableData()
      },
      reset() {
        this.params = {
          page: 1,
          rows: 10,
          projectCode: this.$store.state.projectCode,
          mac: '',
          dateType: 1,
          typeNumbers: '9,10',
          date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
          nodeIds: '',
        }
        this.init()
      },
    },
    created() {
      this.init()
    },
    components: {
      warnS,
      LineChart,
      detailView,
    },
  }
</script>
