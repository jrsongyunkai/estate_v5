<template>
  <div>
    <Tooltip placement="top" max-width="470" transfer>
      <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
      <div slot="content" style="white-space: normal">
        {{ tooltipText }}
        <div><slot></slot></div>
      </div>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      tooltipText: { type: String, default: '' },
    },
  }
</script>
<style></style>
