<template>
  <div class="ys-player" v-resize="onResize" ref="box">
    <div class="player-container" :id="id"></div>
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
  import { getPlayUrlCamera } from '@/api/public'
  import EZUIKit from 'ezuikit-js'
  import { getCameraPicUrl } from '@/api/console/device'

  let playerId = 0

  const genPlayerId = () => {
    playerId++
    return playerId
  }

  export default {
    props: {
      validateCode: {
        type: String,
        default: '',
      },
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
        url: null,
        accessToken: null,
        errorMessage: '',
        poster: require('@/assets/images/zanwu.png'),
      }
    },
    watch: {
      playConfig: {
        async handler() {
          this.getPoster()
          await this.getUrlAndToken()
          if (this.playing) {
            await this.pause()
            this.play()
          }
        },
      },
    },
    created() {
      this.id = `ysPlayer-${genPlayerId()}`
    },
    mounted() {
      this.getPoster()
      if (this.autoplay) {
        this.init()
      }
    },
    beforeDestroy() {
      this.destroy()
    },
    activated() {
      if (this.autoplay) {
        this.init()
      }
    },
    deactivated() {
      this.destroy()
    },
    methods: {
      async init() {
        await this.getUrlAndToken()
        this.initPlayer()
      },
      async getUrlAndToken() {
        const { mac, channel } = this.playConfig
        const { success, message, data } = await getPlayUrlCamera({
          mac,
          channel,
          type: 1,
          validateCode: this.validateCode,
        })
        if (!success) {
          this.url = null
          this.accessToken = null
          this.errorMessage = message
          return
        }
        this.url = data.url
        this.accessToken = data.accessToken
        this.errorMessage = ''
      },
      initPlayer() {
        if (this.errorMessage) return this.$Message.error(this.errorMessage)
        this.player = new EZUIKit.EZUIKitPlayer({
          id: this.id,
          accessToken: this.accessToken,
          url: this.url,
        })
        this.initialized = true
        this.playing = true
        window.player = this.player
      },
      async play() {
        if (this.errorMessage) return this.$Message.error(this.errorMessage)
        if (!this.player) return
        await this.player.play(this.url)
        this.playing = true
      },
      async pause() {
        if (!this.player) return
        await this.player.stop()
        this.playing = false
      },
      async destroy() {
        if (!this.player) return
        await this.player.stop()
        await this.player.destroy()
        this.playing = false
        this.player = null
        this.initialized = false
      },
      onResize() {
        if (!this.player || !this.$refs.box) return
        console.log('resize')
        this.$nextTick(() => {
          const { width, height } = this.$refs.box.getBoundingClientRect()
          this.player.reSize(width, height)
        })
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
  .ys-player {
    position: relative;
    width: 100%;
    height: 100%;
    .player-container {
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
