<template>
  <div>
    <OperationCheckAuth ref="operationCheckAuth" :action="forceEndOrder" @closeSecondCheck="$emit('close')" :title="$t('tip')" isAlways>
      <div style="line-height: 40px; font-size: 16px">{{ $t('forceEndTip') }}</div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { forceEndOrder } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {}
    },
    methods: {
      async forceEndOrder() {
        const res = await forceEndOrder({ orderNo: this.record.orderNo })
        if (res.success) {
          this.$Message.success({ content: this.$t('actionSuccess') })
          this.callback && this.callback()
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.$refs.operationCheckAuth.openModal()
    },
  }
</script>

<style></style>
