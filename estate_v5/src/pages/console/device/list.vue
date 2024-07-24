<template>
  <div id="overlist">
    <Col v-show="flag" :span="24">
      <div class="device-search-box">
        <div class="left">
          <Select transfer style="width: 150px" v-model="packetTypes" :clearable="true" :placeholder="$t('selectGroupType')" class="en-unit" @on-change="handleTypes">
            <Option v-for="item in provideData.packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
          </Select>
          <TreeSelect :placeholder="$t('selectGroup')" class="search-item" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" />
          <Select class="search-item" transfer clearable v-model="building" :placeholder="`${$t('pleaseSelect')} ${$store.state.switchData.prjLocation.positionLabelA}`" @on-change="handleChange">
            <Option z-index="5" v-for="item in buildings" :key="item.value" :label="item.text" :value="item.value"></Option>
          </Select>
          <Select transfer clearable class="search-item" v-model="unit" :placeholder="`${$t('pleaseSelect')} ${$store.state.switchData.prjLocation.positionLabelB}`" @on-change="handleUnit">
            <Option v-for="item in units" :key="item.value" :label="item.text" :value="item.value"></Option>
          </Select>
          <Select transfer clearable class="search-item" v-model="status" :placeholder="$t('pleaseSelectState')" @on-change="handleStatus">
            <Option v-for="item in stats" :key="item.value" :label="item.text" :value="item.value"></Option>
          </Select>
          <Input
            class="search-item"
            v-model="form.mac"
            :placeholder="$store.state.switchData.prjLocation.positionLabelC + '/' + $t('equipmentNo')"
            :title="$store.state.switchData.prjLocation.positionLabelC + $t('equipmentNo')"
            @input.native="handleInputMac"
            :onkeyup="(form.mac = form.mac.replace(/[, ]/g, ''))"
            @on-keyup.enter="handleKeyWords" />
          <Button type="primary" style="margin-left: 5px" @click.stop="handleSearch">{{ $t('query') }}</Button>
          <Button type="default" style="margin-left: 5px" @click.stop="handleReset">{{ $t('reset') }}</Button>
        </div>
        <div class="right">
          <Select v-model="sortOrder" style="width: 150px" @on-change="onSortChange" :value="1" transfer>
            <Option v-for="item in sortData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select class="ml-10" v-model="orderType" style="width: 100px" @on-change="onSortChange" transfer>
            <Option v-for="item in orderData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div :style="controlTableHeight" class="demo-scroll-top" ref="scroll">
        <Row :gutter="8" class="device-wrap">
          <Col :lg="6" :md="8" v-for="(v, k) in tableData" :key="k" class="device-wrap-child" ref="tabData">
            <div class="device grid-content">
              <div class="left-device" @click="macClick(v)">
                <div class="device-img">
                  <span v-show="[1, 8].includes(v.equipmentType)">
                    <img v-if="v.model === 'MT-X5'" src="@/assets/images/X5-v5.png" alt="Mantunsci" />
                    <img v-if="!v.model" src="@/assets/images/Airopen-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 2">
                    <img v-if="v.others.online === 1" src="@/assets/images/ElectricalFire-Online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/ElectricalFire-Offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 3">
                    <img v-if="v.others.online === 1" src="@/assets/images/Stralsund-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/Stralsund-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="[4, 5, 31].includes(v.equipmentType)">
                    <img v-if="v.others.online === 1" src="@/assets/images/PressureLevel-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/PressureLevel-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 6">
                    <img v-if="v.others.online === 1" src="@/assets/images/Smoke-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/Smoke-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 7">
                    <img v-if="v.others.online === 1" src="@/assets/images/FlammableGas-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/FlammableGas-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 10">
                    <img v-if="v.others.online === 1" src="@/assets/images/zac-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/zac-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 18"><img src="@/assets/images/renkeShuijin.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 19"><img src="@/assets/images/zhinengmianban.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 11">
                    <img v-if="v.others.online === 1" src="@/assets/images/renke-wsd-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/renke-wsd-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 12">
                    <img v-if="v.others.online === 1" src="@/assets/images/emeter-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/emeter-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 13">
                    <img v-if="v.others.online === 1" src="@/assets/images/zac-gas-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/zac-gas-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 14">
                    <img v-if="v.others.online === 1" src="@/assets/images/renke-gzd-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/renke-gzd-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 15">
                    <img v-if="v.others.online === 1" src="@/assets/images/common-water-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/common-water-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 16">
                    <img v-if="v.others.online === 1" src="@/assets/images/chaobiaomao-water-online.png" alt="Mantunsci" />
                    <img v-else src="@/assets/images/chaobiaomao-water-offline.png" alt="Mantunsci" />
                  </span>
                  <span v-show="v.equipmentType === 21"><img src="@/assets/images/renke-air-offline.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 22"><img src="@/assets/images/WEconsG3001.png" alt="Mantunsci" /></span>
                  <!-- 报警主机以及传输装置图片 -->
                  <span v-show="v.equipmentType === 26"><img src="@/assets/images/alarmHost.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 27"><img src="@/assets/images/chuanshuzhuangzhi.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 23"><img src="@/assets/images/zhiandaSY.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 24"><img src="@/assets/images/zhiandaYW.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 25"><img src="@/assets/images/ranqi.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 28"><img src="@/assets/images/乐清水表.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 29"><img src="@/assets/images/万霖烟感.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 30"><img src="@/assets/images/拓强水表.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 32"><img src="@/assets/images/liuliangji.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 33"><img src="@/assets/images/xiaoshaji.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 38"><img src="@/assets/images/handlerAlarm.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 39"><img src="@/assets/images/wanlinTem.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 40"><img src="@/assets/images/module-4g.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 41"><img src="@/assets/images/LXSmoke.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 42"><img src="@/assets/images/HMSmoke.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 43"><img src="@/assets/images/DualPowerSupply.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 44"><img src="@/assets/images/Grounding_resistance.png" alt="Mantunsci" /></span>
                  <span v-show="v.equipmentType === 45"><img src="@/assets/images/HMGas.png" alt="Mantunsci" /></span>
                </div>
                <!-- 只有智能空开(equipmentType: 1)显示信号 -->
                <Signal v-if="v.equipmentType === 1 && v.others.online === 1" class="device-signal" :type="v.others.netPort" :value="v.others.csq" />
              </div>
              <div class="right-device device-a" style="overflow: hidden" @click="macClick(v)">
                <div>
                  <div>
                    <div class="devicr-button" v-show="v.others.online === 1">
                      <span class="success-line">{{ $t('online') }}</span>
                      <Tooltip :content="v.others.alarmInfo" placement="top" max-width="200">
                        <span class="b-warning" v-show="!!v.others.alarmInfo">{{ $t('abnormal') }}</span>
                      </Tooltip>
                    </div>
                    <div class="devicr-button" v-show="v.others.online === 0" style="display: flex">
                      <span class="dangers">{{ $t('offline') }}</span>
                      <Tooltip :content="v.others.alarmInfo" placement="top" max-width="200">
                        <span class="b-warning" v-show="!!v.others.alarmInfo">{{ $t('abnormal') }}</span>
                      </Tooltip>
                      <span class="b-warning" v-show="!v.others.alarmInfo">{{ $t('abnormal') }}</span>
                    </div>
                    <div class="devicr-button" v-show="v.others.online === -1" style="display: flex">
                      <span class="b-infos">{{ $t('disconnected') }}</span>
                      <Tooltip :content="v.others.alarmInfo" placement="top" max-width="200">
                        <span class="b-warning" v-show="!!v.others.alarmInfo">{{ $t('abnormal') }}</span>
                      </Tooltip>
                      <span class="b-warning" v-show="!v.others.alarmInfo">{{ $t('abnormal') }}</span>
                    </div>
                    <span class="devicr-button" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
                      <Tooltip :content="v.name" placement="top" max-width="200">{{ v.name }}</Tooltip>
                    </span>
                    <div class="equipment-Id devicr-button">
                      <span class="btnConnect" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: #007eff">
                        ID:
                        <Tooltip :content="v.mac" placement="top">
                          {{ v.mac }}
                        </Tooltip>
                        <Icon type="md-copy" style="color: #999999; margin-left: 10px" @click.stop="handleCopy(v.mac)" />
                      </span>
                    </div>
                    <div class="devicr-button" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; color: #999999">
                      <i class="icon-v5 icon-v5-dingwei"></i>
                      <Tooltip max-width="200" :content="v.build + v.unit + v.room" placement="top">{{ v.build + v.unit + v.room }}</Tooltip>
                    </div>
                  </div>
                  <span style="color: #999999">
                    <Icon type="ios-options-outline" class="lineIcon"></Icon>
                    {{ v.others.countAddr ? v.others.countAddr : 0 }}
                  </span>
                  <div>
                    <div v-if="v.others.alarmInfo" class="disc">
                      <div><i class="icon-v5 icon-v5-baojingjingbaoyujing iconsize"></i></div>
                      <div class="mrt">{{ v.others.alarmInfo }}</div>
                    </div>
                    <div v-else class="linheight"></div>
                  </div>
                </div>
              </div>
              <span class="devicr-button" style="margin-left: 30px; margin-top: 30px; position: absolute; right: 22px; z-index: 10">
                <Dropdown trigger="click" transfer :ref="`Dropdown-${k}`" @on-click="handleCommand($event, v)" @on-visible-change="getVisibleValue($event, v)">
                  <span style="color: #999999"><Icon size="24" type="ios-list" /></span>
                  <DropdownMenu slot="list" style="text-align: center">
                    <template v-if="[1, 2, 19].includes(v.equipmentType)">
                      <DropdownItem name="command-list">{{ $t('viewLineList') }}</DropdownItem>
                      <DropdownItem name="orientation">{{ $t('modifyDirection') }}</DropdownItem>
                    </template>
                    <DropdownItem name="inspection">{{ $t('equipmentPatrolRecord') }}</DropdownItem>
                    <template v-if="v.equipmentType === 21">
                      <DropdownItem name="refrigeration">{{ $t('turnCooling') }}</DropdownItem>
                      <DropdownItem name="heating">{{ $t('powerHeating') }}</DropdownItem>
                      <DropdownItem name="shutdown">{{ $t('Shutdown') }}</DropdownItem>
                    </template>
                    <template v-if="v.equipmentType === 22">
                      <DropdownItem name="openLight" :disabled="+v.lightNess >= 1">{{ $t('turnONLights') }}</DropdownItem>
                      <DropdownItem name="closeLight" :disabled="!v.lightNess">{{ $t('turnOffLights') }}</DropdownItem>
                    </template>
                    <template v-if="v.equipmentType === 30">
                      <DropdownItem name="meterreading">{{ $t('meterReading') }}</DropdownItem>
                      <DropdownItem name="openvalve">{{ $t('openValve') }}</DropdownItem>
                      <DropdownItem name="closevalue">{{ $t('closeValve') }}</DropdownItem>
                    </template>
                    <DropdownItem name="jheventlevel" v-if="[23, 24].includes(v.equipmentType)">{{ $t('equipmentParameterAdjustment') }}</DropdownItem>
                    <DropdownItem name="eastWater" v-if="v.equipmentType === 28">{{ $t('writeTableBase') }}</DropdownItem>
                    <template v-if="[1, 2, 19].includes(v.equipmentType)">
                      <DropdownItem name="equipment">{{ $t('equipmentParameterAdjustment') }}</DropdownItem>
                      <DropdownItem name="builtIn">{{ $t('builtInTimerConfig') }}</DropdownItem>
                      <DropdownItem v-if="v.others.enableAdvancedTiming" name="longitude">{{ $t('lnglatTimerConfig') }}</DropdownItem>
                    </template>
                    <DropdownItem name="checkwork" v-if="v.equipmentType === 27" :disabled="v.checkStatusInfo === 1">{{ $t('checkJob') }}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        <div style="display: flex; justify-content: flex-end">
          <div><Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
        </div>
      </div>
    </Col>
  </div>
</template>
<script>
  import { queryBoxes, getBuildings, getGroupTree, modifyMacRate, brightnessthirdDevice, queryCheckInfo } from '@/api/public'
  import store from '@/store'
  import { saveKeyValue, getKeyValue } from '@/api/common/index'
  import Signal from './signal/index.vue'
  export default {
    name: 'overviewList',
    components: { Signal },
    props: {
      options: { type: Object, default: () => {} },
    },
    inject: ['provideData'],
    data() {
      return {
        restoreMac: '',
        selectRestore: '1',
        bpk: null,
        mac: '',
        sortOrder: 3,
        sortData: [
          { value: 1, label: this.$t('accordingDeviceID') },
          { value: 2, label: this.$t('accordingDeviceAlias') },
          { value: 3, label: this.$t('accordingEquipmentLocation') },
        ],
        orderType: 1,
        orderData: [
          { value: 1, label: this.$t('positiveSequence') },
          { value: 2, label: this.$t('reverseOrder') },
        ],
        grid: { xl: 3, lg: 3, md: 12, sm: 24, xs: 24 },
        bandFlag: false,
        tableData: [],
        loading: false,
        flag: true,
        form: { mac: this.options.mac },
        buildings: [],
        building: '',
        units: [],
        unit: '',
        status: '',
        stats: [
          { value: '', text: this.$t('all') },
          { value: '1', text: this.$t('online') },
          { value: '0', text: this.$t('offline') },
          { value: '-1', text: this.$t('disconnected') },
        ],
        packetTypes: '',
        packetFilter: [],
        packetFilterList: [],
        controlTableHeight: {
          position: 'relative',
        },
        pageNo: 1, // 当前页码
        pageSize: 20, // 每页条数
        total: 0, // 数据总数
        packNewlist: [],
        modal: false,
        setTimer: null,
        rowAddr: '',
      }
    },
    mounted() {
      this.init()
    },
    destroyed() {
      store.commit('overviewMac', '')
      clearInterval(this.setTimer)
    },
    methods: {
      saveSortList() {
        this.saveKeyValueFunc()
        this.$nextTick(() => {
          this.queryList()
        })
      },
      onSortChange() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          return this.$Message.error({ content: this.$t('selectGroup') })
        }
        this.saveSortList()
      },
      async saveKeyValueFunc() {
        const parmas = {
          at: 'cache', // 可取值：cache 存redis；db 存数据库
          tag: 'acc', // 可取值：gbl 全局；acc 账号相关；prj 项目相关；box 设备相关
          key: 'SORT_CFG_FOR_BOX_LIST',
          value: JSON.stringify({ sortType: this.sortOrder, orderType: this.orderType }),
          ep: 0, // 根据tag而不同，当prj、box时，表示项目编号、设备号
          sec: 0, // 当at是cache时，保存到缓存的时效(秒), -1表删除，0表不设超时存储; at是db时,-1表删除;
        }
        const { message, success } = await saveKeyValue(parmas)
        if (!success) {
          this.$Message.error(message)
        }
      },
      handleCopy(val) {
        this.$Copy({ text: val })
      },

      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })
        return tree
      },
      async getGroupTrees() {
        if (!this.packetTypes) return
        const res = await getGroupTree({ groupId: this.packetTypes })
        if (res.code === '0') {
          this.packNewlist = res.data
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      init() {
        this.flag = true
        if (this.$store.state.overviewMac.mac !== undefined) {
          this.form.mac = this.$store.state.overviewMac.mac
        }
        this.getBuilding()
        this.getSortList()
      },
      async getSortList() {
        const params = { at: 'cache', tag: 'acc', key: 'SORT_CFG_FOR_BOX_LIST', ep: 0, sec: 0 }
        const { data, message, success } = await getKeyValue(params)
        if (!success) {
          this.$Message.error(message)
        } else if (data) {
          const sortValue = JSON.parse(data)
          this.sortOrder = sortValue.sortType
          this.orderType = sortValue.orderType
        }
        this.queryList()
      },
      async getBuilding() {
        let all = this.$t('all')
        let params = { projectCode: this.$store.state.projectCode, equipmentTypes: this.options.type, build: this.build }
        const res = await getBuildings(params)
        if (res.success) {
          if (params.build && params.build !== '') {
            this.units = [{ text: all, value: '' }].concat(res.data)
            this.unit = ''
          } else {
            this.buildings = [{ text: all, value: '' }].concat(res.data)
            this.units = []
            this.unit = ''
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleChange(val) {
        this.build = val
        this.pageNo = 1
        this.getBuilding()
      },
      handleUnit(val) {
        this.unit = val
        this.pageNo = 1
        this.queryList()
      },
      handleStatus(val) {
        this.pageNo = 1
        this.status = val
      },
      handleSearch() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          this.pageNo = 1
          this.queryList()
        }
      },
      // 调取取接口方法
      async queryList() {
        this.loading = true
        if (!this.$store.state.projectCode) return
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          projectCode: this.$store.state.projectCode,
          build: this.build,
          unit: this.unit,
          status: this.status,
          key: this.options.mac,
          equipmentTypes: this.options.type,
          nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter,
          sortType: this.sortOrder,
          orderType: this.orderType,
        }
        if (localStorage.getItem('dblLineObj')) {
          this.handleModifyMacRate(localStorage.getItem('dblLineObj'), false)
          localStorage.setItem('dblLineObj', '')
        }
        const res = await queryBoxes(params)
        if (res.success) {
          let tableData = res.datas
          let fliterData = res.datas.filter(item => item.equipmentType === 22)
          if (fliterData.length > 0) {
            let stRing = fliterData.map(item => item.mac).join(',')
            const resLinghtList = await brightnessthirdDevice({ mac: stRing })
            this.tableData = tableData
            this.tableData.forEach(item => {
              let findValue = resLinghtList.data.find(v => v.mac === item.mac)
              item['lightNess'] = (findValue && +findValue.value) || 0
            })
          } else {
            this.tableData = res.datas.map(item => ({ ...item, checkStatusInfo: item.equipmentType === 27 ? 2 : undefined }))
          }
          this.total = res.total
          this.$emit('returnCycleData', { list: this.tableData, total: this.total, totalPage: res.totalPage, pageNo: this.pageNo, params: params })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleInputMac(e) {
        this.$emit('sendMac', e.target.value)
      },
      handleKeyWords(event) {
        this.$emit('sendMac', event.target.value)
        this.form.mac = event.target.value
        this.pageNo = 1
        this.queryList()
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      async getVisibleValue(val, v) {
        if (val && v.equipmentType === 27) {
          const res = await queryCheckInfo({ mac: v.mac })
          if (res.success) {
            v.checkStatusInfo = res.data || ''
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      handleCommand(val, row) {
        this.$emit('handleAction', val, row)
      },
      handleReset() {
        this.form.mac = ''
        store.commit('mac', '')
        this.options.mac = ''
        this.packetTypes = ''
        this.packetFilter = []
        this.unit = ''
        this.building = ''
        this.status = ''
        this.queryList()
        this.init()
      },
      handleModifyMacRate(mac, flag) {
        if (!mac) return false
        modifyMacRate({ fastMac: flag === true ? mac : '', slowMac: flag === true ? '' : mac })
      },
      macClick(obj) {
        obj.boxName = obj.name
        store.commit('mac', obj.mac)
        store.commit('equipmentType', obj.equipmentType)
        store.commit('maintenanceObj', obj)
        this.$emit('lookDetail', obj)
      },
      // 切换每页条数的事件
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList()
      },
      // 页面改变发生的事件
      handleCurrentChange(val) {
        this.pageNo = val
        this.queryList()
      },
    },
  }
</script>

<style lang="less">
  .restore-button {
    color: #f24e4c !important;
  }
  .tip-style {
    margin-left: 5px;
    font-size: 18px;
  }
  .p-margin {
    margin: 10px;
  }

  .mar-t-10 {
    margin-top: 30px;
  }
  .tool-style {
    background: #414959;
    padding: 10px 5px;
    border-radius: 5px;
  }
  .dis-inline {
    display: inline-block;
    margin-left: -5px;
  }
  .baseconfiguration {
    .ivu-modal-footer {
      border-top: transparent;
      padding: 0px 18px 12px 0px;
      text-align: right;
    }
    .ivu-input-number-handler-wrap {
      display: none;
    }
    .ivu-input-number {
      width: 100%;
    }
    .baseSure {
      border: 1px solid #02a7f0;
      border-radius: 5px;
      color: #02a7f0;
      background: rgba(2, 167, 240, 0.1);
      padding: 2px 20px;
    }
    .baseCancle {
      border: 1px solid #aaaaaa;
      border-radius: 5px;
      color: #aaaaaa;
      background: rgba(170, 170, 170, 0.1);
      padding: 2px 20px;
    }
  }
  .jhconfiguration {
    .ivu-input-suffix {
      margin-right: 10px;
    }
    input,
    .ivu-input-wrapper {
      width: 150px;
    }
    .ivu-modal-footer {
      border-color: transparent;
    }
  }
  #overlist {
    /deep/.ivu-table-body {
      max-height: 600px;
      overflow: auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
    }
    .device-search-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #1a202e;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding: 10px;
      .left {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
      }
      .right {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
      }
      .search-item {
        width: 150px;
        margin-left: 5px;
      }
    }

    .ds-center {
      display: flex;
      justify-content: center;
    }
    .disc {
      display: flex;
      color: #d81e06;
      height: 48px;
      white-space: wrap;
      margin-top: -5px;
      margin-left: -2px;
      overflow: hidden;
    }
    .mrt {
      margin-top: 5px;
    }
    .iconsize {
      font-size: 20px;
    }
    .linheight {
      line-height: 14px;
      height: 42px;
    }
    .demo-scroll-top {
      height: 30%;
    }
    .allLine {
      border: 1px solid #414959;
      text-align: center;
      border-radius: 5px;
      height: 28px;
      padding: 5px 30px;
      color: #999999;
    }
    .line {
      text-align: center;
      border: 1px solid #414959;
      width: 100%;
      border-radius: 5px;
      padding: 2px 8px;
      color: #999999;
      flex: 1;
    }
    .grid-content {
      background-color: #1a202e;
      margin-top: 10px;
      border-radius: 5px;
      display: flex;
    }
    /deep/.ivu-table {
      // padding:0 10px;
    }
    .grid-content:hover {
      background-color: #21293c;
    }
    .dangers {
      background: rgba(255, 79, 79, 0.15) !important;
      color: #f56c6c !important;
      height: 22px;
      padding: 1px 6px;
    }
    .success-line {
      color: #21f27f !important;
      background: rgba(0, 186, 138, 0.15);
      height: 22px;
      padding: 3px 6px;
    }
    .b-infos {
      color: #909399;
      background: rgba(144, 147, 153, 0.15);
      height: 22px;
      padding: 1px 6px;
    }
    .b-warning {
      padding: 1px 6px;
    }
    .device-wrap {
      display: flex;
      flex-wrap: wrap;
    }

    .devicr-button {
      padding: 1px;
    }
    .left-device {
      flex: 1;
      padding: 25px 0 25px 25px;
      position: relative;
      .device-signal {
        position: absolute;
        right: 10px;
        top: 30px;
      }
    }
    .right-device {
      flex: 2;
      padding: 30px 20px 30px 0;
    }
    .ivu-icon {
      margin-left: 0px;
    }
    .device-container {
      padding: 5px;
      -webkit-border-bottom-left-radius: '5px';
      -webkit-border-bottom-right-radius: '5px';
      -moz-border-bottom-left-radius: '5px';
      -moz-border-bottom-right-radius: '5px';
      border-bottom-left-radius: '5px';
      border-bottom-right-radius: '5px';
      a {
        display: 'table';
        width: '100%';

        table-layout: 'fixed';
        word-wrap: 'break-word';
        overflow: 'hidden';
        text-decoration: 'none';
      }
    }
    .split-line {
      display: flex;
    }
    .device-a {
      display: flex;
    }
    .grays {
      //color: #1a202e;
      background: #1a202e;
    }
    .reds {
      background: rgba(242, 78, 76, 0.1);
      color: #f24e4c;
      border: 1px solid #f24e4c;
    }
    .greens {
      color: #21f27f;
      border: 1px solid #21f27f;
      background: rgba(33, 242, 127, 0.1);
    }
    .ivu-table-small td {
      height: 40px !important;
    }
    /deep/table {
      width: 100% !important;
    }
    .verticallyCentered {
      display: inline-block;
      vertical-align: middle;
    }
    .equipment-Id {
      color: #007acc;
    }
    .date-picker {
      position: absolute;
      top: -4px !important;
      z-index: 999;
      .circle {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        padding: 3px;
        margin-right: 10px;
      }
      span {
        margin-right: 5px;
      }
    }
    // /deep/ .date-picker{
    //   right: 90px!important;
    //   top: 0px!important;
    // }
    .device-img {
      display: flex;
      vertical-align: 'middle';
      text-align: 'center';
      img {
        display: 'inline-block';
        margin-top: 25px;
      }
    }
    .outline-icon {
      transform: rotateZ(90deg);
    }
    .device-desc {
      margin-top: 20px;
    }
    .editProjectsList {
      z-index: 900 !important;
    }
    .editProjectsList_body .ivu-modal-mask {
      z-index: 900 !important;
    }
    /deep/.ivu-modal-footer {
      border: none;
    }
    .ivu-dropdown-item:hover {
      background: #007eff;
    }
    /deep/.ivu-tooltip-inner {
      width: 200px;
      min-width: 200px !important;
    }
    @media only screen and (max-width: 1310px) {
      .device-wrap-child {
        min-width: 33%;
      }
    }
    @media only screen and (min-width: 1920px) {
      .device-wrap-child {
        min-width: 25%;
      }
    }
  }
</style>
