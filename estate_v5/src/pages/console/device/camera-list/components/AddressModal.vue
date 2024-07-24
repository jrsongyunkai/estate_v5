<template>
  <Modal footer-hide width="1000" :title="$t('macPositionModify')" v-bind="$attrs" v-on="$listeners" @on-visible-change="onOnVisibleChange">
    <DeviceAddress v-if="$attrs.value" :propmapValue="data" @closeFlag="closeFlag" @getAdress="onSave" />
  </Modal>
</template>

<script>
  import DeviceAddress from '../../deviceAdress.vue'

  export default {
    props: {
      data: Object,
      onSave: {
        type: Function,
        default: () => {},
      },
    },
    components: {
      DeviceAddress,
    },
    methods: {
      onOnVisibleChange() {},
      closeFlag() {
        this.$emit('input', false)
      },
    },
  }
</script>

<style lang="less" scoped></style>
