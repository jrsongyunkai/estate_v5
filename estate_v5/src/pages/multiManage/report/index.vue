<template>
  <div id="reportALL">
    <!-- 顶部 -->
    <div class="top">
      <Select :clearable="true" v-model="model2" style="width: 200px; margin-left: 10px" @on-change="changeMonth" :placeholder="$t('pleaseSelectMonth')">
        <Option v-for="item in Month" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button @click="create" style="background: #007eff; color: #fff; border: none; margin-left: 10px" type="primary">{{ $t('generate') }}</Button>
      <Button @click="printFn" style="margin-left: 10px">{{ $t('download') }}</Button>
    </div>
    <div>
      <Tag v-if="show" @on-close="handleClose" closable class="tab" color="primary">
        <Icon color="#999" type="md-chatboxes" />
        <span style="color: #999; margin-left: 10px">{{ $t('pleaseSelectFilter') }}</span>
      </Tag>
    </div>
    <div class="main">
      <div v-if="isReport" class="report">
        <img src="@/assets/images/nodata.png" alt="" style="width: 250px; height: 250px" />
        <div>{{ $t('generateReport') }}</div>
      </div>
      <main v-else>
        <div class="EnergyA" ref="container">
          <div class="a4-page">
            <h1>{{ $t('analysisReport') }}</h1>
            <h3 class="h3">{{ $t('submittedMonthly') + `（${model2}）` }}</h3>
            <h2 style="margin-top: 20px; color: black">{{ '1、' + $t('deviceOverview') }}</h2>
            <Row class="macState">
              <Col span="10">
                <h4>{{ $t('projectName') }}</h4>
                <h3>{{ macState.prjName }}</h3>
                <h4>{{ $t('contactNumber') }}</h4>
                <h3>{{ macState.linkTel }}</h3>
              </Col>
              <Col span="6">
                <h4>{{ $t('customerName') }}</h4>
                <h3>{{ macState.linkMan }}</h3>
                <h4>{{ $t('totalDevice') }}</h4>
                <h3>{{ macState.macTotal }}</h3>
              </Col>
              <Col span="6">
                <h4>{{ $t('projectAddr') }}</h4>
                <h3>
                  {{ macState.prjLocation.address === '' ? $t('mantunSc') : macState.prjLocation.address }}
                </h3>
              </Col>
            </Row>
            <h2 style="margin-top: 20px; color: black">{{ '2、' + $t('alarmAnalysis') }}</h2>
            <Row class="warntype" style="height: auto">
              <Col span="24">
                <h4>{{ '2.1、' + $t('alarmType') }}</h4>
                <p style="height: 500px; color: black">
                  <pie height="474" :options="typeAlarmTypes" />
                </p>
              </Col>
            </Row>
            <Row class="warntype mt-70" style="height: auto">
              <Col span="24">
                <h4>{{ '2.2、' + $t('alertType') }}</h4>
                <p style="height: 500px">
                  <pie height="474" :options="typeAlarmTypes2" />
                </p>
              </Col>
            </Row>
          </div>
          <div class="a4-page">
            <Row class="warntype mt-70" style="height: 320px">
              <Col span="24">
                <h4>{{ '2.4、' + $t('alarmRanking') }}</h4>
                <p><BarChart :options="alarmOption" :type="'warntypeReport'"></BarChart></p>
              </Col>
            </Row>
            <h2 style="color: black" class="mt-70">{{ '3、' + $t('analysis') }}</h2>
            <Row class="warntype" style="height: 400px">
              <Col span="24">
                <h4>{{ '3、' + $t('analysis') }}</h4>
                <h3 style="color: black">{{ $t('overview1') }}</h3>
                <p style="height: 400px"><BarChart :options="alarmOption1"></BarChart></p>
              </Col>
            </Row>
          </div>
          <div class="a4-page">
            <Row class="mt-70">
              <Col span="24">
                <h4>{{ '3.2、' + $t('energyConsumptionStatistics1') }}</h4>
                <h3 style="color: black">{{ $t('energyConsumptionTop') }}</h3>
                <div class="table" style="margin-left: 30px">
                  <Table highlight-row ref="currentRowTable" :columns="columns2" :data="naturalList"></Table>
                </div>
              </Col>
            </Row>
            <h2 style="color: black; margin-top: 50px">{{ '4、' + $t('behavior') }}</h2>
            <Row class="macState" style="height: 100px">
              <Col span="8" style="text-align: center">
                <h4>{{ '4.1、' + $t('numOfOnlineDevice') }}</h4>
                <h3 style="font-weight: 23px">{{ EmaginData.totalOnlineMac }}</h3>
              </Col>
              <Col span="8" style="text-align: center">
                <h4>{{ '4.2、' + $t('numOfOfflineDevice') }}</h4>
                <h3 style="font-weight: 23px">{{ EmaginData.totalOfflineMac }}</h3>
              </Col>
              <Col span="8" style="text-align: center">
                <h4>{{ '4.3、' + $t('patrolInspectionScore') }}</h4>
                <h3 style="font-weight: 23px">-</h3>
              </Col>
            </Row>
            <h4 style="margin: 30px; position: relative; top: 0px; color: #f24e4c">{{ $t('proposal1') }}</h4>
            <h4 style="margin: 30px; color:'font-weight:18px; black;position:relative;top:20px;z-index:555">{{ $t('sectionContent') }}</h4>
            <Row class="macState">
              <Col span="6" style="text-align: center">
                <h5 style="font-weight: 18px">{{ $t('safetyHazards') }}</h5>
                <h5 style="font-weight: 18px; color: #333333">{{ lastdata.hiddenDangerCount }}</h5>
              </Col>
              <Col span="6" style="text-align: center">
                <h5 style="font-weight: 18px">{{ $t('processing') }}</h5>
                <h5 style="font-weight: 18px; color: #333333">{{ lastdata.workOrderProcessingCount }}</h5>
              </Col>
              <Col span="6" style="text-align: center">
                <h5 style="font-weight: 18px">{{ $t('completeWorkOrder') }}</h5>
                <h5 style="font-weight: 18px; color: #333333">{{ lastdata.workOrderProcessedCount }}</h5>
              </Col>
              <Col span="6" style="text-align: center">
                <h5 style="font-weight: 18px">{{ $t('analysisReport') }}</h5>
                <h5 style="font-weight: 18px; font-size: 18px; color: #333333">—</h5>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
  // 引入分组的api

  import { groupingList } from '@/api/safetyMonitor/public'
  import { queryTable, powerConsumptionTrend, workOrderStatistics } from '@/api/public'
  import screenPie from './NestPie.vue'
  import screeBar from './screeBar'
  import { getPrejectData, getEmaginData, queryAlarmTrend } from '@/api/multiManage/report'
  import { alarmTypeDistribution, alarmTrend } from '@/api/visualScreen/index.js'
  import NestPieChart from '@/pages/Common/NestPie'
  import LineAreaChart from './LineArea.vue'
  import BarChart from './Bars'
  import BarCharts from '@/pages/Common/Bars'
  import printJS from 'print-js'
  import dayjs from 'dayjs'
  import { toPng } from 'html-to-image'
  export default {
    name: 'multiManage-report',
    data() {
      return {
        data: [],
        days: '',
        mouths: '',
        cityList1: [],
        cityList2: [],
        model1: '',
        model2: '',
        value: '',
        Month: [],
        isReport: true,
        macState: [],
        options1: { legend: [], series: [] },
        options2: { legend: [], series: [] },
        alarmOption: { legendStatus: false, xAxis: [], series: [], title: { show: false }, tooltip: { show: false } },
        alarmOption1: {},
        columns2: [
          { type: 'index', title: this.$t('ranking'), width: 100, align: 'center' },
          { title: this.$t('deviceAliases'), key: 'name' },
          { title: this.$t('equipmentNo'), key: 'mac', width: 200 },
          { title: this.$t('room'), key: 'roomWZ' },
          { title: this.$t('thisMonth') + this.$t('leakageKwh'), key: 'electricity' },
          { title: this.$t('lastMonth') + this.$t('leakageKwh'), key: 'preElectricity' },
          { title: this.$t('comparison'), key: 'ratio' },
        ],
        naturalList: [],
        EmaginData: {},
        trendOptions: { title: { show: false }, xAxis: [], series: [] },
        thirdBarOptions: {
          legendStatus: true,
          xAxisType: '',
          yAxisType: '',
          xAxis: [],
          series: [],
          title: { show: true, text: this.$t('electricityUsageTrend') },
          tooltip: { show: true, trigger: 'axis', formatter: '{b}<br/>' + this.$t('loadLastYear') + '：{c0}<br/>' + this.$t('loadThisYear') + '：{c1}' },
        },
        lastdata: {},
        show: true,
        isshow: false,
        typeAlarmTypes: { legend: [], series: [] },
        typeAlarmTypes2: { legend: [], series: [] },
        barOptions: { xAxis: [], series: [], title: { show: true, text: this.$t('quantity') } },
        alarm: [],
        time: [],
        warn: [],
      }
    },
    methods: {
      init() {
        this.days = this.$Date().format('YYYY-MM-DD')
        this.mouths = this.$Date().format('YYYY-MM')
        this.getdata()
        this.Month = this.getMonthList()
        this.model2 = this.$Date().format('YYYY-MM')
        getPrejectData({ projectCode: this.$store.state.projectCode }).then(res => {
          this.macState = res.data
        })
        getEmaginData({ projectCodes: this.$store.state.projectCode }).then(res => {
          this.EmaginData = res.data
        })
      },
      getMonthList() {
        const end = dayjs().endOf('month')
        let cursor = dayjs().subtract(1, 'year').startOf('year')
        const months = []
        while (cursor.isBefore(end)) {
          months.push({
            label: cursor.format('YYYY-MM'),
            value: cursor.format('YYYY-MM'),
          })
          cursor = cursor.add(1, 'month')
        }
        return months
      },
      handleClose() {
        this.show = false
      },
      initDistribution() {
        this.typeAlarmTypes.series = []
        this.typeAlarmTypes2.series = []
        let params = { projectCode: this.$store.state.projectCode, time: this.mouths + '-01' }
        alarmTypeDistribution(params).then(res => {
          if (res.success) {
            let data = []
            let _data = []
            res.data.forEach((item, index) => {
              if ([-100].indexOf(item.classify) !== -1) {
                data.push({ name: item.info, value: item.number, tno: item.typeNumber })
              } else if ([-200].indexOf(item.classify) !== 1) {
                _data.push({ name: item.info, value: item.number, tno: item.typeNumber })
              }
            })
            this.typeAlarmTypes.series.push({
              type: 'pie',
              data: data,
              radius: [50, 100],
              center: ['10%', '40%'],
              avoidLabelOverlap: false,
              label: {
                normal: { show: false, position: 'center' },
                emphasis: {
                  show: false,
                  textStyle: { fontSize: '10', fontWeight: 'bold' },
                },
              },
              labelLine: { normal: { show: false } },
            })
            this.typeAlarmTypes2.series.push({
              type: 'pie',
              data: _data,
              radius: [50, 100],
              center: ['10%', '40%'],
              avoidLabelOverlap: false,
              label: {
                normal: { show: false, position: 'center' },
                emphasis: { show: false, textStyle: { fontSize: '20', fontWeight: 'bold' } },
              },
              labelLine: { normal: { show: false } },
            })
            let legend = this.legendData(data)
            let _legend = this.legendData(_data)
            this.typeAlarmTypes.legend.data = legend
            this.typeAlarmTypes2.legend.data = _legend
            this.alarmOption.series = []
            let datas = []
            let datas1 = []
            res.data.forEach(function (item, index) {
              if ([-100].indexOf(item.classify) !== -1) {
                datas.push({
                  name: item.info,
                  value: item.number,
                  tno: item.typeNumber,
                })
              }
              datas1.push(item.info)
            })

            this.alarmOption.series.push({
              type: 'bar',
              barMaxWidth: '30',
              data: datas,
              itemStyle: {
                normal: {
                  color: function (params) {
                    let colorList = [
                      '#f47920',
                      '#2a5caa',
                      '#7fb80e',
                      '#d71345',
                      '#ffc20e',
                      '#33a3dc',
                      '#ffe600',
                      '#45b97c',
                      '#f3715c',
                      '#0000FF',
                      '#2E64FE',
                      '#00FF80',
                      '#FE9A2E',
                      '#f47920',
                      '#2a5caa',
                      '#7fb80e',
                      '#d71345',
                      '#ffc20e',
                      '#33a3dc',
                      '#ffe600',
                      '#45b97c',
                      '#f3715c',
                      '#0000FF',
                      '#2E64FE',
                      '#00FF80',
                      '#FE9A2E',
                      '#f47920',
                      '#2a5caa',
                      '#7fb80e',
                      '#d71345',
                      '#ffc20e',
                      '#33a3dc',
                      '#ffe600',
                      '#45b97c',
                      '#f3715c',
                      '#0000FF',
                      '#2E64FE',
                      '#00FF80',
                      '#FE9A2E',
                    ]
                    return colorList[params.dataIndex]
                  },
                  label: { show: true, position: 'top', textStyle: { color: '#fff' } },
                },
              },
            })
            let arr = []
            datas1.forEach(item => {
              arr.push(item.split('(')[0])
            })
            this.alarmOption.xAxis = arr
          }
        })
      },
      legendData(data) {
        let total = 0
        let legend = []
        data.forEach((v, i) => {
          legend[i] = v.name + ' ' + v.value + ' '
          total += v.value
        })
        legend.forEach((v, i) => {
          if (document.documentElement.clientWidth > 1366) {
            legend[i] = v + '(' + (total === 0 ? 0 : ((data[i].value / total) * 100).toFixed(2)) + '%)'
          } else {
            legend[i] = v.split(' ')[0]
          }
          data[i].name = legend[i]
        })
        return legend
      },
      initAlarmTrend() {
        this.lineAreaChartFlag = false
        let params = {
          projectCode: this.$store.state.projectCode,
          provinceId: this.provinceId,
          cityId: this.cityId,
          countyId: this.countyId,
        }
        this.$nextTick(function () {
          queryAlarmTrend(params).then(res => {
            if (res.success) {
              this.trendOptions.series = []
              this.trendOptions.xAxis = res.data.xAxis
              this.trendOptions.series.push(
                { name: this.$t('alarm'), type: 'line', data: res.data.alarm, itemStyle: { color: '#F80759' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true },
                {
                  name: this.$t('earlyWarning'),
                  type: 'line',
                  data: res.data.warn,
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: '#6FB1FC' },
                        { offset: 1, color: '#0052D4' },
                      ],
                      global: false,
                    },
                  },
                  itemStyle: { color: '#34ACE7' },
                  showSymbol: true,
                  symbol: 'emptyCircle',
                  symbolSize: 4,
                  smooth: true,
                }
              )
              this.lineAreaChartFlag = true
            } else if (res.code === '-1') {
            } else {
              this.trendOptions.xAxis = []
              this.trendOptions.series = []
              this.$Message.error({ content: res.message })
            }
            setTimeout(() => {
              this.isshow = true
            }, 100)
          })
        })
      },
      output() {
        import('@/components/print/print.min').then($Print => {
          window.scrollTo(0, 0)
          let options = {}
          $Print.default.Component(this.$refs.container, options.beforeStart)
        })
      },
      printFn() {
        const printContent = this.$refs.container
        toPng(printContent, { backgroundColor: null, pixelRatio: 2, skipFonts: true })
          .then(url => {
            printJS({
              printable: url,
              type: 'image',
              documentTitle: '', // 标题
              maxWidth: '100%',
              style: `@media print { @page {size: auto; margin: 0; } body{margin:0} img{width: 100%;}}`, // 去除页眉页脚,去除第一页空白
            })
          })
          .catch(err => {
            console.error(err)
          })
      },
      changeMonth(e) {
        e ? (this.mouths = e) : (this.mouths = this.$Date().format('YYYY-MM'))
      },
      async getdata() {
        const res = await groupingList({ projectCode: this.$store.state.projectCode })
        if (res.data) {
          this.cityList1 = res.data
          for (let i = 0; i < res.data.length; i++) {
            this.cityList1[i].value = res.data[i].id
          }
        }
      },
      async getTable() {
        let params = { projectCode: this.$store.state.projectCode, date: this.mouths + '-01', topNum: 10 }
        const res = await queryTable(params)
        this.naturalList = res.data
        this.naturalList.forEach(item => {
          item.electricity = item.others.electricity
          item.preElectricity = item.others.preElectricity
          item.ratio = item.others.ratio
          item.roomWZ = item.build + item.unit + item.room
        })
      },
      getlist() {
        this.thirdBarOptions.series = []
        this.thirdBarOptions.xAxis = []
        let params = {
          statsType: 3,
          time: this.mouths + '-01', // 表单的值和v3有所变化，后期待完善 已完善
          projectCode: this.$store.state.projectCode,
        }
        powerConsumptionTrend(params).then(res => {
          if (res.success) {
            let bardata = { power: [], legend: [] }
            if (res.data.length > 12) {
              res.data.forEach((v, i) => {
                bardata.power[i] = v.afterPower
                bardata.legend[i] = v.time + this.$t('day')
              })
            } else {
              res.data.forEach((v, i) => {
                bardata.power[i] = v.afterPower
                bardata.legend[i] = v.time + this.$t('month')
              })
            }
            this.thirdBarOptions.xAxis = bardata.legend
            this.thirdBarOptions.series.push({
              name: this.$t('electricityUsageTrend'),
              type: 'bar',
              barWidth: '100%',
              data: bardata.power,
              itemStyle: {
                emphasis: { barBorderRadius: 5 },
                normal: { color: '#08BEC1', barBorderRadius: 5 },
              },
            })
          } else {
            this.$Message.error({ content: res.message })
          }
          this.thirdBarOptions.flag = true
          this.alarmOption1 = this.thirdBarOptions
        })
      },
      async getLastData() {
        const res = await workOrderStatistics({ projectCode: this.$store.state.projectCode, time: this.mouths + '-01' })
        this.lastdata = res.data
      },
      async queryalarmTrend() {
        let params = { projectCode: this.$store.state.projectCode, time: this.mouths + '-01' }
        const res = await alarmTrend(params)
        let trend = res.data
        this.alarm = []
        this.time = []
        this.warn = []
        this.barOptions.series = []
        trend.forEach(item => {
          this.alarm.push(item.alarm)
          this.time.push(item.time)
          this.warn.push(item.warn)
        })
        if (res.success) {
          this.barOptions.xAxis = this.time
          this.barOptions.series.push(
            {
              name: this.$t('alarm'),
              type: 'bar',
              barMaxWidth: '10',
              data: this.alarm,
              itemStyle: {
                emphasis: { barBorderRadius: 5 },
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: 'rgba(50, 124, 255, .8)' },
                      { offset: 1, color: 'rgba(50, 124, 255, .2)' },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: this.$t('earlyWarning'),
              type: 'bar',
              barMaxWidth: '10',
              data: this.warn,
              itemStyle: {
                emphasis: { barBorderRadius: 5 },
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: 'rgba(0, 189, 135, .8)' },
                      { offset: 1, color: 'rgba(0, 189, 135, .2)' },
                    ],
                    globalCoord: false,
                  },
                },
              },
            }
          )
        }
      },
      create() {
        this.isReport = false
        this.initDistribution()
        this.queryalarmTrend()
        this.getTable()
        this.getlist()
        this.getLastData()
      },
    },
    mounted() {
      this.init()
    },
    props: {
      datas: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    components: {
      NestPieChart,
      LineAreaChart,
      BarChart,
      BarCharts,
      pie: screenPie,
      bar: screeBar,
    },
  }
</script>

<style lang="less" scoped>
  #reportALL {
    .tab {
      width: 100%;
      height: 42px;
      line-height: 42px;
      border: 1px solid #999;
      // margin-top: 0px;
      font-size: 15px;
      margin-bottom: -20px;
      .ivu-icon-ios-close {
        float: right;
        line-height: 42px;
        margin-right: 20px;
      }
    }
    .report {
      text-align: center;
      float: none;
      margin-right: 100px;
      img {
        margin-top: 200px;
      }
    }
    .top {
      margin-bottom: 10px;
      width: 100%;
      height: 52px;
      width: 100%;
      min-width: 1430px;
      line-height: 52px;
      background-color: #1a202e;
    }
    .sy {
      height: 1500px;
      overflow: hidden;
      margin-left: 300px;
      .sys:nth-of-type(1) {
        margin-top: -470px;
      }
      .sys {
        color: #000;
        height: 120px;
        background: #fff;
        transform: rotate(-35deg);
        width: 1500px;

        margin-left: -170px;
        text-align: center;
        div {
          font-size: 20px;
          color: orange;
          opacity: 0.8;
        }
      }
    }
    .blockL {
      float: left;
      margin: 10px;
      margin-left: 0px;
    }
    .Tab {
      background-color: blue;
    }
    .blockR {
      div {
        float: left;
      }
      .output {
        // margin: 10px;
        margin-left: 20px;
      }
      .date {
        line-height: 50px;
        margin-left: 10px;
        height: 50px;
      }
      .dates {
        line-height: 50px;
        margin-right: -20px;
        height: 50px;
      }
      .serach {
        .inp {
          float: left;
          margin: 10px;
          width: 200px;
        }
        .but {
          float: left;
          margin: 10px;
          margin-left: 0;
          margin-right: -25px;
        }
        div {
          float: left;
        }
      }
    }
    .page {
      float: left;
      margin-left: 50px;
      h1 {
        width: 1200px;
      }
    }
    main {
      // float: left;
      // height: 2200px;
      // overflow: auto;
      div {
        // margin: 0 15px;
        position: relative;
      }
      > div {
        width: 1200px;
        h1 {
          font-size: 40px;
          font-family: PingFang SC;
          font-weight: 700;
          color: #333333;
          line-height: 48px;
        }
        .h3 {
          color: #f24e4c;
          margin-top: 10px;
        }
        p {
          width: 100%;
          border-bottom: 2px solid #ccc;

          margin-left: 30px;
        }
        > span {
          position: absolute;
          left: 900px;
          top: 120px;
        }
        .macState {
          height: 160px;
          width: 1200px;
          margin: 30px 0;
          color: #000;
          // margin-top: 50px;
          h4 {
            font-size: 18px;
            font-weight: 400;
            color: #999999;
          }
          h3 {
            font-size: 18px;
            font-weight: 700;
            color: #333333;
          }
        }
        .warntype {
          height: 300px;
          margin-top: 10px;
          p {
            width: 100%;
            height: 100%;
            margin-left: 0px;
            margin-top: 20px;
            border: none;
            overflow: hidden;
            // background-color: red;
          }
        }
        .EnergyA {
          > div {
            margin-top: 150px;
          }
        }
      }
    }
    .table {
      div {
        margin: 0;
      }
    }
    .mt-70 {
      margin-top: 70px !important;
    }
    .main {
      min-height: 680px;
      width: 100%;
      min-width: 1430px;
      // line-height: 72px;
      margin-top: 35px;
      padding-left: 20px;
      background-color: #1a202e;
    }
    .boundary {
      border: 2px solid #303a5ecc;
      box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.2);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      width: 500px;
      background-color: #101525;
      z-index: 555;
    }
    .boundaries {
      border: 2px solid #303a5ecc;
      box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.2);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      // width: 500px;
      background-color: #101525;
      z-index: 555;
    }

    /deep/::-webkit-scrollbar {
      width: 6px; //竖轴宽度
      height: 6px; //横轴宽度
      // background-color: rgba(99, 110, 246, 0.5);
    }

    /* 滚动槽 */
    /deep/::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    /deep/::-webkit-scrollbar-thumb {
      background-color: rgb(9, 15, 25);
    }
    h4 {
      color: #000;
    }
  }
  header {
    text-align: center;
    margin-top: 20px;
    img {
      width: 100%;
    }
  }
  footer {
    // position: absolute;
    // bottom: 0;
    text-align: center;
    width: 920px;
    img {
      width: 100%;
      background-size: 100%;
    }
  }
  .EnergyA {
    position: relative;
    background-color: #fff;
    .a4-page {
      padding: 40px;
      height: 1697px;
      &:last-child {
        height: auto;
      }
    }
    .count {
      text-align: center;
      height: 860px;
      h1 {
        margin-top: 400px;
      }
      .tille {
        margin-top: 50px;
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #f24e4c;
      }
      .statement {
        font-size: 18px;
        margin-top: 50px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }
    }
    .Basicdata {
      .text {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
        padding: 20px 0;
      }
      .basic {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        margin-top: 10px;
        .tpye {
          color: #999999;
        }
        .name {
          color: #333333;
        }
      }
    }
  }
</style>
