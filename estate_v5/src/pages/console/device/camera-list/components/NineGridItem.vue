<template>
  <div class="nine-grid-item" @click="$emit('click')">
    <div class="player" ref="player">
      <NoAccess v-if="data.accessType === 'noAccess'" />
      <WebRTCStreamer v-if="data.accessType === 'local'" :playConfig="currentChannel" :volume="data.volume" autoplay />
      <YSPlayer v-if="data.accessType === 'ys'" autoplay :playConfig="currentChannel" :validateCode="data.validateCode" />
      <Select v-if="data.channels.length" v-model="data.currentChannelNo" class="channels">
        <Option v-for="item in data.channels" :key="item.channel" :value="item.channel">{{ item.name || $t('passageway', { channel: item.channel }) }}</Option>
      </Select>
      <div class="operations">
        <Icon custom="icon-v5 icon-v5-huazhonghua" @click="openPIP({ data: { ...data } })" />
        <ToggleFullscreen :getElement="() => $refs.player" />
        <Icon size="18" custom="icon-v5 icon-v5-shanchu2" @click="$emit('remove')" v-if="showRemove" />
      </div>
    </div>
  </div>
</template>

<script>
  import Status from './Status.vue'
  import NoAccess from './NoAccess.vue'
  import { openPIP } from './picture-in-picture'

  export default {
    components: {
      Status,
      NoAccess,
    },
    props: {
      data: Object,
      showRemove: Boolean,
    },
    data() {
      return {}
    },
    computed: {
      currentChannel() {
        return this.data.channels.find(item => item.channel === this.data.currentChannelNo)
      },
    },
    methods: {
      openPIP,
    },
  }
</script>

<style lang="less" scoped>
  .nine-grid-item {
    width: 100%;
    height: 100%;
    background: #1a202e;
    .player {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
      .channels {
        position: absolute;
        left: 20px;
        top: 20px;
        width: 100px;
      }
      .operations {
        position: absolute;
        top: 20px;
        right: 20px;
        .ivu-icon {
          margin-left: 8px;
          font-size: 24px;
        }
      }
    }
  }
</style>
