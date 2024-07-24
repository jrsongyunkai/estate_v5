<template>
  <div class="top-title">
    <div>
      <Icon type="md-arrow-back" size="20" @click.stop="$emit('close')" />
      <span class="title-text">{{ title }}</span>
    </div>
    <div class="op-btn">
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: { type: String, default: '' },
    },
  }
</script>

<style lang="less" scoped>
  .top-title {
    width: 100%;
    height: 45px;
    display: flex;
    background: #1a202e;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    z-index: 10;
    box-shadow: 0px 1px 2px #090f19;
    .title-text {
      color: #fff;
      font-size: 16px;
      margin-left: 10px;
      font-weight: 600;
    }
  }
</style>
