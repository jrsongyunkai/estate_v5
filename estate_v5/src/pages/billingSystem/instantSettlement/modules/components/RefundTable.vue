<template>
  <Table :columns="columns" :data="list">
    <template #tradeStatus="{ row }">
      <span v-if="row.status === 0" class="status disabled">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 1" class="status warn">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 2" class="status success">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 3" class="status error">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 4" class="status disabled">{{ row.statusDesc }}</span>
      <span v-else class="status">{{ $t('unknown2') }}</span>
    </template>
    <template #bizType="{ row }">{{ row.bizType === 4 ? $t('offlineRefund') : $t('giftAmountDue') }}</template>
    <template #accountAmount="{ row }">
      <span :class="{ textError: +row.accountAmount < 0 }">{{ `¥${row.accountAmount.toFixed(2)}` }}</span>
    </template>
    <template #channelType="{ row }">{{ row.refundOrderDetailList && row.refundOrderDetailList[0].refundChannelDesc }}</template>
    <template #tradeNo="{ row }">{{ row.refundOrderDetailList && row.refundOrderDetailList[0].tradeNo }}</template>
    <template #giftNo="{ row }">{{ row.bizType === 9 ? row.billNo : '-' }}</template>
    <template #action="{ row }">
      <Button type="text" size="small" class="text-btn-primary" @click.stop="openModal('refundSituationModal', row)">{{ $t('refundSituation') }}</Button>
    </template>
  </Table>
</template>

<script>
  export default {
    props: {
      list: { type: Array, default: () => [] },
      tradeType: { type: Number, default: 1 },
    },
    inject: ['openModal'],
    data() {
      return {}
    },
    computed: {
      columns() {
        return this.tradeType === 1
          ? [
              { title: this.$t('refundSerialNumber'), key: 'refundNo', minWidth: 160 },
              { title: this.$t('correspondingRechargeSerialNumber'), key: 'bizOrderNo', minWidth: 150 },
              { title: this.$t('refundTime'), key: 'refundCreateTime', minWidth: 180 },
              { title: this.$t('refundAmountWithUnit'), key: 'refundTotalAmount', minWidth: 150 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', minWidth: 200 },
              { title: this.$t('refundChannels'), key: 'channelType', slot: 'channelType', minWidth: 150 },
              { title: this.$t('refundChannelSerialNumber'), key: 'tradeNo', slot: 'tradeNo', minWidth: 280 },
              { title: this.$t('refundRemarks'), key: 'remark', minWidth: 200 },
              { title: this.$t('refundAccount'), key: 'refundUser', minWidth: 250 },
              { title: this.$t('state'), key: 'tradeStatus', slot: 'tradeStatus', minWidth: 100 },
              { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', width: 100 },
            ]
          : [
              { title: this.$t('refundSerialNumber'), key: 'billRepairNo', minWidth: 160 },
              { title: this.$t('refundTime'), key: 'createTime', minWidth: 180 },
              { title: this.$t('type'), key: 'bizType', slot: 'bizType', minWidth: 180 },
              { title: this.$t('giftDiscountSerialNumber'), key: 'giftNo', slot: 'giftNo', minWidth: 200 },
              { title: this.$t('refundAmountWithUnit'), key: 'repairAmount', minWidth: 150 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', minWidth: 150 },
              { title: this.$t('refundRemarks'), key: 'remark', minWidth: 200 },
              { title: this.$t('refundAccount'), key: 'extendMsg', minWidth: 250 },
            ]
      },
    },
    methods: {},
  }
</script>
