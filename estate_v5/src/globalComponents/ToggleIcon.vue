<template>
  <Icon :custom="`icon-v5 ${currentIcon}`" @click="toggle" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      defaultIcon: {
        type: String,
        required: true,
      },
      reverseIcon: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        innerValue: this.value,
      }
    },
    watch: {
      value(v) {
        this.innerValue = v
      },
    },
    computed: {
      currentIcon() {
        return this.innerValue ? this.reverseIcon : this.defaultIcon
      },
    },
    methods: {
      toggle() {
        this.innerValue = !this.innerValue
        this.$emit('input', this.innerValue)
        this.$emit('change', this.innerValue)
      },
    },
  }
</script>

<style lang="less" scoped></style>
