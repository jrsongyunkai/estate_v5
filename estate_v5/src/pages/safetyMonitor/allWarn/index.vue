<template>
  <div class="allWarn">
    <template v-if="!showDetail">
      <div class="head content">
        <div class="head-left">
          <div class="type">
            <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
              <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
            </Select>
          </div>
          <div class="type">
            <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" style="width: 200px" />
          </div>
        </div>
        <div class="head-right">
          <div class="dateBnt">
            <span style="min-width: 40px">{{ $t('date') + ':' }}</span>
            <RadioGroup v-model="dateRadio" style="display: flex">
              <Radio :label="$t('day')"></Radio>
              <Radio :label="$t('month')"></Radio>
            </RadioGroup>
          </div>
          <div class="date">
            <Row>
              <Col span="12" class="blockLall">
                <DatePicker v-if="dateRadio === $t('day')" format="yyyy-MM-dd" type="date" v-model="dayDate" style="width: 200px" :editable="false" :clearable="false"></DatePicker>
                <!-- 月历 -->
                <DatePicker type="month" format="yyyy-MM" style="width: 200px" v-model="monthDate" v-if="dateRadio === $t('month')" :editable="false" :clearable="false"></DatePicker>
              </Col>
            </Row>
          </div>
          <div class="search-device">
            <Input v-model="device" :placeholder="$t('enterDeviceNo')" style="width: 200px" />
            <Button type="primary" @click="handleonSubmit">{{ $t('query') }}</Button>
            <Button @click="reset" class="but">{{ $t('reset') }}</Button>
            <div class="export">
              <Tooltip :content="$t('export')">
                <Icon custom="icon-v5 icon-v5-daochu2" size="20" style="margin-left: 10px" @click="handleExport" />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="allWarn-tabs">
        <Tabs value="name1" class="content table" v-model="activeName" @on-click="changeTabs">
          <!-- 用电报警 -->
          <template>
            <TabPane :label="$t('electricityAlarm')" name="first">
              <bar-chart :options="alarmOption"></bar-chart>
            </TabPane>
          </template>
          <!-- 用电预警 -->
          <template>
            <TabPane :label="$t('powerWarning')" name="second">
              <bar-chart :options="warnOption"></bar-chart>
            </TabPane>
          </template>
        </Tabs>
        <div class="table content">
          <Table height="320" :columns="columns" :data="tableData">
            <template slot-scope="{ row }" slot="mac">
              <span class="pointer" style="color: #007eff" @click="handle(row)">{{ row.mac }}</span>
            </template>
            <template slot-scope="{ row }" slot="progress">
              <template v-if="row.progress < 50">
                <Progress stroke-color="#87d068" :percent="row.progress" :stroke-width="5" :hide-info="true"></Progress>
              </template>
              <template v-if="row.progress > 50">
                <Progress stroke-color="#FF4F4F" :stroke-width="5" :percent="row.progress" :hide-info="true"></Progress>
              </template>
            </template>
            <template slot-scope="{ row }" slot="action">
              <span class="pointer c-primary" style="margin-right: 5px" @click="handleUrge(row.id)" v-if="row.processStatus === 0">{{ $t('urge') }}</span>
              <template v-if="row.processStatus === 0">
                <span class="pointer b-danger" @click="handleMaintenance(row)">{{ $t('notProcessed') }}</span>
              </template>
              <template v-if="row.processStatus === 1">
                <span class="pointer b-yelo" @click="handleMaintenance(row)">{{ $t('processing') }}</span>
              </template>
              <template v-if="row.processStatus === 2">
                <span class="pointer b-success" @click="handleMaintenance(row)">{{ $t('processed') }}</span>
              </template>
            </template>
          </Table>
          <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator show-total @on-change="changePage" @on-page-size-change="changesize" />
          <!-- 维保编辑 -->
        </div>
        <Modal v-model="dialogVisible" :title="$t('maintenanceEdit')" @on-cancel="closeMaintenance" id="modal">
          <maintenance-editor v-if="dialogVisible" :maintenanceObj="maintenanceObj" @close-maintenance="closeMaintenance" />
          <div slot="footer"></div>
        </Modal>
      </div>
    </template>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import '@/styles/pages/allWarn.less'
  import store from '@/store/index'
  import BarChart from '@/pages/Common/Bars'
  import echarts from 'echarts'
  import MaintenanceEditor from './MaintenanceEditor.vue'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  import { getGroupType, getGroupTree } from '@/api/public'
  import { getDetailOfTypeStats, getDetailOfProject, getfindMaintenance, alarmUrgePush } from '@/api/safetyMonitor/allWarn'
  import dayjs from 'dayjs'
  export default {
    name: 'safetyMonitor-allWarn',
    components: {
      BarChart,
      MaintenanceEditor,
      detailView,
    },
    mixins: [deviceDetails],
    data() {
      return {
        dialogVisible: false,
        dateRadio: this.$t('day'),
        activeName: 'first',
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        newArr: [],
        isDay: true,
        days: '',
        mouths: '',
        device: '',
        typeList: '',
        currentPage: 1,
        total: 0,
        page: 1,
        pageSize: 10,
        rows: 10,
        dayDate: dayjs(new Date()).format('YYYY-MM-DD'),
        monthDate: dayjs(new Date()).format('YYYY-MM'),
        typeNumbers: -100,
        projectCode: '',
        alarmOption: { legendStatus: false, xAxis: [], series: [], title: { show: true, text: this.$t('alarmStatistics') }, tooltip: { show: true, trigger: '', formatter: '' } },
        warnOption: {
          legendStatus: false,
          xAxis: [],
          series: [],
          title: { show: true, text: this.$t('warningStatistics') },
          tooltip: { show: true, trigger: '', formatter: '' },
        },
        nodeId: '',
        tableData: [],
        columns: [
          { title: this.$t('deviceAliases'), key: 'boxName', align: 'left' },
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'left' },
          { title: this.$t('eventId'), key: 'id', align: 'left' },
          { title: this.$t('place'), key: 'address', align: 'left' },
          { title: this.$t('line'), key: 'channel', align: 'left' },
          { title: this.$t('alarmType'), key: 'info', align: 'left' },
          { title: this.$t('alarmTime'), key: 'create_time', align: 'left' },
          { title: this.$t('progress'), slot: 'progress', align: 'left', width: 150 },
          { title: this.$t('state'), key: 'passTime', align: 'left' },
          { title: this.$t('operation'), slot: 'action', width: 150, align: 'left' },
        ],
        maintenanceBoxObj: {},
        maintenanceObj: '',
        detailsValue: '',
      }
    },
    computed: {
      date() {
        let newDate = this.dateRadio === this.$t('day') ? dayjs(this.dayDate).format('YYYY-MM-DD') : dayjs(this.monthDate).format('YYYY-MM')
        return newDate
      },
      dateType() {
        return this.dateRadio === this.$t('day') ? 1 : 2
      },
    },
    methods: {
      // 初始化事件
      init() {
        this.handleProject()
        this.getGroupTypes()
        this.handleTypeStats()
      },
      reset() {
        this.value = ''
        this.treevalue = ''
        this.mouths = ''
        this.days = ''
        this.device = ''
        this.packetTypes = ''
        this.dateRadio = this.$t('day')
        this.packetFilter = []
        this.$emit('reset')
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        getGroupType(params).then(res => {
          if (res.success) {
            this.packetList = res && res.data
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes }).then(res => {
          if (res.code === '0') {
            this.packNewlist = res.data
            let resData = this.getTree(res.data)
            this.packetFilterList = this.cloneTree(resData)
          }
        })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })
        return tree
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
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      getListid(val) {
        val.map(itm => {
          this.packNewlist.map(item => {
            if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
              this.newArr.push(item.id)
            }
            return this.newArr
          })
        })
        this.packetFilter = this.unique(this.newArr)
      },
      unique(arr) {
        return Array.from(new Set(arr))
      },
      // 获取到echarts数据
      handleTypeStats() {
        var params = {
          dateType: this.dateType,
          date: this.date,
          typeNumbers: this.activeName === 'first' ? -100 : -200,
          projectCode: this.$store.state.projectCode,
          mac: this.device,
          nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter,
        }
        getDetailOfTypeStats(params).then(r => {
          this.flag = true
          if (r.success) {
            let that = this
            this.alarmOption.xAxis = []
            this.alarmOption.series = []
            this.warnOption.xAxis = []
            this.warnOption.series = []
            let bardata = { value: [], legend: [], typeNos: [] }
            let _bardata = { value: [], legend: [], typeNos: [] }
            r.data.forEach(function (item, index) {
              if ([1, 2, 3, 4, 5, 6, 7, 8, 11, 17, 18, 19, 1007, 1008, 1009, 1016].indexOf(item.typeNumber) !== -1) {
                if (item.typeNumber === 4 || item.typeNumber === 1008) {
                  bardata.typeNos.forEach(function (v, i) {
                    if (v === 3) {
                      bardata.value[i] += item.number
                      that.alarmOption.xAxis[i] = that.$t('overloadOverCurrent')
                    }
                  })
                } else if (item.typeNumber === 18 || item.typeNumber === 19) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 17) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('threePhaseAlarm')
                    }
                  })
                } else if (item.typeNumber === 1007) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 5) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('overVoltageAlarm')
                    }
                  })
                } else if (item.typeNumber === 1009) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 7) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('temperatureAlarm')
                    }
                  })
                } else {
                  if (item.typeNumber === 1) {
                    item.info = that.$t('shortCircuitAlarm')
                  } else if (item.typeNumber === 2) {
                    item.info = that.$t('leakageMonitoringAlarm')
                  } else if (item.typeNumber === 4) {
                    item.info = that.$t('overCurrentAlarm')
                  } else if (item.typeNumber === 5) {
                    item.info = that.$t('overVoltageAlarm')
                  } else if (item.typeNumber === 6) {
                    item.info = that.$t('underVoltageAlarm')
                  } else if (item.typeNumber === 8) {
                    item.info = that.$t('surgeAlarm')
                  } else if (item.typeNumber === 11) {
                    item.info = that.$t('arcAlarm')
                  } else if (item.typeNumber === 1016) {
                    item.info = that.$t('leakageProtectionAlarm')
                  }
                  bardata.value.push(item.number)
                  bardata.typeNos.push(item.typeNumber)
                  that.alarmOption.xAxis.push(item.info)
                }
              } else {
                if (item.typeNumber === 9) {
                  item.info = that.$t('leakageProtectionNormal')
                } else if (item.typeNumber === 10) {
                  item.info = that.$t('leakageProtectionSelfTestNotCompleted')
                } else if (item.typeNumber === 12) {
                  item.info = that.$t('leakageMonitoringWarning')
                } else if (item.typeNumber === 13) {
                  item.info = that.$t('currentWarning')
                } else if (item.typeNumber === 14) {
                  item.info = that.$t('overVoltageWarning')
                } else if (item.typeNumber === 15) {
                  item.info = that.$t('underVoltageWarning')
                } else if (item.typeNumber === 16) {
                  item.info = that.$t('communicationWarning')
                }
                if (item.typeNumber !== 1001) {
                  _bardata.value.push(item.number)
                  _bardata.typeNos.push(item.typeNumber)
                  that.warnOption.xAxis.push(item.info)
                }
              }
            })
            this.alarmOption.series.push({
              type: 'bar',
              barMaxWidth: '15',
              data: bardata.value,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 1, color: '#ca3939' }, // 红
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' }, // 黑
                  ]),
                  label: { show: false, position: 'top', textStyle: { color: '#fff' } },
                },
              },
            })
            if (this.$func.isSameArray(bardata.value)) {
              this.alarmOption.series[0].markPoint = {
                data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                normal: { show: true },
              }
            } else {
              this.alarmOption.series[0].markPoint = {
                data: [
                  { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                  { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                ],
                label: { normal: { show: true } },
              }
            }
            this.warnOption.series.push({
              type: 'bar',
              barMaxWidth: '15',
              data: _bardata.value,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 1, color: '#ca3939' }, // 红
                    { offset: 0, color: '#1f212e' }, // 黑
                  ]),
                  label: { show: false, position: 'top', textStyle: { color: '#fff' } },
                },
              },
            })
            if (this.$func.isSameArray(_bardata.value)) {
              this.warnOption.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],
                    label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' },
                  },
                ],
                normal: { show: true },
              }
            } else {
              this.warnOption.series[0].markPoint = {
                data: [
                  { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                  { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                ],
                label: { normal: { show: true } },
              }
            }
            this.flag = true
          } else if (r.code === '-1') {
          } else {
            this.$Message.error({ content: r.message })
          }
        })
      },
      // 获取到列表数据
      async handleProject() {
        var params = {
          page: this.page,
          rows: this.pageSize,
          dateType: this.dateType,
          date: this.date,
          typeNumbers: this.activeName === 'first' ? -100 : -200,
          projectCode: this.$store.state.projectCode,
          mac: this.device,
          nodeIds: this.packetFilter ? this.packetFilter.join() : this.packetFilter,
        }
        const r = await getDetailOfProject(params)
        if (r.success) {
          this.tableData = r.datas
          this.$set(this.tableData)
          this.total = r.total
          this.currentPage = this.page
        } else {
          this.$Message.error({ content: r.message })
        }
      },
      // 搜索设备
      handleonSubmit() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          this.init()
        }
      },
      changeTabs(e) {
        this.activeName = e
        this.init()
      },
      changePage(val) {
        this.page = val
        this.init()
      },
      changesize(val) {
        this.pageSize = val
        this.init()
      },
      // 催促
      handleUrge(id) {
        alarmUrgePush({ id: id }).then(res => {
          if (res.code === '0') {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      // 维保编辑
      async handleMaintenance(obj) {
        let params = { mac: obj.mac, alarmId: obj.id, id: '' }
        const res = await getfindMaintenance(params)
        if (res.success) {
          store.commit('maintenanceObj', res.data)
          store.commit('alarmId', obj.id)
          this.maintenanceObj = obj
          this.dialogVisible = true
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleExport() {
        this.$func.windowCountDown(
          '/project/main/v2/xls/alarmDetailOfProject.as?' + 'typeNumbers=' + this.typeNumbers + '&dateType=' + this.dateType + '&date=' + this.date + '&projectCode=' + this.$store.state.projectCode + '&oqp1=' + this.$store.state.projectName + '&mac=' + this.device + '&nodeIds=' + this.packetFilter
        )
      },
      // 维保编辑取消
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        this.init()
      },
    },
    created() {},
    mounted() {
      this.init()
      if (this.$store.state.classify) {
        this.activeName = this.$store.state.classify === -100 ? 'first' : 'second'
        this.handleProject()
        store.commit('classify', '')
      }
    },
  }
</script>
<style lang="less" scoped>
  .allWarn {
    .c-success {
      color: #67c23a;
    }
    .c-danger {
      color: #f56c6c;
    }
    .pointer {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .head {
      width: 100%;
      padding: 10px 0px;
      display: flex;
      margin-bottom: 10px;
      margin-top: 60px;
      .head-left {
        display: flex;
        align-items: center;
        .type {
          margin: 0px 10px;
          span {
            margin: 0px 8px;
          }
        }
      }
      .head-right {
        display: flex;
        align-items: center;
        margin-left: 60px;
        .dateBnt {
          display: flex;
          align-items: center;
          span {
            margin-right: 10px;
          }
        }
        .date {
          display: flex;
          span {
            margin: 7px 8px;
          }
        }
        .search-device {
          display: flex;
          align-items: center;
          margin-left: 10px;
          Button {
            margin-left: 10px;
          }
        }
      }
    }
    .allWarn-tabs {
      width: 100%;
      // background: #151518;

      margin-top: 10px;
      #main1,
      #main2 {
        width: 100%;
        height: 500px;
      }
      .state {
        color: #67c23a;
      }
    }
    .table {
      margin-top: 10px;
      padding: 20px;
    }
  }
  .export {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    .ivu-icon {
      color: #007eff;
      margin: 0 !important;
    }
  }
  /deep/.ivu-progress-inner {
    background-color: #454a56;
  }
  /deep/.ivu-table-cell {
    white-space: nowrap;
  }
  /deep/.ivu-modal-footer {
    border: none;
  }
</style>
