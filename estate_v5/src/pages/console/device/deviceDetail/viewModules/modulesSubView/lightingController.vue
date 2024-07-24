<template>
  <div>
    <div class="linght-head">
      <div class="left ds-flx">
        <div class="mart"></div>
        <div class="title thead-title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <Button class="refresh-botton" type="primary" ghost icon="md-refresh alarm-threshold-refresh" @click="reFresh"></Button>
        <Button type="success" ghost v-if="lighteness !== 0" @click="closeLight">{{ $t('turnOffLights') }}</Button>
        <Button type="error" ghost v-if="lighteness === 0" @click="openLight">{{ $t('turnONLights') }}</Button>
      </div>
    </div>
    <div class="content-flx">
      <div style="flex: 1">
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('equipmentStatus') }}：</div>
          <div style="display: flex">
            <div :class="networkStatus === 1 ? 'onlineLight' : 'offLight'">{{ networkStatus === 1 ? $t('online') : $t('offline') }}</div>
            <div class="orange-Color" style="margin-left: 10px" v-if="alarmStatus !== '0'">{{ $t('abnormal') }}</div>
          </div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('switchStatus') }}：</div>
          <div>{{ lighteness === 0 ? $t('close1') : $t('open1') }}</div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('brightness') }}：</div>
          <div style="display: flex">
            <div style="flex: 1; margin-right: 10px">{{ lighteness }}</div>
            <div style="flex: 1; margin-top: -7px"><Slider v-model="lighteness" show-tip="never" style="width: 100px" @on-change="getChange"></Slider></div>
            <div style="margin-left: 10px" v-if="isShowLoading"><Icon type="ios-loading" size="16" class="demo-spin-icon-load"></Icon></div>
          </div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('lightingDuration') }}：</div>
          <div>{{ lightTime }}（min）</div>
        </div>
      </div>
      <div style="flex: 1">
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('volt') }}：</div>
          <div>{{ voltage }}</div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('ampere') }}：</div>
          <div>{{ current }}</div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('watt1') }}</div>
          <div>{{ power }}</div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('leakageCurrent') }}:</div>
          <div>{{ leakage }}</div>
        </div>
      </div>
      <div style="flex: 1">
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('updateTime1') }}：</div>
          <div>{{ updateTime }}</div>
        </div>
        <div class="flex-bteween">
          <div class="gray-text">{{ $t('abnormalCause') }}：</div>
          <div>{{ alarmStatusStr }}</div>
        </div>
      </div>
    </div>
    <Modal :title="$t('actionTip')" :mask="false" v-model="tooltipFlagModal">
      <div>{{ contenText }}</div>
      <div slot="footer">
        <Button type="primary" @click="saveOpenAndClose(linghtType)" :loading="isLoading">{{ $t('yes') }}</Button>
        <Button @click="closeTooltipModal">{{ $t('no') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { realTimePara, dimmingthirdDevice, brightnessthirdDevice } from '@/api/public'
  export default {
    props: {
      param: { type: Object, default: () => {} },
    },
    data() {
      return {
        isLoading: false,
        lightValues: '',
        defaultLight: 100,
        lastLighteness: '',
        contenText: '',
        tooltipFlagModal: false,
        linghtType: '',
        leakage: '',
        alarmStatusStr: '',
        updateTime: '',
        power: '',
        current: '',
        voltage: '',
        ledluxValue: '',
        lightTime: '',
        lighteness: 0,
        alarmStatus: '',
        networkStatus: '',
        isCloseLight: true,
        lightValue: 100,
        isShowLoading: false,
      }
    },
    created() {
      this.init()
    },
    computed: {
      isOpenCpt() {
        return this.lighteness === 0
      },
    },
    methods: {
      async init() {
        let params = { mac: this.param.mac }
        const res = await realTimePara(params)
        if (res.success) {
          this.lastLighteness = res.data.lastLighteness
          this.networkStatus = res.data.networkStatus
          this.alarmStatus = res.data.alarmStatus
          this.lighteness = +res.data.lighteness
          this.lightTime = res.data.lightTime
          this.ledluxValue = res.data.led_lux_value || '-'
          this.voltage = res.data.voltage
          this.current = res.data.current
          this.power = res.data.power
          this.leakage = res.data.leakage
          this.updateTime = res.data.updateTime
          this.alarmStatusStr = res.data.alarmStatusStr
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeTooltipModal() {
        this.tooltipFlagModal = false
        this.init()
      },
      async getChange(val) {
        this.lightValues = val
        if (val === 0) {
          this.linghtType = 3
          this.contenText = this.$t('closeLightTip')
          this.tooltipFlagModal = true
          this.isLoading = false
          return false
        } else {
          const res = await brightnessthirdDevice({ mac: this.param.mac })
          if (res.success) {
            if (res.data[0].value === '0') {
              this.linghtType = 4
              this.contenText = this.$t('closeLightTip1', { num: val })
              this.tooltipFlagModal = true
              this.isLoading = false
            } else {
              this.isShowLoading = true
              let address = this.$store.state.adressLight.split(',')
              let param = { mac: this.param.mac, light: val, adjustment: 1, address: address.join('') }
              const res2 = await dimmingthirdDevice(param)
              if (res2.success) {
                this.isShowLoading = false
                this.$Message.success({ content: this.$t('actionSuccess') })
              } else {
                this.$Message.error({ content: res2.message })
              }
            }
          }
        }
      },
      async saveOpenAndClose() {
        this.isLoading = true
        let address = this.$store.state.adressLight.split(',')
        if (this.linghtType === 1 || this.linghtType === 4) {
          const res = await brightnessthirdDevice({ mac: this.param.mac })
          if (res.success) {
            let param = { mac: this.param.mac, light: this.linghtType === 4 ? this.lightValues : this.lastLighteness === 0 ? 100 : this.lastLighteness, adjustment: this.linghtType === 4 ? 1 : 0, address: address.join('') }
            this.getCloseOrOpen(param)
          }
        } else if (this.linghtType === 2 || this.linghtType === 3) {
          let param = { mac: this.param.mac, light: 0, adjustment: this.linghtType === 3 ? 1 : 0, address: address.join('') }
          this.getCloseOrOpen(param)
        }
      },
      openLight() {
        this.linghtType = 1
        this.contenText = this.$t('confirmOpenLight')
        this.tooltipFlagModal = true
        this.isLoading = false
      },
      closeLight() {
        this.linghtType = 2
        this.contenText = this.$t('confirmCloseLight')
        this.tooltipFlagModal = true
        this.isLoading = false
      },
      async getCloseOrOpen(param) {
        const res = await dimmingthirdDevice(param)
        if (res.success) {
          this.$Message.success({ content: this.$t('actionSuccess') })
        } else {
          this.$Message.error({ content: res.message })
        }
        const res2 = await brightnessthirdDevice({ mac: this.param.mac })
        if (res.success) {
          this.lighteness = +res2.data[0].value
        }
        this.isLoading = false
        this.tooltipFlagModal = false
      },
      reFresh() {
        this.init()
      },
    },
  }
</script>

<style lang="less">
  .linght-head {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #5e626c;
    padding-top: 2px;
    padding-bottom: 8px;
    .ds-flx {
      display: flex;
      padding-top: 5px;
    }
    .mart {
      margin: 5px 10px;
      width: 2px;
      height: 14px;
      background: #0372e5;
    }
    .thead-title {
      font-size: 16px;
    }
    .refresh-botton {
      width: 32px;
      height: 32px;
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      margin-right: 10px;
    }
  }
  .content-flx {
    display: flex;
    margin-top: 30px;
  }
  .onlineLight {
    padding: 2px 4px;
    color: #0dd667;
    background: rgba(13, 214, 103, 0.2);
  }
  .offLight {
    padding: 2px 4px;
    color: #f24e4c;
    background: rgba(242, 78, 76, 0.2);
  }
  .orange-Color {
    padding: 2px 4px;
    color: #ea903a;
    background: rgba(234, 144, 58, 0.1);
  }
  .flex-bteween {
    display: flex;
    padding-bottom: 20px;
  }
  .gray-text {
    color: #707276;
  }
</style>
