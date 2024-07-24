<template>
  <div>
    <DeviceParamHead>
      <div class="smoke-flex">
        <Button type="primary" ghost @click="openToolModal">{{ $t('remoteMute') }}</Button>
        <Button type="primary" class="ivu-ml-8" ghost @click="openConfigModal">{{ $t('parameterConfiguration') }}</Button>
      </div>
    </DeviceParamHead>

    <div>
      <div v-display="'flex'" class="margin-10">
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('smokeConcentration1') }}：</div>
          <div class="flex-1">{{ infoData.smokeConcentration === 0 ? 0 : infoData.smokeConcentration || '-' }} db/m</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('temperatureValue') }}：</div>
          <div class="flex-1">{{ infoData.temperature || '-' }} ℃</div>
        </div>
      </div>
      <div v-display="'flex'" class="margin-10">
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('mazePollutionLevel') }}：</div>
          <div class="flex-1">{{ infoData.mazePollution || '-' }}</div>
        </div>
        <div class="flex-1" v-display="'flex'">
          <div class="flex-1 text-right gray-text">{{ $t('batteryVoltage') }}：</div>
          <div class="flex-1">{{ infoData.eqBatteryVoltage || '-' }} V</div>
        </div>
      </div>
    </div>
    <Modal v-model="configModal" :title="$t('parameterConfiguration')" width="600" :mask-closable="false" @on-ok="commandAction">
      <div class="margin-10 text-center">
        <span>{{ $t('pollutionLevelOfSmokeSensors1') }}：</span>
        <span class="position-re">
          <Input v-model="infoData.temAlarmValue" v-inputNumberRule="'PositiveNum'" class="w200"></Input>
          <span class="position-ab">℃</span>
        </span>
      </div>
      <div class="margin-10 text-center">
        <span class="marginL-25">{{ $t('heartbeatCycle') }}：</span>
        <span class="position-re">
          <Input v-model="infoData.heartbeatTime" v-inputNumberRule="'PositiveNum'" class="w200"></Input>
          <span class="position-ab">{{ $t('minute') }}</span>
        </span>
      </div>
    </Modal>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { LXfindRealParam, LXcommand } from '@/api/console/device'
  export default {
    components: {
      DeviceParamHead,
    },
    props: {
      mac: String,
    },
    data() {
      return {
        infoData: {
          temAlarmValue: 0,
          heartbeatTime: 0,
        },
        configModal: false,
      }
    },
    mounted() {
      this.getParamsDetails()
    },
    methods: {
      async getParamsDetails() {
        const res = await LXfindRealParam({ projectCode: this.$store.state.projectCode, mac: this.mac, equipmentType: 41 })
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
            let params = { mac: this.mac, remoteMute: true }
            const res = await LXcommand(params)
            if (!res.success) {
              return this.$Message.error(res.message)
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
        if (!this.infoData.temAlarmValue || !this.infoData.heartbeatTime) {
          return this.$Message.error(this.$t('pleaseEnterTheCompleteParameterConfiguration'))
        }
        const res = await LXcommand({ temThreshold: this.infoData.temAlarmValue, mac: this.mac, heartbeatPeriod: this.infoData.heartbeatTime, remoteMute: false })
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success({ content: this.$t('commandIssuedForWait') })
        this.getParamsDetails()
      },
    },
  }
</script>

<style lang="less" scoped>
  .marginL-25 {
    margin-left: 25px;
  }
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
    margin: 10px;
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
