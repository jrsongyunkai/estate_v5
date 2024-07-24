<template>
  <div class="add-obj-form">
    <BackTopTitle :title="$t('addObject')" @close="$emit('close')">
      <Button class="ml-10" type="primary" ghost @click.stop="save">{{ $t('save') }}</Button>
      <Button class="ml-10" ghost @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
    </BackTopTitle>
    <div class="config-view">
      <ScrollSpy style="padding: 0px 10px" navigationHeight="calc(100vh - 185px)" scrollMode="parent" :navigationList="[$t('objectSelect'), $t('settlementStrategy'), $t('timePeriodPriceConfiguration'), $t('balanceWarningConfiguration')]">
        <ObjectChoosePart ref="objectChoosePart" v-model="tableData" class="bgColor" style="margin-bottom: 10px" />
        <SettlementPart ref="settlementPart" v-model="strategy" class="bgColor" style="margin-bottom: 10px" />
        <PriceConfigPart v-if="[1, 2].includes(strategy.feeStandardType)" ref="priceConfigPart" v-model="priceConf" :chargeType="strategy.chargeType" class="bgColor" style="margin-bottom: 10px" />
        <PackageConfigPart v-if="strategy.feeStandardType === 3" ref="packageConfigPart" v-model="packageConfig" class="bgColor" style="margin-bottom: 10px"></PackageConfigPart>
        <WarningConfigPart ref="warningConfigPart" :chargeType="strategy.chargeType" v-model="warnConfList" class="bgColor" />
      </ScrollSpy>
    </div>
  </div>
</template>
<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import ObjectChoosePart from '../fragment/ObjectChoosePart.vue'
  import SettlementPart from '../fragment/SettlementPart.vue'
  import PriceConfigPart from '../fragment/PriceConfigPart.vue'
  import WarningConfigPart from '../fragment/WarningConfigPart.vue'
  import PackageConfigPart from '../fragment/PackageConfigPart.vue'
  import { saveSettlementObj } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        tableData: [],
        priceConf: {},
        strategy: { feeStandardType: 1, billingCycle: 1, cspPattern: ['1'], chargeType: 1, cbmStrategy: 1, costCalcEdge: 1 },
        warnConfList: [],
        packageConfig: {},
      }
    },
    mixins: [noMarginTop],
    components: { BackTopTitle, ObjectChoosePart, SettlementPart, PriceConfigPart, WarningConfigPart, PackageConfigPart },
    computed: {
      channelConfList() {
        let list = []
        for (let device of this.tableData) {
          list = list.concat(...device.configs.map(item => ({ projectCode: this.$store.state.projectCode, resId: device.resId, addr: item.addr, mac: device.mac, enable: '1' })))
        }
        return list
      },
    },
    methods: {
      async save() {
        const { feeStandardType } = this.strategy
        let objectValidate = this.$refs.objectChoosePart.validate()
        let settlementValidate = this.$refs.settlementPart.validate()
        let priceConfValidate = feeStandardType === 3 ? this.$refs.packageConfigPart.validate() : this.$refs.priceConfigPart.validate()
        let warningConfValidate = this.$refs.warningConfigPart.validate()
        if (objectValidate && settlementValidate && priceConfValidate && warningConfValidate) {
          let params = {
            channelConfList: this.channelConfList,
            strategy: feeStandardType === 3 ? { ...this.strategy, cspPattern: '1', chargeType: 2, cbmStrategy: 2, costCalcEdge: 1 } : { ...this.strategy, cspPattern: this.strategy.cspPattern.toString() },
            priceConf: feeStandardType === 3 ? this.packageConfig : this.priceConf,
            warnConfList: this.warnConfList,
          }
          let res = await saveSettlementObj(params)
          if (res.success) {
            this.callback && this.callback()
            this.$message.success(this.$t('savedSuccessfully'))
            this.$emit('close')
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
    },
    mounted() {
      this.warnConfList = [{ enable: 1, warnType: 1, notificationFormat: '1', triggerThreshold: 1 }]
    },
  }
</script>

<style lang="less" scoped>
  .add-obj-form {
    position: relative;
    .config-view {
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
    }
    .bgColor {
      background: var(--card-bg-color);
    }
  }
</style>
