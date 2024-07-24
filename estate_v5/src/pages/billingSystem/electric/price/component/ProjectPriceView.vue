<template>
  <Tabs value="current" name="subchild" @on-click="handleTabstype">
    <TabPane :label="$t('currentElectricityPrice')" name="current" tab="subchild">
      <TablePriceList v-model="editcurrentData" :disabled="unitPriceStatus" @refreshData="hanldegetTargetAndPrice4Prj" />
    </TabPane>
    <TabPane :label="$t('electricityPriceToBeActivated')" name="activated" tab="subchild">
      <div class="header" style="justify-content: space-between">
        <div>
          <span>{{ $t('enablingTime') }}:</span>
          <span v-if="unitPriceStatus">{{ validStartTime }}</span>
          <DatePicker v-else :options="optionsTimer" v-model="validStartTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('pleaseSelect')" style="width: 200px" :transfer="true" @on-change="handleactivationTime"></DatePicker>
        </div>
      </div>
      <TablePriceList v-model="toBeusededitcurrentData" :disabled="unitPriceStatus" @refreshData="hanldegetTargetAndPrice4Prj" />
    </TabPane>
  </Tabs>
</template>

<script>
  import UseCommonMixin from './UseCommonMixin'
  import TablePriceList from './TablePriceList.vue'
  import { getTargetAndPrice4Prj, configTargetAndPrice } from '@/api/public'
  export default {
    mixins: [UseCommonMixin],
    components: {
      TablePriceList,
    },
    props: {
      unitPriceStatus: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        editcurrentData: [],
        toBeusededitcurrentData: [],
        validStartTime: '',
      }
    },
    methods: {
      async hanldegetTargetAndPrice4Prj() {
        let params = { projectCode: this.$store.state.projectCode, isCurrUse: this.isCurrUse, priceType: '1' }
        const res = await getTargetAndPrice4Prj(params)
        this.editcurrentData = []
        this.toBeusededitcurrentData = []
        if (res.success) {
          if (Object.keys(res.data).length !== 0) {
            this.validStartTime = res.data.validStartTime
            if (this.isCurrUse) {
              this.editcurrentData = res.data.priceList.map(val => ({
                pwrLevelFrom: val.pwrLevelFrom,
                pwrLevelTo: val.pwrLevelTo === 2147483647 ? '+∞' : val.pwrLevelTo,
                peakPrice: val.peakPrice ? val.peakPrice : '',
                flatPrice: val.flatPrice || '',
                valleyPrice: val.valleyPrice || '',
                topPeakPrice: val.topPeakPrice || '',
                id: val.id,
                disabled1: false,
                disabled2: val.pwrLevelTo === 2147483647,
                configPowerCycle: this.$store.state.configPowerCycle,
              }))
            } else {
              this.toBeusededitcurrentData = res.data.priceList.map(val => ({
                pwrLevelFrom: val.pwrLevelFrom,
                pwrLevelTo: val.pwrLevelTo === 2147483647 ? '+∞' : val.pwrLevelTo,
                peakPrice: val.peakPrice || '',
                flatPrice: val.flatPrice || '',
                valleyPrice: val.valleyPrice || '',
                topPeakPrice: val.topPeakPrice || '',
                id: val.id,
                disabled1: false,
                disabled2: val.pwrLevelTo === 2147483647,
                configPowerCycle: this.$store.state.configPowerCycle,
              }))
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTabstype(val) {
        this.tabsType = val
        this.$nextTick(() => {
          this.hanldegetTargetAndPrice4Prj()
        })
      },
      /**
       * 保存项目电价配置
       */
      async saveData(cb) {
        if (this.postParams.priceListStr.length === 0) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip1') })
        cb && cb()
        if (!this.returnTimeValidity()) return
        const params = { ...this.postParams, priceListStr: JSON.stringify(this.postParams.priceListStr) }
        const res = await configTargetAndPrice(params)
        if (res.success) {
          this.$emit('saveState', true)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.hanldegetTargetAndPrice4Prj()
    },
    computed: {
      postParams() {
        let priceListStr = []
        let isCurrUse = this.tabsType === 'current'
        let params = {
          projectCode: this.$store.state.projectCode,
          isCurrUse: isCurrUse,
          priceType: '1', // 电价类型：1-普适电价; 2-例外电价,
        }
        if (isCurrUse) {
          priceListStr = this.editcurrentData.map(val => ({
            pwrLevelFrom: val.pwrLevelFrom,
            pwrLevelTo: val.pwrLevelTo === '+∞' ? '2147483647' : val.pwrLevelTo,
            peakPrice: val.peakPrice || '',
            flatPrice: val.flatPrice || '',
            valleyPrice: val.valleyPrice || '',
            topPeakPrice: val.topPeakPrice || '',
          }))
        } else {
          params.validStartTime = this.validStartTime
          priceListStr = this.toBeusededitcurrentData.map(val => ({
            pwrLevelFrom: val.pwrLevelFrom,
            pwrLevelTo: val.pwrLevelTo === '+∞' ? '2147483647' : val.pwrLevelTo,
            peakPrice: val.peakPrice || '',
            flatPrice: val.flatPrice || '',
            valleyPrice: val.valleyPrice || '',
            topPeakPrice: val.topPeakPrice || '',
          }))
        }
        priceListStr.forEach((val, index) => {
          const hasPointed = this.$store.state.configPowerCycle.topTimeValue.length > 0
          const hasPeak = this.$store.state.configPowerCycle.timeValue.length > 0
          const hasFlat = this.$store.state.configPowerCycle.centerTimeValue.length > 0
          const hasValley = this.$store.state.configPowerCycle.bottomTimeValue.length > 0
          if (!hasPointed) delete val.topPeakPrice
          if (!hasPeak) delete val.peakPrice
          if (!hasFlat) delete val.flatPrice
          if (!hasValley) delete val.valleyPrice
        })
        params.priceListStr = priceListStr
        return params
      },
    },
  }
</script>

<style lang="less" scoped>
  .price-view-content {
    width: 100%;
  }
</style>
