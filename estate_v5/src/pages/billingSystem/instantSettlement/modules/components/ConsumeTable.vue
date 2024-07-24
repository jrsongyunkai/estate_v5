<template>
  <Table :columns="columns" border :data="list" :span-method="spanMethod" show-summary :summary-method="handleSummary">
    <template #orderStatus="{ row }">
      <span v-if="row.orderStatus === 1" style="color: #f2920a">{{ $t('inProgress') }}</span>
      <span v-else-if="row.orderStatus === 2" style="color: #02c35b">{{ $t('completed') }}</span>
      <span v-else-if="row.orderStatus === 3" style="color: #d70720">{{ $t('toBePaid') }}</span>
      <span v-else-if="row.orderStatus === 4" style="color: #d70720">{{ $t('billingSuspended') }}</span>
    </template>
    <template #deviceAddr="{ row }">
      <div>{{ `${row.targetName1}（${row.mac}）` }}/</div>
      <div>{{ `${row.targetName2}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</div>
    </template>
    <template #feeStandardType="{ row }">
      {{ feeStandardTypeMap[row.feeStandardType] || $t('unknown2') }}
    </template>
    <template #settleSpan="{ row }">
      <div>{{ $t('timeRangeValue', { startTime: row.orderStartTime, endTime: row.orderEndTime || '...' }) }}</div>
    </template>
    <template #orderTime="{ row }">{{ !row.orderTime ? '-' : secondsToHms(row.orderTime) }}</template>
    <template #timeSpan="{ row }">
      <span v-if="row.startTime">{{ $t('timeRangeValue', { startTime: row.startTime, endTime: row.endTime || '-' }) }}</span>
    </template>
    <template #price="{ row }">
      <span v-if="row.price">{{ $t('priceWithUnitValue', { price: row.price, unit: row.unit }) }}</span>
    </template>
    <template #totalAmount="{ row }">{{ row.orderStatus === 1 ? '-' : row.totalAmount }}</template>
    <template #amount="{ row }">{{ row.amount !== undefined ? `¥${row.amount}` : '' }}</template>
    <template #cspPattern="{ row }">{{ row.cspPattern === 1 ? $t('chargeFirstBeforeUsing') : $t('useBeforeCharging') }}</template>
    <template #action="{ row }">
      <Button type="text" v-if="row.orderStatus === 1" size="small" class="text-btn-primary" @click.stop="forceEndOrder(row)">{{ $t('forceEnd') }}</Button>
      <span v-else>-</span>
    </template>
  </Table>
</template>

<script>
  export default {
    props: {
      list: { type: Array, default: () => [] },
      sumData: { type: Object, default: () => {} },
      isUser: { type: Boolean, default: false },
      isObject: { type: Boolean, default: false },
    },
    inject: ['openModal'],
    data() {
      return {
        feeStandardTypeMap: {
          1: this.$t('useAccordingToQuantity'),
          2: this.$t('useByPer'),
          3: this.$t('useAccordingToPackage'),
        },
      }
    },
    computed: {
      columns() {
        let columns = [
          { title: this.$t('orderNumber'), key: 'orderNo', minWidth: 200, align: 'center', isMerge: true },
          { title: this.$t('orderState'), key: 'orderStatus', slot: 'orderStatus', minWidth: 100, align: 'center', isMerge: true },
          { title: this.$t('billingMode'), key: 'feeStandardType', slot: 'feeStandardType', minWidth: 100 },
          { title: this.$t('orderConsumptionMode'), key: 'cspPattern', slot: 'cspPattern', minWidth: 130, align: 'center', isMerge: true },
          { title: this.$t('settlementPeriod'), key: 'settleSpan', minWidth: 320, slot: 'settleSpan', align: 'center', isMerge: true },
          { title: this.$t('usageDuration'), key: 'orderTime', slot: 'orderTime', minWidth: 180, align: 'center', isMerge: true, isSum: true },
          { title: this.$t('timePeriodDetails'), minWidth: 320, slot: 'timeSpan', align: 'center', isMerge: false },
          { title: this.$t('unitPrice'), key: 'price', slot: 'price', minWidth: 120, align: 'center', isMerge: false },
          { title: this.$t('consumptionAmountWithUnit'), key: 'amount', slot: 'amount', minWidth: 150, align: 'center', isMerge: false, precision: 2 },
          { title: this.$t('totalSettlementAmount'), key: 'totalAmount', slot: 'totalAmount', minWidth: 150, align: 'center', isMerge: true, isSum: true, precision: 2 },
        ]
        return this.isUser
          ? [{ title: this.$t('settlementObject'), key: 'deviceAddr', minWidth: 250, slot: 'deviceAddr', align: 'center', isMerge: true }, ...columns, { title: this.$t('operation'), key: 'action', slot: 'action', fixed: 'right', align: 'center', minWidth: 120, isMerge: true }]
          : this.isObject
          ? [...columns, { title: this.$t('accountUsed'), key: 'accountName', minWidth: 150, align: 'center', isMerge: true }, { title: this.$t('operation'), key: 'action', slot: 'action', fixed: 'right', align: 'center', minWidth: 120, isMerge: true }]
          : [
              { title: this.$t('settlementObject'), key: 'deviceAddr', minWidth: 250, slot: 'deviceAddr', align: 'center', isMerge: true },
              ...columns,
              { title: this.$t('accountUsed'), key: 'accountName', minWidth: 150, align: 'center', isMerge: true },
              { title: this.$t('operation'), key: 'action', slot: 'action', fixed: 'right', minWidth: 120, align: 'center', isMerge: true },
            ]
      },
    },
    methods: {
      getSpan(rowIndex) {
        const row = this.list[rowIndex]
        const preRow = this.list[rowIndex - 1]
        const rowSpan = this.list.filter(item => item.orderNo === row['orderNo']).length
        if (!preRow || row['orderNo'] !== preRow['orderNo']) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      },
      spanMethod({ column, rowIndex }) {
        if (column.isMerge) {
          return this.getSpan(rowIndex)
        }
      },
      handleSummary({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          let key = column.key
          if (index === 0) {
            sums[key] = { key, value: this.$t('total') }
          } else if (column.isSum) {
            sums[key] = { key, value: key === 'orderTime' ? this.secondsToHms(+this.sumData.orderTime) : key === 'totalAmount' ? this.sumData.totalAmount : '-' }
          } else {
            sums[key] = { key, value: '-' }
          }
        })
        return sums
      },
      secondsToHms(seconds) {
        if (!seconds) return '-'
        let h = Math.floor(seconds / 3600)
        let m = Math.floor((seconds % 3600) / 60)
        let s = Math.floor((seconds % 3600) % 60)
        return this.$t('timeLongValue', { hours: h, minute: m, seconds: s })
      },
      forceEndOrder(row) {
        this.openModal('forceEndOrderModal', row, () => {
          this.$emit('refresh')
        })
      },
    },
  }
</script>

<style></style>
