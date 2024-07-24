<template>
  <div class="webRTC-streamer">
    <video ref="videoELe"></video>
    <div class="poster" v-if="!initialized" @click="init">
      <img :src="poster" alt="" />
    </div>
    <div class="control-btn" v-else>
      <Icon v-if="playing" @click="pause" custom="icon-v5 icon-v5-pause" size="40"></Icon>
      <Icon v-else @click="play" custom="icon-v5 icon-v5-taizhangbeifen3" size="40"></Icon>
    </div>
  </div>
</template>

<script>
  import './adapter.min.js'
  import WebRTCStreamer from './webrtcstreamer'
  import { getCameraPicUrl } from '@/api/console/device'

  export default {
    props: {
      playConfig: {
        type: Object,
        required: true,
      },
      autoplay: Boolean,
      volume: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        initialized: false,
        playing: false,
        poster: require('@/assets/images/zanwu.png'),
      }
    },
    watch: {
      playConfig: {
        handler() {
          this.getPoster()
          if (!this.initialized) return
          this.connectStream()
          if (this.playing) {
            this.playForFirst()
          }
        },
      },
      volume: {
        handler(v) {
          this.$refs.videoELe.volume = v
        },
      },
    },
    mounted() {
      this.getPoster()
      if (this.autoplay) {
        this.init()
      }
    },
    beforeDestroy() {
      this.disconnectStream()
    },
    activated() {
      if (this.autoplay) {
        this.init()
      }
    },
    deactivated() {
      this.disconnectStream()
    },
    methods: {
      init() {
        this.initialized = true
        this.connectStream()
        this.playForFirst()
      },
      playForFirst() {
        this.$refs.videoELe.addEventListener(
          'canplay',
          () => {
            this.play()
          },
          { once: true }
        )
      },
      async play() {
        if (!this.$refs.videoELe) return
        await this.$refs.videoELe.play()
        this.playing = true
      },
      async pause() {
        if (!this.$refs.videoELe) return
        await this.$refs.videoELe.pause()
        this.playing = false
      },
      stop() {
        this.playing = false
        this.disconnectStream()
      },
      connectStream() {
        this.disconnectStream()
        this.webRTCServer = new WebRTCStreamer(this.$refs.videoELe, this.playConfig.streamServer)
        this.webRTCServer.connect(this.playConfig.streamUrl, null, 'rtptransport=tcp&timeout=60&width=0&height=0&bitrate=0&rotation=0')
      },
      disconnectStream() {
        if (!this.webRTCServer) return
        this.webRTCServer.disconnect()
        this.webRTCServer = null
      },
      async getPoster() {
        const { mac, channel } = this.playConfig
        try {
          const { data } = await getCameraPicUrl({
            mac,
            channel,
          })
          this.poster = data || require('@/assets/images/zanwu.png')
        } catch (e) {
          this.poster = require('@/assets/images/zanwu.png')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .webRTC-streamer {
    position: relative;
    width: 100%;
    height: 100%;
    video {
      display: block;
      width: 100%;
      height: 100%;
    }
    .poster {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .control-btn {
      display: none;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &:hover {
      .control-btn {
        display: block;
      }
    }
  }
</style>
