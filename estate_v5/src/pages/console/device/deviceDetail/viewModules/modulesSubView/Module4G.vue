<template>
  <div>
    <DeviceParamHead>
      <div class="tem-flex">
        <Button type="primary" ghost @click="openToolModal">{{ $t('outputLevel') }}</Button>
      </div>
    </DeviceParamHead>
    <div class="module-4G-container">
      <div class="flex-1">
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">{{ $t('signalIntensity') }}：</div>
          <div class="flex-3">
            <Signal class="signal-style" :type="2" :value="signalValue" />
          </div>
        </div>
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">{{ $t('outputState') }}：</div>
          <div class="flex-3">{{ getStatus('output') }}</div>
        </div>
      </div>
      <div class="flex-1">
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color" style="white-space: nowrap">{{ $t('outputMode') }}：</div>
          <div class="flex-3">{{ getOutMode(infoData.outMode) || '-' }}</div>
        </div>
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color" style="padding-left: 5px">{{ $t('inputState') }}：</div>
          <div class="flex-3">{{ getStatus('input') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { outputLevel, getConfigDataThirdDevice, getRealTimeDataThirdDevice } from '@/api/console/device'
  import Signal from '../../../signal/index.vue'
  const inputConfig = {
    0: window.$t('normal'),
    1: window.$t('fault'),
    2: window.$t('feedback'),
  }
  const outputConfig = {
    0: window.$t('close'),
    1: window.$t('open3'),
  }
  export default {
    components: {
      DeviceParamHead,
      Signal,
    },
    props: {
      mac: String,
    },
    computed: {
      signalValue() {
        return (this.infoData.csq || 0) * 2
      },
    },
    data() {
      return {
        infoData: {},
        statusData: {
          model: '', // 型号
          input: '', // 输入状态：0-正常 1-故障 2-反馈
          output: '', // 输出状态：0-关闭   1-打开
        },
      }
    },
    mounted() {
      this.getParamsDetails()
      this.getRealData()
    },
    methods: {
      async getParamsDetails() {
        const res = await getConfigDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.infoData = res.data
      },
      async getRealData() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        const { model, input, output } = !!res.data && res.data
        this.statusData = {
          model, // 型号
          input, // 输入状态：0-正常 1-故障 2-反馈
          output, // 输出状态：0-关闭   1-打开
        }
      },
      getStatus(type) {
        if (!this.statusData[type] && this.statusData[type] !== 0) return '-'
        const typeConfig = type === 'input' ? inputConfig : outputConfig
        return typeConfig[this.statusData[type]]
      },
      getOutMode(val) {
        const modeConfig = {
          1: this.$t('pulse'),
          0: this.$t('levelE'),
        }
        return modeConfig[val]
      },
      openToolModal() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('issueOutputLevel'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { cmd: '01', mac: this.mac }
            const res = await outputLevel(params)
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
  .signal-style {
    margin: -7px 0 0 -5px;
  }
  .module-4G-container {
    display: flex;
    .flex-1 {
      flex: 1;
    }
    .flex-3 {
      flex: 3;
    }
    .text-Color {
      color: #999;
    }
    .text-right {
      text-align: right;
    }
    .mart-20 {
      margin-top: 20px;
    }
  }
</style>
