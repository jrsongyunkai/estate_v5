import { batchModify, getObjDetail } from '@/api/billingSystem/instantSettlement'
export default {
  props: {
    record: { type: Array, default: () => {} },
    callback: { type: Function, default: () => {} },
  },
  data() {
    return {
      priceConf: {},
      strategy: { feeStandardType: 1, billingCycle: 1, cspPattern: ['1'], chargeType: 1, cbmStrategy: 1, costCalcEdge: 1 },
      warnConfList: [],
      packageConfig: {},
    }
  },
  methods: {
    async save() {
      if (this.record.length === 0) return this.$Message.error({ content: this.$t('configuredEmptyObjectTip') })
      let { feeStandardType } = this.strategy
      let settlementValidate = this.$refs.settlementPart.validate()
      let priceConfValidate = feeStandardType === 3 ? this.$refs.packageConfigPart.validate() : this.$refs.priceConfigPart.validate()
      let warningConfValidate = this.$refs.warningConfigPart.validate()
      if (settlementValidate && priceConfValidate && warningConfValidate) {
        let params = {
          cfgIdList: this.record.map(item => item.id),
          defaultUnitPrice: feeStandardType === 3 ? this.packageConfig.defaultUnitPrice : this.priceConf.defaultUnitPrice,
          customUnitPrices: feeStandardType === 3 ? this.packageConfig.customUnitPrices : this.priceConf.customUnitPrices,
          strategy: feeStandardType === 3 ? { ...this.strategy, cspPattern: '1', chargeType: 2, cbmStrategy: 2, costCalcEdge: 1 } : { ...this.strategy, cspPattern: this.strategy.cspPattern.toString() },
          warnConfList: this.warnConfList,
        }
        const res = await batchModify(params)
        if (res.success) {
          this.$Message.success(this.$t('savedSuccessfully'))
          this.callback && this.callback()
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      }
    },
    async getObjInfo(cfgId) {
      const res = await getObjDetail({ cfgId })
      if (res.success) {
        let { priceConf, strategy, warnConf } = res.data || { priceConf: null, strategy: null, warnConf: [] }

        this.strategy = {
          feeStandardType: (strategy && strategy.feeStandardType) || 1,
          billingCycle: strategy && strategy.billingCycle,
          cspPattern: (strategy && strategy.cspPattern.split(',')) || ['1'],
          chargeType: strategy && strategy.chargeType,
          cbmStrategy: strategy && strategy.cbmStrategy,
          costCalcEdge: strategy && strategy.costCalcEdge,
        }
        this.$nextTick(() => {
          if (strategy.feeStandardType === 3) {
            this.packageConfig = {
              defaultUnitPrice: priceConf && priceConf.defaultUnitPrice,
              customUnitPrices: priceConf && priceConf.customUnitPrices,
            }
          } else {
            this.priceConf = {
              defaultUnitPrice: priceConf && priceConf.defaultUnitPrice,
              customUnitPrices: priceConf && priceConf.customUnitPrices,
            }
          }
          this.warnConfList = warnConf.map(it => ({ notificationFormat: it.notificationFormat, triggerThreshold: it.triggerThreshold, warnType: it.warnType, enable: it.enable }))
        })
      } else {
        this.$Message.error({ content: res.message })
        this.$emit('close')
      }
    },
  },
  mounted() {
    if (this.record.length === 1) {
      let info = this.record[0]
      this.getObjInfo(info.id)
    }
  },
}
