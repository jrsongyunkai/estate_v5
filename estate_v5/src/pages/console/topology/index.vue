<template>
  <div>
    <div style="width: 100%" v-show="!showDetail">
      <Row v-if="!settingsVisible" class="topologyPage" :gutter="8">
        <Col :span="11">
          <div class="Tab-left-line">
            <Tabs v-model="curTab" @on-click="handleTabsVal">
              <template #extra>
                <div class="operation" v-if="curTab === '1'">
                  <Button class="b-dger" @click="handleBatchFloorRemotectrl('close')">{{ $t('oneClickOn') }}</Button>
                  <Button class="b-gre" @click="handleBatchFloorRemotectrl('open')">{{ $t('oneClickOff') }}</Button>
                  <Button @click="allPackUp" class="b-blue">{{ treeHasExpand ? $t('collapse') : $t('expandAll') }}</Button>
                  <Button class="pointer detailsBtn" type="primary" ghost @click="handleTreeData"><i class="icon-v5 icon-v5-refresh"></i></Button>
                </div>
                <div class="operation" v-if="curTab === '2'">
                  <Button type="primary" ghost @click="settingsVisible = true">{{ $t('topologyConfig') }}</Button>
                  <Button class="b-dger" @click="$refs.eTree.batchSwitch(true)">{{ $t('oneClickOn') }}</Button>
                  <Button class="b-gre" @click="$refs.eTree.batchSwitch(false)">{{ $t('oneClickOff') }}</Button>
                  <Button class="pointer detailsBtn" type="primary" ghost @click="$refs.eTree.getConfig"><i class="icon-v5 icon-v5-refresh"></i></Button>
                </div>
              </template>
              <TabPane :label="$t('lineAddressTopology')" name="1">
                <Input :placeholder="$t('topologyPlaceholder1')" :border="false" v-model.trim="inputValue" @on-enter="search" class="search" style="border: none" clearable>
                  <Icon type="ios-search" slot="prefix" @click="search" />
                </Input>
                <div class="treeArea">
                  <div class="tree">
                    <Tree :data="treeData" class="demo-tree-render topology" @on-select-change="change" :load-data="loadData" show-checkbox @on-check-change="checkChange" :render="renderContent"></Tree>
                  </div>
                </div>
              </TabPane>
              <TabPane :label="$t('lineElectricalTopology')" name="2">
                <etree ref="eTree" :tabsVal="tabsVal" @electTreeObj="handleElectTreeObj" />
              </TabPane>
            </Tabs>
          </div>
        </Col>
        <Col :span="13">
          <div class="mapArea">
            <Details :title="title" :details="detailsStatus" @lookDeviceDetails="lookDeviceDetails" :state="state" :detailData="detailData" v-if="detailsStatus.title !== undefined"></Details>
          </div>
        </Col>
      </Row>
      <Settings v-else @close-settings="backFromSetting" />
    </div>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
    <BatchOcAlarmTips ref="batchOcAlarmTips" @commitOK="handleChannelsOcPost" />
  </div>
</template>
<script>
  import { getBuildingList, queryEquipmentInfo, queryRoomEquipmentList, searchEquipment, batchCheckFloorRemotectrlAlm } from '@/api/console/topology.js'
  import { initTreeData } from './deepTree'
  import Details from './details.vue'
  import etree from './electricalTree.vue'
  import { batchFloorRemotectrl, mainLineConfig, getDigitalInfo, digitalOutRemotectrl, floorDetail, boxOrAddrDetail4Power, ct808PortDetail } from '@/api/public'
  import { fullclosing, fullopening, halfclosing, redBtnStyle, greenBtnStyle, onlineStyle, offlineStyle, outLIneStyle, off, on, notion, Inching, swinput, swoutput } from './statusColors'
  import Settings from './settings/index.vue'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import BatchOcAlarmTips from '@/pages/console/device/deviceDetail/viewModules/common/BatchOcAlarmTips.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'console-topology',
    components: {
      Details,
      etree,
      Settings,
      detailView,
      BatchOcAlarmTips,
    },
    mixins: [deviceDetails],
    data() {
      return {
        curTab: '1',
        settingsVisible: false,
        inputValue: '',
        treeData: [],
        checkData: [],
        childrenData: [],
        treeHasExpand: true,
        detailsStatus: {},
        detailData: {},
        tabsVal: '1',
        windowWidth: 0, // 页面窗口宽度
        windowHeight: 0, // 页面窗口高度
        tempWidth: 0, // 元素宽度
        tempHeight: 0, // 元素高度
      }
    },
    mounted() {
      this.handleTreeData()
    },
    watch: {
      windowWidth: {
        handler(newVal) {},
      },
      detailsStatus: {
        handler(newVal, oldVal) {
          if (this.detailsStatus.mac === undefined && this.detailsStatus.addr === undefined && this.detailsStatus.digitalOut === undefined) {
            this.queryFloorDetail(this.detailsStatus)
            this.state = 1
            if (this.detailsStatus.parentNode.length === 1) {
              this.title = this.$store.state.switchData.prjLocation.positionLabelA
            } else if (this.detailsStatus.parentNode.length === 2) {
              this.title = this.$store.state.switchData.prjLocation.positionLabelB
            } else {
              this.title = this.$store.state.switchData.prjLocation.positionLabelC
            }
          }
          if (this.detailsStatus.mac !== undefined && this.detailsStatus.addr === undefined) {
            this.queryboxOrAddrDetailPower(this.detailsStatus)
            this.state = 2
            this.title = this.$t('device')
          }
          if (this.detailsStatus.mac !== undefined && this.detailsStatus.addr !== undefined) {
            this.queryboxOrAddrDetailPower(this.detailsStatus)
            this.state = 3
            this.title = this.$t('line')
          }
          if (this.detailsStatus.digitalOut !== undefined) {
            this.queryct808PortDetail(this.detailsStatus)
            this.state = 4
            this.title = this.$t('port')
          }
          if (this.detailsStatus.parentNode !== undefined && this.detailsStatus.parentNode.length === 3) {
            this.queryDevice(this.detailsStatus)
          }
          if (this.detailsStatus.addr !== undefined) {
            this.queryLine(this.detailsStatus.mac, this.detailsStatus, this.detailsStatus.addr)
          }
        },
      },
    },
    methods: {
      backFromSetting() {
        this.settingsVisible = false
        this.curTab = '2'
      },
      handleElectTreeObj(val) {
        this.detailsStatus = val
        this.detailsStatus.title = val.name
      },
      handleTabsVal(val) {
        this.checkData = []
        this.tabsVal = val
        this.detailsStatus.title = undefined
      },
      async handleTreeData() {
        let params = { projectCode: this.$store.state.projectCode, all: true, distinct: true }
        const res = await getBuildingList(params)
        if (res.success) {
          this.treeData = initTreeData(res.data)
        } else {
          this.$Message.error(res.message)
        }
      },
      renderContent(h, { root, node, data }) {
        return h('span', { style: { display: 'inline-block', width: '100%' } }, [
          h('span', { style: { display: 'flex', alignItems: 'center' } }, [
            h('span', data.title),
            h('span', { style: data.chnlOcStatus === 0 ? fullopening : data.chnlOcStatus === 1 ? fullclosing : data.chnlOcStatus === -2 ? '' : halfclosing }, [
              h('Icon', {
                props: {
                  custom: data.chnlOcStatus === 0 ? 'icon-v5 icon-v5-quanfenzha' : data.chnlOcStatus === 1 ? 'icon-v5 icon-v5-quanhezha' : data.chnlOcStatus === -2 ? '' : 'icon-v5 icon-v5-banhezha',
                },
                style: { fontSize: '36px' },
              }),
              h('span', data.chnlOcStatus === 0 ? this.$t('allOff') : data.chnlOcStatus === 1 ? this.$t('allOn') : data.chnlOcStatus === -2 ? '' : this.$t('onOffRatio', data)),
            ]),
          ]),
        ])
      },
      change(item) {
        this.detailsStatus = item[0]
      },
      // 获取楼栋详情信息
      async queryFloorDetail(item) {
        let params = { projectCode: this.$store.state.projectCode, build: item.parentNode[0], unit: item.parentNode[1], room: item.parentNode[2] }
        const res = await floorDetail(params)
        if (res.success) {
          this.detailData = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      // 获取设备线路详情
      async queryboxOrAddrDetailPower(item) {
        let params = { projectCode: this.$store.state.projectCode, mac: item.mac, addr: item.addr }
        const res = await boxOrAddrDetail4Power(params)
        if (res.success) {
          this.detailData = []
          this.detailData = res.data
          if (this.detailData.boxDetailVo) {
            this.detailData.boxDetailVo.tHistory = true
          }
          if (this.detailData.addrDetailVo) {
            this.detailData.addrDetailVo['mac'] = item.mac
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      // 获取808端口详情
      async queryct808PortDetail(item) {
        let type
        if (item.ins && !item.showIns) {
          type = 1
        } else if (!item.ins && !item.showIns) {
          type = 2
        } else if (item.ins && item.showIns) {
          type = 3
        }
        let params = { mac: item.mac, addr: item.addr, startTime: this.$Date().format('YYYY-MM-DD'), endTime: this.$Date().format('YYYY-MM-DD'), digitalType: type, port: item.digitalOut }
        const res = await ct808PortDetail(params)
        this.detailData = res.data
      },
      // 设备
      queryDevice(item) {
        let parentNode = item.parentNode
        let params = { projectCode: this.$store.state.projectCode, build: item.parentNode[0], unit: item.parentNode[1], room: item.parentNode[2] }
        queryRoomEquipmentList(params).then(res => {
          this.childrenData = []
          if (res.success) {
            res.data.forEach(item => {
              const arrPushData = {
                title: item.name,
                mac: item.mac,
                expand: false,
                disabled: !item.mantunsciFlag || !item.isSupportOc,
                isSupportOc: item.isSupportOc,
                children: [],
                parentNode: [item.build, item.unit, item.room],
                equipmentType: item.equipmentType,
                on: item.online,
                chnlOcStatus: item.chnlOcStatus,
                mantunsciFlag: item.mantunsciFlag,
                closeCount: item.closeCount,
                openCount: item.openCount,
                imgUrl: item.imgUrl,
                render: (h, { root, node, data }) => {
                  return h(
                    'span',
                    {
                      style: { display: 'flex', width: '100%' },
                      on: {
                        click: e => {
                          this.pictureName = ''
                          // 当前查看的设备，用于给上传的图片命名
                          parentNode.map(item => {
                            this.pictureName += item + '-'
                          })
                          // this.changeImg(item, item.model);
                          let newstr = this.pictureName + data.title
                          JSON.parse(JSON.stringify((this.pictureName = newstr)))
                          this.params.id = item.id
                          this.params.equipmentType = item.equipmentType
                          this.params.mac = item.mac
                        },
                      },
                    },
                    // 设备
                    [
                      h('span', data.title),
                      h(
                        'span',
                        {
                          style: data.on === 1 ? onlineStyle : data.on === 0 ? offlineStyle : outLIneStyle,
                        },
                        [h('span', data.on === 1 ? this.$t('online') : data.on === 0 ? this.$t('offline') : this.$t('disconnected'))]
                      ),
                      h(
                        'span',
                        {
                          style: data.chnlOcStatus === 0 ? fullopening : data.chnlOcStatus === 1 ? fullclosing : data.chnlOcStatus === -2 ? '' : halfclosing,
                        },
                        [
                          h('Icon', {
                            props: {
                              custom: data.chnlOcStatus === 0 ? 'icon-v5 icon-v5-quanfenzha' : data.chnlOcStatus === 1 ? 'icon-v5 icon-v5-quanhezha' : data.chnlOcStatus === -2 ? '' : 'icon-v5 icon-v5-banhezha',
                            },
                            style: {
                              fontSize: '36px',
                            },
                          }),
                          h('span', data.chnlOcStatus === 0 ? this.$t('allOff') : data.chnlOcStatus === 1 ? this.$t('allOn') : data.chnlOcStatus === -2 ? '' : this.$t('onOffRatio', data)),
                        ]
                      ),
                    ]
                  )
                },
              }
              if (item.mantunsciFlag) {
                arrPushData.loading = false
              }
              this.childrenData.push(arrPushData)
            })
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      // 线路
      async queryLine(mac, parent, addrs) {
        this.addrd = addrs
        this.mac = mac
        let params = { mac: mac }
        const res = await queryEquipmentInfo(params)
        this.resdata = res.data
        this.childrenData = []
        if (res.success) {
          this.resdata.map((item, index) => {
            item.edit = false
            this.childrenData.push({
              addr: item.addr,
              title: item.title ? item.title : item.mac,
              mac: item.mac,
              oc: item.oc,
              on: parent.on,
              edit: item.edit,
              parentNode: parent.parentNode,
              disableCheckbox: item.lineType === 'IO' || !item.isSupportOc,
              isSupportOc: item.isSupportOc,
              showInput: false,
              projectMainLine: item.projectMainLine,
              lineType: item.lineType,
              render: (h, { root, node, data }) => {
                if (data.addr === this.addrd && data.mac === this.mac) {
                  data.edit = true
                } else {
                  data.edit = false
                }
                return h('span', { style: { display: 'flex', alignItems: 'center', width: '100%' } }, [
                  h('span', { style: { display: data.showInput ? 'none' : 'inline-block' } }, [h('span', data.title)]),
                  h('Input', {
                    props: { value: data.title },
                    style: { display: data.showInput ? 'inline-block' : 'none', width: '100px', height: '24px' },
                    on: {
                      'on-change': event => {
                        data.newTitle = event.target.value
                      },
                    },
                  }),
                  !data.isSupportOc
                    ? ''
                    : h('span', { style: data.lineType !== 'IO' ? (data.oc === true ? redBtnStyle : greenBtnStyle) : data.on === 1 ? onlineStyle : data.on === 0 ? offlineStyle : outLIneStyle }, [
                        h('Icon', { props: { custom: data.lineType !== 'IO' ? (data.oc === true ? 'icon-v5 icon-v5-yihezha' : 'icon-v5 icon-v5-yifenzha') : '' }, style: { fontSize: '36px' } }),
                        h('span', data.lineType !== 'IO' ? (data.oc === true ? this.$t('closed') : this.$t('opened')) : data.on === 1 ? this.$t('online') : data.on === 0 ? this.$t('offline') : this.$t('disconnected')),
                      ]),

                  h(
                    'Button',
                    {
                      props: Object.assign({}, this.buttonProps, { type: 'text', ghost: 'ghost' }),
                      style: { fontSize: '16px', cursor: 'pointer', position: 'absolute', right: '10px', color: '#b7292a', display: data.showInput ? 'inline-block' : 'none' },
                      on: {
                        click: () => {
                          data.showInput = false
                        },
                      },
                    },
                    [h('span', this.$t('cancel'))]
                  ),
                  h('Button', { props: Object.assign({}, this.buttonProps, { type: 'text', ghost: 'ghost' }), style: { fontSize: '16px', color: '#4da1e5', cursor: 'pointer', position: 'absolute', right: '80px', display: data.showInput ? 'inline-block' : 'none' } }, [h('span', this.$t('save'))]),
                ])
              },
            })
            // 如果有IO存在。则生产第六层808数据
          })
          this.childrenData.forEach(val => {
            if (val.lineType === 'IO') {
              val['children'] = []
              val['loading'] = false
            }
          })
        } else {
          this.$Message.error(res.message)
        }
      },
      // 808设备线路
      async querySimulation(mac, addr) {
        this.childrenData = []
        let params = { mac: mac, addr: addr }
        const res = await getDigitalInfo(params)
        let arr1 = []
        let arr2 = []
        let arr3 = []
        let tAarr = []
        if (res.success) {
          if (res.data.digitalIns !== undefined) {
            res.data.digitalIns.forEach(val => {
              val['ins'] = true
              val['showIns'] = false
              arr1.push(val)
            })
          }
          if (res.data.digitalOuts !== undefined) {
            res.data.digitalOuts.forEach(val => {
              val['ins'] = false
              val['showIns'] = false
              arr2.push(val)
            })
          }
          if (res.data.analogIns !== undefined) {
            res.data.analogIns.forEach(val => {
              val['ins'] = true
              val['showIns'] = true
              arr3.push(val)
            })
          }
          tAarr = [...arr1, ...arr2, ...arr3]

          tAarr.map(v => {
            this.childrenData.push({
              title: v.name,
              status: v.value,
              disableCheckbox: true,
              ins: v.ins,
              digitalOut: v.index,
              showIns: v.showIns,
              mac: mac,
              addr: addr,
              render: (h, { root, node, data }) => {
                return h('span', { style: { display: 'flex', width: '100%' } }, [
                  h('span', data.title),
                  h('div', { style: !data.showIns && !data.ins ? swoutput : swinput }, [
                    h('span', { style: { marginLeft: '10px', display: 'flex' } }, [
                      h(
                        'div',
                        {
                          style: data.status === 0 ? off : data.status === 1 ? notion : off,
                          on: {
                            click: () => {
                              if (!data.ins) {
                                this.handleDigitalOutRemoteCtrl(mac, addr, data.digitalOut, '2')
                              }
                            },
                          },
                        },
                        [h('span', 'OFF')]
                      ),
                      h(
                        'div',
                        {
                          style: data.status === 1 ? on : data.status === 0 ? notion : on,
                          on: {
                            click: () => {
                              if (!data.ins) {
                                this.handleDigitalOutRemoteCtrl(mac, addr, data.digitalOut, '1')
                              }
                            },
                          },
                        },
                        [h('span', 'ON')]
                      ),
                    ]),
                    h(
                      'div',
                      {
                        style: data.ins ? 'display:none' : Inching,
                        on: {
                          click: () => {
                            this.handleDigitalOutRemoteCtrl(mac, addr, data.digitalOut, '4')
                          },
                        },
                      },
                      [h('span', this.$t('inching'))]
                    ),
                  ]),

                  h('div', { style: data.showIns && data.ins ? swinput : !data.showIns && !data.ins ? swinput : '' }, [h('span', { style: { marginLeft: '10px', display: 'flex' } }, [h('div', { style: data.status === 0 ? off : on }, [h('span', data.status === 0 ? 'OFF' : 'ON')])])]),
                ])
              },
            })
          })
        } else {
          this.$Message.error(res.message)
        }
      },
      // 808动作
      async handleDigitalOutRemoteCtrl(mac, addr, digitalOut, action) {
        let params = { cmd: 'DIGITALOUT_ON_OFF_JOG', mac: mac, addr: addr, digitalOut: digitalOut, action: action }
        const res = await digitalOutRemotectrl(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      loadData(item, callback) {
        this.childrenData = []
        if (item.parentNode !== undefined) {
          // 设备
          if (item.parentNode.length === 3 && item.mac === undefined) {
            this.queryDevice(item)
          }
          // 线路
          if (item.parentNode.length === 3 && item.mac !== undefined && item.lineType === undefined) {
            this.queryLine(item.mac, item)
          }
          // 808
          if (item.lineType === 'IO') {
            this.querySimulation(item.mac, item.addr)
          }
        }
        setTimeout(() => {
          callback(this.childrenData)
        }, 1000)
      },
      checkChange(list, data) {
        this.macAddr = []
        // if (data.children === undefined) { data['children'] = [] }
        this.checkData = list
      },
      search() {
        if (this.inputValue) {
          let params = { keyword: this.inputValue, projectCode: this.$store.state.projectCode }
          this.flag = true
          searchEquipment(params).then(res => {
            let that = this
            this.treeData = this.handleSearchValue(res.data, that)
          })
        } else {
          this.flag = false
          this.handleTreeData()
        }
      },
      // 搜索
      handleSearchValue(res, that) {
        let searchData = res.map(item => {
          let obj = {}
          obj['title'] = item.build
          obj['expand'] = true
          obj['closeCount'] = item.closeCount
          obj['openCount'] = item.openCount
          obj['children'] = [
            {
              title: item.unit,
              expand: true,
              closeCount: item.closeCount,
              openCount: item.openCount,
              children: [
                {
                  title: item.room,
                  expand: true,
                  closeCount: item.closeCount,
                  openCount: item.openCount,
                  children: [{ title: item.name, expand: false, loading: false, children: [], parentNode: [item.build, item.unit, item.room], equipmentType: item.equipmentType, mac: item.mac, on: item.online, closeCount: item.closeCount, openCount: item.openCount }],
                },
              ],
            },
          ]
          return obj
        })
        return searchData
      },
      async handleBatchFloorRemotectrl(status) {
        if (this.checkData === undefined || (this.checkData !== undefined && this.checkData.length <= 0)) {
          return this.$Message.error({ content: this.$t('pleaseSelectLine') })
        }
        this.macAddr = []
        this.checkData.map(val => {
          if (!val.mac && !val.addr) {
            this.macAddr.push({ build: val.parentNode[0], unit: val.parentNode[1] ? val.parentNode[1] : '', room: val.parentNode[2] ? val.parentNode[2] : '', onOrOff: status === 'close' })
          }
          if (val.mac && !val.addr) {
            this.macAddr.push({ build: val.parentNode[0], unit: val.parentNode[1], room: val.parentNode[2], onOrOff: status === 'close', mac: val.mac, addrs: '' })
          }
          if (val.mac && val.addr) {
            this.macAddr.push({ build: val.parentNode[0], unit: val.parentNode[1], room: val.parentNode[2], onOrOff: status === 'close', mac: val.mac, addrs: val.addr })
          }
        })
        let arr = []
        let newarr = []
        let mineline = []
        this.macAddr.map(item => {
          let afterData = []
          if (!item.mac && !item.addrs) {
            arr.push({ build: item.build, unit: item.unit, room: item.room, onOrOff: item.onOrOff, fos: [] })
          } else if (item.mac && item.addrs === '') {
            arr.push({ build: item.build, unit: item.unit, room: item.room, onOrOff: item.onOrOff, fos: [{ mac: item.mac, addrOptInfos: [] }] })
          } else if (item.mac && item.addrs) {
            let tempArr = []
            newarr.push({ build: item.build, unit: item.unit, room: item.room, onOrOff: item.onOrOff, mac: item.mac, addrs: item.addrs })
            for (let i = 0; i < newarr.length; i++) {
              if (tempArr.indexOf(newarr[i].mac) === -1) {
                if (newarr[i].addrs !== undefined) {
                  afterData.push({ build: newarr[i].build, unit: newarr[i].unit, room: newarr[i].room, onOrOff: newarr[i].onOrOff, fos: [{ mac: newarr[i].mac, addrOptInfos: [{ addrs: [newarr[i].addrs], onOrOff: newarr[i].onOrOff }] }] })
                  tempArr.push(newarr[i].mac)
                }
              } else {
                for (let j = 0; j < afterData.length; j++) {
                  if (afterData[j].fos[0].mac === newarr[i].mac) {
                    afterData[j].fos[0].addrOptInfos[0].addrs.push(newarr[i].addrs)
                    break
                  }
                }
              }
            }
          }
          mineline = afterData
        })
        mineline.map(val => {
          arr.push(val)
        })
        const res = await batchCheckFloorRemotectrlAlm(JSON.stringify(arr))
        if (res.success) {
          if (res.data.length > 0) {
            this.$refs.batchOcAlarmTips.openModal(res.data, status === 'close', arr)
          } else {
            this.handleChannelsOcPost(arr)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleChannelsOcPost(params) {
        let map = new Map()
        let newArr = []
        const res = await batchFloorRemotectrl(JSON.stringify(params))
        if (res.data) {
          res.data.map(val => {
            if (!map.has(val.mac)) {
              map.set(val.mac, val)
            }
          })
          newArr = [...map.values()]
          newArr.map(val => {
            if (val.exeResult === 0) {
              this.$Message.success({ content: val.mac + val.msg })
            } else {
              this.$Message.error({ content: val.mac + val.msg })
            }
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      allPackUp() {
        const that = this
        if (this.tabsVal === '1') {
          this.treeData.map(item => {
            changelist(item, 0)
            function changelist(item, deep) {
              item.expand = deep < 2 ? !that.treeHasExpand : that.treeHasExpand
              if (item.children) {
                item.children.map(item => {
                  changelist(item, deep + 1)
                })
              }
            }
            return item
          })
          this.treeHasExpand = !this.treeHasExpand
        }
      },
      async handlemainLineConfig(item, valid) {
        let params = { projectCode: this.$store.state.projectCode, mac: item.mac, addr: `${item.addr}`, valid: valid }
        const res = await mainLineConfig(params)
        if (res.success) {
          this.$Message.success(res.message)
        } else {
          this.$Message.error(res.message)
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .operation {
    display: flex;
    align-items: center;
    height: 36px;
    .ivu-btn {
      margin-left: 4px;
    }
  }
</style>
<style lang="less">
  .topologyPage {
    width: 100%;
    .ivu-tree-children .ivu-checkbox-disabled {
      display: none;
    }

    .ivu-tree-children {
      .ivu-tree-title:hover {
        background-color: #262c3b;
        color: #007eff;
      }
    }

    .demo-tree-render .ivu-tree-title {
      width: 100%;
    }

    .ivu-tree-title-selected:hover {
      background-color: #262c3b;
      color: #007eff;
    }
    .Tab-left-line {
      background: #1a202e;
      padding: 10px;
      position: relative;
      height: ~'calc(100vh - 141px)';
      overflow: hidden;
      .buttonGround {
        z-index: 99;
        margin: 5px 0;
        position: absolute;
        right: 20px;
        top: -50px;
        Button {
          margin-left: 5px;
        }
      }
    }
    .treeArea {
      height: ~'calc(100vh - 250px)';
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .tree {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      scrollbar-width: none;
      .ivu-tree-title-selected {
        background-color: #262c3b;
        color: #007eff;
      }
    }
    .search {
      .ivu-input {
        border: none;
        border-bottom: 1px solid #3d3d41;
      }
    }
  }
  .mapArea {
    background: #1a202e;
    height: ~'calc(100vh - 141px)';
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
</style>
