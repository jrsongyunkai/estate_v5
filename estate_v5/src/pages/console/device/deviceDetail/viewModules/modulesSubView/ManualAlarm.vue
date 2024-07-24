<template>
  <div>
    <DeviceParamHead></DeviceParamHead>
    <div class="container">
      <div class="flex-1">
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">{{ $t('state') }}：</div>
          <div class="flex-3">
            <span class="text-pd-5" :class="className(infoData.status)">{{ (!!statusConfig[infoData.status] && statusConfig[infoData.status][0]) || '-' }}</span>
          </div>
        </div>
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">{{ $t('batteryVoltage') }}：</div>
          <div class="flex-3">{{ infoData.batt ? `${infoData.batt}(V)` : '-' }}</div>
        </div>
      </div>
      <div class="flex-1">
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">&nbsp;</div>
          <div class="flex-3"></div>
        </div>
        <div class="tem-flex mart-20">
          <div class="text-right flex-1 text-Color">{{ $t('temperature') }}：</div>
          <div class="flex-3">{{ infoData.Temp || '-' }}℃</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { getRealTimeDataThirdDevice } from '@/api/console/device'
  import { refreshSim } from '@/api/control/index'
  const statusConfig = {
    0: [window.$t('normal'), 'greenStyle'],
    1: [window.$t('alarm'), 'redStyle'],
    3: [window.$t('lowbatteryLevel'), 'redStyle'],
    2: [window.$t('restoreNormal'), 'greenStyle'],
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
        simInfo: {},
        infoData: {},
        statusConfig,
      }
    },
    mounted() {
      this.getParamsDetails()
    },
    methods: {
      className(val) {
        if (val === 0 || !!val) return statusConfig[val][1]
        return ''
      },
      async refreshInfo(val) {
        let params = { mac: this.mac, imsi: this.simInfo.imsi }
        const res = await refreshSim(params)
        if (!res.success) return this.$Message.error(res.message)
        if (res.success && res.data) {
          this.simInfo = {
            imsi: res.data.imsi,
            iccid: res.data.iccid,
            expireDate: res.data.expireDate,
            simUpdateDate: res.data.simUpdateData,
            volumePackage: res.data.volumePackage,
            remainVolume: res.data.remainVolume,
            supplierName: res.data.supplierName,
          }
          this.$Message.success({ content: this.$t('refreshSuccessful') }) // 刷新成功
        }
      },

      async getParamsDetails() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.infoData = res.data
        // this.$store.state.simObj
      },
    },
  }
</script>

<style lang="less" scoped>
  .bg-right-bg {
    background: rgb(9, 15, 26) !important;
    width: 10px;
  }
  .tem-flex {
    display: flex;
  }
  .redStyle {
    color: #d9001b;
    background: #351b2c;
  }
  .greenStyle {
    color: #21f26d;
    background: #216149;
  }
  .text-pd-5 {
    padding: 2px 4px;
  }
  .mart-20 {
    margin-top: 20px;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
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
  }
</style>
