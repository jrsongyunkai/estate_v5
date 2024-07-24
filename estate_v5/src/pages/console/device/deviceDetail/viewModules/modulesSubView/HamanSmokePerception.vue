<template>
  <div>
    <DeviceParamHead>
      <div class="smoke-flex">
        <Button type="primary" ghost @click="openToolModal">{{ $t('remoteMute') }}</Button>
        <!-- <Button type="primary" class="ivu-ml-8" ghost @click="openConfigModal">参数配置</Button> -->
      </div>
    </DeviceParamHead>

    <div>
      <div v-display="'flex'" class="margin-10" style="flex-wrap: wrap">
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('smokeConcentration1') }}：</div>
          <div class="flex-1">{{ infoData.dbm === 0 ? 0 : infoData.dbm || '-' }} db/m</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('temperatureValue') }}：</div>
          <div class="flex-1">{{ infoData.temp || '-' }} ℃</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('batteryElectricity') }}：</div>
          <div class="flex-1"><batteryIcon :quantity="infoData.batteryPercent" style="width: 70px"></batteryIcon></div>
        </div>
      </div>
      <div v-display="'flex'" class="margin-10" style="flex-wrap: wrap">
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text" style="white-space: nowrap; margin-left: -10px">{{ $t('pollutionLevelOfSmokeSensors') }}：</div>
          <div class="flex-1">{{ infoData.Mazedirty === 0 ? 0 : infoData.Mazedirty || '-' }}</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">RSRQ：</div>
          <div class="flex-1">{{ infoData.signalQuality || '-' }}dB</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('signalToNoiseRatio') }}：</div>
          <div class="flex-1">{{ infoData.SNR || '-' }}dB</div>
        </div>
      </div>
    </div>
    <Modal v-model="configModal" :title="$t('parameterConfiguration')" width="600" :mask-closable="false" @on-ok="commandAction">
      <div class="margin-10 text-center">
        <span>{{ $t('pollutionLevelOfSmokeSensors1') }}：</span>
        <span class="position-re">
          <Input v-model="infoData.tempLimit" v-inputNumberRule="'PositiveNum'" class="w200"></Input>
          <span class="position-ab">℃</span>
        </span>
      </div>
    </Modal>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { HMfindRealParam, HMcommandDown } from '@/api/console/device'
  import batteryIcon from '@/components/batteryIcon/index.vue'
  export default {
    components: {
      DeviceParamHead,
      batteryIcon,
    },
    props: {
      mac: String,
    },
    data() {
      return {
        infoData: {},
        configData: {
          tem: 0,
          minute: 0,
        },
        configModal: false,
      }
    },
    mounted() {
      this.getParamsDetails()
    },
    methods: {
      async getParamsDetails() {
        const res = await HMfindRealParam({ projectCode: this.$store.state.projectCode, mac: this.mac, equipmentType: 42 })
        if (!res.success) return this.$Message.error(res.message)
        this.infoData = res.data
      },
      openToolModal() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('areYouSureYouWantToIssueARemoteMuteCcommand'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { mac: this.mac, tag: 'mute', value: 1 }
            const res = await HMcommandDown(params) // 接口地址待更换
            if (!res.success) {
              return this.$Message.error({ content: this.$t('commandFail') })
            }
            this.$Message.success({ content: this.$t('commandIssuedForWait') })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
        this.getParamsDetails()
      },
      openConfigModal() {
        this.configModal = true
      },
      async commandAction() {
        if (!this.infoData.tempLimit) {
          return this.$Message.error(this.$t('pleaseEnterTheCompleteParameterConfiguration'))
        }
        const res = await HMcommandDown({ value: this.infoData.tempLimit, tag: 'tempLimit', mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success({ content: this.$t('commandIssuedForWait') })
        this.getParamsDetails()
      },
    },
    created() {},
    beforeDestroy() {},
    destroyed() {},
  }
</script>

<style lang="less" scoped>
  .smoke-flex {
    display: flex;
    flex: end;
  }
  .flex-1 {
    flex: 1;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .w200 {
    width: 200px;
  }
  .margin-10 {
    margin: 20px 10px 20px 20px;
  }
  .gray-text {
    color: #999;
  }
  .position-re {
    position: relative;
  }
  .position-ab {
    position: absolute;
    right: 10px;
    top: 0;
  }
</style>
