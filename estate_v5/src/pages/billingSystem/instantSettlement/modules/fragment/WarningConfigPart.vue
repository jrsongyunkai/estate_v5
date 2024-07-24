<template>
  <div class="warning-config">
    <div class="header">{{ $t('balanceWarningConfiguration') }}</div>
    <div class="stats">
      <div>
        <span>{{ chargeType === 1 ? $t('ns_balanceWarningConfiguration.label1') : $t('ns_balanceWarningConfiguration.label2') }}：</span>
        <Switch class="ml-10" v-model="isBalance" :disabled="disabled" />
      </div>
    </div>
    <div class="config-list" v-if="isBalance">
      <div class="item" v-for="(item, index) in configData" :key="index">
        <div class="form-item" v-if="chargeType === 1">
          <span class="lel">{{ $t('ns_balanceWarningConfiguration.label3') }}</span>
          <InputNumber v-if="!disabled" v-model="item.triggerThreshold" :key="chargeType" v-width="120" :disabled="disabled" :placeholder="$t('pleaseEnter')" class="none-handler-wrap" v-inputNumberRule="'TwoDecimal'" />
          <span v-else>{{ item.triggerThreshold }}</span>
        </div>
        <div class="form-item" v-if="chargeType === 2">
          <span class="lel">{{ $t('ns_balanceWarningConfiguration.label4') }}</span>
          <InputNumber v-if="!disabled" :key="chargeType" :min="1" v-model="item.triggerThreshold" v-width="120" :disabled="disabled" :placeholder="$t('pleaseEnter')" class="none-handler-wrap" v-inputNumberRule="'Integer'" />
          <span v-else>{{ item.triggerThreshold }}</span>
          <span class="ml-10">{{ $t('minute') }}</span>
        </div>
        <div class="form-item">
          <span class="lel">{{ $t('ns_balanceWarningConfiguration.label5') }}</span>
          <CheckboxGroup v-model="item.notificationFormat" :disabled="disabled">
            <Checkbox label="1" disabled>{{ $t('applet') }}</Checkbox>
            <Checkbox class="ml-10" :disabled="disabled" label="2">{{ $t('sms') }}</Checkbox>
            <Checkbox class="ml-10" :disabled="disabled" label="3">{{ $t('phone') }}</Checkbox>
          </CheckboxGroup>
        </div>
        <div class="delete-item" v-if="!disabled">
          <Button type="text" @click.stop="delItem(index)" class="text-btn-error" icon="md-remove-circle"></Button>
        </div>
      </div>
      <div class="item add" @click.stop="addItem" v-if="!disabled">{{ chargeType === 1 ? $t('ns_balanceWarningConfiguration.button1') : $t('ns_balanceWarningConfiguration.button2') }}</div>
    </div>
    <div class="error-tip" v-if="!validateFlag">{{ $t('ns_balanceWarningConfiguration.tip1') }}</div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      value: { type: Array, default: () => [] },
      chargeType: { type: Number, default: 1 },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        isBalance: true,
        configData: [],
        validateFlag: true,
      }
    },
    computed: {
      warnConf() {
        return this.isBalance ? this.configData.map(it => ({ ...it, notificationFormat: it.notificationFormat.toString() })) : []
      },
    },
    methods: {
      addItem() {
        this.configData.push({ enable: 1, warnType: this.chargeType, notificationFormat: ['1'], triggerThreshold: null })
      },
      delItem(index) {
        this.configData.splice(index, 1)
      },
      validate() {
        this.validateFlag = (this.warnConf.length > 0 && this.warnConf.every(item => item.triggerThreshold && item.notificationFormat)) || this.warnConf.length === 0
        return this.validateFlag
      },
    },
    mounted() {
      this.configData = cloneDeep(this.value.map(it => ({ ...it, notificationFormat: it.notificationFormat.split(',') })))
    },
    watch: {
      warnConf: {
        handler(value, oldVal) {
          if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
            this.$emit('input', value)
          }
        },
        deep: true,
      },
      value: {
        handler(value) {
          this.configData = value.map(it => ({ ...it, notificationFormat: it.notificationFormat.split(',') }))
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .warning-config {
    padding: 15px;
    .header {
      margin-bottom: 10px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .stats {
      margin-bottom: 15px;
    }
    .config-list {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .item {
        width: calc(~'33.3333% - 7px');
        height: 100px;
        border: 1px solid #333;
        border-radius: 5px;
        margin-bottom: 10px;
        margin-right: 10px;
        padding: 10px 10px;
        padding-right: 30px;
        position: relative;
        .form-item {
          display: flex;
          height: 40px;
          align-items: center;
          .lel {
            white-space: nowrap;
          }
        }
        .delete-item {
          position: absolute;
          right: 0px;
          width: 30px;
          display: flex;
          align-items: center;
          top: 0px;
          height: 100%;
        }
        &:nth-child(3n) {
          margin-right: 0px;
        }
      }
      .item.add {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dotted #007eff;
        color: #007eff;
        cursor: pointer;
      }
    }
    .error-tip {
      color: #ed4014;
      font-size: 14px;
      line-height: 30px;
    }
  }
</style>
