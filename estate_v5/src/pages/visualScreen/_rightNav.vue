<template>
  <div class="content">
    <div class="all-statistics" :style="rightHeight ? 'height:21%' : 'height:18%'">
      <Row justify="space-between">
        <Col span="10">
          <span class="title-color-device" v-textRoll>{{ $t('overviewStatistics') }}</span>
        </Col>
        <Col span="12">
          <img src="../../assets/images/title-riht-bgc.png" alt="" class="title-right-img" />
        </Col>
      </Row>
      <div class="total-statistics">
        <db-loading :loading="!loadingStatus.detailList">
          <Row>
            <template v-for="(item, index) in lists">
              <Col :span="8" :key="index" v-show="item.show" @click.native="getLists(item.method, item.type)" class="pointer" :style="{ 'margin-top': rightHeight ? '5px' : '20px' }">
                <div :key="index" style="display: flex">
                  <div class="left-icon">
                    <div><img :src="item.image" alt="" class="total-Icon" /></div>
                  </div>
                  <div class="right-content">
                    <div v-textRoll class="textRoll-nowrap pd-l10">{{ item.title }}</div>
                    <div class="pd-l10">{{ item.value }}</div>
                  </div>
                </div>
              </Col>
            </template>
          </Row>
        </db-loading>
      </div>
    </div>
    <div class="pending-processing-alarm">
      <Row justify="space-between">
        <Col span="10">
          <span class="title-color-device" v-textRoll>{{ $t('pendingAlarm') }}</span>
        </Col>
        <Col span="12">
          <img src="../../assets/images/title-riht-bgc.png" alt="" class="title-right-img" />
        </Col>
      </Row>
      <db-loading :loading="!loadingStatus.processAlarmLoading">
        <toProcessAlarmVue :options="alarmOptions"></toProcessAlarmVue>
      </db-loading>
    </div>
    <div class="content_top">
      <div>
        <div class="alarm-between">
          <div class="img_row_col">
            <i class="img_row_art" v-textRoll>{{ $t('alarmSituationDistribution') }}</i>
          </div>
          <div class="img_row_col">
            <Button class="img_row_col_btn" :class="tabVal === 'alarm' ? 'alarm-button-active' : 'default-alarm-b'" size="small" @click="handleTabVal('alarm')">
              <div v-textRoll>{{ $t('alarm') }}</div>
            </Button>
            <Button class="img_row_col_btn ml-10" :class="tabVal === 'warning' ? 'alarm-button-active' : 'default-alarm-b'" size="small" @click="handleTabVal('warning')">
              <div v-textRoll>{{ $t('earlyWarning') }}</div>
            </Button>
          </div>
        </div>
        <db-loading :loading="!loadingStatus.policeInformationRelease">
          <div>
            <pie :options="tabVal === 'alarm' ? typeAlarmTypes : typeAlarmTypes2" />
          </div>
        </db-loading>
      </div>
    </div>
    <div class="content_content" :style="rightHeight ? 'height:24%' : 'height:27%'">
      <Row justify="space-between">
        <Col span="10">
          <span class="title-color-device" v-textRoll>{{ $t('alarmSituationTrend') }}</span>
        </Col>
        <Col span="12">
          <img src="../../assets/images/title-riht-bgc.png" alt="" class="title-right-img" />
        </Col>
      </Row>
      <div style="margin-top: 10px">
        <db-loading :loading="!loadingStatus.warningTrend">
          <bar :options="barOptions"></bar>
        </db-loading>
      </div>
    </div>
  </div>
</template>

<script>
  import screenPie from './charts/NestPie.vue'
  import screenBar from './charts/screenBar.vue'
  import toProcessAlarmVue from './charts/toProcessAlarm.vue'
  import { alarmTypeDistribution, alarmTrend, alarmUnprocessedTrend } from '@/api/visualScreen/index.js'
  import { getIndexStatData, queryPageAuth } from '@/api/visualScreen/index'
  import store from '@/store/index'
  import { addMarkPoint } from './visualScreenFunc'
  import dayjs from 'dayjs'
  export default {
    props: {
      loadingStatus: {
        type: Object,
      },
    },
    components: {
      pie: screenPie,
      bar: screenBar,
      toProcessAlarmVue,
    },
    data() {
      return {
        alarmOptions: {
          title: { show: true, text: window.$t('numberOfTimes') },
          xAxis: [],
          series: [],
        },
        authState: '',
        allSpan: '2',
        allBiddingLineShow: false,
        onOffBiddingLineShow: false,
        statData: '',
        typeAlarmTypes: { legend: [], series: [] },
        typeAlarmTypes2: { legend: [], series: [] },
        barOptions: { customHeight: '', xAxis: [], series: [], title: { show: true, text: this.$t('quantity') } },
        alarm: [],
        time: [],
        warn: [],
        tabVal: 'alarm',
        timer: null,
        statTimer: null,
      }
    },
    computed: {
      rightHeight() {
        return this.lists.filter(v => v.show).length > 6
      },
      lists() {
        return [
          {
            title: window.$t('totalNumberOfProjects'),
            show: true,
            value: !this.statData.totalProject ? 0 : this.statData.totalProject,
            method: 'handleProjects',
            type: '',
            image: require(`../../assets/images/iconpro-total.png`),
          },
          {
            title: window.$t('numberOfAlarmsToday'),
            show: true,
            value: !this.statData.totalAlarmToday ? 0 : this.statData.totalAlarmToday,
            method: 'handleQuantity',
            type: '1',
            image: require(`../../assets/images/dayTotal@2x.png`),
          },
          {
            title: window.$t('numberOfAlarmsInThisMonth'),
            show: true,
            value: !this.statData.totalAlarmThisMonth ? 0 : this.statData.totalAlarmThisMonth,
            method: 'handleQuantity',
            type: '2',
            image: require(`../../assets/images/monthAlarmTotal@2x.png`),
          },
          {
            title: window.$t('totalDevice'),
            show: true,
            value: !this.statData.totalMac ? 0 : this.statData.totalMac,
            method: 'handleDevice',
            type: '100',
            image: require(`../../assets/images/icon_banshou@2x.png`),
          },
          {
            title: window.$t('numOfOnlineDevice'),
            show: true,
            value: !this.statData.totalOnlineMac ? 0 : this.statData.totalOnlineMac,
            method: 'handleDevice',
            type: '1',
            image: require(`../../assets/images/icon_allOnline@2x.png`),
          },
          {
            title: window.$t('numOfOfflineDevice'),
            show: true,
            value: !Number(this.statData.totalMac - this.statData.totalOnlineMac) ? 0 : Number(this.statData.totalMac - this.statData.totalOnlineMac),
            method: 'handleDevice',
            type: '0,-1',
            image: require(`../../assets/images/icon_offLine@2x.png`),
          },
          {
            title: window.$t('totalNumberOfLines'),
            show: this.allBiddingLineShow,
            value: !this.statData.totalLine ? 0 : this.statData.totalLine,
            method: '',
            type: '',
            image: require(`../../assets/images/lineTotal@2x.png`),
          },
          {
            title: window.$t('numberOfOnlineLines'),
            show: this.onOffBiddingLineShow,
            value: !this.statData.totalOnlineLine ? 0 : this.statData.totalOnlineLine,
            method: '',
            type: '',
            image: require(`../../assets/images/icon_allOnline@2x.png`),
          },
          {
            title: window.$t('numberOfOfflineLines'),
            show: this.onOffBiddingLineShow,
            value: !this.statData.totalOfflineLine ? 0 : this.statData.totalOfflineLine,
            method: '',
            type: '',
            image: require(`../../assets/images/icon_offLine@2x.png`),
          },
        ]
      },
    },
    created() {
      this.queryQueryPageAuth()
    },
    destroyed() {
      window.clearInterval(this.timer)
      window.clearInterval(this.statTimer)
      this.timer = null
      this.statTimer = null
    },
    mounted() {
      this.init()
      this.getlunxunData()
      this.queryIndexStatData()
    },
    methods: {
      getlunxunData() {
        this.timer = window.setInterval(this.init, 66 * 1000)
        this.statTimer = window.setInterval(this.queryIndexStatData, 6 * 1000)
      },
      init() {
        this.queryDistribution()
        this.queryalarmTrend()
        this.queryProcessAlarm()
      },
      async queryDistribution() {
        const res = await alarmTypeDistribution()
        if (res.success) {
          this.typeAlarmTypes.series = []
          this.typeAlarmTypes2.series = []
          let data = []
          let _data = []
          res.data.forEach((item, index) => {
            if ([-100].indexOf(item.classify) !== -1 && item.number > 0) {
              data.push({ name: item.info, value: item.number, tno: item.typeNumber })
            } else if ([-200].indexOf(item.classify) !== 1 && item.number > 0) {
              _data.push({ name: item.info, value: item.number, tno: item.typeNumber })
            }
          })
          this.typeAlarmTypes.series.push({
            type: 'pie',
            data: data,
            z: 9,
            radius: ['40%', '55%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '20', fontWeight: 'bold' } } },
            labelLine: { normal: { show: false } },
          })
          this.typeAlarmTypes2.series.push({
            type: 'pie',
            data: _data,
            z: 9,
            radius: ['40%', '55%'],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: { normal: { show: false, position: 'center' }, emphasis: { show: false, textStyle: { fontSize: '20', fontWeight: 'bold' } } },
            labelLine: { normal: { show: false } },
          })
          let legend = this.legendData(data)
          let _legend = this.legendData(_data)
          this.typeAlarmTypes.legend.data = legend
          this.typeAlarmTypes2.legend.data = _legend
          this.loadingStatus.policeInformationRelease = true
        } else {
          this.$Message.error({ content: res.message })
        }
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
      async queryalarmTrend() {
        const res = await alarmTrend()
        if (res.success) {
          this.alarm = res.data.map(it => it.alarm)
          this.time = res.data.map(it => it.time)
          this.warn = res.data.map(it => it.warn)
          this.barOptions.xAxis = []
          this.barOptions.series = []
          this.barOptions.xAxis = this.time
          this.barOptions.series = [
            {
              name: window.$t('alarm'),
              type: 'bar',
              barWidth: '20%',
              barGap: 1,
              data: this.alarm,
              xAxisIndex: 1,
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
                      { offset: 0, color: 'rgba(18, 249, 255, .8)' },
                      { offset: 1, color: 'rgba(18, 249, 255, .2)' },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              name: window.$t('earlyWarning'),
              type: 'bar',
              barWidth: '20%',
              xAxisIndex: 1,
              barGap: 1,
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
                      { offset: 0, color: 'rgba(90, 109, 246, .8)' },
                      { offset: 1, color: 'rgba(90, 109, 246, .2)' },
                    ],
                    globalCoord: false,
                  },
                },
              },
            },
            {
              type: 'bar',
              showBackground: true,
              itemStyle: {
                color: 'transparent',
              },
              data: this.alarm,
            },
          ]
          this.barOptions.series[0].markPoint = { data: addMarkPoint(this.alarm) }
          this.barOptions.series[1].markPoint = { data: addMarkPoint(this.warn) }
          this.loadingStatus.warningTrend = true
        }
      },
      handleTabVal(val) {
        this.tabVal = val
      },
      getLists: function (itemMethods, itemType) {
        this[itemMethods](itemType)
      },
      async queryIndexStatData() {
        store.commit('statisticsFlag', false)
        const res = await getIndexStatData()
        if (res.success) {
          this.statData = res.data
          if (this.rightHeight) {
            store.commit('screenBarHeight', 260)
          } else {
            store.commit('screenBarHeight', null)
          }
          this.loadingStatus.detailList = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleProjects() {
        this.$router.push({
          name: 'Overviews',
          params: {
            projectName: this.$store.state.fullName,
          },
        })
      },
      handleDevice(status) {
        this.$router.push({
          name: 'deviceList',
          params: {
            projectCode: this.$store.state.projectCode,
            status: status,
          },
        })
      },
      handleQuantity(dateType) {
        this.$router.push({
          name: 'Alarm',
          params: {
            projectCode: this.$store.state.allProjects.data.map(it => it.projectCode).toString(),
            typeNumber: '-100',
            status: '',
            oqp2: '',
            type: dateType,
          },
        })
      },
      async queryQueryPageAuth() {
        let params = {
          resKeys: 'V5_PROJECT_USE,V5_PROJECT_USE',
          operKeys: 'GET_ADDR_COUNT,GET_ADDR_ONLINE_COUNT',
        }
        const res = await queryPageAuth(params)
        if (res.success) {
          this.authState = res.data
          this.allSpan = !this.authState[0].result && !this.authState[1].result ? '3' : '2'
          this.allBiddingLineShow = !!this.authState[0].result
          this.onOffBiddingLineShow = !!this.authState[1].result
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      queryProcessAlarm() {
        const series = {
          name: '',
          type: 'line',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(19, 255, 255, 0.8)' },
                { offset: 1, color: 'rgba(0, 201, 78, .1)' },
              ],
              global: false,
            },
          },
          itemStyle: { color: '#12F9FF' },
          showSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 4,
          smooth: true,
        }
        // 'rgba(0, 201, 78, .6)', 'rgba(0, 201, 78, .1)', '#12F9FF'
        alarmUnprocessedTrend().then(res => {
          if (res.success) {
            let dataAlarm = res.data.map(v => v.value)
            this.alarmOptions.xAxis = res.data.map(v => dayjs(v.time).format('MM-DD'))
            this.alarmOptions.series = [
              {
                ...series,
                data: dataAlarm,
              },
            ]
            this.alarmOptions.series[0].markPoint = { data: addMarkPoint(dataAlarm) }
          } else {
            this.alarmOptions.xAxis = []
            this.alarmOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
          this.loadingStatus.processAlarmLoading = true
        })
      },
    },
    watch: {},
  }
</script>

<style lang="less" scoped>
  .content {
    width: 100%;
    background-color: transparent;
    height: 100%;
    position: relative;
    .total-Icon {
      width: 40px;
      height: 40px;
    }
    .textRoll-nowrap {
      white-space: nowrap;
      color: #99b3c8;
      width: 100%;
      font-size: 12px;
    }
    .mt-30 {
      margin-top: 30px;
    }
    .mt-20 {
      margin-top: 20px;
    }
    .pd-l10 {
      margin-left: 5px;
    }
    .pd-l-custom {
      //padding-left: 10px;
    }
    .total-statistics {
      height: calc(~'100% - 40px');
      padding-left: 20px;
      margin-top: 5px;
      /deep/.container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        .ivu-row {
          .right-content {
            overflow: hidden;
          }
        }
      }
    }
    .dflex-statistics {
      display: flex;
    }
    .title-right-img {
      height: 16px;
      width: 100%;
    }
    .title-color-device {
      color: #73afec;
      font-weight: 600;
      font-size: 16px;
      padding-left: 15px;
      display: inline-block;
      width: 100%;
    }
    .all-statistics {
      background: url('../../assets/images/bgc6@2x.png') no-repeat;
      background-size: 100% 100%;
      height: 18%;
      padding-top: 15px;
      overflow: hidden;
    }
    .pending-processing-alarm {
      margin-top: 20px;
      background: url('../../assets/images/bgc7@2x.png') no-repeat;
      background-size: 100% 100%;
      height: 21%;
      padding: 20px 15px 0 15px;
      overflow: hidden;
    }
    .content_top {
      margin-top: 20px;
      padding-top: 20px;
      background: url('../../assets/images/bgc8@2x.png') no-repeat;
      background-size: 100% 100%;
      height: 23%;
      overflow: hidden;
      .ivu-btn:focus {
        box-shadow: none;
      }
      .alarm-button-active {
        background: rgba(45, 80, 133, 0.5);
        border-radius: 2px;
        border: 1px solid #385985;
        color: #73afec;
      }
      .default-alarm-b {
        color: #7fcbfa;
        border-radius: 2px;
        opacity: 0.5;
        border: 1px solid #385985;
      }
      .alarm-between {
        display: flex;
        justify-content: space-between;
        .img_row_col {
          width: 48%;
        }
        .img_row_col_btn {
          width: 47%;
        }
      }
      .img_row_art {
        color: #73afec;
        font-weight: 600;
        font-size: 16px;
        padding-left: 10px;
        display: inline-block;
        width: 100%;
      }
    }

    .content_content {
      margin-top: 20px;
      padding-top: 20px;
      background: url('../../assets/images/bgc9@2x.png') no-repeat;
      background-size: 100% 100%;
      // height: 27%;
      .bom {
        width: 100%;
        background-size: 100% 100%;
        height: 35px;
        display: flex;
        align-items: center;
        .img_row {
          position: absolute;
          width: 100%;
          display: flex;

          .img_row_col {
            width: 100%;
            .img_row_art {
              // font-style:italic;
              // font-family: 'SimHei';
              font-weight: 600;
              font-size: 14px;
              // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
              color: white;
            }
          }
        }
      }
    }
  }
  @media only screen and (min-width: 1024px) {
    .content_top,
    .content_content {
      padding: 10px;
    }
    .content_top {
      margin-bottom: 6px;
    }
  }
  @media only screen and (min-width: 1366px) {
    .content_top {
      margin-bottom: 10px;
    }
  }
  @media only screen and (min-width: 1920px) {
    .content_top,
    .content_content {
      padding: 20px;
    }
    .content_top {
      margin-bottom: 10px;
    }
  }
</style>
