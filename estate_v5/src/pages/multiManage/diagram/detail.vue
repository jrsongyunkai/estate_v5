<template>
  <div class="content-diagram">
    <DetailViewModel v-if="!showEdit && sketchInfo" v-show="!showDetail" ref="detailViewModel" :key="modelKey" isNoBack :sketchInfo="sketchInfo"></DetailViewModel>
    <FormViewModel v-if="showEdit" @close="closeAddView"></FormViewModel>
    <ShareModal ref="shareModal" :sketchInfo="sketchInfo"></ShareModal>
    <detailView v-if="showDetail" :showSwitch="false" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>

<script>
  import FormViewModel from './modules/FormViewModel.vue'
  import ShareModal from './modules/ShareModal.vue'
  import DetailViewModel from './modules/DetailViewModel.vue'
  import { mapMutations } from 'vuex'
  import { diagramIndexedDB } from '@/plugins/indexDB/index'
  import { getSketchBaseInfo } from '@/api/multiManage/diagram'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'multiManage-diagramDetail',
    components: { FormViewModel, ShareModal, DetailViewModel, detailView },
    mixins: [deviceDetails],
    provide() {
      return {
        lookDeviceDetail: this.lookDeviceDetail,
      }
    },
    data() {
      return {
        diagramData: [],
        sketchInfo: null,
        showEdit: false,
        modelKey: Math.random(),
        id: this.$route.params.id,
      }
    },
    methods: {
      ...mapMutations('diagram', ['setEditDiagram']),
      editDiagram(item) {
        diagramIndexedDB.setItem('EditDiagram', { ...item })
        this.setEditDiagram({ ...item })
        this.showEdit = true
      },
      shareItem(item) {
        this.sketchInfo = item
        this.$refs.shareModal.openModal()
      },
      closeAddView() {
        this.modelKey = Math.random()
        this.showEdit = false
      },
      async getBaseInfo(id) {
        this.sketchInfo = null
        let res = await getSketchBaseInfo({ id, projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.sketchInfo = {
            ...res.data,
            code: this.$route.params.id,
            filePath: res.data.filePath && res.data.filePath.indexOf('/upload/') > -1 ? `${window.location.origin}/upload/${res.data.filePath.split('/upload/')[1]}` : res.data.filePath,
          }
          this.modelKey = Math.random()
        } else {
          this.$Message.error(res.message)
        }
      },
      lookDeviceDetail(mac) {
        console.log('🚀 ~ lookDeviceDetail ~ mac:', mac)
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
      this.getBaseInfo(this.id)
    },
    watch: {
      '$route.params.id': {
        handler(value) {
          this.getBaseInfo(value)
        },
        deep: true,
      },
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
  }
</style>
