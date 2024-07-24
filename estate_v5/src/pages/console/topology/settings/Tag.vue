<template>
  <div class="tag" :style="{ color: color, background: `${color}25` }">
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      color: String,
    },
  }
</script>

<style lang="less" scoped>
  .tag {
    border-radius: 3px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 2;
  }
</style>
