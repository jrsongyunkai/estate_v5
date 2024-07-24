<template>
  <div class="camera-item">
    <div class="player" ref="player" :style="playerHeight">
      <NoAccess v-if="data.accessType === 'noAccess'" />
      <WebRTCStreamer v-if="data.accessType === 'local'" :playConfig="currentChannel" :volume="data.volume" />
      <YSPlayer v-if="data.accessType === 'ys'" :playConfig="currentChannel" :validateCode="data.validateCode" />
      <Checkbox v-model="data.checked" class="check-camera" />
      <Select v-if="data.channels.length" v-model="data.currentChannelNo" class="channels">
        <Option v-for="item in data.channels" :key="item.channel" :value="item.channel">{{ item.name || $t('passageway', { channel: item.channel }) }}</Option>
      </Select>
      <div class="operations">
        <ToggleIcon defaultIcon="icon-v5-shengyin" reverseIcon="icon-v5-shengyinjingyin" @change="toggleVolume" />
        <Icon custom="icon-v5 icon-v5-huazhonghua" @click="openPIP({ data: { ...data } })" />
        <ToggleIcon defaultIcon="icon-v5-gongzuoququanping" reverseIcon="icon-v5-gongzuoqushouqi" @change="dispatchAction({ type: 'toggleFullPage', payload: data })" />
        <ToggleFullscreen :getElement="() => $refs.player" />
      </div>
      <PTZControl v-if="currentChannel && currentChannel.isSupportPTZCtrl" :mac="data.mac" :currentChannelNo="data.currentChannelNo" :accessToken="data.accessToken" :type="data.accessType" />
    </div>
    <div class="info">
      <div class="name">
        <span class="name-text" v-textRoll>{{ data.name }}</span>
        <Status :value="data.others.online" class="status" />
      </div>
      <div class="mac">ID:{{ data.mac }}</div>
      <div class="address">
        <Icon custom="icon-v5 icon-v5-dingwei" />
        <span style="flex: 1" v-textRoll>{{ $t('equipmentLocation') + ':' + (data.address || '-') }}</span>
      </div>
      <Dropdown class="action-menu" transfer trigger="click" @on-click="dispatchAction({ type: $event, payload: data })">
        <Icon custom="icon-v5 icon-v5-menu"></Icon>
        <template #list>
          <DropdownMenu>
            <DropdownItem v-for="item in actions" :key="item.name" :name="item.name">{{ item.text }}</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<script>
  import Status from './Status.vue'
  import NoAccess from './NoAccess.vue'
  import PTZControl from './ptz-control/index.vue'
  import { openPIP } from './picture-in-picture'

  export default {
    components: {
      Status,
      NoAccess,
      PTZControl,
    },
    props: {
      data: Object,
    },
    inject: ['dispatchAction'],
    data() {
      return {
        actions: [
          {
            name: 'viewDetail',
            text: this.$t('deviceInformationDetails'),
          },
        ],
      }
    },
    computed: {
      currentChannel() {
        return this.data.channels.find(item => item.channel === this.data.currentChannelNo)
      },
      playerHeight() {
        const height = this.data.fullPage ? `calc(100vh - 370px)` : '290px'
        return {
          height,
        }
      },
    },
    methods: {
      toggleVolume(muted) {
        this.data.volume = muted ? 0 : 1
      },
      openPIP,
    },
  }
</script>

<style lang="less" scoped>
  .camera-item {
    border-radius: 10px;
    background: #1a202e;
    overflow: hidden;
    .player {
      position: relative;
      height: 290px;
      background: #000;
      .check-camera {
        position: absolute;
        left: 20px;
        top: 20px;
      }
      .channels {
        position: absolute;
        left: 50px;
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
      .PTZ-control {
        position: absolute;
        left: 20px;
        bottom: 20px;
      }
    }
  }
  .info {
    position: relative;
    padding: 10px;
    font-size: 14px;
    color: #aaa;
    .name {
      display: flex;
      .name-text {
        font-size: 16px;
        color: #fff;
        margin-right: 10px;
      }
      .status {
        flex-shrink: 0;
      }
    }
    .address {
      white-space: nowrap;
      display: flex;
      align-items: center;
    }
    .action-menu {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
</style>
