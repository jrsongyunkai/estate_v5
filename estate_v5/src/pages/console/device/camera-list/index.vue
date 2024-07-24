<template>
  <div class="camera-page">
    <SearchBar @search="onSearch" @playByGrid="nineGridModalVisible = true" />
    <Row class="camera-list" :gutter="16">
      <Col :span="colSpan" v-for="item in visibleCameraList" :key="item.mac" style="margin-bottom: 16px">
        <CameraItem :data="item" />
      </Col>
    </Row>
    <Page v-if="viewMode === 'list'" @on-change="onPageChange" :current="pageParams.pageNo" :page-size="pageParams.pageSize" :total="pageParams.total"></Page>
    <DetailModal v-model="detailModalVisible" :mac="detailModalMac" />
    <AddressModal v-model="addressModalVisible" :data="addressModalData" :onSave="addressModalSave" />
    <NineGridModal v-model="nineGridModalVisible" :checkedMacList="checkedMacList" :getAllCameras="getAllCameras" />
  </div>
</template>

<script>
  import SearchBar from './components/SearchBar.vue'
  import CameraItem from './components/CameraItem.vue'
  import DetailModal from './components/DetailModal.vue'
  import AddressModal from './components/AddressModal.vue'
  import NineGridModal from './components/NineGridModal.vue'
  import { queryBoxes, queryChannelsCamera } from '@/api/public'
  import { compose, map, filter, get } from 'lodash/fp'

  export default {
    components: {
      SearchBar,
      CameraItem,
      DetailModal,
      AddressModal,
      NineGridModal,
    },
    provide() {
      return {
        dispatchAction: this.dispatchAction,
      }
    },
    data() {
      return {
        viewMode: 'list', // list or fullPage
        searchParams: {},
        pageParams: {
          pageNo: 1,
          pageSize: 6,
          total: 0,
        },
        cameraList: [],
        detailModalVisible: false,
        detailModalMac: null,
        addressModalVisible: false,
        addressModalData: null,
        addressModalSave: null,
        nineGridModalVisible: false,
      }
    },
    computed: {
      visibleCameraList() {
        if (this.viewMode === 'list') return this.cameraList
        return this.cameraList.filter(item => item.fullPage)
      },
      colSpan() {
        return this.viewMode === 'list' ? 8 : 24
      },
      checkedMacList() {
        const getCheckedMacList = compose(
          map(get('mac')),
          filter(item => item.checked)
        )
        return getCheckedMacList(this.cameraList)
      },
    },
    mounted() {},
    methods: {
      dispatchAction({ type, payload }) {
        this[type](payload)
      },
      viewDetail(payload) {
        this.detailModalMac = payload.mac
        this.detailModalVisible = true
      },
      showAddressModal(payload) {
        this.addressModalData = payload.data
        this.addressModalSave = payload.updateAddress
        this.addressModalVisible = true
      },
      toggleFullPage(payload) {
        this.viewMode = payload.fullPage ? 'list' : 'fullPage'
        payload.fullPage = !payload.fullPage
      },
      onSearch(searchParams) {
        this.searchParams = searchParams
        this.getCameraList()
      },
      onPageChange(pageNo) {
        this.pageParams.pageNo = pageNo
        this.getCameraList()
      },
      async getCameraList() {
        this.cameraList = await this._getCameraList(
          {
            ...this.searchParams,
            projectCode: this.$store.state.projectCode, // 'P00000000012',
            equipmentTypes: 20,
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
          },
          {
            checked: false,
            volume: 1,
            fullPage: false,
          },
          true
        )
        this.viewMode = 'list'
      },
      async getAllCameras() {
        return this._getCameraList({
          projectCode: this.$store.state.projectCode, // 'P00000000012',
          equipmentTypes: 20,
          pageNo: 1,
          pageSize: 9999,
        })
      },
      async _getCameraList(params, extract, setTotal) {
        const deviceList = await this.getDeviceList(params, setTotal)
        const channelsList = await this.getChannelsList(deviceList)
        return deviceList.map(item => {
          const channelConfig = channelsList.find(cfg => cfg.mac === item.mac)
          const channels = channelConfig ? channelConfig.localChannels || channelConfig.channels : []
          const accessType = channelConfig && channels.length ? (channelConfig.localChannels ? 'local' : 'ys') : 'noAccess'
          const currentChannelNo = channels.length ? channels[0].channel : null
          return {
            ...item,
            address: item.build ? item.build + item.unit + item.room : '',
            accessType,
            validateCode: channelConfig && channelConfig.validateCode,
            accessToken: channelConfig && channelConfig.accessToken,
            channels,
            currentChannelNo,
            ...extract,
          }
        })
      },
      async getDeviceList(params, setTotal) {
        const {
          success,
          message,
          datas,
          total = 0,
        } = await queryBoxes({
          equipmentTypes: 20,
          ...params,
        })
        if (!success) this.$Message.error(message)
        if (setTotal) this.pageParams.total = total
        return datas || []
      },
      async getChannelsList(deviceList) {
        if (!deviceList.length) return []
        const macs = deviceList.map(item => item.mac).join(',')
        const { success, message, data } = await queryChannelsCamera({
          macs,
        })
        if (!success) this.$Message.error(message)
        return data || []
      },
    },
  }
</script>

<style lang="less" scoped>
  .camera-list {
    margin: 10px 0;
  }
</style>
