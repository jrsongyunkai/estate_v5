<template>
  <Table :columns="columns" border :data="list" :span-method="spanMethod" show-summary :summary-method="handleSummary">
    <template #orderStatus="{ row }">
      <span v-if="row.orderStatus === 1" style="color: #f2920a">进行中</span>
      <span v-else-if="row.orderStatus === 2" style="color: #02c35b">已完结</span>
      <span v-else-if="row.orderStatus === 3" style="color: #d70720">待支付</span>
      <span v-else-if="row.orderStatus === 4" style="color: #d70720">计费暂停</span>
    </template>
    <template #deviceAddr="{ row }">
      <div>{{ `${row.targetName1}（${row.mac}）` }}/</div>
      <div>{{ `${row.targetName2}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</div>
    </template>
    <template #settleSpan="{ row }">
      <div>{{ `${row.orderStartTime} 至 ${row.orderEndTime || '...'}` }}</div>
    </template>
    <template #orderTime="{ row }">{{ !row.orderTime ? '-' : secondsToHms(row.orderTime) }}</template>
    <template #timeSpan="{ row }">
      <span v-if="row.startTime">{{ `${row.startTime} 至 ${row.endTime || '-'}` }}</span>
    </template>
    <template #price="{ row }">
      <span v-if="row.price">{{ `${row.price}元/${row.unit}` }}</span>
    </template>
    <template #totalAmount="{ row }">{{ row.orderStatus === 1 ? '-' : row.totalAmount }}</template>
    <template #amount="{ row }">{{ row.amount !== undefined ? `¥${row.amount}` : '' }}</template>
    <template #cspPattern="{ row }">{{ row.cspPattern === 1 ? '先收费再使用' : '先使用再收费' }}</template>
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
    data() {
      return {}
    },
    computed: {
      columns() {
        let columns = [
          { title: '订单编号', key: 'orderNo', align: 'center', isMerge: true },
          { title: '订单状态', key: 'orderStatus', slot: 'orderStatus', align: 'center', isMerge: true },
          { title: '订单消费模式', key: 'cspPattern', slot: 'cspPattern', align: 'center', isMerge: true },
          { title: '结算时段', key: 'settleSpan', slot: 'settleSpan', align: 'center', isMerge: true },
          { title: '使用时长', key: 'orderTime', slot: 'orderTime', align: 'center', isMerge: true, isSum: true },
          { title: '时段详情', slot: 'timeSpan', align: 'center', isMerge: false },
          { title: '单价', key: 'price', slot: 'price', align: 'center', isMerge: false },
          { title: '消费金额（元）', key: 'amount', slot: 'amount', align: 'center', isMerge: false, precision: 2 },
          { title: '结算总额（元）', key: 'totalAmount', slot: 'totalAmount', align: 'center', isMerge: true, isSum: true, precision: 2 },
        ]
        return this.isUser
          ? [{ title: '结算对象', key: 'deviceAddr', slot: 'deviceAddr', align: 'center', isMerge: true }, ...columns]
          : this.isObject
          ? [...columns, { title: '使用账号', key: 'accountName', align: 'center', isMerge: true }]
          : [{ title: '结算对象', key: 'deviceAddr', slot: 'deviceAddr', align: 'center', isMerge: true }, ...columns, { title: '使用账号', key: 'accountName', align: 'center', isMerge: true }]
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
            sums[key] = { key, value: '合计' }
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
        return h + '小时 ' + m + '分钟 ' + s + '秒'
      },
    },
  }
</script>

<style></style>
