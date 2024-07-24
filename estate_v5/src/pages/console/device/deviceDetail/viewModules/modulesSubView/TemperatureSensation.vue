<template>
  <div>
    <DeviceParamHead>
      <div class="tem-flex">
        <Button type="primary" ghost @click="openToolModal">{{ $t('remoteNoiseReduction') }}</Button>
      </div>
    </DeviceParamHead>
    <Row class="mart-20">
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('state') }}：</Col>
          <Col>
            <span class="text-pd-5" :class="className(infoData.status)">{{ statusText }}</span>
          </Col>
        </Row>
      </Col>
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('batteryVoltage') }}：</Col>
          <Col>{{ infoData.Battery_Voltage || '-' }}V</Col>
        </Row>
      </Col>
    </Row>
    <Row class="mart-20">
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('currentTemperature') }}：</Col>
          <Col>{{ infoData.temperature || '-' }}℃</Col>
        </Row>
      </Col>
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('temperatureMinutesAgoOfFive') }}：</Col>
          <Col>{{ infoData.temperature_before || '-' }}℃</Col>
        </Row>
      </Col>
    </Row>
    <Row class="mart-20">
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('signalQuality') }}：</Col>
          <Col>{{ infoData.signal_quality || '-' }}dBm</Col>
        </Row>
      </Col>
      <Col :md="24" :lg="24" :xl="12">
        <Row>
          <Col span="8" class="text-right text-Color">{{ $t('beliefImpatienceRatio') }}：</Col>
          <Col>{{ infoData.signal_intensity || '-' }}dB</Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { wanLinAepCommand, getRealTimeDataThirdDevice } from '@/api/console/device'
  const statusConfig = {
    0: [window.$t('normal'), 'greenStyle'],
    1: [window.$t('alarm'), 'redStyle'],
    2: '', // 预留
    3: [window.$t('lowbatteryLevel'), 'redStyle'],
    4: [window.$t('equipmentFailure'), 'yellowStyle'],
    5: [window.$t('test'), 'blueStyle'],
    6: [window.$t('antiDismantlingAlarm'), 'redStyle'],
    7: '', // 预留
    8: [window.$t('demolitionRestoration'), 'greenStyle'],
  }
  export default {
    components: {
      DeviceParamHead,
    },
    props: {
      mac: String,
    },
    data() {
      return {
        infoData: {},
      }
    },
    mounted() {
      this.getParamsDetails()
    },
    computed: {
      statusText() {
        return (!!statusConfig[this.infoData.status] && statusConfig[this.infoData.status][0]) || '-'
      },
    },
    methods: {
      async getParamsDetails() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.infoData = res.data
        // this.$store.state.simObj
      },
      className(val) {
        if (val === 0 || !!val) return statusConfig[val][1]
        return ''
      },
      openToolModal() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('sureCommandRemoteSilencing'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { mac: this.mac, cmd: 1 }
            const res = await wanLinAepCommand(params) // 接口地址待更换
            if (!res.success) {
              return this.$Message.error({ content: this.$t('commandFail') })
            }
            this.$Message.success({ content: this.$t('commandIssuedForWait') })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .tem-flex {
    display: flex;
    flex: end;
  }
  .redStyle {
    color: #d9001b;
    background: #351b2c;
  }
  .greenStyle {
    color: #21f26d;
    background: #216149;
  }
  .yellowStyle {
    color: #f2d900;
    background: #614921;
  }
  .blueStyle {
    color: #0099ff;
    background: #214961;
  }
  .text-pd-5 {
    padding: 2px 4px;
  }
  .text-right {
    text-align: right;
  }
  .mart-20 {
    margin-top: 20px;
  }
  .text-Color {
    color: #999;
  }
</style>
