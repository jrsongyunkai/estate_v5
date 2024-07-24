<template>
  <div class="input-number-range-box">
    <div class="input-box">
      <InputNumber v-model="minNumber" class="none-handler-wrap" @on-blur="onBlur" :disabled="disabled" :placeholder="minPlaceholder" />
      <i style="position: absolute; right: 10px">{{ unit }}</i>
    </div>
    <span style="margin: 0 10px">{{ $t('to') }}</span>
    <div class="input-box">
      <InputNumber v-model="maxNumber" :class="isRed ? 'none-handler-wrap redBorder' : 'none-handler-wrap'" @on-blur="onBlur" :disabled="disabled" :placeholder="maxPlaceholder" />
      <i style="position: absolute; right: 10px">{{ unit }}</i>
      <div v-if="isRed" style="color: red; position: absolute; top: 28px">{{ $t('topMoreThanBottom') }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InputNumberRange',
    props: {
      unit: String,
      minValue: [String, Number],
      maxValue: [String, Number],
      minPlaceholder: String,
      maxPlaceholder: String,
      disabled: Boolean,
    },
    data() {
      return {
        isRed: false,
      }
    },
    computed: {
      minNumber: {
        get() {
          return this.minValue === '' ? null : Number(this.minValue)
        },
        set(v) {
          this.$emit('update:minValue', v)
        },
      },
      maxNumber: {
        get() {
          return this.maxValue === '' ? null : Number(this.maxValue)
        },
        set(v) {
          this.$emit('update:maxValue', v)
        },
      },
    },
    methods: {
      onBlur() {
        if (this.minNumber != null && this.maxNumber != null && this.minNumber > this.maxNumber) {
          // const min = this.maxNumber;
          // this.maxNumber = this.minNumber;
          // this.minNumber = min;
          this.isRed = true
          this.$emit('isRed', true)
        } else {
          this.isRed = false
          this.$emit('isRed', false)
        }
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  .redBorder {
    border: 1px solid red !important;
  }
  .input-number-range-box {
    width: 100%;
    display: flex;
    align-items: center;
    .input-box {
      flex: 1;
      position: relative;
      .ivu-input-number {
        width: 100%;
      }
    }
  }
</style>
