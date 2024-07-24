<template>
  <div class="package-config">
    <div class="header">
      <div class="left">{{ $t('packageConfiguration') }}</div>
    </div>
    <div class="price-content">
      <div class="price-box def-price" :class="{ error: !validateFlag }">
        <div class="title">{{ $t('defaultPackage') }}</div>
        <div class="price-input mb-10">
          <div class="input-item">
            <span class="lel">{{ $t('singlePackageUsageTimeMinutes') }}:</span>
            <Input v-if="!disabled" v-model="defaultUnitPrice.useTime" v-width="200" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'Integer'" />
            <span class="value" v-else>{{ defaultUnitPrice.useTime }}</span>
          </div>
        </div>
        <div class="price-input">
          <div class="input-item">
            <span class="lel">{{ $t('temporaryUserUnitPrice') }}({{ unit }}):</span>
            <Input v-if="!disabled" v-model="defaultUnitPrice.tempUserPrice" v-width="200" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'TwoDecimal'" />
            <span class="value" v-else>{{ defaultUnitPrice.tempUserPrice }}</span>
          </div>
          <div class="input-item ml-10">
            <span class="lel">{{ $t('registeredUserUnitPrice') }}({{ unit }}):</span>
            <Input v-if="!disabled" v-model="defaultUnitPrice.regUserPrice" v-width="200" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'TwoDecimal'" />
            <span class="value" v-else>{{ defaultUnitPrice.regUserPrice }}</span>
          </div>
        </div>
      </div>
      <div class="error-tip" v-if="!validateFlag">{{ $t('pleaseSetTheDefaultPackageConfiguration') }}</div>
      <div class="price-box" v-for="(item, index) in customUnitPrices" :key="index">
        <div class="price-input mb-10">
          <div class="input-item">
            <span class="lel">{{ $t('singlePackageUsageTimeMinutes') }}:</span>
            <Input v-if="!disabled" v-model="item.useTime" :disabled="disabled" v-width="200" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'Integer'" />
            <span class="value" v-else>{{ item.useTime }}</span>
          </div>
        </div>
        <div class="price-input">
          <div class="input-item">
            <span class="lel">{{ $t('unitPriceForTemporaryUsers') }}({{ unit }}):</span>
            <Input v-if="!disabled" v-model="item.tempUserPrice" :disabled="disabled" v-width="200" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'TwoDecimal'" />
            <span class="value" v-else>{{ item.tempUserPrice }}</span>
          </div>
          <div class="input-item ml-10">
            <span class="lel">{{ $t('unitPriceForRegisteredUsers') }}({{ unit }}):</span>
            <Input v-if="!disabled" v-model="item.regUserPrice" :disabled="disabled" v-width="200" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'TwoDecimal'" />
            <span class="value" v-else>{{ item.regUserPrice }}</span>
          </div>
        </div>
        <div class="delete-price" v-if="!disabled">
          <Button type="text" @click.stop="delItem(index)" class="text-btn-error" icon="md-remove-circle"></Button>
        </div>
      </div>
      <div class="error-tip" v-if="!customValidateFlag">{{ $t('improveUnitPriceConfigurationTip') }}</div>
      <div class="add-price" v-if="!disabled">
        <Button type="primary" ghost long @click.stop="addConfigItem">{{ $t('addPackage') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: { type: Object, default: () => {} },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        unit: this.$t('yuanTime'),
        customUnitPrices: [], // 自定义单价
        defaultUnitPrice: { index: 0, useTime: '', tempUserPrice: '', regUserPrice: '' }, // 默认单价
        validateFlag: true,
        customValidateFlag: true,
      }
    },
    computed: {
      priceConf() {
        return {
          customUnitPrices: JSON.stringify(this.customUnitPrices.map((item, index) => ({ ...item, index: index + 1 }))),
          defaultUnitPrice: JSON.stringify(this.defaultUnitPrice),
        }
      },
    },
    methods: {
      addConfigItem() {
        if (this.customUnitPrices.length >= 10) return this.$Message.error({ content: this.$t('upToTenCustomPackagesCanBeAdded') })
        this.customUnitPrices.push({ useTime: '', tempUserPrice: '', regUserPrice: '' })
      },
      delItem(index) {
        this.customUnitPrices.splice(index, 1)
      },
      validate() {
        this.validateFlag = true
        this.validateFlag = true
        if (+this.defaultUnitPrice.regUserPrice < 0 || +this.defaultUnitPrice.tempUserPrice < 0 || !this.defaultUnitPrice.tempUserPrice || !this.defaultUnitPrice.regUserPrice) {
          this.validateFlag = false
          return false
        }
        if (this.customUnitPrices.length && this.customUnitPrices.some(item => +item.regUserPrice < 0 || +item.tempUserPrice < 0 || !item.regUserPrice || !item.tempUserPrice)) {
          this.customValidateFlag = false
          return false
        }
        return true
      },
    },
    mounted() {},
    watch: {
      priceConf: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true,
      },
      value: {
        handler(val, oldVal) {
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            this.defaultUnitPrice = JSON.parse(val.defaultUnitPrice)
            this.customUnitPrices = JSON.parse(val.customUnitPrices)
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .package-config {
    padding: 15px;
    .header {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .price-content {
      .price-box {
        padding: 10px;
        border: 1px solid #333;
        border-radius: 5px;
        margin-bottom: 10px;
        position: relative;
        padding-right: 40px;
        .title {
          font-size: 18px;
          color: #007eff;
          margin-bottom: 10px;
        }
        .price-input {
          display: flex;
          font-size: 14px;
          .input-item {
            display: flex;
            align-items: center;
            span.lel {
              white-space: nowrap;
              padding-right: 8px;
              color: #bebebe;
              display: block;
              width: 200px;
              text-align: right;
              flex-shrink: 0;
            }
            span.value {
              white-space: nowrap;
              padding-right: 40px;
              font-weight: bold;
            }
          }
        }
        .mb-10 {
          margin-bottom: 10px;
        }
        .delete-price {
          position: absolute;
          right: 0px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0px;
          width: 40px;
          /deep/.ivu-btn.ivu-btn-text {
            font-size: 20px;
          }
        }
      }
      .price-box.error {
        border-color: #ed4014;
      }
      .error-tip {
        color: #ed4014;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
</style>
