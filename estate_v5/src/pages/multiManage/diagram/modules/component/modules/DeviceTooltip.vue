<template>
  <div class="tooltip-device">
    <div class="content-text">
      {{ `${deviceInfo.deviceName}(${deviceInfo.mac})${deviceInfo.addrName ? `/${deviceInfo.addrName}(${deviceInfo.mac}-${deviceInfo.addr.toString().padStart(2, '0')})` : ''}` }}
      <Button type="text" v-if="!hideLookDevice" class="view-device" @click.stop="lookDeviceDetail(deviceInfo.mac)">查看详情</Button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      deviceInfo: { type: Object, default: () => {} },
      hideLookDevice: { type: Boolean, default: false },
    },
    inject: ['lookDeviceDetail'],
  }
</script>

<style lang="less" scoped>
  .tooltip-device {
    position: absolute;
    padding: 5px 0;
    z-index: 3018;
    background: rgba(70, 76, 91, 0.9);
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    display: none;
    .content-text {
      font-size: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      padding-left: 10px;
      .view-device {
        color: #2d8cf0;
        font-size: 12px;
      }
    }
  }
</style>
