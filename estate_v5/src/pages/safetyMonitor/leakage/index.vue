<template>
  <div class="leakage">
    <template v-if="!showDetail">
      <div class="head content">
        <div class="head-left">
          <div class="type">
            <Select :clearable="true" transfer v-model="packetTypes" :placeholder="$t('selectGroupingType')" class="en-unit" style="width: 200px" @on-change="handleTypes">
              <Option v-for="item in packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
            </Select>
          </div>
          <div class="type">
            <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox style="width: 200px" v-model="packetFilter" @on-change="handleFilter" transfer :data="packetFilterList" />
          </div>
        </div>
        <div class="head-right">
          <div class="dateBnt">
            <span style="min-width: 40px">{{ $t('date') + ':' }}</span>
            <RadioGroup v-model="dateRadio" @on-change="handleDatePicker" style="display: flex">
              <Radio :label="$t('day')"></Radio>
              <Radio :label="$t('month')"></Radio>
            </RadioGroup>
          </div>
          <div class="date">
            <Row>
              <Col span="12" class="blockLleakage">
                <DatePicker v-show="isDay" type="date" :value="days" style="width: 200px" @on-change="changeDM" :editable="false" :clearable="false"></DatePicker>
                <!-- 月历 -->
                <DatePicker v-model="month" type="month" :value="mouths" style="width: 200px" v-show="!isDay" @on-change="changeDM" :editable="false" :clearable="false"></DatePicker>
              </Col>
            </Row>
          </div>
          <div class="search-device">
            <Input v-model="device" :placeholder="$t('enterDeviceNo')" style="width: 200px" />
            <Button type="primary" @click="handleonSubmit">{{ $t('query') }}</Button>
            <Button @click="reset" class="but">{{ $t('reset') }}</Button>
          </div>
        </div>
      </div>
      <div class="leakage-content">
        <div class="mymain content table">
          <div class="typeC">
            <span>
              <div class="active active1"></div>
              <h6>{{ $t('safety') }}</h6>
            </span>
            <span>
              <div class="active active2"></div>
              <h6>{{ $t('earlyWarning') }}</h6>
            </span>
            <span>
              <div class="active active3"></div>
              <h6>{{ $t('alarm') }}</h6>
            </span>
          </div>
          <bar-chart :options="leakageOption"></bar-chart>
        </div>
        <div class="table content">
          <Table height="320" :columns="columns" :data="tableData">
            <template slot-scope="{ row }" slot="mac">
              <span class="pointer c-primary" @click="handle(row)">{{ row.mac }}</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Tooltip :content="$t('lineDetail')" placement="top">
                <span size="30" class="c-primary pointer" style="margin-right: 10px" custom="icon-v5 icon-v5-xianlu" @click="lineLeakageDetail(row.address, row.mac)">{{ $t('lineDetail') }}</span>
              </Tooltip>
              <Tooltip :content="$t('historyTrend')" placement="top">
                <span size="30" class="c-primary pointer" custom="icon-v5 icon-v5-qushi" @click="leakageTrend(row.address, row.mac)">{{ $t('historyTrend') }}</span>
              </Tooltip>
            </template>
          </Table>
          <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator show-total @on-change="changePage" @on-page-size-change="changesize" />
        </div>
        <!-- 线路明细 -->
        <Modal :title="addr" width="30%" id="lines" v-model="dialogTableVisible">
          <Table :data="lineDetail" :columns="trendlines"></Table>
          <div slot="footer"></div>
        </Modal>
        <Modal :title="addr" id="lines" v-model="trendDialog">
          <Row class="pickDate" style="display: flex; align-items: center">
            <div class="dateBnt2">
              <span>{{ $t('date') + ':' }}</span>
              <RadioGroup v-model="dateRadio2" @on-change="handleTrendPicker">
                <Radio :label="$t('day')"></Radio>
                <Radio :label="$t('month')"></Radio>
              </RadioGroup>
            </div>
            <div class="block" v-show="trendPicker === $t('day')">
              <DatePicker v-model="trendValue" type="date" :editable="false" :clearable="false" value-format="yyyy-MM-dd" @on-change="handleTrendDayPicker"></DatePicker>
            </div>
            <div class="block" v-show="trendPicker === $t('month')">
              <DatePicker v-model="trendMonth" value-format="yyyy-MM" type="month" :editable="false" :clearable="false" @on-change="handleTrendMonthPicker"></DatePicker>
            </div>
          </Row>
          <div class="typeC" v-if="trendFlag">
            <span>
              <div class="active active1"></div>
              <h6>{{ $t('safety') }}</h6>
            </span>
            <span>
              <div class="active active2"></div>
              <h6>{{ $t('earlyWarning') }}</h6>
            </span>
            <span>
              <div class="active active3"></div>
              <h6>{{ $t('alarm') }}</h6>
            </span>
          </div>
          <bar-chart v-if="trendFlag" :options="trendOptions"></bar-chart>

          <Table height="300" :data="trendData" :columns="trendHistory"></Table>
          <div slot="footer"></div>
        </Modal>
      </div>
    </template>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import BarChart from '@/pages/Common/Bars'
  import '@/styles/pages/leakage.less'
  import { getGroupType, getGroupTree } from '@/api/public'
  import { getCurrentRealtime, getCurrentStats, queryChannels, leakageStats } from '@/api/safetyMonitor/leakage'
  import echarts from 'echarts'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-leakage',
    components: {
      BarChart,
      detailView,
    },
    mixins: [deviceDetails],
    data() {
      return {
        dialogVisible: false,
        dateRadio: this.$t('day'),
        dateRadio2: this.$t('day'),
        activeName: 'first',
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        days: '',
        mouths: '',
        isDay: true,
        month: this.$Date().format('YYYY-MM'),
        device: '',
        typeList: '',
        currentPage: 1,
        total: 0,
        page: 1,
        pageSize: 10,
        rows: 10,
        dateType: 1,
        date: this.$Date().format('YYYY-MM-DD'),
        trendValue: this.$func.getNowFormatDate(),
        trendMonth: this.$func.getCurrentYearMonth(),
        typeNumbers: -100,
        projectCode: '',
        leakageOption: {
          legendStatus: false,
          xAxis: [],
          series: [],
          title: { show: true, text: this.$t('leakageSituation') },
          nameY: this.$t('milliampereWithUnit'),
          tooltip: { show: true, trigger: '', formatter: '' },
        },
        trendOptions: {
          legendStatus: false,
          xAxis: [],
          series: [],
          title: { show: true, text: this.$t('leakageSituation') },
          nameY: this.$t('milliampereWithUnit'),
          nameX: this.$t('hour'),
          tooltip: { show: true, trigger: '', formatter: '' },
        },
        nodeId: '',
        tableData: [],
        columns: [
          { title: this.$t('deviceAliases'), key: 'boxName', align: 'left' },
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'left' },
          { title: this.$t('place'), key: 'address', align: 'left' },
          { title: this.$t('leakageCurrentMill'), key: 'number', align: 'left' },
          { title: this.$t('operation'), slot: 'action', width: 200, align: 'left' },
        ],
        trendlines: [
          { title: this.$t('lineName'), key: 'title', align: 'left' },
          { title: this.$t('leakageCurrentMill'), key: 'gLd', align: 'left' },
        ],
        trendHistory: [
          { title: this.$t('time'), key: 'time', align: 'left' },
          { title: this.$t('leakageCurrentMill'), key: 'number', align: 'left' },
        ],
        addr: '',
        lineDetail: [],
        trendData: [],
        dialogTableVisible: false,
        trendDateType: 1,
        trendDate: '',
        trendFlag: false,
        trendDialog: false,
        trendPicker: this.$t('day'),
        trendLoading: false,
        detailsValue: '',
        newArr: [],
      }
    },
    methods: {
      // 初始化事件
      init() {
        this.days = this.$Date().format('YYYY-MM-DD')
        this.mouths = this.$Date().format('YYYY-MM')
        this.handleLeakageStats()
        this.handleRealtime()
      },
      reset() {
        this.packetTypes = ''
        this.packetFilterList = []
        this.days = ''
        this.mouths = ''
        this.device = ''
        this.dateRadio = this.$t('day')
        this.$emit('reset')
      },
      // 分组类型
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupTrees() {
        const res = await getGroupTree({ groupId: this.packetTypes })
        if (res.code === '0') {
          this.packNewlist = res.data
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        } else {
          this.$Message.error({ content: res.message })
        }
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
      handleFilter(val) {
        this.pageNo = 1
        this.getListid(val)
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
      // 改变时间类型
      handleDatePicker(dateType) {
        if (dateType === this.$t('day')) {
          this.isDay = true
          this.dateType = 1
          this.leakageOption.title.text = this.$t('leakageSituation')
        } else {
          this.isDay = false
          this.dateType = 2
          this.leakageOption.title.text = this.$func.getMonthText(this.month) + this.$t('leakageSituation')
        }
        this.init()
      },
      // 获取到echarts数据
      handleLeakageStats() {
        this.leakageOption.xAxis = []
        this.leakageOption.series = []
        this.$nextTick(function () {
          var that = this
          var params = {
            dateType: this.dateType,
            date: this.date,
            projectCode: this.$store.state.projectCode,
            mac: this.device,
            nodeId: this.nodeId,
          }
          getCurrentStats(params).then(r => {
            let barValue = []
            if (r.success) {
              let barData = []
              r.data.forEach(function (item, index) {
                barData.push({
                  value: item.number,
                  name: that.$t('leakageCurrentValue'),
                  type: 'bar',
                  itemStyle: { color: '' },
                })
                that.leakageOption.xAxis.push(item.time)
                if (item.number < 300 || item.number === '-') {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#87cf86' },
                  ])
                } else if (item.number >= 300 && item.number < 1500) {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#E79C27' },
                  ])
                } else {
                  barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                    { offset: 1, color: '#F26665' },
                  ])
                }
                barValue.push(item.number)
              })
              that.leakageOption.series.push({ type: 'bar', barMaxWidth: '15', data: barData })
              if (this.$func.isSameArray(barValue)) {
                this.leakageOption.series[0].markPoint = {
                  data: [{ type: 'max', symbol: this.$func.echartsSymbolOverlap, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#007eff' } }],
                  normal: { show: true },
                }
              } else {
                this.leakageOption.series[0].markPoint = {
                  data: [
                    { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
                    { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
                  ],
                  label: { normal: { show: true } },
                }
              }
            } else if (r.code === '-1') {
            } else {
              this.$Message.error({ content: r.message })
            }
          })
        })
      },
      // 获取到列表数据
      async handleRealtime() {
        var params = {
          page: this.page,
          rows: this.pageSize,
          dateType: this.dateType,
          date: this.date,
          projectCode: this.$store.state.projectCode,
          mac: this.device,
          nodeIds: this.nodeId,
        }
        const r = await getCurrentRealtime(params)
        if (r.success) {
          this.tableData = r.datas
          this.total = r.total
          this.currentPage = this.page
        } else if (r.code === '-1') {
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
      changeDM(dates) {
        // 改变日期
        // 直接把所需要的日期和日期类型传过去
        if (this.isDay) {
          // 日
          this.date = dates
        } else {
          // 月
          this.date = dates
          this.leakageOption.title.text = this.$func.getMonthText(dates) + this.$t('leakageSituation')
        }
        this.init()
      },
      // 获取进退页面数
      changePage(val) {
        this.page = val
        this.init()
      },
      // 获取点击页面数
      changesize(val) {
        this.pageSize = val
        this.init()
      },
      // 线路详细
      async queryChannels(addr, mac) {
        let params = { mac: mac }
        const res = await queryChannels(params)
        if (res.success) {
          this.lineDetail = res.datas
          this.addr = this.$t('leakageCurrentDetail', { addr })
          this.dialogTableVisible = true
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      lineLeakageDetail(addr, mac) {
        this.queryChannels(addr, mac)
      },
      // 历史趋势
      leakageTrend(addr, mac) {
        this.mac = mac
        this.trendDialog = true
        this.addr = this.$t('leakageCurrentTrend', { addr })
        this.initTrend()
      },
      initTrend() {
        let that = this
        this.$nextTick(function () {
          this.trendLoading = true
          let params = { page: 1, limit: 31, dateType: this.trendDateType, date: this.trendDate ? this.trendDate : this.$func.getNowFormatDate(), projectCode: this.$store.state.projectCode, mac: this.mac }
          leakageStats(params)
            .then(res => {
              this.trendOptions.xAxis = []
              this.trendOptions.series = []
              if (res.success) {
                let barData = []
                this.trendData = res.data
                res.data.forEach((item, index) => {
                  barData.push({ value: item.number, name: this.$t('leakageCurrentValue'), type: 'bar', barMaxWidth: '30', itemStyle: { color: '' } })
                  that.trendOptions.xAxis.push(item.time)
                  if (item.number < 300 || item.number === '-') {
                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                      { offset: 1, color: '#87cf86' },
                    ])
                  } else if (item.number >= 300 && item.number < 1500) {
                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                      { offset: 1, color: '#E79C27' },
                    ])
                  } else {
                    barData[index].itemStyle.color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      { offset: 0, color: 'rgba(26, 32, 46,.2)' },
                      { offset: 1, color: '#F26665' },
                    ])
                  }
                })
                this.trendOptions.series.push({ type: 'bar', data: barData, itemStyle: { normal: { color: {} } } })

                this.trendFlag = true
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({ content: res.message })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({ content: this.$t('unknown') })
              }
            })
            .finally(() => {
              this.trendLoading = false
            })
        })
      },
      handleCloseTrend() {
        this.trendPicker = this.$t('day')
        this.trendValue = this.$func.getNowFormatDate()
        this.trendMonth = this.$func.getCurrentYearMonth()
      },
      handleTrendDayPicker(val) {
        this.trendDateType = 1
        this.trendDate = val
        this.trendValue = val
        this.trendOptions.title.text = this.$t('leakageSituation')
        this.initTrend()
      },
      handleTrendMonthPicker(val) {
        this.trendDateType = 2
        this.trendDate = val
        this.trendMonth = val
        this.trendOptions.title.text = this.$func.getMonthText(val) + this.$t('leakageSituation')
        this.initTrend()
      },
      // 历史趋势中的切换日月
      handleTrendPicker(val) {
        if (val === this.$t('day')) {
          this.trendDateType = 1
          this.trendDate = this.trendValue
          this.trendOptions.nameY = this.$t('milliampereWithUnit')
          this.trendOptions.nameX = this.$t('hour')
        } else {
          this.trendDateType = 2
          this.trendDate = this.trendMonth
          this.trendOptions.nameY = this.$t('milliampereWithUnit')
          this.trendOptions.nameX = this.$t('day')
          this.trendOptions.title.text = this.$func.getMonthText(this.trendMonth) + this.$t('leakageSituation')
        }
        this.trendPicker = val
        this.initTrend()
      },
    },
    created() {},
    mounted() {
      this.getGroupTypes()
      this.init()
    },
  }
</script>
<style lang="less" scoped>
  .table {
    margin-top: 10px;
    padding: 20px 20px 10px 20px;
  }
  .leakage {
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
          margin: 0 10px;
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
    .leakage-content {
      #main1 {
        width: 100%;
        height: 500px;
      }
      .mymain {
        .typeC {
          display: flex;
          justify-content: flex-end;
          margin-right: 20px;
          position: absolute;
          right: 0;
          span {
            display: flex;
            align-items: center;
            .active {
              width: 10px;
              height: 10px;
              margin: 0px 10px;
            }
            .active1 {
              background: #87cf86;
            }
            .active2 {
              background: #e79c27;
            }
            .active3 {
              background: #f26665;
            }
            h6 {
              font-size: 8px;
            }
          }
        }
      }
    }

    .pointer {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
  .date-picker {
    position: absolute;
    right: 40px;
    top: 14px;
    z-index: 999;
    button {
      width: 30px;
      height: 30px;
      padding: 0 8px;
      margin-right: 10px;
    }
    .circle {
      height: 30px;
      width: 30px;
      padding: 3px;
      margin-right: 10px;
    }
    span {
      margin-right: 5px;
    }
    /deep/.ivu-table-cell {
      white-space: nowrap;
    }
  }
  .dateBnt2 {
    margin-left: 20px;
    .ivu-radio-wrapper {
      margin-left: 8px;
      margin-right: 8px;
    }
  }
</style>
