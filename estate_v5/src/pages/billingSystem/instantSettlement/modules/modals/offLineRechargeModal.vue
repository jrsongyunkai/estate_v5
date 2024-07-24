<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" :title="$t('offlineRecharge')" @on-cancel="$emit('close')">
      <div class="tips warning-tips">
        <div>
          <span style="font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        </div>
        <div>{{ $t('offlineRechargeTip') }}</div>
      </div>
      <div class="item-input">
        <div class="label">{{ $t('rechargeAmount') }}</div>
        <div><MoneyInput v-model="money" /></div>
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
    <OperationCheckAuth ref="operationCheckAuth" :action="rechargeOffline" :title="$t('offlineRecharge')" isAlways>
      <div class="money-info">
        <div class="info-item">
          <div class="label">{{ $t('accountBalance') }}:</div>
          <div class="text">¥{{ currentAmount.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeAmount') }}:</div>
          <div class="text">¥{{ money.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('amountAfterRecharge') }}:</div>
          <div class="text">¥{{ (currentAmount + money).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { rechargeOffline } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        isShowModel: false,
        remark: '',
        money: 0,
      }
    },
    computed: {
      currentAmount() {
        return this.record && +this.record.currentAmount
      },
    },
    methods: {
      onConfirm() {
        if (!(this.money > 0)) return this.$Message.error(this.$t('enterRechargeAmount'))
        this.$refs.operationCheckAuth.openModal()
      },
      async rechargeOffline() {
        let params = {
          projectCode: this.$store.state.projectCode,
          accountId: this.record.accountId,
          username: this.record.username,
          amount: this.money,
          remark: this.remark,
        }
        const res = await rechargeOffline(params)
        if (res.success) {
          this.$Message.success(this.$t('rechargedSuccessfully'))
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
