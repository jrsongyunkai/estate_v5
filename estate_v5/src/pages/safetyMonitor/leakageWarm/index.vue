<template>
  <div>
    <warnS v-show="!showDetail" :datas="datas" @lookDeviceDetails="lookDeviceDetails" @sendPage="changePage" @sendSize="changesize" @search="search" @reset="reset" @sendDate="changeDM" @sendDates="changeDMs" @sendmacs="changemacs">
      <line-chart :options="options"></line-chart>
      <line-chart :options="optionss" slot="history"></line-chart>
    </warnS>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import warnS from '@/components/seftcontrol'
  import LineChart from '@/pages/Common/Line'
  import { warnList, warnStates } from '@/api/safetyMonitor/leakageWarm'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-leakageWarm',
    components: {
      warnS,
      LineChart,
      detailView,
    },
    mixins: [deviceDetails],
    data() {
      return {
        datas: {
          tableData1: [],
          tableColumns1: [
            { title: this.$t('deviceAliases'), key: 'boxName' },
            { title: this.$t('equipmentNo'), key: 'mac', slot: 'mac' },
            { title: this.$t('eventId'), key: 'id' },
            { title: this.$t('place'), key: 'address' },
            { title: this.$t('line'), key: 'channel' },
            { title: this.$t('alarmOrWarningData'), key: 'time' },
            { title: this.$t('operation'), slot: 'actions' },
          ],
          tableData1s: [],
          total: 0,
        },
        options: { nameY: this.$t('unitPiece'), xAxis: [], series: [], title: { show: true, text: this.$t('allDayleakageAsituation') }, tooltip: '' },
        optionss: { nameY: this.$t('unitPiece'), xAxis: [], series: [], title: { show: true, text: this.$t('allDayleakageAsituation') }, tooltip: '' },
        params: { projectCode: this.$store.state.projectCode, typeNumbers: '2,12,1016', mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), nodeIds: '' },
        paramss: { projectCode: this.$store.state.projectCode, typeNumbers: '2,12,1016', mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), nodeIds: '' },
      }
    },
    methods: {
      init() {
        this.getTableData()
        this.getEchartsData()
        // this.getEchartsDatas()
      },
      getEchartsData() {
        this.$nextTick(() => {
          warnStates(this.params).then(res => {
            this.options.xAxis = []
            this.options.series = []
            this.options.series.push(
              {
                name: this.$t('leakageHardProtectionA'),
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
                      { offset: 0, color: 'rgba(245,242,30, 0.2)' },
                      { offset: 1, color: 'rgba(245,242,30, 0.3)' },
                    ],
                    global: false,
                  },
                },
                itemStyle: { color: '#f5f21e' },
                showSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 4,
              },
              {
                name: this.$t('leakageSoftProtectionA'),
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
              },
              {
                name: this.$t('leakageSoftProtectionW'),
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
                      { offset: 0, color: 'rgba(255, 168, 84, 0.2)' },
                      { offset: 1, color: 'rgba(255, 168, 84, 0.3)' },
                    ],
                    global: false,
                  },
                },
                itemStyle: { color: '#FFA854' },
                showSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 4,
              }
            )

            if (this.params.dateType === 2) {
              this.options.title.text = this.$t('currentLeakageAlarm')
            } else {
              this.options.title.text = this.$t('allDayleakageAsituation')
            }
            for (let i = 0; i < res.data.length; i++) {
              this.options.xAxis.push(res.data[i].time)
              this.options.series[0].data.push(res.data[i].number1016)
              this.options.series[1].data.push(res.data[i].number2)
              this.options.series[2].data.push(res.data[i].number12)
            }
            if (this.$func.isSameArray(this.options.series[0].data)) {
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
            if (this.$func.isSameArray(this.options.series[1].data)) {
              this.options.series[1].markPoint = {
                data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                normal: { show: true },
              }
            } else {
              this.options.series[1].markPoint = {
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
      getEchartsDatas() {
        this.$nextTick(() => {
          warnStates(this.paramss).then(res => {
            this.optionss.xAxis = []
            this.optionss.series = []
            this.optionss.series.push(
              {
                name: this.$t('leakageHardProtectionA'),
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
                      { offset: 0, color: 'rgba(245,242,30, 0.2)' },
                      { offset: 1, color: 'rgba(245,242,30, 0.3)' },
                    ],
                    global: false,
                  },
                },
                itemStyle: { color: '#f5f21e' },
                showSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 4,
              },
              {
                name: this.$t('leakageSoftProtectionA'),
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
              },
              {
                name: this.$t('leakageSoftProtectionW'),
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
                      { offset: 0, color: 'rgba(255, 168, 84, 0.2)' },
                      { offset: 1, color: 'rgba(255, 168, 84, 0.3)' },
                    ],
                    global: false,
                  },
                },
                itemStyle: { color: '#FFA854' },
                showSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 4,
              }
            )
            if (this.paramss.dateType === 2) {
              this.optionss.title.text = this.$t('currentLeakageAlarm')
            } else {
              this.optionss.title.text = this.$t('allDayleakageAsituation')
            }
            for (let i = 0; i < res.data.length; i++) {
              this.optionss.xAxis.push(res.data[i].time)
              this.optionss.series[0].data.push(res.data[i].number1016)
              this.optionss.series[1].data.push(res.data[i].number2)
              this.optionss.series[2].data.push(res.data[i].number12)
            }
            this.datas.tableData1s = res.data
            if (this.$func.isSameArray(this.optionss.series[0].data)) {
              this.optionss.series[0].markPoint = {
                data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                normal: { show: true },
              }
            } else {
              this.optionss.series[0].markPoint = {
                data: [
                  { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                  { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                ],
                label: { normal: { show: true } },
              }
            }
            if (this.$func.isSameArray(this.optionss.series[1].data)) {
              this.optionss.series[1].markPoint = {
                data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                normal: { show: true },
              }
            } else {
              this.optionss.series[1].markPoint = {
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
      async getTableData() {
        const res = await warnList(this.params)
        this.datas.tableData1 = res.datas
        this.datas.total = res.total
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
        this.params = {
          projectCode: this.$store.state.projectCode,
          typeNumbers: '2,12,1016',
          mac: '',
          dateType: 1,
          date: this.$Date().format('YYYY-MM-DD'), // 默认为今天
          nodeIds: '',
        }
        this.init()
      },
      changemacs(e) {
        this.paramss.mac = e
        this.getEchartsDatas()
      },
      changeDMs(e) {
        this.paramss.dateType = e[0]
        this.paramss.date = e[1]
        this.getEchartsDatas()
      },
    },
    created() {
      this.init()
    },
  }
</script>
