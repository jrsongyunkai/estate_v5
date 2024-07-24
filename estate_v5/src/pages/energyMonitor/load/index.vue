<template>
  <div id="load">
    <div class="form">
      <div style="float: left">
        <Input class="short-input" v-model="params.mac" style="width: 200px" :placeholder="$t('enterDeviceNo')" clearable></Input>

        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px; margin-left: 10px" :placeholder="$t('selectGroupingType')" :clearable="true">
          <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
      </div>

      <div class="" style="margin-left: 10px; float: left">
        <TreeSelect :placeholder="$t('selectGroup')" style="width: 200px" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" />
      </div>
      <Button type="primary" @click="inits" style="margin-left: 10px; background: #007eff">{{ $t('query') }}</Button>
      <Button @click="reset" style="margin-left: 10px">{{ $t('reset') }}</Button>
    </div>
    <Row :gutter="10" class="project_trend mt">
      <Col span="12">
        <div class="pd content">
          <div class="title">{{ $t('loadpowerConsumptionTrenday') }}</div>
          <line-area-chart :options="HoursOptions"></line-area-chart>
        </div>
      </Col>
      <Col span="12">
        <div class="pd content">
          <div class="title">{{ $t('loadpowerConsumptionTrenweek') }}</div>
          <line-area-chart :options="WeekOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <Row :gutter="10">
      <Col span="12" class="mt">
        <div class="pd content">
          <div class="title">{{ $t('last2monthLoadTrend') }}</div>
          <line-area-chart :options="setMonthOptions"></line-area-chart>
        </div>
      </Col>
      <Col span="12" class="mt">
        <div class="pd content">
          <div class="title">{{ $t('loadpowerConsumptionTrenyear') }}</div>
          <line-area-chart :options="YearsOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { groupingList, tree } from '@/api/safetyMonitor/public'
  import { getGroupType, getGroupTree } from '@/api/public'
  import BarCharts from '@/pages/Common/Bars'
  import LineCharts from '@/pages/Common/Line'
  import LineAreaChart from './LineChart.vue'

  import { loadStatsOfLast2Day } from '@/api/console/project'
  import dayjs from 'dayjs'
  import { sameMarkPoint, differenceMarkPoint, typeAxis, timeType } from './load'
  export default {
    name: 'energyMonitor-load',
    data() {
      return {
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        firstLine: false,
        secondLine: false,
        thirdBar: false,
        firstLineOptions: {
          series: [],
          xAxis: [],
          title: {
            show: true,
            text: this.$t('loadSituationPastTwoDays'),
          },
          legendSelect: false,
          tooltip: {
            trigger: 'axis',
            formatter: '{b}' + this.$t('hour') + '<br/>' + this.$t('yesterdayLoad') + '：{c0}<br/>' + this.$t('todayLoad') + '：{c1}',
          },
        },
        secondLineOptions: {
          series: [],
          xAxis: [],
          title: {
            show: true,
            text: this.$t('loadSituationPastTwoWeeks'),
          },
          legendSelect: false,
          tooltip: {
            trigger: 'axis',
            formatter: '',
          },
        },
        thirdBarOptions: {
          legendStatus: true,
          xAxisType: '',
          yAxisType: '',
          xAxis: [],
          series: [],
          title: {
            show: true,
            text: this.$t('loadSituationThisYearLastMonth'),
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: '{b}<br/>' + this.$t('loadLastYear') + '：{c0}<br/>' + this.$t('loadThisYear') + '：{c1}',
          },
        },
        model1: '',
        cityList1: [],
        value: '',
        cityList2: [],
        HoursOptions: {
          left: '90',
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        afterPower: [],
        prePower: [],
        hourstime: [],
        WeekOptions: {
          left: '90',
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        wafterPower: [],
        wprePower: [],
        weekstime: [],
        YearsOptions: {
          left: '90',
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        setMonthOptions: {
          left: '90',
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        yafterPower: [],
        yprePower: [],
        yeekstime: [],
        params: {
          projectCode: this.$store.state.projectCode,
          mac: '',
          nodeId: '',
        },
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getGroupTypes()
        this.inits()
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        getGroupType(params)
          .then(res => {
            //
            if (res.success) {
              this.packetList = res && res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      async inits() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return
        }
        const dateTypeConfig = {
          2: { preName: this.$t('yesterday2'), afterName: this.$t('dayBeforeYesterday'), data: 'HoursOptions', interval: 4 },
          3: { preName: this.$t('thisMonth'), afterName: this.$t('lastMonth'), data: 'setMonthOptions', interval: 24 },
          4: { preName: this.$t('thisYear'), afterName: this.$t('lastYear'), data: 'YearsOptions', interval: 30 },
          5: { preName: this.$t('thisWeek'), afterName: this.$t('lastWeek'), data: 'WeekOptions', interval: 24 },
        }
        let paramsArr = ['2', '3', '4', '5'].map(item => ({ projectCode: this.$store.state.projectCode, mac: this.params.mac, nodeId: this.packetFilter.length ? this.packetFilter.join(',') : '', statsType: item, time: dayjs().format('YYYY-MM-DD') }))
        Promise.all([this.loadData(paramsArr[0]), this.loadData(paramsArr[1]), this.loadData(paramsArr[2]), this.loadData(paramsArr[3])]).then(([res1, res2, res3, res4]) => {
          this.queryGetLoadData(res1, dateTypeConfig[2])
          this.queryGetLoadData(res2, dateTypeConfig[3])
          this.queryGetLoadData(res3, dateTypeConfig[4])
          this.queryGetLoadData(res4, dateTypeConfig[5])
        })
      },
      reset() {
        this.packetTypes = ''
        this.packetFilter = []
        this.model1 = ''
        this.cityList2 = []
        this.params.mac = ''
      },
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes })
          .then(res => {
            if (res.code === '0') {
              this.packNewlist = res.data
              let resData = this.getTree(res.data)
              this.packetFilterList = this.cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      groupingType(e) {
        if (e === undefined) return false
        else this.changeType(e)
      },
      getdata() {
        groupingList({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.data) {
            this.cityList1 = res.data
            for (let i = 0; i < res.data.length; i++) {
              this.cityList1[i].value = res.data[i].id
            }
          }
          //
        })
      },
      changeType(groupId) {
        this.$nextTick(() => {
          tree({ groupId }).then(res => {
            // 使用递归
            function sys(arr, parentId) {
              let data2 = []

              if (arr.length === 0) {
                return false
              } else {
                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                let pArr = res.data.filter(value => {
                  // 筛选出满足条件的
                  return value.parentId === parentId
                })
                let mArr = arr.filter(value => {
                  // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                  return value.parentId !== parentId
                })
                pArr.forEach((value, i) => {
                  let arr = {}
                  arr.title = value.name
                  arr.value = value.id
                  arr.children = sys(mArr, value.id)
                  data2.push(arr)
                })
                return data2
              }
            }
            this.cityList2 = sys(res.data, 0)
          })
        })
      },
      loadData(params) {
        return new Promise(resolve => {
          loadStatsOfLast2Day(params).then(res => {
            resolve(res)
          })
        })
      },
      queryGetLoadData(res, { preName, afterName, data, interval }) {
        if (!res.success) {
          return this.$Message.error(res.message)
        }

        this[data].customTime = res.data.map(item => timeType[data](item.xAxis))
        this[data].xAxis = {
          type: 'category',
          data: res.data.map(item => typeAxis[data](item.xAxis)).map(item => ({ value: item, textStyle: { color: '#fff' } })),
          show: true,
          axisLabel: {
            show: true,
            interval: interval,
          },
        }

        this[data].yAxis.name = `${this.$t('electricQuantity')}(kW)`
        const prePower = res.data.map(item => item.pre1Pwr)
        const afterPower = res.data.map(item => item.pre2Pwr)
        this[data].series = [
          {
            name: preName,
            type: 'line',
            data: prePower,
            itemStyle: {
              color: '#0DD667',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                  { offset: 1, color: 'rgba(13, 214, 103, 0.3)' },
                ],
                global: false,
              },
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            smooth: true,
          },
          {
            name: afterName,
            type: 'line',
            data: afterPower,
            itemStyle: {
              color: '#0373e6',
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                  { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                ],
                global: false,
              },
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            smooth: true,
          },
        ]
        this[data].series[0].markPoint = this.$func.isSameArray(prePower) ? sameMarkPoint : differenceMarkPoint
        this[data].series[1].markPoint = this.$func.isSameArray(afterPower) ? sameMarkPoint : differenceMarkPoint
      },
    },
    watch: {
      '$store.state.projectCode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        },
      },
    },
    components: {
      BarCharts,
      LineCharts,
      LineAreaChart,
    },
  }
</script>
<style lang="less" scoped>
  .title {
    //   width: 96px;
    height: 16px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
  .mt {
    margin-top: 10px;
  }
  .mb {
    margin-bottom: 20px;
  }
  .pd {
    padding: 20px;
  }
  .form {
    background: #1a202e;
    padding-left: 20px;
    // float:left;
    height: 52px;
    line-height: 52px;
    margin-bottom: 10px;
    // width: 100%;
  }
  .short-input {
    width: 200px;
  }
</style>
