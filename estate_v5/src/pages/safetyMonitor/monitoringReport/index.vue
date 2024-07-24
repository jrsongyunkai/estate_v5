<template>
  <div class="monitoringReport">
    <div class="abnormal">
      <div class="header">
        <h3>{{ $t('abnormalSituation') }}</h3>
        <DatePicker type="date" :placeholder="$t('pleaseSelectDate')" format="yyyy-MM-dd" style="width: 200px" @on-change="handleTime" v-model="timer"></DatePicker>
      </div>
      <Row>
        <Col :span="7">
          <h4 class="anomalyLeveheader">{{ $t('abnormalLevelDistribution') }}</h4>
          <AnomalyLevePie :options="gradedistrAtio" :personTotal="gradedTotal" :type="'grade'" />
        </Col>
        <Col :span="10" class="distribute">
          <h4 class="distributeheader">{{ $t('abnormalAgeGroupDistribution') }}</h4>
          <Nursetrends :trend="(trendShow = false)" :options="abnormalNursetrends" />
        </Col>
        <Col :span="7" style="position: relative">
          <h4 class="StackedBarheader">
            {{ $t('abnormalLevelHighRiskPeopleDistribution') }}
            <Tooltip placement="top" max-width="300" transfer>
              <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 5px" />
              <div slot="content" style="white-space: normal">
                <div>{{ $t('abnormalLevelHighRiskTips') }}</div>
              </div>
            </Tooltip>
          </h4>
          <Form label-position="top" style="padding: 0 20px">
            <FormItem v-for="(item, index) in StackedBarTitle" :key="index" :label="`${item.name}:`">
              <div class="StackedBar"><StackedBar :options="item.highRiskInfoList" /></div>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </div>

    <div class="abnormal mt-10">
      <div class="header">
        <h3>{{ $t('last30dayAbnormalLevelTrend') }}</h3>
      </div>
      <Nursetrends :trend="trendShow" :options="NursetrendsData" />
    </div>

    <div class="abnormal mt-10">
      <div class="header">
        <h3>{{ $t('monitoringPeopleProfiling') }}</h3>
      </div>
      <Row>
        <Col :span="7">
          <h4 class="anomalyLeveheader">{{ $t('ageGroupDistribution') }}</h4>
          <AnomalyLevePie :options="agedistrAtion" :personTotal="agedistrpersonTotal" />
        </Col>
        <Col :span="7" class="distribute">
          <h4 class="anomalyLeveheader">{{ $t('genderDistribution') }}</h4>
          <GenderPie :options="genderData" />
        </Col>
        <Col :span="10">
          <h4 class="StackedBarheader">{{ $t('highRiskPeopleDistribution') }}</h4>
          <Row>
            <Col :span="18">
              <Veen :options="airbubbleData" />
              <!-- <Airbubble :options="airbubbleData"/> -->
            </Col>
            <Col :span="6">
              <div class="lenght" v-for="(item, index) in safetyType" :key="index">
                <div class="round" :class="`roundbg${index + 1}`"></div>
                <span>{{ item }}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

    <div class="abnormal mt-10">
      <div class="header">
        <h3>{{ $t('watchList') }}</h3>
      </div>
      <Row class="mt-10">
        <Select v-model="gridman" style="width: 200px" :placeholder="$t('pleaseSelectGridman')">
          <Option v-for="item in gridmanData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input :placeholder="$t('pleaseEnterNameOrContact')" style="width: 200px" class="ml-10" v-model="kpKeyword" />
        <Input :placeholder="$t('topologyPlaceholder2')" style="width: 200px" class="ml-10" v-model="macKeyword" />
        <Button type="primary" class="ml-10" @click="handlelecNursekeeperList">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="handlereset">{{ $t('reset') }}</Button>
      </Row>
      <div class="gridContent" v-for="(item, index) in elecNurseData" :key="index">
        <Row :gutter="40" class="gridContentheader">
          <Col :span="2" style="display: flex; align-items: center; height: 100px">
            <el-image style="width: 100%; height: 100px" :src="item.photo" :preview-src-list="[item.photo]"></el-image>
          </Col>
          <Col :span="22">
            <Form :label-width="100">
              <Row>
                <FormItem :label="`${$t('fullName')}：`" style="width: 300px">
                  <span class="text">{{ item.name }}</span>
                </FormItem>
                <FormItem :label="`${$t('contactNumber')}：`" style="width: 300px">
                  <span class="text">{{ item.telephone }}</span>
                </FormItem>
                <FormItem :label="`${$t('mailbox')}：`" style="width: 300px">
                  <span class="text">{{ item.email }}</span>
                </FormItem>
                <FormItem :label="`${$t('bindAccount')}：`" style="width: 300px">
                  <span class="text">{{ item.staffName }}</span>
                </FormItem>
              </Row>
              <FormItem :label="`${$t('areaOfResponsibility')}：`">
                <span class="text">{{ item.dutyRegion }}</span>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
            <div class="pt-20">
              <h4 class="anomalyLeveheader">{{ $t('abnormalLevelDistribution') }}</h4>
              <AnomalyLevePie :options="item.levelTotalList" :type="'grade'" :personTotal="item.personTotal" />
            </div>
            <div class="pt-20">
              <h4 class="anomalyLeveheader">{{ $t('ageGroupDistribution') }}</h4>
              <AnomalyLevePie :options="item.ageTotalList" :type="'age'" :personTotal="item.personTotal" />
            </div>
          </Col>
          <Col :span="16">
            <div class="pt-20">
              <h4 class="anomalyLeveheader">{{ $t('watchLineList') }}</h4>
              <Table :columns="monitoringColumns" :data="item.channelList">
                <template slot-scope="{ row }" slot="mac">
                  {{ `${row.macName}(${row.mac})` }}
                </template>
                <template slot-scope="{ row }" slot="addr">
                  {{ `${row.addrTitle}(${row.showAddr})` }}
                </template>
                <template slot-scope="{ row }" slot="objects">{{ `${row.personName}` }}{{ row.personTelephone !== '' ? `(${row.personTelephone})` : '' }}</template>
                <template slot-scope="{ row }" slot="month">
                  <div class="monitorMonth">
                    <span v-for="(otem, oind) in row.levelTotalList" :key="oind" :class="`labelMark${oind + 1}`">
                      {{ otem.total }}
                      <i v-if="otem.show">:</i>
                    </span>
                    <!-- <span class="labelMark2">{{ row.levelTotalList[1].total}}</span>
                                        <i>:</i>
                                        <span class="labelMark3">{{ row.levelTotalList[2].total}}</span>
                                        <i>:</i>
                                        <span class="labelMark4">{{ row.levelTotalList[3].total}}</span>
                                        <i>:</i>
                                        <span class="labelMark5">{{ row.levelTotalList[4].total}}</span> -->
                  </div>
                </template>
                <template slot-scope="{ row }" slot="orcode">
                  <Poptip trigger="click" :transfer="true">
                    <span v-if="row.todayLevel === 0"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #0dd667"></i></span>
                    <span v-if="row.todayLevel === 1"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e0e71c"></i></span>
                    <span v-if="row.todayLevel === 2"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #007eff"></i></span>
                    <span v-if="row.todayLevel === 3"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #ea903a"></i></span>
                    <span v-if="row.todayLevel === 4"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e03c3a"></i></span>
                    <div slot="content">
                      <div style="width: 146px">
                        <img :src="row.careCodeUrl" alt="" style="width: 100%" />
                      </div>
                    </div>
                  </Poptip>
                </template>
                <template slot-scope="{ row }" slot="action">
                  <div class="historyTrand" @click="handleHistoryTrand(row.channelId, row.careCodeUrl)">{{ $t('historyTrend') }}</div>
                </template>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <Modal v-model="historyTrand" :title="$t('historyTrend')" footer-hide class="monitorinTrand" width="780">
      <h3>{{ $t('last30dayAbnormalTrend') }}</h3>
      <div v-if="historyTrand" style="width: 100%">
        <MonitorTrand :options="monitorinTrandOption" />
      </div>
      <div class="historyTrandTable">
        <Table :columns="historyTrandColumns" :data="historyTrandData" max-height="300">
          <template slot-scope="{ row }" slot="level">
            <Poptip trigger="click" :transfer="true">
              <span v-if="row.level === 0"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #0dd667"></i></span>
              <span v-if="row.level === 1"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e0e71c"></i></span>
              <span v-if="row.level === 2"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #007eff"></i></span>
              <span v-if="row.level === 3"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #ea903a"></i></span>
              <span v-if="row.level === 4"><i class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e03c3a"></i></span>
              <div slot="content">
                <div style="width: 146px">
                  <img :src="careCodeUrl" alt="" style="width: 100%" />
                </div>
              </div>
            </Poptip>
          </template>
        </Table>
      </div>
    </Modal>
  </div>
</template>
<script>
  import AnomalyLevePie from '../../Common/AnomalyLevePie.vue'
  import Nursetrends from '../../Common/Nursetrends.vue'
  import StackedBar from '../../Common/StackedBar.vue'
  import GenderPie from '../../Common/GenderPie.vue'
  import Airbubble from '../../Common/Airbubble.vue'
  import MonitorTrand from '../../Common/monitorTrand.vue'
  import Veen from './veen.vue'
  import { elecNursekeeperList, keeperListSimple, channelLevelTrend, projectLevelTrend, peopleStat, dayStat } from '@/api/public'
  export default {
    name: 'safetyMonitor-monitoringReport',
    components: {
      AnomalyLevePie,
      Nursetrends,
      StackedBar,
      GenderPie,
      Airbubble,
      MonitorTrand,
      Veen,
    },
    data() {
      return {
        safetyType: [this.$t('unableLiveSelf'), this.$t('haveDisease'), this.$t('liveAloneAndOver70'), this.$t('handicapAndOver70'), this.$t('others')],
        timer: this.$Date().format('YYYY-MM-DD'),
        gradedTotal: 0,
        kpKeyword: '',
        macKeyword: '',
        monitorinTrandOption: { data: [], time: [] },
        abnormalNursetrends: {},
        NursetrendsData: {},
        historyTrandColumns: [
          { title: this.$t('date'), key: 'date' },
          { title: this.$t('abnormalLevel'), slot: 'level' },
        ],
        historyTrandData: [],
        monitoringColumns: [
          { title: this.$t('owningDevice'), slot: 'mac' },
          { title: this.$t('watchLine'), slot: 'addr' },
          { title: this.$t('watchObject'), slot: 'objects' },
          { title: this.$t('watchObjectAddress'), key: 'personAddress' },
          { title: this.$t('last30dayAbnormalLevelDistribution'), slot: 'month', width: '180' },
          { title: this.$t('todayCareCode'), slot: 'orcode', width: '120' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        MonitoringData: [],
        imageUrls: require('../../../assets/images/wangeyuan.webp'),
        StackedBarTitle: [],
        trendShow: true,
        gradedistrAtio: {},
        levelHighRiskInfoList: {},
        agedistrAtion: {},
        genderData: {},
        airbubbleData: {},
        gridmanData: [],
        gridman: '',
        historyTrand: false,
        elecNurseData: [],
        agedistrpersonTotal: 0,
        careCodeUrl: '',
      }
    },
    mounted() {
      this.handledayStat()
      this.handlepeopleStat()
      this.handleprojectLevelTrend()
      this.handlekeeperListSimple()
      this.handlelecNursekeeperList()
    },
    methods: {
      handleTime(val) {
        this.timer = val
      },
      handledayStat() {
        let newTimer = `${this.timer.split('-')[0]}${this.timer.split('-')[1]}${this.timer.split('-')[2]}`
        let params = { projectCode: this.$store.state.projectCode, yymmdd: newTimer }
        dayStat(params).then(res => {
          if (res.success) {
            this.gradedistrAtio = res.data.levelInfoList
            this.gradedTotal = res.data.personTotal
            var data = {
              xdata: [],
              legend: [this.$t('normal'), this.$t('lowAbnormal'), this.$t('mediumAbnormal'), this.$t('higherAbnormal'), this.$t('highAbnormal')],
              data: [],
            }
            let level0 = []
            let level1 = []
            let level2 = []
            let level3 = []
            let level4 = []

            res.data.ageInfoList.map(val => {
              data.xdata.push(val.ageName)
              val.levelInfoList.map(item => {
                if (item.level === 0) {
                  level0.push(item.total)
                } else if (item.level === 1) {
                  level1.push(item.total)
                } else if (item.level === 2) {
                  level2.push(item.total)
                } else if (item.level === 3) {
                  level3.push(item.total)
                } else {
                  level4.push(item.total)
                }
              })
              data.data = [level0, level1, level2, level3, level4]
            })
            this.abnormalNursetrends = []
            this.abnormalNursetrends = data
            let arr = [this.$t('normal'), this.$t('lowAbnormal'), this.$t('mediumAbnormal'), this.$t('higherAbnormal'), this.$t('highAbnormal')]
            this.StackedBarTitle = []
            res.data.levelHighRiskInfoList.map((val, index) => {
              this.StackedBarTitle.push({ name: arr[index], highRiskInfoList: val.highRiskInfoList })
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlepeopleStat() {
        let params = { projectCode: this.$store.state.projectCode }
        peopleStat(params).then(res => {
          if (res.success) {
            this.agedistrpersonTotal = res.data.personTotal
            this.agedistrAtion = res.data.ageInfoList
            this.genderData = res.data.sexInfoList
            this.airbubbleData = res.data.highRiskInfoList
            // item === 1 ? '生活不能自理' : item === 2 ? '有疾病在身' : item === 3 ? '独居且70以上' : item === 4 ? '残疾且70以上' : '其他'
            res.data.mixPeopleList.map(val => {
              this.airbubbleData.push({
                name: [
                  val.levelList[0] === 1 ? this.$t('unableLiveSelf') : val.levelList[0] === 2 ? this.$t('haveDisease') : val.levelList[0] === 3 ? this.$t('liveAloneAndOver70') : val.levelList[0] === 4 ? this.$t('handicapAndOver70') : this.$t('others'),
                  val.levelList[1] === 1 ? this.$t('unableLiveSelf') : val.levelList[1] === 2 ? this.$t('haveDisease') : val.levelList[1] === 3 ? this.$t('liveAloneAndOver70') : val.levelList[1] === 4 ? this.$t('handicapAndOver70') : this.$t('others'),
                ],
                total: val.total,
                type: val.type || '',
              })
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleprojectLevelTrend() {
        let params = { projectCode: this.$store.state.projectCode }
        projectLevelTrend(params).then(res => {
          var data = { xdata: [], legend: [this.$t('normal'), this.$t('lowAbnormal'), this.$t('mediumAbnormal'), this.$t('higherAbnormal'), this.$t('highAbnormal')], data: [] }
          let level0 = []
          let level1 = []
          let level2 = []
          let level3 = []
          let level4 = []
          res.data.map(val => {
            data.xdata.push(val.monthDay)
            val.levelInfoList.map(item => {
              if (item.level === 0) {
                level0.push(item.total)
              } else if (item.level === 1) {
                level1.push(item.total)
              } else if (item.level === 2) {
                level2.push(item.total)
              } else if (item.level === 3) {
                level3.push(item.total)
              } else {
                level4.push(item.total)
              }
            })
          })
          data.data = [level0, level1, level2, level3, level4]
          this.NursetrendsData = data
        })
      },
      handlelecNursekeeperList() {
        let params = { projectCode: this.$store.state.projectCode, personKeyword: this.kpKeyword, macKeyword: this.macKeyword, kpId: this.gridman }
        elecNursekeeperList(params).then(res => {
          if (res.success) {
            this.MonitoringData = []
            res.data.forEach(val => {
              val.channelList.forEach(item => {
                item.levelTotalList.forEach((otem, oind) => {
                  oind === 4 ? (otem['show'] = false) : (otem['show'] = true)
                })
              })
            })
            this.elecNurseData = res.data
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlekeeperListSimple() {
        let params = { projectCode: this.$store.state.projectCode }
        keeperListSimple(params).then(res => {
          if (res.success) {
            res.data.map(val => {
              this.gridmanData.push({ value: val.kpId, label: val.name })
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleHistoryTrand(id, img) {
        this.historyTrand = true
        this.careCodeUrl = img
        let params = { channeId: id }
        channelLevelTrend(params).then(res => {
          if (res.success) {
            this.monitorinTrandOption.data = []
            this.monitorinTrandOption.time = []
            res.data.map(val => {
              this.monitorinTrandOption.data.push(val.level)
              this.monitorinTrandOption.time.push(val.monthDay)
              this.historyTrandData.push({ date: val.monthDay, level: val.level })
            })
            this.historyTrandData.reverse()
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlereset() {
        this.kpKeyword = ''
        this.macKeyword = ''
        this.gridman = ''
        this.handlelecNursekeeperList()
      },
    },
    watch: {
      timer: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.handledayStat()
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .monitoringReport {
    .pt-20 {
      padding-top: 20px;
    }
    .abnormal {
      padding: 15px 15px 25px 15px;
      background: #1b1f2e;
      .header {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
      .anomalyLeveheader {
        color: #dddddd;
        margin-bottom: 20px;
      }
      .distributeheader {
        color: #dddddd;
      }
      .distribute {
        border-left: 1px solid #424b5f;
        border-right: 1px solid #424b5f;
        padding: 0 10px;
      }
      .StackedBarheader {
        color: #dddddd;
        padding: 0px 0 10px 10px;
      }
      .StackedBar {
        border: 1px solid #535b6c;
        height: 25px;
        canvas {
          left: 0px !important;
          top: 0px !important;
        }
      }
      .gridContent {
        margin-top: 20px;
        border: 1px solid #424b5f;
        border-radius: 4px;
        padding: 10px 20px 20px 20px;
        .gridContentheader {
          border-bottom: 1px solid #424b5f;
        }
      }
    }
    .lenght {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        color: #999;
      }
    }
    .monitorMonth {
      i {
        margin: 0 5px;
      }
    }
    .round {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .historyTrand {
      color: #007eff;
      cursor: pointer;
    }
    .labelMark1 {
      color: #0eeb71;
    }

    .labelMark2 {
      color: #e0e71c;
    }
    .labelMark3 {
      color: #0096ff;
    }
    .labelMark4 {
      color: #ea903a;
    }
    .labelMark5 {
      color: #e03c3a;
    }
    .roundbg1 {
      background: #e03c3a;
    }
    .roundbg2 {
      background: #e0e71c;
    }
    .roundbg3 {
      background: #ea903a;
    }
    .roundbg4 {
      background: #de3384;
    }
    .roundbg5 {
      background: #0096ff;
    }
    .qrcode1 {
      color: '#0DD667';
    }
    .qrcode2 {
      color: '#E0E71C';
    }
    .qrcode3 {
      color: '#007EFF';
    }
    .qrcode4 {
      color: '#EA903A';
    }
    .qrcode5 {
      color: '#E03C3A';
    }
  }
  .monitorinTrand {
    .historyTrandTable {
      height: 300px;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      scrollbar-width: none;
    }
    .ivu-modal-footer {
      padding: 0;
    }
  }
</style>
