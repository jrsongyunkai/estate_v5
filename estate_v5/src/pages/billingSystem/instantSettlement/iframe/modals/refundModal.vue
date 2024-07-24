<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" title="退费" @on-cancel="$emit('close')">
      <div class="tips error-tips">
        <div>
          <span style="font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        </div>
        <div>本次交易所充值金额将会原路退回至充值账号，相应账号中的余额也将 对应减少，您确认退费吗？</div>
      </div>
      <div class="money-input">
        <span style="margin-right: 10px">退费金额</span>
        <MoneyInput v-model="amount" />
      </div>
      <div class="shortcuts">
        <el-button type="text" class="mr-30" @click.stop="setSettlementAmount">当前结算余额</el-button>
        <el-button type="text" @click.stop="setRechargeAmount">本次充值金额</el-button>
      </div>
      <div class="item-input">
        <div class="label">备注</div>
        <div><Input v-model="remark" maxlength="100" show-word-limit type="textarea" placeholder="请输入" /></div>
      </div>
      <div class="order-info">
        <div class="title">充值明细</div>
        <div class="info-item">
          <div class="label">充值账号:</div>
          <div class="text">{{ userInfo && userInfo.username }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值金额:</div>
          <div class="text">¥{{ record && record.payAmount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">流水号:</div>
          <div class="text">{{ record && record.orderNo }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值渠道:</div>
          <div class="text">{{ '微信充值' }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值渠道流水号:</div>
          <div class="text">{{ record && record.tradeNo }}</div>
        </div>
        <div class="info-item">
          <div class="label">充值备注:</div>
          <div class="text">{{ record && record.remark }}</div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ '取消' }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="onConfirm">{{ '确定' }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="refundOnline" title="退费明细" isAlways>
      <div class="money-info">
        <div class="title">退费明细</div>
        <div class="info-item">
          <div class="label">当前结算余额:</div>
          <div class="text">¥{{ userInfo && userInfo.currentAmount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">退费金额:</div>
          <div class="text">¥{{ amount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">退费后余额:</div>
          <div class="text">¥{{ userInfo && (userInfo.currentAmount - amount).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { refundOnline, getAccountAmount } from '../request/api'
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
        if (this.amount > this.userInfo.currentAmount) return this.$Message.error('退费金额不能大于当前账户余额')
        if (this.amount > this.record.payAmount) return this.$Message.error('退费金额不能大于充值金额')
        if (this.amount <= 0) return this.$Message.error('请输入退费金额')
        this.$refs.operationCheckAuth.openModal()
      },
      setSettlementAmount() {
        if (this.record.newAccountAmount < 0) return this.$Message.error('退费金额不能小于0')
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
          this.$Modal.info({ content: '金额将会在二十四小时内退回至充值账号，请耐心等待。' })
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
