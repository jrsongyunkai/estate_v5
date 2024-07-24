<template>
  <div class="content">
    <div class="content_top">
      <div class="header">
        <Row class="img_row">
          <Col span="12" class="img_row_col tl">
            <i class="img_row_art ml-10" v-textRoll>{{ $t('energyConsumptionTrend') }}</i>
          </Col>
          <Col span="11" class="img_row_col tr">
            <i class="img_row_fff" @click="checkedProjectStr.length > 1 ? handleControl('1') : handleGoContent('1')">{{ $t('remoteControl') }} ></i>
            <Modal :title="$t('selectProject')" id="controlMod" v-model="controlState">
              <input class="header-search" v-model="message" type="text" :placeholder="$t('searchProject')" />
              <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleSelect(item)">
                {{ item.projectName }}
              </div>
              <div slot="footer"></div>
            </Modal>
          </Col>
        </Row>
      </div>
      <db-loading :loading="!loadingStatus.energyConsumptiontrendNum">
        <Row class="content_cont" align="middle">
          <Col span="6" offset="7" class="head">{{ $t('thisYear') }}</Col>
          <Col span="6" class="head">{{ $t('thisMonth') }}</Col>
          <Col span="5" class="head">
            <div v-if="!isOpenPrjGrpHourPowerStat">{{ $t('yesterday') }}</div>
            <div v-else>
              <Dropdown @on-click="getDropdownItem" trigger="click" class="power-name">
                <a href="javascript:void(0)" class="head">
                  {{ dateName }}
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="item in powerMenuConfig" :key="item.value" :name="item.value">{{ item.label }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Col>
          <Col span="7" class="demission">{{ $t('powerConsumption') }}</Col>
          <Col span="6">
            <div style="cursor: pointer" class="fot power-value" v-textRoll @click="handleReport('yearReport')">{{ Math.ceil(+statis.curYearPower) || 0 }}</div>
          </Col>
          <Col span="6">
            <div style="cursor: pointer" class="fot power-value" v-textRoll @click="handleReport('monthReport')">{{ Math.ceil(+statis.curMonthPower) || 0 }}</div>
          </Col>
          <Col span="5" class="fot power-value">
            <div v-textRoll>{{ Math.ceil(+statis.statisticsPower) || 0 }}</div>
          </Col>
          <Col span="7" class="demission">
            <span class="tan-text">
              <Tooltip class="tips" max-width="250" placement="right" transfer>
                {{ $t('carbonEmission') }}(kgCO₂)
                <Icon type="ios-information-circle-outline" size="12" color="#1497db" />
                <div slot="content">
                  <p>{{ $t('carbonEmissionTip') }}</p>
                  <p>{{ $t('carbonEmissionValueTip') }}</p>
                </div>
              </Tooltip>
            </span>
          </Col>
          <Col span="6">
            <div style="cursor: pointer" class="fot carbon-value" v-textRoll @click="handleReport('yearReport')">{{ getCo2(statis.curYearPower) }}</div>
          </Col>
          <Col span="6">
            <div style="cursor: pointer" class="fot carbon-value" v-textRoll @click="handleReport('monthReport')">{{ getCo2(statis.curMonthPower) }}</div>
          </Col>
          <Col span="5" class="fot carbon-value">
            <div v-textRoll>{{ getCo2(statis.statisticsPower) }}</div>
          </Col>
        </Row>
      </db-loading>
      <db-loading :loading="!loadingStatus.energyConsumptiontrendData">
        <div>
          <line-area :options="trendOptions"></line-area>
        </div>
      </db-loading>
    </div>
    <div class="content-deviceType">
      <div style="padding-top: 20px">
        <Row class="img_row" justify="space-between">
          <Col span="10" class="img_row_col tl">
            <i class="title-color-device ml-10" v-textRoll>{{ $t('equipmentClassification') }}</i>
          </Col>
          <Col span="12">
            <img src="../../assets/images/title-riht-bgc.png" alt="" class="title-right-img" />
          </Col>
        </Row>
      </div>
      <db-loading :loading="!loadingStatus.equipmentClassification">
        <div><pie :options="pieOptions"></pie></div>
      </db-loading>
    </div>
    <div class="content-deviceType">
      <div style="padding-top: 20px">
        <Row class="img_row">
          <Col span="16" class="img_row_col tl">
            <i class="title-color-device ml-10" v-textRoll>{{ $t('equipmentPowerCurve') }}</i>
          </Col>
          <Col span="8">
            <div class="pointer checkDetail" @click="$router.push('/power-trend')">{{ $t('viewDetails') }}></div>
          </Col>
        </Row>
      </div>
      <db-loading :loading="!loadingStatus.equipmentClassification">
        <div style="padding: 0 10px"><line-area :options="powerOption"></line-area></div>
      </db-loading>
    </div>
    <div class="content_bom">
      <div class="bom">
        <div style="display: flex; align-items: center">
          <Row class="img_row">
            <Col span="12" class="img_row_col tl">
              <i class="img_row_art ml-10" v-textRoll>{{ $t('workOrderManagement') }}</i>
            </Col>
            <Col span="11" class="report img_row_col tr">
              <i class="img_row_fff" @click="checkedProjectStr.length > 1 ? handleControl('2') : handleGoContent('2')">
                {{ $t('statisticalReport') }}
                <Icon custom="icon-v5 icon-v5-xiazai" />
              </i>
              <Modal :title="$t('selectProject')" id="reportMod" v-model="reportState">
                <input class="header-search" v-model="message" type="text" :placeholder="$t('searchProject')" />
                <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item, '1')">
                  {{ item.projectName }}
                </div>
                <div slot="footer"></div>
              </Modal>
            </Col>
          </Row>
        </div>
        <div class="content_bom_img">
          <div class="content_bom_img_div" @click="handleContent('1')">
            <div>
              <img class="dfs" src="../../assets/images/workWarning.png" alt="" />
              <div class="div_font tc">{{ $t('hiddenDangerInquiry') }}</div>
            </div>
            <countTo class="div_number div_color_f tc" :startVal="startVal" :endVal="!workOrder.hiddenDangerCount ? 0 : workOrder.hiddenDangerCount" :duration="times"></countTo>
          </div>
          <div class="content_bom_img_div" @click="checkedProjectStr.length > 1 ? handleControl('3') : handleGoContent('3')">
            <div>
              <img class="dfs" src="../../assets/images/iconHandle@2x.png" alt="" />
              <div class="div_font tc">{{ $t('processing') }}</div>
            </div>
            <countTo class="div_number div_color_s tc" :startVal="startVal" :endVal="!workOrder.workOrderProcessingCount ? 0 : workOrder.workOrderProcessingCount" :duration="times"></countTo>
            <Modal :title="$t('selectProject')" id="workMod" v-model="workOrderState">
              <input class="header-search" v-model="message" type="text" :placeholder="$t('searchProject')" />
              <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item, '2')">
                {{ item.projectName }}
              </div>
              <div slot="footer"></div>
            </Modal>
          </div>
          <div class="content_bom_img_div" @click="checkedProjectStr.length > 1 ? handleControl('4') : handleGoContent('4')">
            <div>
              <img class="dfs" src="../../assets/images/iconFinish@2x.png" alt="" />
              <div class="div_font tc">{{ $t('completeWorkOrder') }}</div>
            </div>
            <countTo class="div_number div_color_t tc" :startVal="startVal" :endVal="!workOrder.workOrderProcessedCount ? 0 : workOrder.workOrderProcessedCount" :duration="times"></countTo>
            <Modal :title="$t('selectProject')" id="workMod2" v-model="workOrderState2">
              <input class="header-search" v-model="message" type="text" :placeholder="$t('searchProject')" />
              <div class="count" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleWork(item, '3')">
                {{ item.projectName }}
              </div>
              <div slot="footer"></div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import screenElectricArea from './charts/screenElectricArea.vue'
  import { mapState } from 'vuex'
  import powerBar from './charts/devicePowerBar.vue'
  import { energyStatistics, energyTrend, workOrderStatistics, powerTrend, getEquipClassifyStatList } from '@/api/visualScreen/index.js'
  import countTo from 'vue-count-to'
  import { powerToCarbon, roundPrecision } from '@utils/math'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  import screenPie from './charts/BotPie.vue'
  import { addMarkPoint, powerMenuConfig } from './visualScreenFunc'
  export default {
    props: {
      loadingStatus: { type: Object },
    },
    components: { lineArea: screenElectricArea, countTo, pie: screenPie, bar: powerBar },
    data() {
      return {
        powerMenuConfig,
        dateName: window.$t('yesterday'),
        devicePower: [],
        powerOption: { xAxis: [], series: [], title: { show: true, text: `${this.$t('power')}(kW)` } },
        pieOptions: { legend: [], series: [] },
        startVal: 0,
        times: 2000,
        Ysearch: '',
        controlState: false,
        reportState: false,
        workOrderState: false,
        workOrderState2: false,
        statis: '',
        message: '',
        trendOptions: { title: { show: true, text: this.$t('electricQuantity') + '(kW·h)' }, xAxis: [], series: [] },
        curMonthPower: [],
        preMonthPower: [],
        time: [],
        workOrder: '',
        baseStyle: { height: this.$store.state.heighttimg },
        checkedProjectStr: '',
      }
    },
    computed: {
      ...mapState('admin/layout', ['headerMenu', 'isMobile', 'menuCollapse', 'showSearch', 'showBreadcrumb']),
      matchedOptions() {
        if (this.message !== '') {
          return this.$store.state.allProjects.data.filter(item => item.projectName.indexOf(this.message) > -1)
          // return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1)
        } else {
          return this.$store.state.allProjects.data
          // return this.checkedProjectStr
        }
      },
      isOpenPrjGrpHourPowerStat() {
        return !!this.$store.state.isOpenPrjGrpHourPowerStat
      },
    },
    created() {},
    mounted() {
      this.init()
      this.getlunxunData()
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    methods: {
      async queryPowerData() {
        const res = await powerTrend()
        if (res.success) {
          this.devicePower = res.data.map(v => v.value)
          const timexAxis = res.data.map(v => v.time)
          this.powerOption.xAxis = timexAxis.map(v => v.split(' ')[1])
          this.powerOption.customTime = timexAxis
          const seriseArr = [{ name: '', data: this.devicePower, color: ['rgba(19, 255, 255, .6)', 'rgba(0, 201, 78, .1)', '#12F9FF'] }]
          this.powerOption.series = seriseArr.map(v => this.chartOption(v.name, v.data, v.color))
          this.powerOption.series[0].markPoint = { data: addMarkPoint(this.devicePower) }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getDropdownItem(val) {
        this.dateName = powerMenuConfig.find(v => v.value === val).label
        this.statis.statisticsPower = this.statis[val]
      },
      getlunxunData() {
        this.timer = window.setInterval(() => {
          this.queryTrend()
          this.queryPowerData()
          this.handleStatistics()
          this.queryEquipClassifyStatList()
        }, 62000)
      },
      async init() {
        this.handleStatistics()
        this.queryTrend()
        this.handleWorkOrder()
        this.queryPowerData()
        this.queryEquipClassifyStatList()
        this.checkedProjectStr = JSON.parse(await projectIndexDB.getItem('checkedProjectStr')) // 取值时转为对象
      },
      async handleStatistics() {
        const res = await energyStatistics()
        this.statis = res.data
        const value = powerMenuConfig.find(v => v.label === this.dateName).value
        this.statis.statisticsPower = this.statis[value]
        this.loadingStatus.energyConsumptiontrendNum = true
      },
      chartOption(name, data, color = ['rgba(43, 153, 255, 1)', 'rgba(43, 153, 255, 1)', '#2B99FF'], custom) {
        return {
          name,
          type: 'line',
          data,
          showSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 4,
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: color[0] },
                { offset: 1, color: color[1] },
              ],
              global: false,
            },
          },
          itemStyle: { color: color[2] },
          ...custom,
        }
      },
      async queryTrend() {
        const res = await energyTrend()
        if (res.success) {
          const trendData = res.data
          this.curMonthPower = trendData.map(v => v.curMonthPower)
          this.preMonthPower = trendData.map(v => v.preMonthPower)
          this.time = trendData.map(v => v.time)
          this.trendOptions.xAxis = []
          this.trendOptions.series = []
          this.trendOptions.xAxis = this.time
          const seriseArr = [
            { name: window.$t('thisMonth'), data: this.curMonthPower, color: ['rgba(43, 153, 255, 1)', 'rgba(43, 153, 255, 1)', '#2B99FF'] },
            { name: window.$t('lastMonth'), data: this.preMonthPower, color: ['rgba(19, 255, 255, .6)', 'rgba(0, 201, 78, .1)', '#12F9FF'] },
          ]
          this.trendOptions.series = seriseArr.map(v => this.chartOption(v.name, v.data, v.color))
          this.trendOptions.series[0].markPoint = { data: addMarkPoint(this.curMonthPower) }
          this.trendOptions.series[1].markPoint = { data: addMarkPoint(this.preMonthPower) }
        } else {
          this.trendOptions.xAxis = []
          this.trendOptions.series = []
          this.$Message.error({ content: res.message })
        }
        this.loadingStatus.energyConsumptiontrendData = true
      },
      handleSelect(item) {
        this.$func.switchToProject(item, '/console/topology')
      },
      handleWork(item, type) {
        switch (type) {
          case '1':
            this.$func.switchToProject(item, '/multiManage/report')
            break
          case '2':
            this.$func.switchToProject(item, 'multiManage-workOrder', '1')
            break
          case '3':
            this.$func.switchToProject(item, 'multiManage-workOrder', '2')
            break
          default:
            break
        }
      },
      handleWorkOrder() {
        workOrderStatistics().then(res => {
          this.workOrder = res.data
        })
      },
      handleControl(num) {
        switch (num) {
          case '1':
            this.controlState = true
            break
          case '2':
            this.reportState = true
            break
          case '3':
            this.workOrderState = true
            break
          case '4':
            this.workOrderState2 = true
            break
          default:
            break
        }
      },
      handleGoContent(num) {
        let path = ''
        let item = {}
        switch (num) {
          case '1':
            path = '/console/topology'
            item = {
              projectCode: this.$store.state.projects,
            }
            this.$func.switchToProject(item, path)
            break
          case '2':
            path = 'multiManage-report'
            item = {
              projectCode: this.$store.state.projects,
            }
            this.$func.switchToProject(item, path, '1')
            break
          case '3':
            path = 'multiManage-workOrder'
            item = {
              projectCode: this.$store.state.projects,
            }
            this.$func.switchToProject(item, path, '1')
            break
          case '4':
            path = 'multiManage-workOrder'
            item = {
              projectCode: this.$store.state.projects,
            }
            this.$func.switchToProject(item, path, '2')
            break
          default:
            break
        }
      },
      handleContent(status) {
        if (status === '1') {
          this.$router.push({ name: 'Alarm' })
        }
      },
      handleReport(type) {
        this.$router.push({ name: 'Report', params: { type: type } })
      },
      getCo2(pStr) {
        const p = Number(pStr)
        if (!p) return 0
        return roundPrecision(powerToCarbon(p), 3)
      },
      queryEquipClassifyStatList() {
        getEquipClassifyStatList().then(res => {
          if (res.success) {
            let pieData = []
            this.pieOptions.series = []
            res.data.forEach(item => {
              if (+item.totalMac > 0) {
                pieData.push({ name: item.classifyDesc, value: item.totalMac })
              }
            })
            this.pieOptions.series.push({
              type: 'pie',
              data: pieData,
              z: 9,
              radius: ['42', '56'],
              center: ['25%', '50%'],
              avoidLabelOverlap: false,
              label: { show: false, position: 'center' },
              textStyle: { fontSize: '30', fontWeight: 'bold' },
              labelLine: { show: false },
              itemStyle: { borderRadius: 10, borderColor: 'rgba(0, 0, 0, 0)', borderWidth: 2 },
            })
            let legend = this.legendData(pieData)
            this.pieOptions.legend.data = legend
            this.loadingStatus.equipmentClassification = true
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
    },
    watch: {
      '$store.state.heighttimg': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal
          }
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  .tan-text {
    transform: scale(0.8);
    display: inline-block;
    /deep/.ivu-tooltip-rel {
      z-index: 10;
    }
  }
  .checkDetail {
    color: #99b3c8;
    text-align: right;
    margin-right: 25px;
  }
  .power-name /deep/.ivu-select-dropdown {
    background: #071223;
  }
  .power-name /deep/ .head {
    display: flex;
    white-space: nowrap;
  }
  .power-name /deep/ .ivu-icon-ios-arrow-down {
    margin-top: 3px;
    margin-left: -2px !important;
    transform: scale(0.8);
  }
  .table-wrapper::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.9;
    z-index: -1;
    background: #fff;
  }
  .el-table__body {
    position: relative;
  }
  .title-right-img {
    height: 16px;
    width: 100%;
  }
  .title-color-device {
    color: #73afec;
    font-weight: 600;
    font-size: 16px;
    padding-left: 10px;
    width: 100%;
    display: inline-block;
  }
  .fot {
    font-family: PangMenZhengDao;
    font-weight: 400;
    font-style: italic;
  }
  .content {
    width: 100%;
    background-color: transparent;
    height: 100%;
    z-index: 999;
    .content_top {
      background: url('../../assets/images/bgc1@2x.png') no-repeat;
      width: 100%;
      background-size: 100% 100%;
      margin-bottom: 10px;
      height: 29%;
      overflow: hidden;
    }
    .content-deviceType {
      background: url('../../assets/images/bgc3@2x.png') no-repeat;
      width: 100%;
      background-size: 100% 100%;
      margin-top: 20px;
      height: 21%;
      overflow: hidden;
    }
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      // background: url('../../assets/images/border.gif') no-repeat;
      background-size: 100% 100%;
      height: 35px;
      img {
        width: 100%;
      }
      .img_row {
        width: 100%;
        .img_row_col {
          width: 25%;
          .img_row_art {
            font-weight: 600;
            font-size: 16px;
            color: #73afec;
            display: inline-block;
            width: 100%;
          }
          .img_row_fff {
            color: #99b3c8;
          }
        }
      }
    }
    .ivu-icon {
      margin-left: 5px;
    }
    .content_cont {
      font-size: 14px;
      color: #73ffffff;
      font-weight: bold;
      text-align: center;
      .head {
        font-weight: normal;
        font-size: 14px;
        color: #99b3c8;
      }
      .demission {
        font-weight: normal;
        white-space: nowrap;
        font-size: 12px;
        color: #73ffffff;
        height: 47px;
        line-height: 47px;
        text-align: center;
        background: url('../../assets/images/useElectra.png') center no-repeat;
        background-size: 100% 100%;
        &.carbon {
          display: flex;
          align-items: center;
        }
      }
      .power-value {
        font-size: 16px;
      }
      .carbon-value {
        font-size: 14px;
      }
    }
    .content_bom {
      margin-top: 20px;
      background: url('../../assets/images/bgc4@2x.png') no-repeat;
      background-size: 100% 100%;
      height: 18%;
      overflow: hidden;
      .bom {
        position: relative;
        .img_row {
          width: 100%;
          display: flex;
          align-items: center;
          padding-top: 10px;
          background-size: 100% 100%;
          // height: 35px;
          .img_row_col {
            width: 100%;
            .img_row_fff {
              color: #99b3c8;
            }
            .img_row_art {
              font-weight: 600;
              font-size: 16px;
              // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
              color: #73afec;
              vertical-align: middle;
              .iconfont {
                margin-left: 5px;
                font-size: 20px;
              }
            }
          }
        }
        .content_bom_img {
          display: flex;
          justify-content: space-around;
          height: 100%;
          margin: 10px 0;
          .content_bom_img_div {
            padding-top: 15px;
            text-align: center;
            .dfs {
              width: 60px;
            }
            .div_font {
              color: #99b3c8;
            }
            .div_number {
              font-family: PangMenZhengDao;
              font-weight: 400;
              font-size: 20px;
            }
          }
        }
      }
    }

    @media only screen and (min-width: 1024px) {
      .content_top,
      .content_bom {
        padding: 10px;
      }
      .content_cont_st_icon {
        font-size: 16px;
      }
      .content_cont_st_zi {
        font-size: 12px;
      }
      .div_font {
        font-size: 12px;
      }
      .content_top {
        margin-bottom: 6px;
      }
    }
    @media only screen and (min-width: 1366px) {
      .content_cont_st_icon {
        font-size: 18px;
      }
      .content_cont_st_zi {
        font-size: 12px;
      }
      .div_font {
        font-size: 14px;
      }
      .content_top {
        margin-bottom: 10px;
      }
    }
    @media only screen and (min-width: 1920px) {
      .content_cont_st_icon {
        font-size: 22px;
      }
      .content_top,
      .content_bom {
        padding: 10px;
      }
      .content_cont_st_zi {
        font-size: 16px;
      }
      .div_font {
        font-size: 16px;
      }
      .content_top {
        margin-bottom: 10px;
      }
    }
  }
</style>
