<template>
  <Table :columns="columns" :data="list" show-summary :summary-method="handleSummary">
    <template #tradeStatus="{ row }">
      <span class="status disabled" v-if="row.status === 0">未支付</span>
      <span class="status warn" v-if="row.status === 1">支付中</span>
      <span class="status success" v-if="row.status === 2">充值成功</span>
      <span class="status error" v-if="row.status === 3">充值失败</span>
      <span class="status primary ml-10" v-if="row.refundStatus === 2">退费成功</span>
    </template>
    <template #payAmount="{ row }">{{ row.payAmount.toFixed(2) }}</template>
    <template #bizTypeDesc="{ row }">{{ row.bizTypeDesc || '微信支付' }}</template>
    <template #accountAmount="{ row }">
      <span :class="{ textError: +row.accountAmount < 0 }">{{ `¥${row.accountAmount.toFixed(2)}` }}</span>
    </template>
    <template #expireTime="{ row }">{{ row.expireTime === '2099-12-31 23:59:59' ? '-' : row.expireTime }}</template>
    <template #action="{ row }">
      <Button type="text" size="small" v-if="row.status === 2 && row.refundStatus !== 2" class="text-btn-primary" @click.stop="openModal('refundModal', row, callback)">退费</Button>
      <Button type="text" size="small" v-if="row.refundStatus === 2" class="text-btn-primary" @click.stop="refundOrderByPayOrder(row)">退费情况</Button>
    </template>
  </Table>
</template>

<script>
  import { refundOrderByPayOrder } from '../request/api'
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
              { title: '流水号', key: 'orderNo' },
              { title: '交易时间', key: 'payCreateTime' },
              { title: '充值金额（元）', key: 'payAmount', slot: 'payAmount', isSum: true, precision: 2 },
              { title: '结算余额（元）', key: 'accountAmount', slot: 'accountAmount' },
              { title: '充值渠道', key: 'bizTypeDesc', slot: 'bizTypeDesc' },
              { title: '充值渠道流水号', key: 'tradeNo' },
              { title: '充值备注', key: 'remark' },
              { title: '充值账号', key: 'accountName' },
              { title: '状态', key: 'state', slot: 'tradeStatus' },
              { title: '操作', slot: 'action', fixed: 'right', align: 'center', width: 100 },
            ]
          : [
              { title: '流水号', key: 'billRepairNo' },
              { title: '交易时间', key: 'createTime' },
              { title: '充值金额（元）', key: 'repairAmount', isSum: true, precision: 2 },
              { title: '结算余额（元）', key: 'accountAmount', slot: 'accountAmount' },
              { title: '充值渠道', key: 'bizTypeDesc' },
              { title: '有效期', key: 'expireTime', slot: 'expireTime' },
              { title: '充值备注', key: 'remark' },
              { title: '充值账号', key: 'extendMsg' },
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
            sum[key] = { key, value: '合计' }
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
