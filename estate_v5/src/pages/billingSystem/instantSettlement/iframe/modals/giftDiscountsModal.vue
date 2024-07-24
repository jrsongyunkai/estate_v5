<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" title="赠送/优惠" @on-cancel="$emit('close')">
      <div class="money-input">
        <span style="margin-right: 10px">使用期限</span>
        <RadioGroup v-model="useType" type="button">
          <Radio label="forever">一直有效</Radio>
          <Radio label="limit">有效期至</Radio>
        </RadioGroup>
        <DatePicker :model-value="limitTime" v-if="useType === 'limit'" :options="dateOptions" @on-change="changeDate" format="yyyy-MM-dd" type="date" placeholder="请选择有效截止日期" class="ml-10" />
      </div>
      <div class="item-input">
        <div class="label">赠送金额</div>
        <div><MoneyInput v-model="amount" /></div>
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
    <OperationCheckAuth ref="operationCheckAuth" :action="giveOffline" title="赠送/优惠" isAlways>
      <div class="money-info">
        <div class="info-item">
          <div class="label">账号余额:</div>
          <div class="text">¥{{ currentAmount.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="info-item">
          <div class="label">赠送金额:</div>
          <div class="text">¥{{ amount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">赠送后金额:</div>
          <div class="text">¥{{ (currentAmount + amount).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { giveOffline } from '../request/api'
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
        useType: 'forever',
        limitTime: '',
        dateOptions: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now()
          },
        },
      }
    },
    computed: {
      currentAmount() {
        return this.record && +this.record.currentAmount
      },
    },
    methods: {
      onConfirm() {
        if (this.useType !== 'forever' && this.limitTime === '') return this.$Message.error('请选择有效期')
        if (this.amount === 0) return this.$Message.error('请输入赠送金额')
        this.$refs.operationCheckAuth.openModal()
      },
      async giveOffline() {
        let params = {
          projectCode: this.$store.state.projectCode,
          accountId: this.record.accountId,
          username: this.record.username,
          expireDate: this.useType === 'forever' ? '-1' : this.limitTime,
          amount: this.amount,
          remark: this.remark,
        }
        const res = await giveOffline(params)
        if (res.success) {
          this.$Message.success(res.message)
          this.callback && this.callback()
          this.$emit('close')
        } else {
          this.$Message.error(res.message)
        }
      },
      changeDate(e) {
        this.limitTime = e
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
