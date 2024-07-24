<template>
  <div class="status">
    <span v-if="value === 1" class="success-lines">{{ $t('online') }}</span>
    <span v-if="value === 0">
      <span class="dangerss">{{ $t('offline') }}</span>
      <span class="b-warning">{{ $t('abnormal') }}</span>
    </span>
    <span v-if="value === -1">
      <span class="b-infoss">{{ $t('disconnected') }}</span>
      <span class="b-warning">{{ $t('abnormal') }}</span>
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 1,
      },
    },
  }
</script>

<style lang="less" scoped>
  .dangerss {
    background: rgba(255, 79, 79, 0.15) !important;
    color: #f56c6c !important;
    height: 22px;
    padding: 1px 6px;
  }
  .success-lines {
    color: #21f27f !important;
    background: rgba(0, 186, 138, 0.15);
    height: 22px;
    padding: 1px 6px;
  }
  .b-warning {
    padding: 1px 6px;
  }
</style>
