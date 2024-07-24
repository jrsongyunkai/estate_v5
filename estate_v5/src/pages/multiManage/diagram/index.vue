<template>
  <div class="content-diagram">
    <Row v-if="!addView && !showDetailView" :gutter="10">
      <Col span="6" class="diagram-item" v-for="item in diagramData" :key="item.id">
        <div class="diagram-item-content">
          <div class="top-image">
            <div class="op-bg" v-if="item.previewPath">
              <img :src="`${item.previewPath}?v=${getPicVersion(item)}`" alt="" />
            </div>
            <div class="op-btn">
              <div class="btn" v-if="!!item.filePath" @click.stop="lookDetail(item)">
                <Icon type="md-eye" size="20" />
                <div>{{ $t('view') }}</div>
              </div>
              <div class="btn" @click.stop="editDiagram(item)">
                <Icon type="md-create" size="20" />
                <div>{{ $t('edit') }}</div>
              </div>
              <Dropdown v-if="!!item.filePath" @on-click="name => exportClick(item, name)">
                <div class="btn">
                  <Icon type="ios-cloud-download" size="20" />
                  <div>{{ $t('download') }}</div>
                </div>
                <template #list>
                  <DropdownMenu>
                    <DropdownItem name="JSON">JSON</DropdownItem>
                    <DropdownItem name="PNG">PNG</DropdownItem>
                  </DropdownMenu>
                </template>
              </Dropdown>
              <div class="btn" v-if="!!item.filePath" @click.stop="shareItem(item)">
                <Icon type="ios-send" size="20" />
                <div>{{ $t('share') }}</div>
              </div>
              <div class="btn del" @click.stop="deleteItem(item)">
                <Icon type="md-trash" size="20" />
                <div>{{ $t('delete') }}</div>
              </div>
            </div>
          </div>
          <div class="bottom-info">
            <div class="name">{{ item.name }}</div>
            <div class="text-b">
              <div>{{ item.createTime }}</div>
              <div>{{ item.staffRealName }}</div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="6" class="diagram-item">
        <div class="button-add" @click.stop="showAddView">
          <div>
            <div style="text-align: center; margin-bottom: 20px"><Icon custom="icon-v5 icon-v5-tianjia" size="40" /></div>
            <div>{{ $t('clickToAddSystemDiagram') }}</div>
          </div>
        </div>
      </Col>
    </Row>
    <FormViewModel v-if="addView && !showDetailView" @close="closeAddView"></FormViewModel>
    <OperationCheckAuth ref="operationCheckAuth" :action="deleteAction"></OperationCheckAuth>
    <BaseInfoFormModal ref="baseInfoFormModal" @callback="editDiagram"></BaseInfoFormModal>
    <ShareModal ref="shareModal" :sketchInfo="sketchInfo"></ShareModal>
    <DetailViewModel ref="detailViewModel" v-if="!addView && showDetailView" v-show="!showDetail" :sketchInfo="sketchInfo" @close="closeDetail"></DetailViewModel>
    <detailView v-if="showDetail" :showSwitch="false" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>

<script>
  import FormViewModel from './modules/FormViewModel.vue'
  import BaseInfoFormModal from './modules/BaseInfoFormModal.vue'
  import ShareModal from './modules/ShareModal.vue'
  import DetailViewModel from './modules/DetailViewModel.vue'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import { sketchList, delSketch } from '@/api/multiManage/diagram'
  import { mapMutations } from 'vuex'
  import { diagramIndexedDB } from '@/plugins/indexDB/index'
  import deviceDetails from '@/mixins/deviceDetails'
  import dayjs from 'dayjs'
  import store from '@/store/index'
  export default {
    name: 'multiManage-diagram',
    components: { FormViewModel, BaseInfoFormModal, ShareModal, DetailViewModel, detailView },
    data() {
      return {
        diagramData: [],
        addView: false,
        sketchInfo: null,
        showDetailView: false,
      }
    },
    provide() {
      return {
        lookDeviceDetail: this.lookDeviceDetail,
      }
    },
    mixins: [deviceDetails],
    methods: {
      ...mapMutations('diagram', ['setEditDiagram']),
      async loadList() {
        const res = await sketchList({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.diagramData = res.data.map(it => ({
            ...it,
            filePath: it.filePath && it.filePath.indexOf('/upload/') > -1 ? `${window.location.origin}/upload/${it.filePath.split('/upload/')[1]}` : it.filePath,
          }))
        } else {
          this.$Message.error(res.message || this.$t('loadFail'))
        }
      },
      closeAddView() {
        this.addView = false
        this.loadList()
      },
      showAddView() {
        this.$refs.baseInfoFormModal.openModal()
      },
      deleteItem(item) {
        this.$refs.operationCheckAuth.openModal(item)
      },
      deleteAction(item) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteConfirmTip'),
          onOk: async () => {
            let res = await delSketch({ id: item.id, projectCode: this.$store.state.projectCode })
            if (res.success) {
              this.loadList()
              if (item.positionType === 1) {
                store.commit('showMenus', Math.random())
              }
              this.$Message.success(res.message || this.$t('deleteSuccessful'))
            } else {
              this.$Message.error(res.message || this.$t('deleteFailed'))
            }
          },
        })
      },
      lookDetail(item) {
        this.sketchInfo = item
        this.showDetailView = true
      },
      closeDetail() {
        this.showDetailView = false
        this.sketchInfo = null
      },
      editDiagram(item) {
        diagramIndexedDB.setItem('EditDiagram', { ...item }).then(() => {
          this.setEditDiagram({ ...item })
          this.addView = true
          this.showDetailView = false
        })
      },
      exportClick(item, type) {
        let link = document.createElement('a')
        document.body.appendChild(link)
        if (type === 'JSON') {
          link.setAttribute('download', `${item.name}.json`)
          link.href = item.filePath
        } else {
          link.setAttribute('download', `${item.name}.png`)
          link.href = item.previewPath ? `${window.location.origin}/upload/${item.previewPath.split('/upload/')[1]}` : ''
        }
        link.click()
        document.body.removeChild(link)
      },
      shareItem(item) {
        this.sketchInfo = item
        this.$refs.shareModal.openModal()
      },
      getPicVersion(item) {
        return item.updateTime ? dayjs(item.updateTime).valueOf() : dayjs(item.createTime).valueOf()
      },
      lookDeviceDetail(mac) {
        window.leaveDeviceHideTip && window.leaveDeviceHideTip()
        this.handle({ mac })
      },
      closeView() {
        this.deviceInfo = {}
        this.showDetail = false
        this.$nextTick(() => {
          this.$refs.detailViewModel.setViewSize()
        })
      },
    },
    mounted() {
      this.loadList()
      diagramIndexedDB.getItem('EditDiagram').then(res => {
        if (res) {
          this.$Modal.confirm({
            title: this.$t('editTip'),
            content: this.$t('continueEditDiagramTip'),
            onOk: () => {
              this.editDiagram({ ...res })
            },
            onCancel: () => {
              diagramIndexedDB.removeItem('EditDiagram')
            },
          })
        }
      })
    },
  }
</script>

<style lang="less" scoped>
  .content-diagram {
    width: 100%;
    height: calc(~'100vh - 142px');
    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .diagram-item {
      height: 310px;
      margin-bottom: 10px;
      min-width: 400px;
      &-content {
        width: 100%;
        height: 100%;
        background: #1a202e;
        border-radius: 5px;
        cursor: pointer;
        overflow: hidden;
        .top-image {
          height: 230px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('../../../assets/images/diagram-bg@1x.png') no-repeat center center;
          position: relative;
          .op-bg {
            position: absolute;
            z-index: 1;
            left: 0px;
            top: 0px;
            height: 100%;
            width: 100%;
            background: #29313d;
            img {
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }
          .op-btn {
            position: absolute;
            z-index: 2;
            left: 0;
            top: 0px;
            display: none;
            width: 100%;
            height: 100%;
            padding: 10%;
            align-items: center;
            justify-content: space-around;
            .btn {
              color: #fff;
              text-align: center;
              cursor: pointer;
              &:active,
              &:hover {
                color: #2d8cf0;
              }
            }
            .btn.del {
              &:hover,
              &:active {
                color: #d9001b;
              }
            }
          }
          &:hover {
            .op-btn {
              display: flex;
              background: rgba(0, 0, 0, 0.5);
            }
          }
        }
        .bottom-info {
          padding: 10px;
          .name {
            padding-bottom: 20px;
          }
          .text-b {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
    .button-add {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #1a202e;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        color: #2d8cf0;
      }
    }
  }
</style>
