<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" title="线下充值" @on-cancel="$emit('close')">
      <div class="tips warning-tips">
        <div>
          <span style="font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        </div>
        <div>输入线下充值金额后账号余额将直接根据充值金额变化。</div>
      </div>
      <div class="item-input">
        <div class="label">充值金额</div>
        <div><MoneyInput v-model="money" /></div>
      </div>
      <div class="item-input">
        <div class="label">备注</div>
        <div><Input v-model="remark" maxlength="100" show-word-limit type="textarea" placeholder="请输入" /></div>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ '取消' }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="onConfirm">{{ '确定' }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="rechargeOffline" title="线下充值" isAlways>
      <div class="money-info">
        <div class="info-item">
          <div class="label">账号余额:</div>
          <div class="text">¥{{ currentAmount.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值金额:</div>
          <div class="text">¥{{ money.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值后金额:</div>
          <div class="text">¥{{ (currentAmount + money).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { rechargeOffline } from '../request/api'
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
        if (!(this.money > 0)) return this.$Message.error('请输入充值金额')
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
          this.$Message.success('充值成功')
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
