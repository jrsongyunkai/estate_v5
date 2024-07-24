<template>
  <div>
    <DeviceParamHead :text="$t('otherData')"></DeviceParamHead>
    <div v-display="'flex'" class="mar-20">
      <div class="hm-flex-1">
        <span class="gray-text">{{ $t('signalIntensity') }}：</span>
        <span>{{ infoData.signalStrength === 0 ? 0 : infoData.signalStrength || '-' }}dbm</span>
      </div>
      <div class="hm-flex-1">
        <span class="gray-text">{{ $t('concentration') }}：</span>
        <span>{{ infoData.gas === 0 ? 0 : infoData.gas || '-' }}ppm</span>
      </div>
    </div>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { HMfindRealParam } from '@/api/console/device'
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
    methods: {
      async getParamsDetails() {
        const res = await HMfindRealParam({ projectCode: this.$store.state.projectCode, mac: this.mac, equipmentType: 45 })
        if (!res.success) return this.$Message.error(res.message)
        this.infoData = res.data
      },
    },
  }
</script>

<style lang="less" scoped>
  .mar-20 {
    margin: 20px;
  }
  .hm-flex-1 {
    flex: 1;
  }
  .gray-text {
    color: #999;
  }
</style>
