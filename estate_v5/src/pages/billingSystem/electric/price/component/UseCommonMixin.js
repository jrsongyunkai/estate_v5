import { deletePriceStep, batchDeleteTarget, batchConfigTargetAndPrice } from '@/api/public'
export default {
  props: {
    unitPriceStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optionsTimer: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() + 24 * 60 * 60 * 1000 - 86400000
        },
      },
      tabsType: 'current',
      postIndex: 0,
      validStartTime: '',
    }
  },
  methods: {
    deletePriceStepModal(params, cb) {
      this.$Modal.confirm({
        title: this.$t('tip'),
        content: `<div>${this.$t('deleteBillingLadderTip')}</div>`,
        okText: this.$t('confirm'),
        cancelText: this.$t('cancel'),
        onOk: async () => {
          const res = await deletePriceStep(params)
          if (res.success) {
            cb && cb()
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        },
        onCancel: () => {
          this.$Message.info({ content: this.$t('canceled') })
        },
      })
    },
    handleactivationTime(val) {
      this.validStartTime = val
    },
    hanldeleteTarget(val, type, cb) {
      let params = {
        projectCode: this.$store.state.projectCode,
        targetInfoStr: type === 'group' ? JSON.stringify(val.targetInfoVoList.map(it => ({ nodeId: it.nodeId }))) : JSON.stringify(val.targetInfoVoList.map(it => ({ resId: it.resId, addr: it.addr }))),
      }
      this.$Modal.confirm({
        title: this.$t('tip'),
        content: `<div>${this.$t('deleteResourceConfigurationTip')}</div>`,
        okText: this.$t('confirm'),
        cancelText: this.$t('cancel'),
        onOk: async () => {
          const res = await batchDeleteTarget(params)
          if (res.success) {
            this.$Message.success({ content: res.message })
            cb && cb()
          } else {
            this.$Message.error({ content: res.message })
          }
        },
        onCancel: () => {
          this.$Message.info({ content: this.$t('canceled') })
        },
      })
    },
    newDate(time) {
      var date = new Date(time)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
    },
    returnTimeValidity() {
      if (!this.isCurrUse) {
        let timerFlag = new Date(Date.parse(this.validStartTime)) > new Date(Date.parse(this.$Date().format('YYYY-MM-DD HH:mm:ss')))
        if (this.validStartTime === '') {
          this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip7') })
          return false
        } else if (!timerFlag) {
          this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip8') })
          return false
        }
        return true
      }
      return true
    },
    async batchConfigTargetAndPrice(params) {
      const res = await batchConfigTargetAndPrice(params)
      if (res.success) {
        this.postIndex++
      } else {
        this.$Message.error({ content: res.message })
      }
    },
    /**
     * 获取数组中出现元素最多元素的个数
     * @param {*} arr
     * @returns {number}
     */
    findMostFrequentCount(arr) {
      let counts = {}
      let maxCount = 0
      arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1
        if (counts[num] > maxCount) {
          maxCount = counts[num]
        }
      })
      return maxCount
    },
  },
  computed: {
    isCurrUse() {
      return this.tabsType === 'current'
    },
  },
}
