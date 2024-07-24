<template>
  <div>
    <div class="dp-head">
      <div class="left ds-flx">
        <div class="mart"></div>
        <div class="title thead-title">{{ text }}</div>
      </div>
      <div class="right">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: window.$t('realTimeParameters'),
      },
    },
  }
</script>

<style lang="less" scoped>
  .dp-head {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #5e626c;
    padding-top: 2px;
    padding-bottom: 8px;
    margin-top: 7px;
    .ds-flx {
      display: flex;
      padding-top: 5px;
    }
    .mart {
      margin: 5px 10px;
      width: 2px;
      height: 14px;
      background: #0372e5;
    }
    .thead-title {
      font-size: 14px;
    }
  }
</style>
