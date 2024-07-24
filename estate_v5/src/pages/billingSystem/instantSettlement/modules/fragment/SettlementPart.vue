<template>
  <div class="settlement bgColor">
    <div class="header">
      <div class="left">{{ $t('settlementStrategy') }}</div>
    </div>
    <Form ref="formValidate" :model="formData" label-position="right" :label-width="200" :rules="formRules">
      <FormItem :label="$t('billingMode')" prop="feeStandardType">
        <RadioGroup v-model="formData.feeStandardType" v-if="!disabled">
          <Radio :label="1">{{ $t('useAccordingToQuantity') }}</Radio>
          <Radio :label="2">{{ $t('useByPer') }}</Radio>
          <Radio :label="3">{{ $t('useAccordingToPackage') }}</Radio>
        </RadioGroup>
        <div v-else>{{ formData.feeStandardType === 1 ? $t('useAccordingToQuantity') : formData.feeStandardType === 2 ? $t('useByPer') : $t('useAccordingToPackage') }}</div>
      </FormItem>
      <template v-if="formData.feeStandardType !== 3">
        <FormItem :label="formData.feeStandardType === 1 ? `${$t('billingType')}:` : `${$t('singleChargeStandard')}:`" prop="chargeType">
          <RadioGroup v-model="formData.chargeType" v-if="!disabled" @on-change="changeChargeType">
            <Radio :label="1">{{ `${formData.feeStandardType === 1 ? $t('chargeTypeOption.electricityUse') : $t('chargeTypeOption.electricityCount')}` }}</Radio>
            <Radio :label="2">{{ `${formData.feeStandardType === 1 ? $t('chargeTypeOption.timeLengthUse') : $t('chargeTypeOption.timeLengthCount')}` }}</Radio>
          </RadioGroup>
          <div v-else>{{ formData.chargeType === 1 ? `${formData.feeStandardType === 1 ? $t('chargeTypeOption.electricityUse') : $t('chargeTypeOption.electricityCount')}` : `${formData.feeStandardType === 1 ? $t('chargeTypeOption.timeLengthUse') : $t('chargeTypeOption.timeLengthCount')}` }}</div>
        </FormItem>
        <FormItem prop="billingCycle" :key="2" v-if="formData.feeStandardType === 2">
          <template #label>
            <span>{{ formData.chargeType === 2 ? $t('billingCycleLables.label1') : $t('billingCycleLables.label2') }}</span>
          </template>
          <div style="position: relative" v-if="!disabled" v-width="240">
            <InputNumber :key="3" v-if="formData.chargeType === 2" v-model="formData.billingCycle" class="none-handler-wrap" v-width="240" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'Integer'" />
            <InputNumber :key="4" v-else v-model="formData.billingCycle" class="none-handler-wrap" v-width="240" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'ThreeDecimal'" />
            <span style="position: absolute; top: 2px; right: 10px">{{ formData.chargeType === 2 ? $t('minute') : 'kW·h' }}</span>
          </div>
          <div v-else>{{ `${formData.billingCycle} ${formData.chargeType === 2 ? $t('minute') : 'kW·h'}` }}</div>
        </FormItem>
        <FormItem :label="`${$t('consumptionPattern')}:`" prop="cspPattern">
          <CheckboxGroup v-model="formData.cspPattern" v-if="!disabled">
            <Checkbox label="1">{{ $t('chargeFirstBeforeUsing') }}</Checkbox>
            <span @click.prevent="selectModeTips">
              <Checkbox class="ml-10" label="2">{{ $t('useBeforeCharging') }}</Checkbox>
            </span>
          </CheckboxGroup>
          <div v-else>{{ formData.cspPattern.length == 2 ? $t('chargeFirstBeforeUsingAndUseBeforeCharging') : formData.cspPattern.includes('1') ? $t('chargeFirstBeforeUsing') : formData.cspPattern.includes('2') ? $t('useBeforeCharging') : '' }}</div>
        </FormItem>
        <FormItem prop="billingCycle" :key="1" v-if="formData.feeStandardType === 1">
          <template #label>
            <span>{{ formData.chargeType === 2 ? $t('billingCycleLables.label3') : $t('billingCycleLables.label4') }}</span>
            <TooltipVue style="margin-left: -5px; display: inline-block">{{ formData.chargeType === 2 ? $t('billingCycleLables.labelTip1') : $t('billingCycleLables.labelTip2') }}</TooltipVue>
            :
          </template>
          <div style="position: relative" v-if="!disabled" v-width="240">
            <InputNumber :key="2" v-if="formData.chargeType === 2" v-model="formData.billingCycle" class="none-handler-wrap" v-width="240" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'Integer'" />
            <InputNumber :key="1" v-else v-model="formData.billingCycle" class="none-handler-wrap" v-width="240" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'TwoDecimal'" />
            <span style="position: absolute; top: 2px; right: 10px">{{ formData.chargeType === 2 ? 'min' : $t('yuan') }}</span>
          </div>
          <div v-else>{{ `${formData.billingCycle}${formData.chargeType === 2 ? 'min' : $t('yuan')}` }}</div>
        </FormItem>
        <FormItem prop="cbmStrategy">
          <template #label>
            <span>{{ $t('consumerBalanceManagementStrategy') }}</span>
            <TooltipVue style="margin-left: -5px; display: inline-block">{{ $t('billingCycleLables.labelTip3') }}</TooltipVue>
            :
          </template>
          <RadioGroup v-model="formData.cbmStrategy" v-if="!disabled">
            <Radio v-for="op in strategyOptions" :label="op.value" :key="op.value">
              {{ op.label }}
              <TooltipVue style="margin-left: -10px; display: inline-block">{{ op.tip }}</TooltipVue>
            </Radio>
          </RadioGroup>
          <div v-else>{{ cbmStrategyLabel }}</div>
        </FormItem>
      </template>
    </Form>
    <Modal v-model="isChangeModel" @on-ok="confirmSelect" @on-cancel="cancelSelect" :closable="false">
      <div style="display: flex">
        <span style="color: #ff9900; font-size: 20px; margin-right: 10px"><i class="ivu-icon ivu-icon-ios-alert"></i></span>
        <div>{{ $t('openUseBeforeChargingTip') }}</div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  export default {
    name: 'SettlementPart',
    props: {
      value: { type: Object, default: () => {} },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        isChangeModel: false,
        formData: { feeStandardType: 1, billingCycle: 1, cspPattern: ['1'], chargeType: 1, cbmStrategy: 2, costCalcEdge: 1 },
      }
    },
    computed: {
      strategyOptions() {
        let { chargeType } = this.formData
        return chargeType === 1
          ? [
              { label: this.$t('strategyOptions.label2'), value: 2, tip: this.$t('strategyOptions.tip2') },
              { label: this.$t('strategyOptions.label3'), value: 3, tip: this.$t('strategyOptions.tip3') },
            ]
          : [
              { label: this.$t('strategyOptions.label1'), value: 1, tip: this.$t('strategyOptions.tip1') },
              { label: this.$t('strategyOptions.label2'), value: 2, tip: this.$t('strategyOptions.tip2') },
              { label: this.$t('strategyOptions.label3'), value: 3, tip: this.$t('strategyOptions.tip3') },
            ]
      },
      formRules() {
        let { feeStandardType, chargeType } = this.formData
        const comRules = {
          cspPattern: [{ required: true, type: 'array', message: this.$t('ns_settlementStrategyFromRule.tip1'), trigger: 'change' }],
          cbmStrategy: [{ required: true, type: 'number', message: this.$t('ns_settlementStrategyFromRule.tip2'), trigger: 'change' }],
          feeStandardType: [{ required: true, type: 'number', message: this.$t('ns_settlementStrategyFromRule.tip3'), trigger: 'change' }],
        }
        return this.disabled
          ? null
          : feeStandardType === 1
          ? {
              billingCycle: [
                { required: true, type: 'number', message: chargeType === 2 ? this.$t('ns_settlementStrategyFromRule.tip4') : this.$t('ns_settlementStrategyFromRule.tip5'), trigger: 'change' },
                {
                  required: true,
                  trigger: 'change',
                  validator: (rule, value, cb) => {
                    if (value <= 0) return cb(new Error(chargeType === 2 ? this.$t('ns_settlementStrategyFromRule.tip8', { num: 0 }) : this.$t('ns_settlementStrategyFromRule.tip9', { num: 0 })))
                    if (chargeType === 2 && value > 60) return cb(new Error(this.$t('ns_settlementStrategyFromRule.tip10', { num: 60 })))
                    if (chargeType === 1 && value > 100) return cb(new Error(this.$t('ns_settlementStrategyFromRule.tip11', { num: 100 })))
                    cb()
                  },
                },
              ],
              ...comRules,
            }
          : {
              billingCycle: [
                { required: true, type: 'number', message: chargeType === 2 ? this.$t('ns_settlementStrategyFromRule.tip6') : this.$t('ns_settlementStrategyFromRule.tip7'), trigger: 'change' },
                {
                  required: true,
                  trigger: 'change',
                  validator: (rule, value, cb) => {
                    if (value < 0.001 && chargeType === 1) return cb(new Error(this.$t('ns_settlementStrategyFromRule.tip12', { num: 0.001 })))
                    if (value < 1 && chargeType === 2) return cb(new Error(this.$t('ns_settlementStrategyFromRule.tip13', { num: 1 })))
                    if (value > 10000) return cb(new Error(`${chargeType === 2 ? this.$t('ns_settlementStrategyFromRule.tip14', { num: 10000 }) : this.$t('ns_settlementStrategyFromRule.tip15', { num: 10000 })}`))
                    cb()
                  },
                },
              ],
              ...comRules,
            }
      },
      cbmStrategyLabel() {
        let { cbmStrategy } = this.formData
        return cbmStrategy === 1 ? this.$t('strategyOptions.label1') : cbmStrategy === 2 ? this.$t('strategyOptions.label2') : cbmStrategy === 3 ? this.$t('strategyOptions.label3') : ''
      },
    },
    methods: {
      selectModeTips() {
        let { cspPattern } = this.formData
        let findIndex = cspPattern.findIndex(item => item === '2')
        if (findIndex > -1) {
          this.formData.cspPattern.splice(findIndex, 1)
        } else {
          this.isChangeModel = true
        }
      },
      confirmSelect() {
        this.formData.cspPattern.push('2')
        this.isChangeModel = false
      },
      cancelSelect() {
        this.isChangeModel = false
      },
      validate() {
        let validRes = false
        this.$refs.formValidate.validate(valid => {
          validRes = valid
        })
        return validRes
      },
      changeChargeType(e) {
        this.formData.cbmStrategy = e === 1 ? 2 : 1
        let { feeStandardType } = this.formData
        if (feeStandardType === 1) {
          if (e === 1) {
            this.formData.billingCycle = 0.01
          } else {
            this.formData.billingCycle = 1
          }
        } else {
          if (e === 1) {
            this.formData.billingCycle = 0.001
          } else {
            this.formData.billingCycle = 1
          }
        }
      },
    },
    watch: {
      formData: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true,
      },
      'formData.feeStandardType': {
        handler(val) {
          if (val === 3) {
            this.formData = { ...this.formData, cspPattern: ['1'], chargeType: 2, cbmStrategy: 2, costCalcEdge: 1 }
          }
        },
      },
      value: {
        handler(value, oldVal) {
          if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
            this.formData = cloneDeep(value)
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .settlement {
    padding: 15px 15px 1px 15px;
    .header {
      font-size: 16px;
    }
  }
</style>
