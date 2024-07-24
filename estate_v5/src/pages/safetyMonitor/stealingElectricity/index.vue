<template>
  <div>
    <div class="stealing-head">
      <div>
        <Row :gutter="10">
          <Col>
            <el-cascader style="width: 285px" v-model="macLine" :options="macData" @on-change="getMacLine" filterable :placeholder="$t('pleaseSelectDeviceLine')">
              <template slot-scope="{ data }">
                <Tooltip :disabled="!data.textContent" :content="data.textContent" transfer transfer-class-name="el-cascader-label-tips">
                  <span>{{ data.label }}</span>
                </Tooltip>
              </template>
            </el-cascader>
          </Col>
          <Col><DatePicker type="date" v-model="baseDate" :options="disOptions" :placeholder="$t('pleaseSelectBaseDate')" style="width: 200px" @on-change="getBaseDate"></DatePicker></Col>
          <Col><Button type="primary" @click="getEchsrtsValue">{{ $t('query') }}</Button></Col>
          <Col><Button type="default" @click="resetLists">{{ $t('reset') }}</Button></Col>
        </Row>
      </div>
      <div>
        <Button type="primary" ghost @click="$router.push({ path: '/multiManage/stealingElectricity' })">{{ $t('electricityTheftMonitoringConfigurationList') }}</Button>
      </div>
    </div>
    <div class="content-Charts">
      <div v-if="!isShowChart">
        <!--  -->
        <div v-if="!isLoading">
          <h3>{{ $t('ElectricityTheftMonitoring') }}</h3>
          <div style="text-align: center"><img src="../../../assets/images/noDatas.png" alt="" style="width: 200px" /></div>
          <div style="text-align: center; margin-bottom: 100px">{{ $t('electricityTheftNoData') }}</div>
        </div>
      </div>
      <div v-if="isLoading" style="text-align: center; margin-top: 120px; margin-bottom: 200px">
        <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
        <div style="text-align: center">{{ $t('dataLoading') }}</div>
      </div>
      <div></div>
      <div class="conten-head" v-if="isShowChart">
        <div style="flex: 1"><h3>{{ $t('ElectricityTheftMonitoring') }}</h3></div>
        <div style="flex: 3">
          <div class="conten-head">
            <div>
              <Badge color="#007EFF" :text="$t('averagePower')" />
              <TooltipVue style="display: inline-block">
                <div>{{ $t('currentAveragePower') }}</div>
              </TooltipVue>
            </div>
            <div>
              <Badge color="#18F1FF" :text="$t('electricityTheftMonitoringBaseline')" />
              <TooltipVue style="display: inline-block">
                <div>{{ $t('electricityTheftBaselineTips') }}</div>
              </TooltipVue>
            </div>
            <div>
              <Badge color="#F24E4C" :text="$t('electricityTheftMonitoringAlarmValue')" />
              <TooltipVue style="display: inline-block">
                <div>{{ $t('electricityTheftMonitoringAlarmValueTips') }}</div>
              </TooltipVue>
            </div>
            <div>
              <span style="color: #18f1ff; margin-right: 5px">----</span>
              <span>{{ $t('dateAveragePower', { month: monthCpt, day: dayCpt }) }}</span>
            </div>
            <div>
              <span style="color: red; margin-right: 5px">{{ '----' }}</span>
              <span>{{ $t('dateElectricityTheftAlarm', { month: monthCpt, day: dayCpt }) }}</span>
            </div>
            <div style="margin-top: -5px" class="select-time">
              <Select v-model="selectTimeValue" @on-change="changeTimeValue" @on-open-change="getDisableOption" style="width: 200px" :placeholder="$t('selectTimePeriod')" :clearable="true">
                <Option v-for="item in selectTimeList" :value="item.value" :key="item.value" :label="item.type" @click.native="getmacMessage(item)" :disabled="isDis && item.value > nowType"></Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isShowChart">
        <stealCharts :options="seriseData" :unit="stealUnit" style="width: 100%"></stealCharts>
      </div>
    </div>
    <div style="margin-top: 10px; background: #1a202e">
      <div style="padding: 20px"><h3>{{ $t('electricityTheftAlarmList') }}</h3></div>
      <div style="padding: 0 20px">
        <Table :columns="stealColums" :data="stealData">
          <template slot-scope="{ row }" slot="macName">{{ row.boxName }}</template>
          <template slot-scope="{ row }" slot="macs">{{ row.mac }}</template>
          <template slot-scope="{ row }" slot="events">{{ row.id }}</template>
          <template slot-scope="{ row }" slot="location">{{ row.address }}</template>
          <template slot-scope="{ row }" slot="lines">{{ row.channel }}</template>
          <template slot-scope="{ row }" slot="vaslues">{{ row.valueDescribe.triggerValue }}</template>
          <template slot-scope="{ row }" slot="viewModals">{{ row.valueDescribe.triggerType === 1 ? $t('singlePointMonitoring') : $t('smoothStatistics') }}</template>
          <template slot-scope="{ row }" slot="alarmTime">{{ row.time }}</template>
          <template slot-scope="{ row }" slot="opration">
            <Button type="text" style="color: #007eff" @click="openHistroy(row)">{{ $t('historyTrend') }}</Button>
          </template>
        </Table>
      </div>

      <div style="overflow: hidden">
        <div style="float: right">
          <Page show-total :current="currentPageNo" @on-change="changePage" :total="totalList" show-elevator />
        </div>
      </div>
    </div>
    <Modal :title="$t('historyTrend')" v-model="historyModal" width="800">
      <DatePicker type="daterange" v-model="dateValue" @on-change="getTimeChange" placement="bottom-end" :placeholder="$t('pleaseSelectDateTime')" style="width: 200px"></DatePicker>
      <Select v-model="selectHistoryTime" @on-change="handleTypes" multiple :max-tag-count="2" style="width: 300px; margin-left: 10px" :placeholder="$t('selectTimePeriod')" :clearable="true">
        <Option v-for="item in selectTimeList" :value="item.value" :key="item.value" :label="item.type"></Option>
      </Select>
      <div v-if="isHistoryCpt" style="margin-top: 15px">
        <div class="steal-Details">
          <h3>{{ $t('electricityTheftAlarmSituation') }}</h3>
          <div></div>
        </div>
        <stealCharts :options="historyCharts" :unit="historyUnit"></stealCharts>
      </div>
      <div style="margin-top: 15px"></div>
      <Table :columns="ishistoryColums" :data="tableHistoryCpt" :max-height="300"></Table>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import querner from '../../../assets/images/querner13.png'
  import { pageQueryAddr, warnList, queryTrendStealing, queryAlarmTimes } from '@/api/public'
  import { timeList, disableFunc } from './stealElec'
  import stealCharts from './stealingCharts.vue'
  import dayjs from 'dayjs'
  export default {
    name: 'safetyMonitor-stealingElectricity',
    components: { stealCharts },
    data() {
      return {
        nowType: '',
        isDis: false,
        selectLine: '',
        selectMac: '',
        isLoading: false,
        isShowChart: false,
        dataEightLine: [],
        historyUnit: this.$t('piece2'),
        stealUnit: 'W',
        dataHistory: [],
        currentPageNo: 1,
        totalList: 0,
        historyColums: [],
        historyData: [],
        historyCharts: {},
        dateValue: [this.$Date().add(-28, 'day').format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')],
        selectHistoryTime: [1],
        historyModal: false,
        stealData: [],
        stealColums: [
          { title: this.$t('deviceAliases'), slot: 'macName' },
          { title: this.$t('device'), slot: 'macs' },
          { title: this.$t('eventId'), slot: 'events' },
          { title: this.$t('place'), slot: 'location' },
          { title: this.$t('line'), slot: 'lines' },
          { title: `${this.$t('alarmValue')}(W)`, slot: 'vaslues' },
          { title: this.$t('monitorMode'), slot: 'viewModals' },
          { title: this.$t('alarmTime'), slot: 'alarmTime' },
          { title: this.$t('operation'), slot: 'opration' },
        ],
        macData: [],
        macLine: [],
        macAddr: {},
        selectTimeValue: 1,
        seriseData: {},
        selectTimeList: timeList,
        baseDate: this.$func.getNowFormatDateTime(),
        disOptions: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now()
          },
        },
      }
    },
    created() {
      // this.seriseData.xAxis = monthList
    },
    mounted() {
      this.getAllMac()
      this.getAlarmInit()
    },
    computed: {
      monthCpt() {
        return Number(this.baseDate.substr(5, 2))
      },
      dayCpt() {
        return this.baseDate.substr(8, 2)
      },
      isHistoryCpt() {
        return Object.keys(this.historyCharts).length > 0
      },
      ishistoryColums() {
        let ishistoryColums = [{ title: this.$t('date'), key: 'time' }]

        this.selectHistoryTime.forEach(v => {
          // v===1?'00:00-03:00':v===2?'03:00-06:00':v===3?'06:00-09:00':v===4?'09:00-12:00':v===5?'12:00-15:00'
          ishistoryColums.push({ title: timeList.filter(j => j.value === v)[0].type + this.$t('alarmNumber'), key: 'value' + v })
        })
        return ishistoryColums
      },
      tableHistoryCpt() {
        if (this.dataHistory.length > 0) {
          let tableHistoryCpt = []
          tableHistoryCpt = this.dataHistory
          return tableHistoryCpt
        } else {
          return []
        }
      },
      lineDataCpt() {
        let lineDataCpt
        if (this.macLine[0]) {
          this.macData.forEach(v => {
            if (v.value === this.macLine[0]) {
              lineDataCpt =
                v.addrs.map(v => ({
                  value: String(v.addr),
                  label: v.title,
                })) || []
            }
          })
          return lineDataCpt
        } else {
          return []
        }
      },
    },
    methods: {
      getmacMessage(val) {
        const time = dayjs().format('YYYY-MM-DD')
        if (time === dayjs(this.baseDate).format('YYYY-MM-DD')) {
          const dateTime = +dayjs().format('YYYY-MM-DD HH:mm').substr(10, 3)
          let nowTypes = disableFunc(dateTime)

          if (nowTypes < val.value) {
            this.$Message.error({
              content: this.$t('currentTimeNotMonitor'),
            })
          }
        }
      },
      getDisableOption(val) {
        if (val) {
          const time = dayjs().format('YYYY-MM-DD')
          if (time === dayjs(this.baseDate).format('YYYY-MM-DD')) {
            this.isDis = true
            const dateTime = +dayjs().format('YYYY-MM-DD HH:mm').substr(10, 3)

            this.nowType = disableFunc(dateTime)
          } else {
            this.isDis = false
          }
        }
      },
      changeTimeValue(val) {
        this.isShowChart = false
        this.isLoading = true
        let params = {
          mac: this.macLine[0],
          addr: this.macLine[1],
          baseDate: this.baseDate,
          timeRangeType: val,
        }
        this.getStealingElec(params)
      },
      getTimeChange(val) {
        if (this.checkMonth(val[0], val[1])) {
          return this.$Message.error({
            content: this.$t('timeRangeExceed1month'),
          })
        }

        let params = {
          mac: this.macAddr.mac,
          addr: this.macAddr.addr,
          startTime: dayjs(this.dateValue[0]).format('YYYY-MM-DD'),
          endTime: dayjs(this.dateValue[1]).format('YYYY-MM-DD'),
          // timeRangeType: '1'
        }
        this.getHIstoryTableAndCharts(params, false)
      },
      checkMonth(start, end) {
        return new Date(end).getTime() - new Date(start).getTime() >= 31 * 24 * 60 * 60 * 1000
      },
      getEchsrtsValue() {
        if (!this.macLine[0] || !this.macLine[1]) {
          return this.$Message.error({
            content: this.$t('pleaseSelectDeviceLine'),
          })
        }
        if (!this.baseDate) {
          return this.$Message.error({
            content: this.$t('pleaseSelectBaselineDate'),
          })
        }
        this.isShowChart = false
        this.isLoading = true

        let params = {
          mac: this.macLine[0],
          addr: this.macLine[1],
          baseDate: this.baseDate,
          timeRangeType: this.selectTimeValue,
        }
        this.getStealingElec(params)
        this.getAlarmInit()
      },
      getStealingElec(params) {
        queryTrendStealing(params).then(res => {
          if (res.success) {
            let chartsData = res.data

            this.seriseData.xAxis = res.data.map(item => item.time)
            this.seriseData.series = [
              {
                type: 'line',
                name: this.$t('electricityTheftMonitoringBaseline'),
                silent: false,
                data: res.data.map(item => item.basePw),
                lineStyle: { type: 'solid' },
                barMinHeight: 1,
                itemStyle: {
                  color: '#18F1FF',
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                },

                markLine: {
                  silent: true,
                  label: {
                    position: 'start',
                    formatter: `${chartsData[chartsData.length - 1].basePw}`,
                    color: '#18F1FF',
                    padding: [0, 12, 0, 0],
                  },
                  lineStyle: {
                    color: '#18F1FF',
                  },

                  data: [
                    [
                      {
                        coord: [0, chartsData[chartsData.length - 1].basePw],
                        symbol: `image://${querner}`,
                        symbolRotate: 0,
                        symbolSize: [38, 13],
                        symbolOffset: [-23, 0],
                      },
                      {
                        coord: [30, chartsData[chartsData.length - 1].basePw],
                        symbol: 'none',
                        symbolSize: 0,
                        // symbolOffset: [0, -10]
                      },
                    ],
                  ],
                },
              },
              {
                type: 'line',
                name: this.$t('averagePower'),
                silent: false,
                data: res.data.map(item => item.avgPw),
                lineStyle: { type: 'solid' },
                barMinHeight: 1,
                itemStyle: {
                  color: '#007EFF',
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                },
              },
              {
                type: 'line',
                name: this.$t('electricityTheftMonitoringAlarmValue'),
                silent: false,
                data: res.data.map(item => item.upLimitAlmPw),
                lineStyle: { type: 'solid' },
                barMinHeight: 1,
                itemStyle: {
                  color: '#f24e4c',
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                },

                markLine: {
                  silent: true,
                  label: {
                    position: 'start',
                    formatter: `${chartsData[chartsData.length - 1].upLimitAlmPw}`,
                    color: 'red',
                    padding: [0, 12, 0, 0],
                  },
                  lineStyle: {
                    color: 'red',
                  },

                  data: [
                    [
                      {
                        coord: [0, chartsData[chartsData.length - 1].upLimitAlmPw],
                        symbol: 'image://' + require('../../../assets/images/quernere14.png'),
                        symbolRotate: 0,
                        symbolSize: [38, 13],
                        symbolOffset: [-23, 0],
                      },
                      {
                        coord: [30, chartsData[chartsData.length - 1].upLimitAlmPw],
                        symbol: 'none',
                        symbolSize: 0,
                        // symbolOffset: [0, '-100%']
                      },
                    ],
                  ],
                },
              },
            ]
            this.$nextTick(() => {
              this.isLoading = false
              this.isShowChart = true
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      changePage(e) {
        this.currentPageNo = e
        this.getAlarmInit()
      },
      getAlarmInit() {
        let params = {
          page: this.currentPageNo,
          rows: 10,
          projectCode: this.$store.state.projectCode,
          typeNumbers: 1021,
          dateType: 1,
          date: dayjs(this.baseDate).format('YYYY-MM-DD'),
          nodeIds: '',
          mac: this.macLine[0] || '',
          addr: this.macLine[1] || '',
        }

        this.getAlarmList(params)
      },
      getAlarmList(params) {
        warnList(params).then(res => {
          if (res.success) {
            this.stealData = res.datas
            this.totalList = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      openHistroy(row) {
        this.macAddr = row
        let params = {
          mac: row.mac,
          addr: row.addr,
          startTime: dayjs(this.dateValue[0]).format('YYYY-MM-DD'),
          endTime: dayjs(this.dateValue[1]).format('YYYY-MM-DD'),
          // timeRangeType: '1'
        }
        this.getHIstoryTableAndCharts(params, true)
      },
      getHIstoryTableAndCharts(params, type) {
        queryAlarmTimes(params).then(res => {
          if (res.success) {
            let dataArrType = []
            for (let i = 0; i < 8; i++) {
              dataArrType.push({
                type: 'line',
                silent: false,
                name: `${timeList[i].type}`,
                data: res.data
                  .map(v => v.detailVos)
                  .flat()
                  .filter(j => j.timeRangeType === i + 1)
                  .map(item => ({
                    value: item.alarmTimes, // + 2 * Math.random().toFixed(1)
                    name: i + 1,
                  })),
                lineStyle: { type: 'solid' },
                barMinHeight: 1,
                itemStyle: {
                  color: `${timeList[i].color}`,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                },
              })
            }
            this.dataEightLine = dataArrType
            this.dateaLinexAxis = res.data.map(v => v.time.substr(5))

            this.dataHistory = res.data.map(item => ({
              ...item,
              value1: item.detailVos.filter(v => v.timeRangeType === 1)[0].alarmTimes,
              value2: item.detailVos.filter(v => v.timeRangeType === 2)[0].alarmTimes,
              value3: item.detailVos.filter(v => v.timeRangeType === 3)[0].alarmTimes,
              value4: item.detailVos.filter(v => v.timeRangeType === 4)[0].alarmTimes,
              value5: item.detailVos.filter(v => v.timeRangeType === 5)[0].alarmTimes,
              value6: item.detailVos.filter(v => v.timeRangeType === 6)[0].alarmTimes,
              value7: item.detailVos.filter(v => v.timeRangeType === 7)[0].alarmTimes,
              value8: item.detailVos.filter(v => v.timeRangeType === 8)[0].alarmTimes,
            }))
            // this.selectHistoryTime = [1]
            this.historyCharts = {}
            this.historyCharts.time = new Date().getFullYear()
            this.historyCharts.xAxis = res.data.map(v => v.time.substr(5))
            this.historyCharts.series = this.dataEightLine.filter(v => this.selectHistoryTime.includes(v.data[0].name))
            if (type) {
              this.historyModal = true
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getMacLine(val) {},
      getBaseDate(val) {
        this.baseDate = val
      },
      resetLists() {
        this.macLine = []
        this.selectMac = ''
        this.selectLine = ''
        this.baseDate = ''
        this.selectTimeValue = 1
      },
      handleTypes(val) {
        if (val.length > 0) {
          this.historyCharts = {}
          this.historyCharts.time = new Date().getFullYear()
          this.historyCharts.xAxis = this.dateaLinexAxis
          this.historyCharts.series = this.dataEightLine.filter(v => val.includes(v.data[0].name))
        }
      },
      getAllMac() {
        let params = {
          projectCode: this.$store.state.projectCode,
          pageSize: 1000,
          equipmentTypes: '1,2,19',
          pageNo: 1,
        }
        pageQueryAddr(params).then(res => {
          if (res.success) {
            this.macData = res.datas.map(item => ({
              addrs: item.addrs,
              value: item.mac,
              label: (item.name + '(' + item.mac + ')').length > 15 ? (item.name + '(' + item.mac + ')').substr(0, 15) + '...' : item.name + '(' + item.mac + ')',
              disabled: !item.addrs || item.addrs.length === 0,
              textContent: item.name + '(' + item.mac + ')',
              children:
                item.addrs.map(v => ({
                  value: String(v.addr),
                  label: v.title,
                })) || [],
            }))
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .select-time {
    .ivu-select-dropdown {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .stealing-head {
    .ivu-cascader-menu .ivu-cascader-menu-item {
      padding-right: 20px !important;
    }
  }
  .steal-Details {
    display: flex;
    justify-content: space-between;
  }
  .stealing-head {
    background: #1a202e;
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }
  .content-Charts {
    background: #1a202e;
    margin-top: 10px;
    padding: 25px 15px 10px;
  }
  .conten-head {
    display: flex;
    justify-content: space-around;
  }
</style>
