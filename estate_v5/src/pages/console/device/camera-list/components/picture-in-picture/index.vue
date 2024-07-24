<template>
  <VueDragResize v-show="visible" class="pip" isActive preventActiveBehavior parentLimitation :x="x" :y="y" :w="w" :h="h" :parentW="parentW" :parentH="parentH" :z="9999" :sticks="['tl', 'tr', 'bl', 'br']" ref="wrapper">
    <div class="pip-box" ref="box">
      <div class="top-bar">
        <div class="title">{{ data.name }}</div>
        <div class="controls">
          <ToggleIcon :size="18" defaultIcon="icon-v5-shengyin" reverseIcon="icon-v5-shengyinjingyin" @change="toggleVolume" />
          <Icon :size="18" custom="icon-v5 icon-v5-gongzuoququanping" @click="fullPage" />
          <ToggleFullscreen :size="18" :getElement="() => $refs.box" />
          <Icon :size="16" custom="icon-v5 icon-v5-shanchu2" @click="close" />
        </div>
      </div>
      <NoAccess v-if="data.accessType === 'noAccess'" />
      <WebRTCStreamer v-if="data.accessType === 'local'" autoplay :playConfig="currentChannel" :volume="data.volume" />
      <YSPlayer v-if="data.accessType === 'ys'" autoplay :playConfig="currentChannel" :validateCode="data.validateCode" />
      <PTZControl v-if="currentChannel && currentChannel.isSupportPTZCtrl" :mac="data.mac" :currentChannelNo="data.currentChannelNo" :accessToken="data.accessToken" :type="data.accessType" />
    </div>
  </VueDragResize>
</template>

<script>
  import VueDragResize from 'vue-drag-resize'
  import PTZControl from '../ptz-control/index.vue'
  import NoAccess from '../NoAccess.vue'
  import store from '@/store/index'

  export default {
    components: {
      VueDragResize,
      PTZControl,
      NoAccess,
    },
    data() {
      return {
        parentW: document.documentElement.clientWidth,
        parentH: document.documentElement.clientHeight,
        visible: true,
        onClose: null,
        x: 0,
        y: 0,
        w: 480,
        h: 270,
        data: null,
      }
    },
    computed: {
      currentChannel() {
        return this.data.channels.find(item => item.channel === this.data.currentChannelNo)
      },
    },
    mounted() {
      window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
    },
    methods: {
      toggleVolume(muted) {
        this.data.volume = muted ? 0 : 1
      },
      fullPage() {
        const x = store.state.admin.layout.menuCollapse ? 80 : 255
        const y = 130
        // this.w = document.documentElement.clientWidth - this.x
        // this.h = document.documentElement.clientHeight - this.y
        console.log(this.w, this.h)
        this.$refs.wrapper.left = x
        this.$refs.wrapper.top = y
        this.$refs.wrapper.right = 0
        this.$refs.wrapper.bottom = 0
      },
      onResize() {
        this.parentW = document.documentElement.clientWidth
        this.parentH = document.documentElement.clientHeight
      },
      close() {
        this.visible = false
        this.onClose && this.onClose()
        this.destroy()
      },
      destroy() {
        this.$destroy()
        this.$el.parentNode.removeChild(this.$el)
      },
    },
  }
</script>

<style lang="less" scoped>
  .pip {
    position: fixed;
    &::before {
      display: none;
    }
    /deep/.vdr-stick {
      opacity: 0;
    }
    .pip-box {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 10px;
      overflow: hidden;
      .PTZ-control {
        position: absolute;
        left: 20px;
        bottom: 20px;
      }
    }
    .top-bar {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 0 20px;
      background: rgba(0, 0, 0, 0.2);
      .controls {
        display: flex;
        align-items: center;
        /deep/.ivu-icon {
          margin-left: 10px;
        }
      }
    }
  }
</style>
