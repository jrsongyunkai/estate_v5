<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" :title="$t('offlineRefund')" @on-cancel="$emit('close')">
      <div class="tips warning-tips">
        <div>
          <span style="font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        </div>
        <div>{{ $t('offlineRefundTip') }}</div>
      </div>
      <div class="item-input">
        <div class="label">{{ $t('refundAmount') }}</div>
        <div><MoneyInput v-model="amount" /></div>
      </div>
      <div class="item-input">
        <div class="label">{{ $t('remark') }}</div>
        <div><Input v-model="remark" maxlength="100" show-word-limit type="textarea" :placeholder="$t('pleaseEnter')" /></div>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="onConfirm">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="refundOffline" :title="$t('offlineRefund')" isAlways>
      <div class="money-info">
        <div class="info-item">
          <div class="label">{{ $t('accountBalance') }}:</div>
          <div class="text">¥{{ currentAmount.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('refundAmount') }}:</div>
          <div class="text">¥{{ amount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('amountAfterRefund') }}:</div>
          <div class="text">¥{{ (currentAmount - amount).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { refundOffline } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        isShowModel: false,
        remark: '',
        amount: 0,
      }
    },
    computed: {
      currentAmount() {
        return this.record && +this.record.currentAmount
      },
    },
    methods: {
      onConfirm() {
        if (this.amount === 0) return this.$Message.warning(this.$t('enterRefundAmountTip'))
        this.$refs.operationCheckAuth.openModal()
      },
      async refundOffline() {
        let params = {
          projectCode: this.$store.state.projectCode,
          accountId: this.record.accountId,
          username: this.record.username,
          amount: this.amount,
          remark: this.remark,
        }
        const res = await refundOffline(params)
        if (res.success) {
          this.$Message.success(res.message)
          this.callback && this.callback()
          this.$emit('close')
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.isShowModel = true
    },
  }
</script>

<style lang="less">
  @import url('./style.less');
</style>
