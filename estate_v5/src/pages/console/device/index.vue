<template>
  <div id="tabsOverView">
    <Col :span="24" v-show="!showDetail">
      <Tabs :animated="false" v-model="activeName" @on-click="handleClick">
        <template v-for="tab in tabPaneList">
          <TabPane :key="tab.name" :label="tab.label" :name="tab.name" v-if="tab.checkFlag">
            <template v-if="activeName === tab.name">
              <CameraList v-if="tab.name === 'ten'"></CameraList>
              <overviewList v-else :options="options" @sendMac="receiveMac" @handleAction="handleAction" @returnCycleData="getCycleData" @lookDetail="lookDetail"></overviewList>
            </template>
          </TabPane>
        </template>
        <template slot="extra">
          <Poptip placement="bottom-end" width="180" slot="extra" word-wrap v-model="visible" transfer style="z-index: 999">
            <Icon class="tab-icon" custom="icon-v5 icon-v5-shaixuan" size="24" />
            <div class="api" slot="content">
              <CheckboxGroup v-model="tabSelect">
                <Checkbox v-for="item in checkLists" :key="item.value" :label="item.value" style="display: block; margin: 5px">{{ item.label }}</Checkbox>
              </CheckboxGroup>
              <div class="mrg-120">
                <Button type="default" size="small" class="deter-ml" @click="visible = false">{{ $t('cancel') }}</Button>
                <Button type="primary" size="small" @click="addClassifyTab">{{ $t('confirm') }}</Button>
              </div>
            </div>
          </Poptip>
        </template>
      </Tabs>
    </Col>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo" @switchDevice="switchDevice" :deviceCycleData="deviceCycleData"></detailView>
    <EquipmentRecordModal ref="equipmentRecordModal" />
    <ServicePointModal ref="servicePointModal" />
    <CheckWorkerModal ref="checkWorkerModal" />
    <ConfigurationModal ref="configurationModal" />
    <WriteTableBaseModal ref="writeTableBaseModal" />
  </div>
</template>
<script>
  import overviewList from './list.vue'
  import CameraList from './camera-list/index.vue'
  import detailView from './deviceDetail/detailView.vue'
  import store from '@/store'
  import { getEquipmentClassifyTab, saveEquipmentClassifyTab, queryBoxes, brightnessthirdDevice, getGroupType, configAndOperate, dimmingthirdDevice, chtqdqwaterRead, chtqdqwaterValveOnOrOff } from '@/api/public'
  import { queryBoxDetails } from '@/api/control/index'
  import deviceClassification from '@/mixins/deviceClassification'
  import { mapMutations } from 'vuex'
  export default {
    name: 'console-device',
    components: {
      overviewList,
      CameraList,
      detailView,
      EquipmentRecordModal: () => import('./actionModal/EquipmentRecordModal.vue'),
      ServicePointModal: () => import('./actionModal/ServicePointModal.vue'),
      CheckWorkerModal: () => import('./actionModal/CheckWorkerModal.vue'),
      ConfigurationModal: () => import('./actionModal/ConfigurationModal.vue'),
      WriteTableBaseModal: () => import('./actionModal/WriteTableBaseModal.vue'),
    },
    mixins: [deviceClassification],
    provide() {
      return {
        provideData: this.provideData,
        lookDeviceDetails: this.lookDeviceDetails,
      }
    },
    data() {
      return {
        visible: false,
        tabSelect: [],
        activeName: 'first',
        options: { type: '1', mac: '' },
        rightView: this.$store.state.rightView,
        tabsWidth: '',
        showDetail: false,
        deviceInfo: {},
        deviceCycleData: {},
        initTab: 'deviceInfo',
        showSwitch: true,
        provideData: {
          packetList: [],
        },
      }
    },
    computed: {
      tabPaneList() {
        return this.deviceClass.map(it => {
          let obj = { label: it.name, type: it.types, name: it.tabName, checkFlag: true }
          if (it.value) {
            obj.checkFlag = this.tabSelect.indexOf(it.value) > -1
          }
          return obj
        })
      },
      checkLists() {
        return this.deviceClass.filter(it => it.value).map(it => ({ label: it.name, value: it.value }))
      },
    },
    created() {
      this.getGroupTypes()
      this.init()
    },
    methods: {
      ...mapMutations('device', ['setDeviceAddr']),
      async lookDeviceDetails([mac, addr]) {
        const res = await queryBoxDetails({ mac })
        if (!res.success) return this.$Message.error({ content: res.message })
        this.deviceInfo = res.data
        store.commit('mac', res.data.mac)
        store.commit('equipmentType', res.data.equipmentType)
        this.setDeviceAddr(+addr)
        this.initTab = 'runTrend'
        this.$nextTick(() => {
          this.showDetail = true
          this.showSwitch = false
        })
      },
      init() {
        this.monitorTab()
        this.gettClassifyTab()
        if (!this.rightView) {
          if (document.body.clientWidth <= 1800) {
            this.tabsWidth = document.body.clientWidth * 0.7916667 - 240 + 'px'
          }
        }
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.provideData.packetList = res && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      monitorTab() {
        let type = this.$store.state.overview.equipmentType
        let tabFind = this.tabPaneList.find(item => item.type.indexOf(type) > -1)
        this.options.type = tabFind ? tabFind.type.join(',') : ''
        this.activeName = tabFind ? tabFind.name : 'first'
        this.options.mac = this.$store.state.overview.mac
      },
      handleClick(tab) {
        this.activeName = tab
        let types = this.tabPaneList.find(item => item.name === tab).type
        this.options.type = types ? types.join(',') : ''
      },
      async gettClassifyTab() {
        let params = { projectCode: this.$store.state.projectCode }
        let res = await getEquipmentClassifyTab(params)
        if (res.success) {
          this.tabSelect = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async addClassifyTab() {
        if (this.tabSelect.length < 1) return this.$Message.error({ content: this.$t('selectedNotNull') })
        let newCheckList = Array.from(new Set([1, 2, 9].concat(this.tabSelect)))
        let params = { projectCode: this.$store.state.projectCode, classify: newCheckList.join() }
        const res = await saveEquipmentClassifyTab(params)
        if (res.success) {
          this.visible = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
        this.gettClassifyTab()
        this.handleClick('first')
      },
      receiveMac(val) {
        this.options.mac = val
      },
      closeView() {
        this.deviceInfo = {}
        this.showDetail = false
      },
      lookDetail(info, tab = 'deviceInfo') {
        this.showSwitch = true
        this.deviceInfo = { ...info }
        this.initTab = tab
        this.showDetail = true
      },
      getCycleData(data) {
        this.deviceCycleData = data
      },
      async setDeviceCycleData(pageNo, isNext = false) {
        let params = { ...this.deviceCycleData.params, pageNo }
        const res = await queryBoxes(params)
        if (res.success) {
          let tableData = res.datas
          let filterData = res.datas.filter(item => item.equipmentType === 22)
          if (filterData.length > 0) {
            let stRing = filterData.map(item => item.mac).join(',')
            const resLight = await brightnessthirdDevice({ mac: stRing })
            tableData.forEach(item => {
              let findValue = resLight.data.find(v => v.mac === item.mac)
              item['lightNess'] = (findValue && +findValue.value) || 0
            })
          } else {
            tableData = res.datas.map(item => ({ ...item, checkStatusInfo: item.equipmentType === 27 ? 2 : undefined }))
          }
          this.deviceCycleData = { list: tableData, total: res.total, totalPage: res.totalPage, pageNo, params: params }
          this.deviceInfo = isNext ? { ...tableData[0] } : { ...tableData[tableData.length - 1] }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      switchDevice(index) {
        if (index === -1) {
          this.setDeviceCycleData(this.deviceCycleData.pageNo - 1, false)
        } else if (this.deviceCycleData.list[index]) {
          this.deviceInfo = { ...this.deviceCycleData.list[index] }
        } else {
          this.setDeviceCycleData(this.deviceCycleData.pageNo + 1, true)
        }
      },
      // 参数调整
      async handleEquipment(row) {
        const res = await queryBoxDetails({ mac: row.mac })
        if (res.success) {
          store.commit('aliasName', res.data.name)
          store.commit('customAlarm', res.data.others.customAlarm)
          store.commit('classifyLabel', res.data.others.classifyLabel)
          store.commit('sortBUR', { build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2 })
        } else {
          this.$Message.error({ content: res.message })
        }
        store.commit('mac', row.mac)
        store.commit('equipmentType', row.equipmentType)
        this.lookDetail(row, 'config')
      },
      handleBuiltIn(row) {
        this.$router.push({ name: 'multiManage-builtInTimer', params: { mac: row.mac } })
      },
      handleLongitude(row) {
        this.$router.push({ name: 'multiManage-latlongTimer', params: { mac: row.mac } })
      },
      async queryconfigAndOperate(type, row) {
        let list = [{ type: type, value: 0 }]
        let params = { deviceId: row.mac, list: JSON.stringify(list) }
        const res = await configAndOperate(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getCloseOrOpen(param) {
        const res = await dimmingthirdDevice(param)
        if (res.success) {
          this.$Message.success({ content: this.$t('actionSuccess') })
        } else {
          this.$Message.error({ content: res.message })
        }
        setTimeout(() => {
          this.$refs.overviewListRef.queryList()
        }, 3000)
      },
      meterReading(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div> ${this.$t('surePerformMeterReading')}？</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { cid: row.mac, address: row.mac, model: '17501' }
            const res = await chtqdqwaterRead(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      openAndCloseValve(type, row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div>${type === '43' ? this.$t('sureExcuteOpening') : this.$t('sureExcuteClosing')}？</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { cid: row.mac, address: row.mac, type }
            const res = await chtqdqwaterValveOnOrOff(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      /**
       * 操作按钮
       * @param {String} action 操作按钮名称
       * @param {Object} row 行数据
       */
      handleAction(action, row) {
        switch (action) {
          case 'command-list':
            //  查看线路列表
            this.lookDetail(row, 'addrLines')
            break
          case 'orientation':
            //  修改服务指向
            this.$refs.servicePointModal.openModel(row)
            break
          case 'inspection':
            //  巡检记录查看
            this.$refs.equipmentRecordModal.openModel(row)
            break
          case 'equipment':
            //  设备参数调整
            this.handleEquipment(row)
            break
          case 'builtIn':
            // 内置定时配置
            this.handleBuiltIn(row)
            break
          case 'longitude':
            // 内置经纬定时
            this.handleLongitude(row)
            break
          case 'refrigeration':
            // 开机制冷
            this.queryconfigAndOperate('sendCmdChn21', row)
            break
          case 'heating':
            // 开机制热
            this.queryconfigAndOperate('sendCmdChn22', row)
            break
          case 'shutdown':
            // 关机
            this.queryconfigAndOperate('sendCmdChn23', row)
            break
          case 'openLight':
            // 开灯
            this.getCloseOrOpen({ mac: row.mac, light: row.lightNess === 0 ? 100 : row.lightNess, adjustment: 0, address: `${row.build}${row.unit}${row.room}` })
            break
          case 'closeLight':
            // 关灯
            this.getCloseOrOpen({ mac: row.mac, light: 0, adjustment: 0, address: `${row.build}${row.unit}${row.room}` })
            break
          case 'checkwork':
            // 查岗
            this.$refs.checkWorkerModal.openModal(row)
            break
          case 'jheventlevel':
            // 设备参数调整
            this.$refs.configurationModal.openModal(row)
            break
          case 'eastWater':
            // 写表底数
            this.$refs.writeTableBaseModal.openModal(row)
            break
          case 'meterreading':
            // 抄表
            this.meterReading(row)
            break
          case 'openvalve':
            // 开阀
            this.openAndCloseValve('43', row)
            break
          case 'closevalue':
            // 关阀
            this.openAndCloseValve('53', row)
            break
          default:
            break
        }
      },
    },
    mounted() {},
    activated() {
      if (this.$route.params.mac) {
        this.deviceInfo = { ...this.$route.params }
        this.showDetail = true
        this.showSwitch = false
      }
    },
  }
</script>
<style lang="less" scoped>
  /deep/.ivu-tabs-nav-container {
    padding: 5px;
  }
  /deep/.ivu-tabs-bar {
    background: #1a202e;
    margin-bottom: 10px;
  }
  .mrg-120 {
    margin-left: 60px;
    display: flex;
    margin-top: 20px;
  }
  .deter-ml {
    padding-right: 10px;
    margin-right: 5px;
  }
  .tab-icon {
    padding: 11px;
  }
</style>
