<template>
  <div class="tenseDetail">
    <div class="back" @click="back">
      <span class="icon-v5 icon-v5-xiangzuo"></span>
      {{ $t('back') }}
    </div>
    <div class="detailcontent">
      <Tabs :value="type" @on-click="getTabValue">
        <TabPane :label="$t('ruleInfo')" name="1">
          <div class="infomation">
            <h3>{{ $t('baseInfo') }}</h3>
            <Form :label-width="100">
              <FormItem :label="$t('ruleName') + ':'">
                {{ infomation.name }}
              </FormItem>
              <FormItem :label="$t('ruleDescription') + ':'">
                {{ infomation.remark }}
              </FormItem>
              <FormItem :label="$t('ruleState') + ':'">
                <!-- <Switch v-model="switchStatus" /> -->
                <span>{{ switchStatus ? $t('enabled') : $t('disabled') }}</span>
              </FormItem>
              <FormItem :label="$t('executionMode') + ':'">
                <RadioGroup v-model="mod">
                  <Radio :label="1" disabled>{{ $t('executeAtEdge') }}</Radio>
                  <Radio :label="2" disabled>{{ $t('executeInCloud') }}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="$t('configuringObjectType') + ':'">
                <RadioGroup v-model="configType">
                  <Radio :label="1" disabled>{{ $t('breaker') }}</Radio>
                  <Radio :label="2" disabled>808</Radio>
                  <Radio :label="3" disabled>{{ $t('gateway') }}</Radio>
                </RadioGroup>
              </FormItem>
            </Form>
          </div>
          <div class="detailList">
            <div class="height-380">
              <div class="dis-flex">
                <div class="flex-1">
                  <h3>{{ $t('configurationObject') }}</h3>
                  <div class="device-list">
                    <div v-for="(item, index) in deviceList" :key="index" class="textSty" :class="index === curIndex ? 'blueStyle' : 'default-Style'" @click="getMacDetail(index, item)">
                      <div>{{ `${item.macTitle}(${item.mac})` }}</div>
                      <div>
                        <span v-if="item.addr">{{ `${item.title}(${item.mac}-${item.addr.padStart(2, '0')})` }}</span>
                        <span v-if="item.index">{{ `/${item.name}` }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex-3">
                  <div class="flex-content">
                    <h3>{{ $t('objectState') }}</h3>
                    <div>
                      <div v-if="configType">
                        <span class="redBox blockStyle"></span>
                        <span>{{ redTextBox }}</span>
                        <span class="greenBox blockStyle"></span>
                        <span>{{ greenText }}</span>
                        <span v-if="configType === 1">
                          <span class="yellowBox blockStyle"></span>
                          <span>{{ $t('openAndLock') }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="swiper" ref="daySwper" style="width: 95%">
                        <div class="swiper-wrapper">
                          <div v-for="(item, index) in dayList" :key="item.time" :class="item.time === curClick ? 'swiper-slide time-box blue-bgs pointer' : 'swiper-slide time-box gray-bg pointer'" @click="getItemValue(item, index)">
                            <div class="pd-left">{{ item.timeSubstr }}</div>
                            <div v-if="item.isToday" class="posi-relative">
                              <span class="posi-absolute">
                                <img src="../../../assets/images/todayIcon.png" alt="" />
                              </span>
                            </div>
                            <div :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ item.dayNum }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="posi-relative">
                        <div class="swiper-button-next">
                          <img src="../../../assets/images/right.png" class="dis-block" alt="" />
                        </div>
                        <div class="swiper-button-prev">
                          <img src="../../../assets/images/left.png" class="dis-block" alt="" />
                        </div>
                      </div>
                    </div>
                    <swiperEchartsVue
                      v-if="showSwiper"
                      ref="swiperEchartsVue"
                      :key="curIndex"
                      :echartTime="curClick"
                      :defaultIndex="defaultIndex"
                      :isLoading="isLoading"
                      :defaultIndexChange="defaultIndexChange"
                      @changeTime="changeTime"
                      :macAndport="curMacAndPort"
                      :configId="rowItem.configId"></swiperEchartsVue>
                    <div class="dis-loading" v-else><Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" /></div>
                  </div>
                </div>
              </div>
              <!-- <Table :columns="Devicecolumns" :data="Devicedata"></Table> -->
            </div>
          </div>

          <div class="detailList">
            <h3>{{ $t('cyclePeriod') }}</h3>
            <Form :label-width="100">
              <FormItem :label="$t('cyclePeriod') + ':'">
                {{ rowItem.cycleDesc }}
              </FormItem>
            </Form>
          </div>
          <div class="detailList">
            <h3>{{ $t('configureTimePeriods') }}</h3>
            <Table :columns="Timercolumns" :data="Timerdata">
              <template #mustStatusName="{ row }">
                {{ row.others.mustStatusDesc }}
              </template>
              <template #monitorModelName="{ row }">
                {{ row.others.judgeLogic }}
              </template>
              <template slot-scope="{ row }" slot="time">{{ row.startTime }}-{{ row.endTime }}</template>
              <template slot-scope="{ row }" slot="isAlarm">
                {{ row.isAlarm === 1 ? $t('yes') : $t('no') }}
              </template>
              <template #actionType="{ row }">{{ actionConfigValue(row.actionType) }}</template>
              <template #alarmTypeName="{ row }">
                {{ row.others.alarmTypeDesc }}
              </template>
            </Table>
          </div>
        </TabPane>
        <TabPane :label="$t('alarmHistory')" name="2" v-if="mod === 2">
          <div class="history">
            <div class="title-between">
              <h3>{{ $t('alarmHistory') }}</h3>
              <div>
                <DatePicker type="daterange" v-model="selectTime" transfer :placeholder="$t('pleaseSelectDate')" class="w200"></DatePicker>
                <Button type="primary" class="mar-rl-10" @click="queryHistoryList">{{ $t('query') }}</Button>
                <Button class="marR--10" @click="resetTime">{{ $t('reset') }}</Button>
                <Button class="outputs" @click="exportHistory">
                  <Icon custom="icon-v5 icon-v5-daochu" size="18" />
                </Button>
              </div>
            </div>

            <Table :columns="Alarmcolumns" :data="Alarmdata">
              <template slot-scope="{ row }" slot="addrs">
                <div>{{ row.title + getLineId(row.mac, row.addr) }}</div>
              </template>
              <template slot-scope="{ row }" slot="digital">
                <div>{{ row.digital }}</div>
              </template>
              <template #actionType="{ row }">
                <div>{{ ['', '0', 0].includes(row.actionType) ? $t('nothing') : row.actionType }}</div>
              </template>
              <template #judgeLogic="{ row }">
                {{ row.judgeLogic }}
              </template>
              <template #triggerRule="{ row }">
                {{ row.triggerRule }}
              </template>
            </Table>
            <Page :total="AlarmTotal" @on-change="handleAlamrmPage" />
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import { tenseDeviceAlarmList } from '@/api/public'
  import { getLineId } from '../linkageScene/pro/constants'
  import { queryBoxAbnormalConfig, snapshotList } from '@api/multiManage/runningTense'
  import swiperEchartsVue from './swiperEcharts.vue'
  import { getCurrThirtyDay, actionConfigValue, historyClomns } from './getDay'
  import Swiper, { Navigation } from 'swiper'
  import dayjs from 'dayjs'
  import qs from 'qs'
  export default {
    components: { swiperEchartsVue },
    props: {
      type: String,
      rowItem: Object,
    },
    data() {
      return {
        selectTime: [],
        curMacAndPort: {},
        showSwiper: false,
        swipers: null,
        dayList: [],
        curClick: '',
        deviceList: [],
        curIndex: 0,
        switchStatus: true,
        configType: '',
        TimerdataTotal: 0,
        mod: '',
        infomation: {},
        Devicecolumns: [
          {
            title: this.$t('configDevice'),
            key: 'title',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
          },
        ],
        Timercolumns: [
          {
            title: this.$t('timeSpan'),
            slot: 'time',
          },
          {
            title: this.$t('ShouldInState'),
            slot: 'mustStatusName',
          },
          {
            title: this.$t('alarmTriggeringMechanism'),
            slot: 'monitorModelName',
          },
          {
            title: this.$t('durationCycleDuration'),
            key: 'monitorCycle',
          },
          {
            title: this.$t('action'),
            slot: 'actionType',
          },
          {
            title: this.$t('alarm'),
            slot: 'isAlarm',
          },
          {
            title: this.$t('alarmType1'),
            slot: 'alarmTypeName',
          },
        ],
        Alarmcolumns: [],
        Alarmdata: [],
        Devicedata: [],
        Timerdata: [],
        pageNo: '1',
        DevicedataTotal: 0,
        AlarmTotal: 0,
        timer: null,
        defaultIndex: 0,
        defaultIndexChange: null,
        isLoading: null,
      }
    },
    computed: {
      redTextBox() {
        const redList = [
          { value: 1, label: this.$t('closing') },
          { value: 2, label: 'OFF' },
          { value: 3, label: this.$t('powerFailure') },
        ]
        const redLabel = redList.find(v => v.value === this.configType)
        return redLabel ? redLabel.label : ''
      },
      greenText() {
        const greenList = [
          { value: 1, label: this.$t('opening') },
          { value: 2, label: 'ON' },
          { value: 3, label: this.$t('normal') },
        ]
        const greenLabel = greenList.find(v => v.value === this.configType)
        return greenLabel ? greenLabel.label : ''
      },
    },
    async mounted() {
      await this.getDetailsConfig()
      await this.getDevicList()
      if (this.type) {
        this.getTableHistory()
      }
      this.dayList = getCurrThirtyDay()
      this.curClick = dayjs().format('YYYY-MM-DD')
      this.swipers = new Swiper('.swiper', {
        loop: false,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        modules: [Navigation],
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 如果需要滚动条
        scrollbar: '.swiper-scrollbar',
        slidesPerView: 10,
      })
      this.swipers.slideTo(11)
      this.showSwiper = true
    },
    methods: {
      getLineId,
      actionConfigValue,
      getTabValue(val) {
        if (val === '2') {
          this.getTableHistory()
        }
      },
      async getTableHistory() {
        let params = {
          configId: this.rowItem.configId,
          pageNo: this.pageNo,
          pageSize: '10',
        }
        this.getList(params)
      },
      resetTime() {
        this.selectTime = []
      },
      async queryHistoryList() {
        let params = {
          configId: this.rowItem.configId,
          startTime: this.selectTime[0] ? dayjs(this.selectTime[0]).format('YYYY-MM-DD') : '',
          endTime: this.selectTime[1] ? dayjs(this.selectTime[1]).format('YYYY-MM-DD') : '',
          pageNo: this.pageNo,
          pageSize: '10',
        }
        this.getList(params)
      },
      async getList(val) {
        const res = await tenseDeviceAlarmList(val)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.Alarmdata = res.datas
        this.AlarmTotal = res.total
      },
      exportHistory() {
        const queryString = qs.stringify({
          projectCode: this.$store.state.projectCode,
          startTime: this.selectTime[0] ? dayjs(this.selectTime[0]).format('YYYY-MM-DD') : '',
          endTime: this.selectTime[1] ? dayjs(this.selectTime[1]).format('YYYY-MM-DD') : '',
          configId: this.rowItem.configId,
          pageNo: this.pageNo,
          pageSize: '10',
        })
        this.$func.windowCountDown(`/boxAbnormal/alarm/list/export.as?${queryString}`)
      },
      getItemValue(item, index) {
        // console.log(item, 'ite,ms');
        if (item.time === this.curClick) return
        this.curClick = item.time
        this.defaultIndexChange = null
        this.defaultIndex = index
        this.isLoading = '1'
        this.$nextTick(() => {
          this.$refs.swiperEchartsVue.swiper.slideTo(index)
        })
      },
      getMacDetail(index, item) {
        this.isLoading = '1'
        this.curIndex = index
        this.curMacAndPort = item
        this.defaultIndexChange = 1
        this.defaultIndex = 30
        // this.curClick = this.curClick
      },
      async getDevicList() {
        let params = {
          configId: this.rowItem.configId,
          pageNo: 1,
          pageSize: 10000,
          sync: true,
        }
        const res = await snapshotList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        const type = this.configType
        if (type === 1) {
          this.deviceList = res.datas
            .map(v => {
              const configs = v.configs && v.configs.map(j => ({ ...j, mac: v.mac, macTitle: v.title, configId: v.configId }))
              return configs
            })
            .flat(1)
            .filter(v => !!v)
        } else if (type === 2) {
          const resData = res.datas
          resData.forEach(v => {
            v.digArr = []
            v.configs &&
              v.configs.forEach(val => {
                const commonAtrribiute = { title: val.title, macTitle: v.title, addr: val.addr, mac: v.mac }
                const digOutsArr = (val.digitalOuts && val.digitalOuts.map(h => ({ ...h, ...commonAtrribiute, isOutOrIns: 'digitalOuts' }))) || []
                const digInssArr = (val.digitalIns && val.digitalIns.map(h => ({ ...h, ...commonAtrribiute, isOutOrIns: 'digitalIns' }))) || []
                const concatArr = digInssArr.concat(digOutsArr)
                v.digArr.push(...concatArr)
              })
          })
          this.deviceList = resData.map(v => v.digArr).flat(1)
        } else if (type === 3) {
          this.deviceList = res.datas.map(v => ({ ...v, macTitle: v.title }))
        }
        this.curMacAndPort = this.deviceList[0]
      },
      async getDetailsConfig() {
        let params = {
          configId: this.rowItem.configId,
          projectCode: this.$store.state.projectCode,
        }
        const res = await queryBoxAbnormalConfig(params)
        const { name, remark, model, status, type } = res.data.baseInfo
        const { cycleDesc } = res.data.cycleInfo
        const timeTable = res.data.timeInfoList
        this.infomation = {
          name,
          remark,
          cycleDesc,
        }
        this.switchStatus = status === 1
        this.mod = model
        this.configType = type
        this.Timerdata = timeTable
        this.TimerdataTotal = timeTable.length
        let copyClomns = historyClomns()
        const addrsSlot = { title: this.$t('line'), slot: 'addrs' }
        const digitalSlot = {
          title: this.$t('port'),
          slot: 'digital',
        }
        const typeDigital = this.configType === 2 ? digitalSlot : null
        if ([1, 2].includes(this.configType)) {
          copyClomns.splice(2, 0, addrsSlot, typeDigital)
        }

        // 为3不用加
        this.Alarmcolumns = copyClomns.filter(v => !!v)
      },
      changeTime(val) {
        this.curClick = val.length && val[0].time
        this.defaultIndexChange = null
        this.isLoading = ''
        // this.getChartsData()
      },
      back() {
        this.$emit('tenseShow', '1')
      },
      handletenseDeviceAlarmList(page) {
        let params = {
          configId: this.rowItem.configId,
          pageNo: page,
          pageSize: '10',
        }
        this.getList(params)
      },
      handleAlamrmPage(val) {
        this.pageNo = val
        this.getTableHistory()
        // this.handletenseDeviceAlarmList(this.pageNo)
      },
    },
    destroyed() {
      this.swipers.destroy()
    },
  }
</script>
<style lang="less">
  .tenseDetail {
    .outputs {
      border: 1px solid #007eff;
      padding: 3px;
      color: #007eff;
      margin-left: 10px;
      width: 36px;
      height: 32px;
      background-color: rgba(0, 126, 255, 0.1);
      border-radius: 5px;
    }
    .title-between {
      display: flex;
      justify-content: space-between;
    }
    .mar-rl-10 {
      margin: 0 10px;
    }
    .marR--10 {
      margin-right: 10px;
    }
    .pad-10 {
      padding: 0 40px;
    }
    .blockStyle {
      height: 10px;
      width: 10px;
      display: inline-block;
      border-radius: 2px;
      margin: 0 5px;
    }
    .redBox {
      background: #f56c6c;
    }
    .greenBox {
      background: #21f27f;
    }
    .yellowBox {
      background: #ffa854;
    }
    .dis-loading {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 100px;
    }
    .pd-l {
      padding-left: 24px;
    }
    .textSty {
      overflow: hidden;
      white-space: nowrap;
    }
    .swiper-wrapper {
      width: 800px;
      // min-width: 300px !important;
    }
    .posi-relative {
      position: relative;
    }
    .posi-absolute {
      position: absolute;
      top: -23px;
      right: -4px;
    }
    .pd-left {
      padding-left: 8px;
    }
    .dis-block {
      width: 30px;
      height: 40px;
      display: inline-block;
    }
    .swiper-button-next {
      position: absolute;
      top: -33px;
      right: -2px;
      width: 40px;
      height: 30px;
      // margin-top: calc(0px - (var(--swiper-navigation-size)/ 2));
      z-index: 10;
      cursor: pointer;
      display: flex !important;
      //background: green;
      align-items: center;
      justify-content: center;
    }

    .swiper-button-prev {
      position: absolute;
      top: -33px;
      left: -2px;
      width: 40px;
      height: 30px;
      // margin-top: calc(0px - (var(--swiper-navigation-size)/ 2));
      z-index: 10;
      cursor: pointer;
      display: flex;
      // background: red;
      align-items: center;
      justify-content: center;
      // color:
    }
    .gray-bg {
      background: rgba(153, 153, 153, 0.1);
    }
    .blue-bgs {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      color: #007eff;
    }
    .time-box {
      width: 60px !important;
      height: 35px;
      margin: 0 5px;
      padding: 0 10px;
      border-radius: 4px;
      padding: 2px 4px;
    }
    .mrg-left {
      margin-left: 14px;
      margin-top: -5px;
      font-size: 12px;
    }
    .grays-today {
      color: #999999;
    }
    .blues-today {
      color: #007eff;
    }
    .ivu-radio-checked .ivu-radio-inner:after {
      opacity: 1;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
    }
    .dis-flex {
      display: flex;
    }
    .flex-content {
      display: flex;
      justify-content: space-between;
    }
    .flex-1 {
      flex: 1;
    }
    .flex-3 {
      flex: 3;
    }
    .device-list {
      width: 100%;
      height: 350px;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .default-Style {
      height: 60px;
      width: 90%;
      margin: 10px;
      padding: 10px;
      background: #2f3541;
      border-radius: 5px;
    }
    .blueStyle {
      height: 60px;
      margin: 10px;
      padding: 10px;
      width: 90%;
      background: #172d41;
      color: #2d8bef;
      border-radius: 5px;
    }
    .height-380 {
      height: 380px;
    }
    .back {
      font-size: 16px;
      cursor: pointer;
    }
    .detailcontent {
      .ivu-tabs-bar {
        background: #1a202e;
        border-radius: 10px;
        margin-top: 10px;
        padding: 10px;
      }
      .infomation {
        background: #1a202e;
        padding: 20px;
        border-radius: 10px;
      }
      h3 {
        margin-bottom: 20px;
      }
      .detailList {
        background: #1a202e;
        margin-top: 20px;
        padding: 20px;
        border-radius: 10px;
      }
    }
    .history {
      background: #1a202e;
      border-radius: 10px;
      padding: 20px;
    }
  }
</style>
