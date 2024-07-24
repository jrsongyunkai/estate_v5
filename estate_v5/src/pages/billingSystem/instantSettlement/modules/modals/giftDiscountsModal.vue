<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" :title="$t('giftsOrDiscounts')" @on-cancel="$emit('close')">
      <div class="money-input">
        <span style="margin-right: 10px">{{ $t('serviceLife') }}</span>
        <RadioGroup v-model="useType" type="button">
          <Radio label="forever">{{ $t('alwaysValid') }}</Radio>
          <Radio label="limit">{{ $t('validTo') }}</Radio>
        </RadioGroup>
        <DatePicker :model-value="limitTime" v-if="useType === 'limit'" :options="dateOptions" @on-change="changeDate" format="yyyy-MM-dd" type="date" :placeholder="$t('pleaseSelectValidDeadline')" class="ml-10" />
      </div>
      <div class="item-input">
        <div class="label">{{ $t('giftAmount') }}</div>
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
    <OperationCheckAuth ref="operationCheckAuth" :action="giveOffline" :title="$t('giftsOrDiscounts')" isAlways>
      <div class="money-info">
        <div class="info-item">
          <div class="label">{{ $t('accountBalance') }}:</div>
          <div class="text">¥{{ currentAmount.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('giftAmount') }}:</div>
          <div class="text">¥{{ amount.toFixed(2) }}</div>
        </div>
        <div class="info-item">
          <div class="label">{{ $t('amountAfterGift') }}:</div>
          <div class="text">¥{{ (currentAmount + amount).toFixed(2) }}</div>
        </div>
      </div>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { giveOffline } from '@/api/billingSystem/instantSettlement'
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
        if (this.useType !== 'forever' && this.limitTime === '') return this.$Message.error(this.$t('pleaseSelectAnExpirationDate'))
        if (this.amount === 0) return this.$Message.error(this.$t('pleaseEnterTheGiftAmount'))
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
