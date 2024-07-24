<template>
  <div>
    <Modal v-model="giftDiscounts" :title="$t('giftsOrDiscounts')" class-name="recharge" width="600" @on-cancel="$emit('close')">
      <div class="prompt" style="display: flex">
        <Row style="align-items: center">
          <Icon color="#f59a23" size="20" type="ios-information-circle-outline" style="margin-left: 10px" />
        </Row>
        <div class="ml-10">{{ $t('giftsOrDiscountsTip') }}</div>
      </div>
      <div class="source">
        <Form ref="formValidate" :model="formData" label-position="right" :label-width="100" :rules="formRules">
          <FormItem :label="`${$t('giftType')}:`" prop="opType">
            <RadioGroup v-model="formData.opType" type="button">
              <Radio label="1">{{ $t('electricCharge') }}</Radio>
              <Radio label="2">{{ $t('electricQuantity') }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="`${$t('serviceLife')}:`" prop="timer">
            <RadioGroup v-model="formData.timerType" type="button">
              <Radio label="always">{{ $t('alwaysValid') }}</Radio>
              <Radio label="term">{{ $t('validTo') }}</Radio>
            </RadioGroup>
            <DatePicker v-if="formData.timerType === 'term'" v-model="formData.timer" :options="optionsTimer" type="date" @on-change="handleTimer" :placeholder="$t('pleaseSelect')" style="width: 200px" class="ml-10"></DatePicker>
          </FormItem>
          <FormItem :label="`${$t('giftedTo')}:`" prop="user">
            <Row>
              <i18n path="giftedToValue" :places="{ username: staffName, phone: $store.state.mobile }">
                <Select place="target" v-if="record" v-model="formData.user" style="width: 200px; margin: 0px 10px" :transfer="true" :placeholder="$t('pleaseSelect')">
                  <Option v-for="item in record.user" :value="`${item.name}(${item.telephone});${item.id}`" :key="item.telephone">{{ `${item.name}(${item.telephone})` }}</Option>
                </Select>
              </i18n>
            </Row>
          </FormItem>
          <FormItem :label="formData.opType === '1' ? $t('giftAmount') : $t('freeBattery')" prop="amt">
            <MoneyInput v-if="formData.opType === '1'" v-model="formData.amt" />
            <template v-else>
              <div style="display: flex; align-items: center">
                <InputNumber v-model="formData.amt" v-inputNumberRule="'PositiveNum'" v-width="150" :placeholder="$t('pleaseEnter')" />
                <span style="margin-top: 5px">kW·h</span>
              </div>
            </template>
          </FormItem>
          <FormItem :label="$t('remark')" v-if="formData.opType === '1'" prop="notes">
            <Input v-model="formData.notes" :placeholder="$t('pleaseEnter')" type="textarea" v-width="400" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleAccountGift">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="giftAction" :title="$t('giftsOrDiscounts')" isAlways>
      <Form v-if="formData.opType === '1'">
        <FormItem :label="`${$t('balance')}:`">
          <span>￥ {{ record.balance ? +record.balance : 0 }}</span>
        </FormItem>
        <FormItem :label="`${$t('giftAmount')}:`">
          <h1>￥ {{ `${formData.amt}` }}</h1>
        </FormItem>
        <FormItem :label="`${$t('amountAfterGift')}:`">￥ {{ ((record.balance ? Number(record.balance) : 0) + Number(`${formData.amt}`)).toFixed(2) }}</FormItem>
      </Form>
    </OperationCheckAuth>
  </div>
</template>

<script>
  import { accountGift } from '@/api/public'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        giftDiscounts: false,
        staffName: window.sessionStorage.getItem('staffName'),
        formData: { amt: 0, opType: '1', timer: '', notes: '', user: '', timerType: 'always' },
        optionsTimer: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000
          },
        },
        PwsSeconedStatus: this.$store.state.setSecondPwds,
      }
    },
    computed: {
      formRules() {
        let obj = {
          amt: [
            { required: true, type: 'number', message: `${this.formData.opType === '1' ? this.$t('pleaseEnterTheGiftAmount') : this.$t('pleaseEnterGiftBatteryAmount')}`, trigger: 'change' },
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, cb) => {
                if (value <= 0) return cb(new Error(`${this.formData.opType === '1' ? this.$t('pleaseEnterTheGiftAmount') : this.$t('pleaseEnterGiftBatteryAmount')}`))
                cb()
              },
            },
          ],
        }
        if (this.formData.timerType === 'term') {
          obj.timer = [{ required: true, message: this.$t('pleaseSelectUserPeriod'), trigger: 'change' }]
        }
        return obj
      },
    },
    methods: {
      handleTimer(val) {
        this.formData.timer = val
      },
      handleAccountGift() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            if (this.formData.opType === '2' && !this.PwsSeconedStatus) {
              this.giftAction()
            } else {
              this.$refs.operationCheckAuth.openModal()
            }
          }
        })
      },
      async giftAction() {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.record.billingTarget,
          targetValue: this.record.targetValue,
          opType: this.formData.opType,
          amt: this.formData.amt,
          userName: this.formData.user.split(';')[0],
          uid: this.formData.user.split(';')[1],
          expirieDate: this.formData.timerType === 'always' ? '-1' : this.formData.timer,
        }
        if (this.formData.opType === '1') {
          params.remark = this.formData.notes
        }
        const res = await accountGift(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('giftOrDiscountSuccessful') })
          this.callback && this.callback()
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.giftDiscounts = true
    },
  }
</script>

<style></style>
