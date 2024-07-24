<template>
  <div class="PTZ-control" :style="cssVar">
    <div class="direction-y up" @mousedown="startPTZControl('up')">
      <Icon style="color: #1890ff" size="28" type="md-arrow-dropup" />
    </div>
    <div class="direction-y down" @mousedown="startPTZControl('down')">
      <Icon style="color: #1890ff" size="28" type="md-arrow-dropdown" />
    </div>
    <div class="direction-x left" @mousedown="startPTZControl('left')">
      <Icon style="color: #1890ff" size="28" type="md-arrow-dropleft" />
    </div>
    <div class="direction-x right" @mousedown="startPTZControl('right')">
      <Icon style="color: #1890ff" size="28" type="md-arrow-dropright" />
    </div>
  </div>
</template>

<script>
  import { localPTZControl } from './local'
  import { ysPTZControl } from './ys'

  export default {
    props: {
      type: String,
      mac: String,
      currentChannelNo: [Number, String],
      accessToken: String,
      size: {
        type: Number,
        default: 90,
      },
      notSupport: Boolean,
    },
    data() {
      return {
        PTZMoving: false,
      }
    },
    computed: {
      cssVar() {
        return {
          '--box-size': `${this.size}px`,
        }
      },
    },
    mounted() {
      document.addEventListener('mouseup', this.stopPTZControl)
    },
    beforeDestroy() {
      document.removeEventListener('mouseup', this.stopPTZControl)
    },
    methods: {
      executePTZControlCmd(cmd) {
        if (this.type === 'local') {
          return localPTZControl({
            cmd,
            mac: this.mac,
            channelNo: this.currentChannelNo,
          })
        } else if (this.type === 'ys') {
          return ysPTZControl({
            cmd,
            mac: this.mac,
            channelNo: this.currentChannelNo,
            accessToken: this.accessToken,
          })
        }
      },
      /**
       * 云台控制
       * @param {string} cmd up down left right zoomIn zoomOut stop
       */
      startPTZControl(cmd) {
        if (!this.mac) return this.$emit('noTarget')
        if (this.notSupport) return this.$Message.warning(this.$t('deviceNotsupportPanTiltControl'))
        this.PTZMoving = true
        this.executePTZControlCmd(cmd)
      },
      stopPTZControl() {
        if (!this.PTZMoving) return
        this.PTZMoving = false
        this.executePTZControlCmd('stop')
      },
    },
  }
</script>

<style lang="less" scoped>
  .PTZ-control {
    position: relative;
    width: var(--box-size);
    height: var(--box-size);
    background: #e3e3e3;
    border-radius: 50%;
    text-align: center;
    overflow: hidden;
    .direction-x {
      position: absolute;
      top: 0;
      width: ~'calc(var(--box-size) / 3)';
      height: 100%;
      &.left {
        left: 0;
        line-height: var(--box-size);
        &:active {
          background: linear-gradient(to left, transparent, #2878ff);
        }
      }
      &.right {
        right: 0;
        line-height: var(--box-size);
        &:active {
          background: linear-gradient(to right, transparent, #2878ff);
        }
      }
    }
    .direction-y {
      position: absolute;
      left: 0;
      width: 100%;
      height: ~'calc(var(--box-size) / 3)';
      &.up {
        top: 0;
        line-height: ~'calc(var(--box-size) / 3)';
        &:active {
          background: linear-gradient(to top, transparent, #2878ff);
        }
      }
      &.down {
        bottom: 0;
        line-height: ~'calc(var(--box-size) / 3)';
        &:active {
          background: linear-gradient(to bottom, transparent, #2878ff);
        }
      }
    }
  }
</style>
