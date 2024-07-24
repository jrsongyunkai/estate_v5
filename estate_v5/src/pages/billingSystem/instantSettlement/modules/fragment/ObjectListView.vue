<template>
  <div class="obj-list-view bgColor">
    <div class="header">
      <div class="left">{{ $t('billingObject') }}</div>
    </div>
    <div>
      <Tag v-for="item in record" size="medium" :key="item.id" :closable="false" :disable-transitions="false">
        <span>{{ `${item.macName}（${item.mac}）/ ${item.addrName}（${item.mac}-${item.addr.toString().padStart(2, '0')}）` }}</span>
      </Tag>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      record: { type: Array, default: () => [] },
    },
  }
</script>

<style lang="less" scoped>
  .obj-list-view {
    padding: 15px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .left {
        font-size: 16px;
      }
    }
  }
</style>
