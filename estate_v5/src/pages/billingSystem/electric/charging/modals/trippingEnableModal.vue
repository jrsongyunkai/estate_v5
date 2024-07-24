<template>
  <div>
    <Modal v-model="trippingEnable" :title="$t('releaseEnable')" class-name="tripping" width="600" @on-cancel="$emit('close')">
      <Form ref="formValidate" :model="formData" label-position="right" :label-width="190" :rules="formRules">
        <FormItem :label="`${$t('debtDeduction')}:`" prop="status">
          <Switch v-model="formData.status" />
        </FormItem>
        <template v-if="formData.status">
          <FormItem prop="amt" :label-width="50">
            <i18n path="releaseEnableMaxInputValue">
              <InputNumber place="input" v-model="formData.amt" v-inputNumberRule="'PositiveNum'" style="width: 100px"></InputNumber>
            </i18n>
          </FormItem>
          <FormItem :label="`${$t('releaseForm')}:`" prop="tripType">
            <RadioGroup v-model="formData.tripType">
              <Radio label="1">{{ $t('ns_releaseFormOption.label1') }}</Radio>
              <Radio label="2">{{ $t('ns_releaseFormOption.label2') }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="recover">
            <div class="label-recover" slot="label">
              <i18n path="releaseEnableRestorePower">
                <TooltipVue place="explain" class="explain" :tooltipText="$t('releaseEnableRestorePowerTip')"></TooltipVue>
              </i18n>
            </div>
            <Switch v-model="formData.recover" />
          </FormItem>
        </template>
      </Form>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleTripEnable">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="$emit('close')">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getConfigTripProperty, tripEnable } from '@/api/public'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        trippingEnable: false,
        formData: { status: false, amt: 0, recover: false, tripType: '1' },
        formRules: {
          tripType: [{ required: true, message: this.$t('pleaseChooseTheReleaseForm'), trigger: 'change' }],
        },
      }
    },
    methods: {
      async getConfig() {
        let params = { projectCode: this.$store.state.projectCode, tagetType: this.record.billingTarget, target: this.record.targetValue }
        const res = await getConfigTripProperty(params)
        if (res.success) {
          if (res.data) {
            let obj = JSON.parse(res.data.propertyValue)
            this.formData.status = res.data.status === 1
            this.formData.amt = +obj.amt
            this.formData.recover = obj.recover === 'true'
            this.formData.tripType = obj.tripType
            this.configId = res.data.id
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async tripEnable() {
        let params = {
          projectCode: this.$store.state.projectCode,
          target: this.record.targetValue,
          tagetType: this.record.billingTarget,
          tripType: this.formData.tripType,
          recover: this.formData.recover,
          amt: this.formData.amt,
          status: this.formData.status ? 1 : 2,
        }
        const res = await tripEnable(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('releaseEnableHasBeenIssued') })
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTripEnable() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.tripEnable()
          }
        })
      },
    },
    mounted() {
      this.getConfig()
      this.trippingEnable = true
    },
  }
</script>

<style lang="less" scoped>
  .label-recover {
    > span {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: flex-end;
      .explain {
        /deep/ .ivu-icon {
          margin-left: 0px !important;
        }
      }
    }
  }
</style>
