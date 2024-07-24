<template>
  <Table :columns="columns" :data="list" show-summary :summary-method="handleSummary">
    <template #tradeStatus="{ row }">
      <span class="status disabled" v-if="row.status === 0">{{ $t('notPaid') }}</span>
      <span class="status warn" v-if="row.status === 1">{{ $t('paying') }}</span>
      <span class="status success" v-if="row.status === 2">{{ $t('rechargedSuccessfully') }}</span>
      <span class="status error" v-if="row.status === 3">{{ $t('rechargeFailed') }}</span>
      <span class="status primary ml-10" v-if="row.refundStatus === 2">{{ $t('refundSuccessful') }}</span>
    </template>
    <template #payAmount="{ row }">{{ row.payAmount.toFixed(2) }}</template>
    <template #bizTypeDesc="{ row }">{{ row.bizTypeDesc || $t('weChatPay') }}</template>
    <template #accountAmount="{ row }">
      <span :class="{ textError: +row.accountAmount < 0 }">{{ `¥${row.accountAmount.toFixed(2)}` }}</span>
    </template>
    <template #expireTime="{ row }">{{ row.expireTime === '2099-12-31 23:59:59' ? '-' : row.expireTime }}</template>
    <template #action="{ row }">
      <Button type="text" size="small" v-if="row.status === 2 && row.refundStatus !== 2" class="text-btn-primary" @click.stop="openModal('refundModal', row, callback)">{{ $t('refund') }}</Button>
      <Button type="text" size="small" v-if="row.refundStatus === 2" class="text-btn-primary" @click.stop="refundOrderByPayOrder(row)">{{ $t('refundSituation') }}</Button>
    </template>
  </Table>
</template>

<script>
  import { refundOrderByPayOrder } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      list: { type: Array, default: () => [] },
      tradeType: { type: Number, default: 1 },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {}
    },
    computed: {
      columns() {
        return this.tradeType === 1
          ? [
              { title: this.$t('serialNumber'), key: 'orderNo', minWidth: 180 },
              { title: this.$t('transactionTime'), key: 'payCreateTime', minWidth: 168 },
              { title: this.$t('rechargeAmountWithUnit'), key: 'payAmount', minWidth: 150, slot: 'payAmount', isSum: true, precision: 2 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', minWidth: 150 },
              { title: this.$t('rechargeChannels'), key: 'bizTypeDesc', slot: 'bizTypeDesc', minWidth: 100 },
              { title: this.$t('rechargeChannelSerialNumber'), key: 'tradeNo', minWidth: 254 },
              { title: this.$t('rechargeRemarks'), key: 'remark', minWidth: 150 },
              { title: this.$t('rechargeAccount'), key: 'accountName', minWidth: 200 },
              { title: this.$t('state'), key: 'state', slot: 'tradeStatus', minWidth: 200 },
              { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', width: 100 },
            ]
          : [
              { title: this.$t('serialNumber'), key: 'billRepairNo', minWidth: 150 },
              { title: this.$t('transactionTime'), key: 'createTime', minWidth: 170 },
              { title: this.$t('rechargeAmountWithUnit'), key: 'repairAmount', minWidth: 150, isSum: true, precision: 2 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', minWidth: 150 },
              { title: this.$t('rechargeChannels'), key: 'bizTypeDesc', minWidth: 200 },
              { title: this.$t('expirationDate'), key: 'expireTime', slot: 'expireTime', minWidth: 200 },
              { title: this.$t('rechargeRemarks'), key: 'remark', minWidth: 150 },
              { title: this.$t('rechargeAccount'), key: 'extendMsg', minWidth: 150 },
            ]
      },
    },
    inject: ['openModal'],
    methods: {
      getSum(data, key) {
        return data
          .map(item => Number(item[key]))
          .reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
      },
      handleSummary({ columns, data }) {
        let sum = {}
        columns.forEach((column, index) => {
          const key = column.key
          if (index === 0) {
            sum[key] = { key, value: this.$t('total') }
          } else if (column.isSum) {
            let sumValue = this.getSum(data, key)
            sum[key] = { key, value: sumValue.toFixed(column.precision) }
          } else {
            sum[key] = { key, value: '-' }
          }
        })
        return sum
      },
      async refundOrderByPayOrder(row) {
        const res = await refundOrderByPayOrder({ projectCode: this.$store.state.projectCode, payOrderNo: row.orderNo })
        if (res.success) {
          this.openModal('refundSituationModal', res.data)
        } else {
          this.$Message.error(res.message)
        }
      },
    },
  }
</script>
