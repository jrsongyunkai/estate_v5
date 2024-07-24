<template>
  <div class="trend-span">
    <span v-if="!isHideType">{{ `${type === 'qoq' ? $t('monthOnMonthRatio1') : $t('YoY')}` }}:</span>
    <Trend v-if="Number(value) !== 0" :flag="Number(value) < 0 ? 'down' : 'up'" text-color>{{ `${Math.abs(Number(value)).toFixed(2)}%` }}</Trend>
    <span v-else>0.00%</span>
  </div>
</template>

<script>
  export default {
    props: {
      isHideType: Boolean,
      type: String,
      value: Number | String,
    },
  }
</script>

<style lang="less" scoped>
  .trend-span {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    /deep/ .ivu-trend-text {
      vertical-align: unset;
    }
    /deep/ .ivu-icon-md-arrow-dropup:before {
      content: '\F348';
    }
    /deep/ .ivu-icon-md-arrow-dropdown:before {
      content: '\F346';
    }
  }
</style>
