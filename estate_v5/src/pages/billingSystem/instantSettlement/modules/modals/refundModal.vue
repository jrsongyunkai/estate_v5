<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" :title="$t('refund')" @on-cancel="$emit('close')">
      <div class="tips error-tips">
        <div>
          <span style="font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        </div>
        <div>{{ $t('refundModalTip') }}</div>
      </div>
      <div class="money-input">
        <span style="margin-right: 10px">{{ $t('refundAmount') }}</span>
        <MoneyInput v-model="amount" />
      </div>
      <div class="shortcuts">
        <el-button type="text" class="mr-30" @click.stop="setSettlementAmount">{{ $t('currentSettlementBalance') }}</el-button>
        <el-button type="text" @click.stop="setRechargeAmount">{{ $t('amountOfThisRecharge') }}</el-button>
      </div>
      <div class="item-input">
        <div class="label">{{ $t('remark') }}</div>
        <div><Input v-model="remark" maxlength="100" show-word-limit type="textarea" :placeholder="$t('pleaseEnter')" /></div>
      </div>
      <div class="order-info">
        <div class="title">{{ $t('rechargeDetails') }}</div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeAccount') }}:</div>
          <div class="text">{{ userInfo && userInfo.username }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeAmount') }}:</div>
          <div class="text">¥{{ record && record.payAmount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('serialNumber') }}:</div>
          <div class="text">{{ record && record.orderNo }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeChannels') }}:</div>
          <div class="text">{{ $t('weChatPay') }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeChannelSerialNumber') }}:</div>
          <div class="text">{{ record && record.tradeNo }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('rechargeRemarks') }}:</div>
          <div class="text">{{ record && record.remark }}</div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="onConfirm">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="refundOnline" :title="$t('refundDetails')" isAlways>
      <div class="money-info">
        <div class="title">{{ $t('refundDetails') }}</div>
        <div class="info-item">
          <div class="label">{{ $t('currentSettlementBalance') }}:</div>
          <div class="text">¥{{ userInfo && userInfo.currentAmount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('refundAmount') }}:</div>
          <div class="text">¥{{ amount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('balanceAfterRefund') }}:</div>
          <div class="text">¥{{ userInfo && (userInfo.currentAmount - amount).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { refundOnline, getAccountAmount } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        isShowModel: false,
        amount: 0,
        userInfo: null,
        remark: '',
      }
    },
    methods: {
      onConfirm() {
        if (this.amount > this.userInfo.currentAmount) return this.$Message.error(this.$t('refundAmountLimitTip1'))
        if (this.amount > this.record.payAmount) return this.$Message.error(this.$t('refundAmountLimitTip2'))
        if (this.amount <= 0) return this.$Message.error(this.$t('enterRefundAmountTip'))
        this.$refs.operationCheckAuth.openModal()
      },
      setSettlementAmount() {
        if (this.record.newAccountAmount < 0) return this.$Message.error(this.$t('refundAmountLimitValue', { limit: 0 }))
        this.amount = (this.record && this.record.newAccountAmount) || 0
      },
      setRechargeAmount() {
        this.amount = (this.record && this.record.payAmount) || 0
      },
      async getUserAccount() {
        const res = await getAccountAmount({ projectCode: this.$store.state.projectCode, accountId: this.record.accountId })
        if (res.success) {
          this.userInfo = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      async refundOnline() {
        let arr = [{ payChannelDesc: '1', refundAmount: this.amount, refundType: this.amount < this.record.payAmount ? 1 : 0, payOrderNo: this.record.orderNo }]
        let params = {
          projectCode: this.$store.state.projectCode,
          accountId: this.record.accountId,
          username: this.userInfo.username,
          bizOrderNo: this.record.orderNo,
          amount: this.amount,
          operateUser: this.$store.state.realName,
          remark: this.remark,
          refundDetailList: JSON.stringify(arr),
        }
        const res = await refundOnline(params)
        if (res.success) {
          this.callback && this.callback()
          this.$emit('close')
          this.$Modal.info({ content: this.$t('refundSuccessfulAfterTip') })
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.isShowModel = true
      this.getUserAccount()
    },
  }
</script>

<style lang="less">
  @import url('./style.less');
</style>
