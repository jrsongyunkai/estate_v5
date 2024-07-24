<template>
  <div>
    <Modal v-model="offlineRecharge" :title="rechargeType === 'recharge' ? $t('offlineRecharge') : $t('offlineRefund')" class-name="recharge" @on-cancel="$emit('close')" width="600">
      <div class="prompt">
        <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
        <span v-if="rechargeType === 'recharge'">{{ $t('rechargeTip') }}</span>
        <span v-else>{{ $t('offlineRefundTip2') }}</span>
      </div>
      <div class="source">
        <Form ref="formValidate" :model="formData" label-position="right" :label-width="100" :rules="formRules">
          <FormItem :label="rechargeType === 'recharge' ? `${$t('rechargeSource')}:` : `${$t('refundRecipient')}:`" prop="user">
            <Row>
              <i18n :path="rechargeType === 'recharge' ? 'rechargeToValue' : 'refundRecipientToValue'" :places="{ username: staffName, phone: $store.state.mobile }">
                <Select place="target" v-if="record" v-model="formData.user" style="width: 200px; margin: 0 10px" :transfer="true" :placeholder="$t('pleaseSelect')">
                  <Option v-for="item in record.user" :value="`${item.name}(${item.telephone});${item.id}`" :key="item.telephone">{{ `${item.name}(${item.telephone})` }}</Option>
                </Select>
              </i18n>
            </Row>
          </FormItem>
          <FormItem :label="rechargeType === 'recharge' ? `${$t('rechargeAmount')}:` : `${$t('refundAmount')}:`" prop="amt">
            <MoneyInput v-model="formData.amt" />
          </FormItem>
          <FormItem :label="$t('remark')" prop="notes">
            <Input v-model="formData.notes" :placeholder="$t('pleaseEnter')" type="textarea" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleTransaction">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="offlineAction" :title="$t('offlineRefund')" isAlways>
      <Form>
        <FormItem :label="`${$t('balance')}:`">
          <span>￥ {{ record.balance ? +record.balance : 0 }}</span>
        </FormItem>
        <FormItem :label="rechargeType === 'recharge' ? `${$t('rechargeAmount')}:` : `${$t('refundAmount')}:`">
          <h1>￥ {{ formData.amt }}</h1>
        </FormItem>
        <FormItem :label="rechargeType === 'recharge' ? $t('amountAfterRecharge') : $t('amountAfterRefund')">
          <template v-if="rechargeType === 'recharge'">￥ {{ (Number(record.balance) + Number(formData.amt)).toFixed(2) }}</template>
          <template v-else>
            <h1>￥ {{ (Number(record.balance) - Number(`${formData.amt}`)).toFixed(2) }}</h1>
          </template>
        </FormItem>
      </Form>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { offlineAccountCharge } from '@/api/public'
  export default {
    props: {
      rechargeType: { type: String, default: 'recharge' },
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        offlineRecharge: false,
        staffName: window.sessionStorage.getItem('staffName'),
        formData: { amt: 0, user: '', notes: '' },
      }
    },
    computed: {
      formRules() {
        return {
          amt: [
            { required: true, type: 'number', message: `${this.rechargeType === 'recharge' ? this.$t('enterRechargeAmount') : this.$t('enterRefundAmountTip')}`, trigger: 'change' },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, cb) => {
                if (value <= 0) return cb(new Error(`${this.rechargeType === 'recharge' ? this.$t('enterRechargeAmount') : this.$t('enterRefundAmountTip')}`))
                cb()
              },
            },
          ],
        }
      },
    },
    methods: {
      handleTransaction() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.$refs.operationCheckAuth.openModal()
          }
        })
      },
      async offlineAction() {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.record.billingTarget,
          targetValue: this.record.targetValue,
          opType: this.rechargeType === 'recharge' ? '1' : '2',
          amt: this.formData.amt,
          remark: this.formData.notes,
          userName: this.formData.user.split(';')[0],
          uid: this.formData.user.split(';')[1],
        }
        const res = await offlineAccountCharge(params)
        if (res.success) {
          this.$Message.success({ content: this.rechargeType === 'recharge' ? this.$t('rechargedSuccessfully') : this.$t('refundSuccessful') })
          this.$emit('close')
          this.callback && this.callback()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.offlineRecharge = true
    },
  }
</script>

<style></style>
