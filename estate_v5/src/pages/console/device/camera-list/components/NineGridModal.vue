<template>
  <Modal footer-hide fullscreen class-name="camera-nine-grid" @on-visible-change="onVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Row :gutter="24" :wrap="false">
      <Col flex="400px" style="overflow: hidden">
        <div class="list">
          <div class="list-title">{{ $t('cameraList') }}</div>
          <div class="list-content">
            <div class="list-item" v-for="item in cameraList" :key="item.mac">
              <div class="serial">{{ item.serial === null ? '-' : (item.serial + 1).toString().padStart(2, '0') }}</div>
              <div class="info">
                <div class="name">
                  <span class="name-text" v-textRoll>{{ item.name }}</span>
                  <Status :value="item.others.online" class="status" />
                </div>
                <div class="mac">ID:{{ item.mac }}</div>
              </div>
              <Checkbox :disabled="autoRoll" v-model="item.checked" @on-change="onCheckChange(item, $event)" />
            </div>
          </div>
        </div>
        <div class="control">
          <div class="control-title">{{ $t('cameraControl') }}</div>
          <PTZControl v-bind="ptzControlParams" @noTarget="$Message.warning($t('pleaseSelectDeviceFirst'))" />
          <div class="volume-control">
            <div style="margin-right: 20px">{{ $t('voice') }}</div>
            <Slider style="width: 200px" :disabled="!activeCamera" v-model="activeCameraVolume" :min="0" :max="1" :step="0.01" />
          </div>
        </div>
      </Col>
      <Col flex="auto">
        <div class="roll">
          <Button type="primary" ghost @click="goToPage(rollConfig.pageIndex - 1)" :disabled="rollConfig.pageIndex <= 0">{{ $t('previousScreen') }}</Button>
          <Button type="primary" ghost @click="goToPage(rollConfig.pageIndex + 1)" :disabled="rollConfig.pageIndex >= rollConfig.pages.length - 1">{{ $t('nextScreen') }}</Button>
          <Button type="primary" ghost @click="toggleAutoRoll" :disabled="rollConfig.pages.length === 1">{{ autoRoll ? $t('stopAutomaticScrolling') : $t('startAutomaticScrolling') }}</Button>
          <span>{{ $t('automaticScrollingTime') }}</span>
          <InputNumber v-model="rollInterval" :min="30" />
        </div>
        <div class="grid-list">
          <div v-for="(item, idx) in gridList" :key="item ? item.mac : idx" class="grid-list-item" :class="item && item === activeCamera ? 'active' : ''">
            <NineGridItem v-if="item" :data="item" @click="setActiveCamera(item)" :showRemove="!autoRoll" @remove="removeFromGrid(item)" />
            <div class="placeholder" v-else></div>
          </div>
        </div>
      </Col>
    </Row>
  </Modal>
</template>

<script>
  import Status from './Status.vue'
  import PTZControl from './ptz-control/index.vue'
  import NineGridItem from './NineGridItem.vue'
  import { chunk } from 'lodash/fp'

  const GRID_COUNT = 9

  export default {
    components: {
      Status,
      PTZControl,
      NineGridItem,
    },
    props: {
      getAllCameras: Function,
      checkedMacList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        cameraList: [],
        gridList: new Array(GRID_COUNT).fill(null),
        rollList: [],
        rollConfig: {
          pages: [],
          pageIndex: 0,
          gridPositions: [],
        },
        rollInterval: 30,
        autoRoll: false,
        activeCamera: null,
      }
    },
    computed: {
      activeCameraCurrentChannel() {
        if (!this.activeCamera) return null
        return this.activeCamera.channels.find(item => item.channel === this.activeCamera.currentChannelNo) || null
      },
      ptzControlParams() {
        if (!this.activeCamera) return null
        return {
          mac: this.activeCamera.mac,
          currentChannelNo: this.activeCamera.currentChannelNo,
          accessToken: this.activeCamera.accessToken,
          type: this.activeCamera.accessType,
          notSupport: !(this.activeCameraCurrentChannel && this.activeCameraCurrentChannel.isSupportPTZCtrl),
        }
      },
      activeCameraVolume: {
        get() {
          return this.activeCamera ? this.activeCamera.volume : 1
        },
        set(v) {
          if (this.activeCamera) {
            this.activeCamera.volume = v
          }
        },
      },
    },
    mounted() {
      this.initData()
    },
    methods: {
      async initData() {
        this.allCameras = await this.getAllCameras()
      },
      onVisibleChange(visible) {
        if (visible) {
          const queen = []
          this.cameraList = this.allCameras.map(item => {
            const checked = this.checkedMacList.includes(item.mac)
            const camera = {
              ...item,
              checked,
              serial: null,
              volume: 1,
            }
            if (checked) {
              queen.push(camera)
            }
            return camera
          })
          queen.forEach(item => this.addToGrid(item))
          this.updateRollConfig()
        } else {
          this.gridList = new Array(GRID_COUNT).fill(null)
          this.setActiveCamera(null)
        }
      },
      onCheckChange(camera, checked) {
        if (checked) {
          this.addToGrid(camera)
        } else {
          this.removeFromGrid(camera)
        }
        this.updateRollConfig()
      },
      toggleAutoRoll() {
        if (!this.rollConfig.gridPositions.length) {
          return this.$Message.warning(this.$t('SelectCameraFirst'))
        }
        this.autoRoll = !this.autoRoll
        if (this.autoRoll) {
          this.rollTimer = setInterval(() => {
            this.goToPage((this.rollConfig.pageIndex + 1) % this.rollConfig.pages.length)
          }, this.rollInterval * 1000)
        } else {
          clearInterval(this.rollTimer)
        }
      },
      setActiveCamera(camera) {
        this.activeCamera = camera
      },
      goToPage(index) {
        if (index < 0 || index > this.rollConfig.pages.length - 1) return
        this.rollConfig.pageIndex = index
        const curPage = this.rollConfig.pages[index]
        this.rollConfig.gridPositions.forEach((pos, idx) => {
          const camera = curPage[idx] || null
          const [oldCamera] = this.gridList.splice(pos, 1, camera)
          console.log('🚀 ~ file: NineGridModal.vue:117 ~ this.rollConfig.gridPositions.forEach ~ oldCamera:', oldCamera)
          if (oldCamera) {
            oldCamera.checked = false
            oldCamera.serial = null
          }
          if (camera) {
            camera.checked = true
            camera.serial = pos
          }
        })
      },
      addToGrid(camera) {
        if (this.rollConfig.gridPositions.length >= GRID_COUNT) {
          this.$nextTick(() => {
            camera.checked = false
          })
          return this.$Message.warning(this.$t('mostOnlyCamerasSelectedNum', { num: GRID_COUNT }))
        }
        const index = this.gridList.indexOf(null)
        camera.checked = true
        camera.serial = index
        this.gridList.splice(index, 1, camera)
      },
      removeFromGrid(camera) {
        const index = this.gridList.indexOf(camera)
        if (index === -1) return
        camera.checked = false
        camera.serial = null
        this.gridList.splice(index, 1, null)
        if (this.activeCamera === camera) {
          this.setActiveCamera(null)
        }
      },
      updateRollConfig() {
        const gridPositions = this.gridList.filter(item => item !== null).map(item => item.serial)
        if (!gridPositions.length) {
          this.rollConfig = {
            pages: [],
            pageIndex: 0,
            gridPositions: [],
          }
          return
        }
        const rollList = [...this.cameraList].sort((a, b) => {
          const aNo = a.serial
          const bNo = b.serial

          if (aNo === null && bNo === null) {
            return 0
          } else if (aNo === null) {
            return 1
          } else if (bNo === null) {
            return -1
          } else {
            return aNo - bNo
          }
        })
        const pageSize = gridPositions.length

        this.rollConfig = {
          pages: chunk(pageSize, rollList),
          pageIndex: 0,
          gridPositions,
        }
      },
    },
  }
</script>

<style lang="less">
  .camera-nine-grid {
    .ivu-modal-content {
      background: #080f19;
    }
    .list {
      background: #1a202e;
      padding: 10px;
    }
    .list-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .list-content {
      height: ~'calc(100vh - 340px)';
      overflow: auto;
    }
    .list-item {
      display: flex;
      align-items: center;
      .serial {
        font-size: 16px;
        width: 40px;
        text-align: center;
        flex-shrink: 0;
      }
      .info {
        position: relative;
        padding: 10px;
        font-size: 14px;
        color: #aaa;
        flex-grow: 1;
        overflow: hidden;
        margin-right: 10px;
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
      }
    }
    .control {
      margin-top: 10px;
      background: #1a202e;
      padding: 20px 10px;
      .control-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .volume-control {
        margin-top: 20px;
        display: flex;
        align-items: center;
      }
    }
    .roll {
      margin-bottom: 20px;
      & > * {
        margin-right: 8px;
      }
    }
    .grid-list {
      height: ~'calc(100vh - 100px)';
      display: grid;
      grid-gap: 24px;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, minmax(25%, 1fr));
      .grid-list-item {
        border-radius: 10px;
        overflow: hidden;
        &.active {
          outline: 1px solid #007eff;
          box-shadow: 0 0 10px #007eff;
        }
      }
      .placeholder {
        width: 100%;
        height: 100%;
        background: #1a202e url(../../../../../assets/images/peizhilaiyuan.png) center center no-repeat;
      }
    }
  }
</style>
