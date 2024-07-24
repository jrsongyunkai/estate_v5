<template>
  <Table :columns="columns" :data="list">
    <template #tradeStatus="{ row }">
      <span v-if="row.status === 0" class="status disabled">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 1" class="status warn">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 2" class="status success">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 3" class="status error">{{ row.statusDesc }}</span>
      <span v-else-if="row.status === 4" class="status disabled">{{ row.statusDesc }}</span>
      <span v-else class="status">未知</span>
    </template>
    <template #bizType="{ row }">{{ row.bizType === 4 ? '线下退费' : '赠额到期' }}</template>
    <template #accountAmount="{ row }">
      <span :class="{ textError: +row.accountAmount < 0 }">{{ `¥${row.accountAmount.toFixed(2)}` }}</span>
    </template>
    <template #channelType="{ row }">{{ row.refundOrderDetailList && row.refundOrderDetailList[0].refundChannelDesc }}</template>
    <template #tradeNo="{ row }">{{ row.refundOrderDetailList && row.refundOrderDetailList[0].tradeNo }}</template>
    <template #giftNo="{ row }">{{ row.bizType === 9 ? row.billNo : '-' }}</template>
    <template #action="{ row }">
      <Button type="text" size="small" class="text-btn-primary" @click.stop="openModal('refundSituationModal', row)">退费情况</Button>
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
              { title: '退费流水号', key: 'refundNo' },
              { title: '对应充值流水号', key: 'bizOrderNo' },
              { title: '退费时间', key: 'refundCreateTime' },
              { title: '退费金额（元）', key: 'refundTotalAmount' },
              { title: '结算余额（元）', key: 'accountAmount', slot: 'accountAmount' },
              { title: '退费渠道', key: 'channelType', slot: 'channelType' },
              { title: '退费渠道流水号', key: 'tradeNo', slot: 'tradeNo' },
              { title: '退费备注', key: 'remark' },
              { title: '退费账号', key: 'refundUser' },
              { title: '状态', key: 'tradeStatus', slot: 'tradeStatus' },
              { title: '操作', slot: 'action', fixed: 'right', align: 'center', width: 100 },
            ]
          : [
              { title: '退费流水号', key: 'billRepairNo' },
              { title: '退费时间', key: 'createTime' },
              { title: '类型', key: 'bizType', slot: 'bizType' },
              { title: '赠送/优惠流水号', key: 'giftNo', slot: 'giftNo', minWidth: 200 },
              { title: '退费金额（元）', key: 'repairAmount' },
              { title: '结算余额（元）', key: 'accountAmount', slot: 'accountAmount' },
              { title: '退费备注', key: 'remark' },
              { title: '退费账号', key: 'extendMsg' },
            ]
      },
    },
    methods: {},
  }
</script>
