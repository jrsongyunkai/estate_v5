<template>
  <div>
    <div class="inform-heads">
      <div class="left ds-flx">
        <div class="mart"></div>
        <div class="title thead-title">{{ $t('otherParameters') }}</div>
      </div>
      <div class="right">
        <Button v-if="checkStatus === 0" type="primary" ghost style="margin-left: 10px" @click="openCheckModal">
          {{ $t('checkJob') }}
          <span style="position: relative">
            <span style="position: absolute; top: -15px; left: 2px">
              <img src="@/assets/images/alreturn.png" alt="" style="width: 32px" />
            </span>
          </span>
        </Button>
        <Button v-if="checkStatus === 3" type="primary" ghost style="margin-left: 10px" @click="openCheckModal">{{ $t('checkJob') }}</Button>
        <Button type="warning" ghost v-if="checkStatus === 1">{{ $t('onDutyInspection') + '...' + '(' + countDown + ':' + fiveNight + ')' }}</Button>
        <Button v-if="checkStatus === 2" type="primary" ghost style="margin-left: 10px" @click="openCheckModal">
          {{ $t('checkJob') }}
          <span style="position: relative">
            <span style="position: absolute; top: -15px; left: 2px">
              <img src="@/assets/images/moreTime.png" alt="" style="width: 26px" />
            </span>
          </span>
        </Button>
        <Button type="primary" ghost style="margin: 0 10px" @click="initDevice">{{ $t('reset1') }}</Button>
        <Button type="primary" ghost @click="refreshData">{{ $t('refresh') }}</Button>
      </div>
    </div>
    <div>
      <div style="display: flex; padding-top: 20px">
        <div style="flex: 1">
          <div class="txt-right">
            <span class="grays">{{ $t('fireAlarmStatus') }}:</span>
            <span class="alarm-red" v-if="fireStatus === 1">{{ $t('alarm') }}</span>
            <span class="x-success" v-if="fireStatus === 0">{{ $t('normal') }}</span>
          </div>
          <div class="text-mar">
            <span class="grays">{{ $t('mainPowerState') }}:</span>
            <span class="b-warning" v-if="mainPowerStatus === 1">{{ $t('fault') }}</span>
            <span class="x-success" v-if="mainPowerStatus === 0">{{ $t('normal') }}</span>
          </div>
        </div>
        <div style="flex: 1">
          <div class="txt-right">
            <span class="grays">{{ $t('equipmentStatus') }}:</span>
            <span class="b-blueing" v-if="deviceStatus === 1">{{ $t('normalMonitoring') }}</span>
            <span class="b-warning" v-if="deviceStatus === 0">{{ $t('testStatus') }}</span>
          </div>
          <div class="text-mar">
            <span class="grays">{{ $t('backupState') }}:</span>
            <span class="b-warning" v-if="followPowerStatus === 1">{{ $t('fault') }}</span>
            <span class="x-success" v-if="followPowerStatus === 0">{{ $t('normal') }}</span>
          </div>
          <div class="txt-right"></div>
        </div>
        <div style="flex: 1">
          <div class="txt-right">
            <span class="grays">{{ $t('faultStatus') }}:</span>
            <span class="b-warning" v-if="errorStatus === 1">{{ $t('fault') }}</span>
            <span class="x-success" v-if="errorStatus === 0">{{ $t('normal') }}</span>
          </div>
          <div class="text-mar">
            <span class="grays">{{ $t('communicateMonitoringCenter') }}:</span>
            <span class="b-warning" v-if="channelStatus === 1">{{ $t('fault') }}</span>
            <span class="x-success" v-if="channelStatus === 0">{{ $t('normal') }}</span>
          </div>
        </div>
      </div>
      <div>
        <span class="grays">{{ $t('monitoringConnectionLines') }}:</span>
        <span class="b-warning" v-if="connectAddrStatus === 1">{{ $t('fault') }}</span>
        <span class="x-success" v-if="connectAddrStatus === 0">{{ $t('normal') }}</span>
      </div>
      <div style="display: flex">
        <div class="text-mar" style="flex: 1">
          <span class="grays">{{ $t('version') }}:</span>
          <span>
            {{ version }}
          </span>
        </div>
        <div class="text-mar" style="flex: 2">
          <span class="grays">{{ $t('deviceTime') }}:</span>
          <span>{{ utTime }}</span>
          <span class="b-blueing pointer" @click="getNewProTime">{{ $t('synchronizeSystemTime') }}</span>
        </div>
      </div>
      <Modal :title="$t('checkJob')" v-model="checkWorkerModal" class="chek-modal">
        <div v-if="showOne">
          <span>{{ $t('responseTimeoutDuration') }}：</span>
          <Select v-model="minValue" style="width: 200px" filterable>
            <Option v-for="item in timelist" :key="item.label" :value="item.value">{{ item.label }}</Option>
          </Select>
          <span>{{ $t('minute') }}</span>
        </div>
        <div class="ds-center" v-if="showTwo">
          <div>
            <div><Icon type=" icon-v5  icon-v5-refresh1" class="demo-spin-icon-load" style="font-size: 40px"></Icon></div>
            <div style="margin-left: -30px">{{ $t('waitingResponse', { hour: countDown, minute: fiveNight }) }}</div>
          </div>
        </div>
        <div v-if="showThree" class="ds-center">
          <div>
            <div style="margin: 10px 0"><Icon type=" icon-v5 icon-v5-dui" style="color: green; font-size: 25px"></Icon></div>
            <div style="margin-left: -8px">{{ $t('responsed') }}</div>
          </div>
        </div>
        <div v-if="showFour" class="ds-center">
          <div>
            <div style="margin: 10px 0"><Icon type="ios-close-circle" style="color: red; font-size: 25px" /></div>
            <div style="margin-left: -8px">{{ $t('commandTimedOutNotResponding') }}</div>
          </div>
        </div>
        <div slot="footer">
          <div v-if="isShowButton">
            <Button type="primary" @click="openCountdown">{{ $t('confirm2') }}</Button>
            <Button @click="checkWorkerModal = false">{{ $t('cancel') }}</Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import { queryutInfo, checkUtDevice, refreshRealTime, syncTimeUt, initUt, queryCheckInfo } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    props: {
      mac: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        checkCounts: null,
        countSet: null,
        checkStatus: '',
        showOne: true,
        showTwo: false,
        showThree: false,
        showFour: false,
        countDown: '',
        fiveNight: '',
        connectAddrStatus: '',
        setting: '',
        utTime: '',
        version: '',
        channelStatus: '',
        errorStatus: '',
        deviceStatus: '',
        fireStatus: '',
        mainPowerStatus: '',
        followPowerStatus: '',
        checkInfo: { checkInfo: '1' },
        isShowButton: true,
        minValue: '',
        timelist: [],
        comboType: '',
        checkWorkerModal: false,
        countTime: null,
      }
    },
    created() {
      for (let i = 11; i < 61; i++) {
        this.timelist.push({ value: `${i}`, label: `${i}` })
      }
      this.init()
      this.getStatus()
    },
    beforeDestroy() {
      clearInterval(this.countSet)
      clearInterval(this.countTime)
    },
    methods: {
      refreshData() {
        refreshRealTime({ type: 4, mac: this.mac }).then(res => {
          if (res.success) {
            this.init('refresh')
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      init(val) {
        queryutInfo({ mac: this.mac }).then(res => {
          if (res.success) {
            this.$emit('propQueryInfo', res.data)
            this.checkStatus = res.data.utBaseInfo.checkStatus
            this.fireStatus = res.data.utBaseInfo.fireStatus
            this.mainPowerStatus = res.data.utBaseInfo.mainPowerStatus
            this.followPowerStatus = res.data.utBaseInfo.followPowerStatus
            this.deviceStatus = res.data.utBaseInfo.deviceStatus
            this.errorStatus = res.data.utBaseInfo.errorStatus
            this.channelStatus = res.data.utBaseInfo.channelStatus
            this.connectAddrStatus = res.data.utBaseInfo.connectAddrStatus
            this.version = res.data.utBaseInfo.version
            this.setting = res.data.utBaseInfo.setting || ''
            this.utTime = dayjs(+res.data.utBaseInfo.utTime).format('YYYY-MM-DD HH:mm:ss')

            if (this.checkStatus === 1) {
              let checkEndTime = res.data.utBaseInfo.checkEndTime
              this.countDown = ((checkEndTime - new Date().valueOf()) / (1000 * 60)).toFixed(0) - 1

              if (this.countSet || this.countTime) {
              } else {
                if (this.fiveNight) {
                } else {
                  this.fiveNight = parseInt((checkEndTime - new Date().valueOf()) % 60)
                }

                this.countSet = setInterval(() => {
                  this.fiveNight--
                  if (this.fiveNight === -1) {
                    this.countDown -= 1
                    this.fiveNight = 59
                  }
                  if (this.countDown <= 0) {
                    this.countDown = 0
                  }
                  if (this.countDown === 0 && this.fiveNight === 0) {
                    this.checkStatus = 2
                    clearInterval(this.countSet)
                  }
                }, 1000)
              }
            } else {
              if (this.countSet) {
                clearInterval(this.countSet)
              }
            }
            if (val === 'refresh') {
              this.$Message.success({
                content: this.$t('refreshSuccessful'),
              })
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      openCountdown() {
        if (!this.minValue) return this.$Message.error({ content: this.$t('selectDurationFirst') })
        let parmars = {
          mac: this.mac,
          checkTime: this.minValue,
        }
        checkUtDevice(parmars).then(res => {
          if (res.success) {
            this.isShowButton = false
            this.showOne = false
            this.showTwo = true
            this.showThree = false
            this.showFour = false
            this.fiveNight = 59
            this.countDown = +this.minValue - 1
            this.countTime = setInterval(() => {
              this.fiveNight--
              if (this.fiveNight === -1) {
                this.countDown -= 1
                this.fiveNight = 59
              }
              if (this.countDown === -1) {
                this.countDown = 0
                this.fiveNight = 0
                clearInterval(this.countTime)
              }
            }, 1000)
            this.checkStatus = 1
            this.checkCounts = setInterval(() => {
              queryCheckInfo({ mac: this.mac }).then(res => {
                if (res.success) {
                  if (res.data === 0 || res.data === 2) {
                    this.checkStatus = res.data
                    if (res.data === 0) {
                      this.showOne = false
                      this.showTwo = false
                      this.showThree = true
                      this.showFour = false
                    }
                    if (res.data === 2) {
                      this.showOne = false
                      this.showTwo = false
                      this.showThree = false
                      this.showFour = true
                    }
                    clearInterval(this.checkCounts)
                    clearInterval(this.countTime)
                  }
                } else {
                  clearInterval(this.countTime)
                  clearInterval(this.checkCounts)
                  this.checkWorkerModal = false
                  this.$Message.error({
                    content: res.message,
                  })
                }
              })
            }, 5000)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
        //
      },
      getStatus() {
        queryCheckInfo({ mac: this.mac }).then(res => {
          if (res.success) {
            this.checkStatus = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      initDevice() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<p>${this.$t('sureReset')}？</p>`,
          onOk: () => {
            initUt({ mac: this.mac }).then(res => {
              if (res.success) {
                this.init()
                this.$Message.success({
                  content: this.$t('resetSuccess'),
                })
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          },
        })
      },
      getNewProTime() {
        syncTimeUt({ mac: this.mac }).then(res => {
          if (res.success) {
            this.init()
            this.$Message.success({
              content: this.$t('syncSuccessful'),
            })
          }
        })
      },
      getValues(val) {},
      openCheckModal() {
        this.checkWorkerModal = true
        this.showOne = true
        this.showTwo = false
        this.showThree = false
        this.showFour = false
        this.isShowButton = true
      },
    },
  }
</script>
<style lang="less" scoped>
  .inform-heads {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #5e626c;
    padding-top: 2px;
    .ds-flx {
      display: flex;
      padding-top: 5px;
    }
    .mart {
      margin: 5px 0px;
      margin-right: 10px;
      width: 2px;
      height: 14px;
      background: #0372e5;
    }
    .thead-title {
      font-size: 16px;
    }
  }
  .txt-right {
    margin: 10px 0;
  }
  .text-mar {
    margin: 20px 0;
  }
  .ds-center {
    display: flex;
    justify-content: center;
  }
  .alarm-red {
    margin-left: 5px;
    padding: 2px 4px 2px 2px;
    color: #f56c6c !important;
    background: rgba(255, 79, 79, 0.15) !important;
  }
  .grays {
    color: #999999;
    margin-right: 5px;
  }
  .nomal-green {
    padding: 3px 5px;
    color: #0dd667;
    //background: rgba(22, 85, 62);
    border-radius: 4px;
  }
</style>
