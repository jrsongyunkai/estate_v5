<template>
  <div>
    <div style="background: #1a202e; height: 52px; margin-top: 60px; margin-bottom: -40px; min-width: 1430px">
      <div class="blockLseft">
        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
          <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
        <div class="" style="margin-left: 0px; margin-right: 20px; margin-top: 0px">
          <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" style="width: 200px" />
        </div>
        <div class="dateBnt" style="margin-top: 8px" v-if="!datas.date">
          <div style="margin-left: 25px; margin-right: -5px; margin-top: 8px">
            {{ $t('date') + ':' }}
          </div>
          <RadioGroup v-model="dateRadio" @on-change="handleDatePicker" style="margin-right: -30px; margin-top: 8px">
            <Radio :label="$t('day')"></Radio>
            <Radio :label="$t('month')"></Radio>
          </RadioGroup>
        </div>
        <!-- <div>日期</div> -->
        <!-- 日历 -->
        <DatePicker v-show="isDay" :type="datas.date ? 'daterange' : 'date'" :value="datas.date ? dayes : days" :placeholder="$t('pleaseSelectDateTime')" style="width: 200px; margin-left: 0px" :editable="false" @on-change="changeDM" :clearable="true"></DatePicker>
        <!-- 月历 -->
        <DatePicker type="month" :value="mouths" style="width: 200px; margin-left: 0px" v-show="!isDay" :editable="false" @on-change="changeDM" :clearable="true"></DatePicker>
        <!-- 搜索 -->
        <div class="serach" style="margin-left: 0px; margin-right: 0px">
          <Input :placeholder="$t('enterDeviceNo')" @on-enter="searchDevice" v-model="device" style="width: 200px" class="inp" clearable />
          <Button type="primary" @click="searchDevice" class="but">{{ $t('query') }}</Button>
          <Button @click="reset" class="but">{{ $t('reset') }}</Button>
        </div>
        <div class="export" v-if="isoutput" style="margin-left: 0px">
          <Dropdown placement="bottom" @on-click="outputs">
            <a href="javascript:void(0)">
              <Icon custom="icon-v5 icon-v5-daochu2" size="20" class="buts" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="now">{{ $t('currentPageData') }}</DropdownItem>
              <DropdownItem name="all">{{ $t('allData') }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="echarts" :style="datas.tem ? 'padding-top:2px;background: #1a202e;' : 'padding: 20px;padding-bottom:0px;background: #1a202e;'" v-if="!datas.date">
      <slot></slot>
      <div style="height: 338px" v-if="datas.other">
        <slot name="ect1"></slot>
        <p style="width: 5px; background-color: #090f19; float: left; height: 364px; margin-top: -20px"></p>
        <slot name="ect2"></slot>
      </div>
    </div>
    <!-- 表格部分 -->
    <br v-if="datas.date" />
    <br v-if="datas.date" />
    <div class="table" style="padding: 20px; padding-bottom: 0px; background: #1a202e; margin-top: 7px">
      <!-- 表格 -->
      <Table :data="datas.tableData1" :columns="datas.tableColumns1" :height="datas.date ? 520 : 320" :disabled-hover="true" ref="table">
        <template slot-scope="{ row }" slot="type_number">
          <span class="pointer" :style="row.type_number === 1003 ? 'color:#409eff' : 'color:#e6a23c'">{{ row.type_number === 1003 ? $t('openingWarning') : $t('closingWarning') }}</span>
        </template>
        <template slot-scope="{ row }" slot="mac">
          <span class="pointer" @click="handle(row)">{{ row.mac }}</span>
        </template>
        <template slot-scope="{ row }" slot="macname">
          <span>{{ row.boxName }}</span>
        </template>
        <template slot-scope="{ row }" slot="phase">
          <span>{{ row.thresholdName }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span size="30" class="c-primary pointer" style="margin: 0 10px" custom="icon-v5 icon-v5-xianlu" @click="lineLeakageDetail(row.address, row.mac)">{{ $t('lineDetail') }}</span>
          <span size="30" class="c-primary pointer" style="margin: 0 10px" custom="icon-v5 icon-v5-qushi" @click="leakageTrend(row.address, row.mac)">{{ $t('historyTrend') }}</span>
        </template>
        <template slot-scope="{ row }" slot="actions">
          <span size="30" class="c-primary pointer" custom="icon-v5 icon-v5-qushi" @click="leakageTrend(row.address, row.mac)">{{ $t('historyTrend') }}</span>
        </template>
      </Table>
      <!-- 分页 -->
      <div style="overflow: hidden">
        <div style="float: right" :style="datas.date ? 'margin-bottom:150px' : ''">
          <Page show-total :current="current" @on-change="changePage" :total="datas.total" show-elevator />
        </div>
      </div>
    </div>
    <!-- 线路明细 -->
    <Modal :title="addr" width="40%" v-model="dialogTableVisible">
      <Table :data="lineDetail" :columns="trendlines">
        <template slot-scope="{ row }" slot="aT">
          <span>{{ row.aT ? row.aT : '--' }}</span>
        </template>
        <template slot-scope="{ row }" slot="bT">
          <span>{{ row.bT ? row.bT : '--' }}</span>
        </template>
        <template slot-scope="{ row }" slot="cT">
          <span>{{ row.cT ? row.cT : '--' }}</span>
        </template>
        <template slot-scope="{ row }" slot="nT">
          <span>{{ row.nT ? row.nT : '--' }}</span>
        </template>
      </Table>
      <div slot="footer"></div>
    </Modal>
    <!-- 历史趋势 -->
    <Modal :title="addrs" class="lines" v-model="trendDialog" :width="width" :styles="{ top: '40px' }">
      <div slot="footer"></div>
      <Row class="pickDate" style="margin-bottom: 10px">
        <div style="margin-left: 20px; margin-right: 5px; margin-top: 5px">
          {{ $t('date') + ':' }}
        </div>
        <RadioGroup v-model="dateRadios" @on-change="handleDatePickers" style="margin-top: 5px">
          <Radio :label="$t('day')"></Radio>
          <Radio :label="$t('month')"></Radio>
        </RadioGroup>
        <template>
          <div class="block" v-show="isDays">
            <DatePicker v-show="isDays" :editable="false" v-model="dayss" type="date" value-format="yyyy-MM-dd" @on-change="changeDMs" :clearable="false"></DatePicker>
          </div>
          <div class="block" v-show="!isDays">
            <DatePicker v-model="mouthss" value-format="yyyy-MM" type="month" :editable="false" @on-change="changeDMs" :clearable="false"></DatePicker>
          </div>
        </template>
      </Row>
      <template v-if="slotshow">
        <slot name="history" />
      </template>
      <Table :data="datas.tableData1s" :columns="$route.path === '/safetyMonitor/leakageWarm' ? hisqsa : trendHistory" :height="320" :disabled-hover="true">
        <template slot-scope="{ row }" slot="mac">
          <span class="pointer" @click="handle(row)">{{ row.mac }}</span>
        </template>
      </Table>
      <!-- 分页 -->
      <div style="margin: 10px; overflow: hidden" v-if="$route.path !== '/safetyMonitor/leakageWarm'">
        <div style="float: right">
          <Page show-total :current="1" @on-change="changePages" :total="datas.totals" show-elevator />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  // 引入分组的api
  import { groupingList, tree } from '@/api/safetyMonitor/public'
  import { getGroupType, getGroupTree } from '@/api/public'
  import { warnStates } from '@/api/safetyMonitor/temperature'
  import '@/styles/pages/leakage.less'
  import { queryChannels, queryBoxDetails } from '@/api/safetyMonitor/leakage'
  import BarChart from '@/pages/Common/Bars'
  export default {
    data() {
      return {
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        values3: '',
        values4: '',
        dateRadio: this.$t('day'),
        data: [],
        days: '',
        mouths: '',
        dayss: '',
        mouthss: '',
        dayHis: true,
        dataflag: false,
        isDay: true,
        isDays: true,
        isMouth: false,
        device: '',
        tableData1: [],
        tableColumns1: [],
        select: [
          { title: this.$t('allData'), expand: true, value: '1', selected: false, checked: false, sortable: true },
          { title: this.$t('currentPageData'), expand: true, value: '0', selected: false, checked: false },
        ],
        cityList: [
          { value: 1, label: this.$t('allData') },
          { value: 2, label: this.$t('currentPageData') },
        ],
        isoutput: false,
        cityList1: [],
        model: '',
        model1: '',
        cityList2: [],
        model2: '',
        detailsValue: '',
        addr: '',
        dialogTableVisible: false,
        lineDetail: [],
        trendlines: [
          { title: this.$t('lineName'), key: 'title', align: 'center' },
          { title: this.$t('temperatureACelsius'), slot: 'aT', align: 'center' },
          { title: this.$t('temperatureBCelsius'), slot: 'bT', align: 'center' },
          { title: this.$t('temperatureCCelsius'), slot: 'cT', align: 'center' },
          { title: this.$t('temperatureNCelsius'), slot: 'nT', align: 'center' },
        ],
        trendDialog1: false,
        trendDateType: 1,
        trendDate: '',
        trendFlag: false,
        trendDialog: false,
        trendPicker: 'day',
        trendLoading: false,
        trendData: [],
        trendValue: this.$func.getNowFormatDate(),
        trendMonth: this.$func.getCurrentYearMonth(),
        typeNumbers: -100,
        trendHistory: [
          { title: this.$t('line'), key: 'title' },
          { title: this.$t('temperatureACelsius'), key: 'aT' },
          { title: this.$t('temperatureBCelsius'), key: 'bT' },
          { title: this.$t('temperatureCCelsius'), key: 'cT' },
          { title: this.$t('temperatureNCelsius'), key: 'nT' },
        ],
        trendOptions: {
          xAxis: [],
          series: [{ type: 'bar', barMaxWidth: '30', name: this.$t('temperatureValueA'), data: [], itemStyle: { normal: { color: {}, label: { show: true, position: 'top' } } } }],
          title: { show: true, text: '' },
          tooltip: { show: true, trigger: '', formatter: '' },
          monitor: true,
          dateType: '',
        },
        dayes: [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')],
        params: { page: 1, rows: 10, projectCode: this.$store.state.projectCode, mac: '', dateType: 1, date: this.$Date().format('YYYY-MM-DD'), nodeId: '' },
        width: 800,
        slotshow: false,
        arr: [],
        addrs: '',
        dateRadios: this.$t('day'),
        hisqsa: [
          { title: this.$t('time'), key: 'time' },
          { title: this.$t('leakageHardProtectionA'), key: 'number1016' },
          { title: this.$t('leakageSoftProtectionA'), key: 'number2' },
          { title: this.$t('leakageSoftProtectionW'), key: 'number12' },
        ],
        current: 1,
      }
    },
    methods: {
      async getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      groupingType(e) {
        this.changeType(e)
      },
      groupingChoise(e) {
        // 分组筛选完之后，就传给父级进行应用，根据这个ID发请求
        let str = ''
        e.forEach(item => {
          str += item + ','
        })
        str = str.substr(0, str.length - 1)
        this.$emit('sendID', str)
      },
      changeflag() {
        // 显示隐藏 日历
        this.dataflag = !this.dataflag
      },
      init() {
        this.days = this.$Date().format('YYYY-MM-DD')
        this.mouths = this.$Date().format('YYYY-MM')
        this.dayss = this.$Date().format('YYYY-MM-DD')
        this.mouthss = this.$Date().format('YYYY-MM')
        this.getdata()
        this.getGroupTypes()
      },
      searchDevice() {
        this.current = 1
        let str = ''
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          if (this.packetFilter.length !== 0) {
            this.packetFilter.forEach(item => {
              str += item + ','
            })
            str = str.substr(0, str.length - 1)
          }
          if (this.isoutput) {
            if (this.daynow === undefined) this.daynow = [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')]
            let arr = {
              mac: this.device,
              startTime: this.daynow ? this.daynow[0] : this.$Date().format('YYYY-MM') + '-01',
              endTime: this.daynow ? this.daynow[1] : this.$Date().format('YYYY-MM-DD'),
              nodeIds: str,
            }
            this.$emit('search', arr)
          } else {
            let arr = {
              mac: this.device,
              dateType: this.dateRadio === this.$t('day') ? 1 : 2,
              date: this.daynow ? this.daynow : this.$Date().format('YYYY-MM-DD'), // 默认为今天
              nodeIds: str,
            }
            this.$emit('search', arr)
          }
        }
      },
      changePage(e) {
        // 改变页码
        this.current = e
        this.$emit('sendPage', e)
      },
      changePages(e) {
        this.$emit('sendPages', e)
      },
      changesize(e) {
        // 改变每页显示条数
        this.$emit('sendSize', e)
      },
      outputs(e) {
        let ctxPaths = this.$func.ctxPaths()
        if (this.daynow === undefined) {
          this.daynow = [this.$Date().format('YYYY-MM') + '-01', this.$Date().format('YYYY-MM-DD')]
        }
        if (this.$route.path === '/safetyMonitor/ocWarn') {
          this.$func.windowCountDown(
            ctxPaths + '/project/main/v3/xls/openingAndClosingWarning.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.device + '&startTime=' + this.daynow[0] + '&endTime=' + this.daynow[1] + '&exportType=' + (e === 'all' ? '' : 'exportCurrent') + '&nodeIds=' + this.packetFilter
          )
        } else {
          this.$func.windowCountDown(
            ctxPaths +
              '/deStatuscan/result/export.as?mac=' +
              this.device +
              '&pageSize=' +
              this.params.rows +
              '&pageNo=' +
              this.params.page +
              '&startTime=' +
              this.daynow[0] +
              '&endTime=' +
              this.daynow[1] +
              '&projectCode=' +
              this.$store.state.projectCode +
              '&projectName=' +
              this.$store.state.prjName +
              '&export=' +
              (e === 'all' ? e.toUpperCase() : '') +
              '&nodeIds=' +
              this.packetFilter
          )
        }
      },
      changeDM(date) {
        // 改变日期
        // 直接把所需要的日期和日期类型传过去
        this.daynow = date
        if (this.isDay) {
          // 日
          this.isDay = true
          this.value3 = date
          this.$emit('sendDate', [1, date])
        } else {
          // 月
          this.isDay = false
          this.value4 = date
          this.$emit('sendDate', [2, date])
        }
      },
      changeDMs(date) {
        this.daynow = date
        if (this.isDays) {
          // 日
          this.isDay = true
          this.values3 = date
          this.$emit('sendDates', [1, date])
        } else {
          // 月
          this.values4 = date
          this.isDay = false
          this.$emit('sendDates', [2, date])
        }
      },
      getdata() {
        groupingList({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.data) {
            this.cityList1 = res.data
            for (let i = 0; i < res.data.length; i++) {
              this.cityList1[i].value = res.data[i].id
            }
          }
        })
      },
      changeType(groupId) {
        this.$nextTick(() => {
          tree({ groupId }).then(res => {
            // 使用递归
            function sys(arr, parentId) {
              let data2 = []
              if (arr.length !== 0) {
                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                let pArr = res.data.filter(value => {
                  // 筛选出满足条件的
                  return value.parentId === parentId
                })
                let mArr = arr.filter(value => {
                  // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                  return value.parentId !== parentId
                })
                pArr.forEach((value, i) => {
                  let arr = {}
                  arr.title = value.name
                  arr.value = value.id
                  arr.children = sys(mArr, value.id)
                  data2.push(arr)
                })
                return data2
              } else {
                return false
              }
            }
            this.cityList2 = sys(res.data, 0)
          })
        })
      },
      line(e) {
        this.$emit('sendline', e)
      },
      historys(e) {
        this.$emit('sendhistory', e)
      },
      async handle(row) {
        const res = await queryBoxDetails({ mac: row.mac })
        if (res.success) {
          this.$emit('lookDeviceDetails', res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryChannels(addr, mac) {
        let params = { mac: mac }
        const res = await queryChannels(params)
        if (res.success) {
          this.lineDetail = res.datas
          this.addr = '【' + addr + '】' + this.$t('of') + this.$t('line') + ' ' + this.$t('temperatureDetail')
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
        this.addrss = addr
        this.macss = mac
        this.$emit('sendmacs', mac)
        if (this.$route.path === '/safetyMonitor/leakageWarm') {
          this.trendDialog = true
          this.width = 1000
          this.addrs = '【' + addr + '】' + this.$t('of') + this.$t('leakage1') + ' ' + this.$t('historyTrend')
          setTimeout(() => {
            this.slotshow = true
          }, 1)
          this.arr = []
          this.datas.optionss.series[0].data.forEach((item, index) => {
            this.arr.push({
              time: index,
              number1: item,
              number2: this.datas.optionss.series[1].data[index],
            })
          })
        } else {
          this.trendDialog = true
          this.width = 1000
          this.addrs = '【' + addr + '】' + this.$t('of') + this.$t('temperature') + ' ' + this.$t('historyTrend')
          setTimeout(() => {
            this.slotshow = true
          }, 1)
        }
      },
      handleCloseTrend() {
        this.trendPicker = 'day'
        this.trendValue = this.$func.getNowFormatDate()
        this.trendMonth = this.$func.getCurrentYearMonth()
      },
      reset() {
        this.current = 1
        this.model1 = ''
        this.cityList2 = []
        this.days = ''
        this.packetTypes = ''
        this.packetFilter = []
        this.dayes = []
        this.device = ''
        this.isDay = true
        this.dateRadio = this.$t('day')
        this.$emit('reset')
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
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
      handleDatePicker(dateType) {
        if (dateType === this.$t('day')) {
          // 日
          dateType = 1
          this.isDay = true
          let date = this.value3 ? this.value3 : this.days
          this.$emit('sendDate', [dateType, date])
        } else {
          // 月
          dateType = 2
          this.isDay = false
          let date = this.value4 ? this.value4 : this.mouths
          this.$emit('sendDate', [dateType, date])
        }
      },
      handleDatePickers(dateType) {
        if (dateType === this.$t('day')) {
          // 日
          dateType = 1
          this.isDays = true
          let date = this.values3 ? this.values3 : this.$Date().format('YYYY-MM-DD')
          this.$emit('sendDates', [dateType, date])
        } else {
          // 月
          dateType = 2
          this.isDays = false
          let date = this.values4 ? this.values4 : this.$Date().format('YYYY-MM')
          this.$emit('sendDates', [dateType, date])
        }
      },
      leakageWarn(address, mac) {},
    },
    mounted() {
      if (this.datas.isoutput) this.isoutput = this.datas.isoutput
      this.init()
      if (this.$route.path === '/safetyMonitor/temperature') {
        warnStates(this.params).then(res => {
          this.trendOptions.xAxis = []
          this.trendOptions.series[0].data = []
          if (this.params.dateType === 2) {
            this.trendOptions.title.text = this.$t('currentMonth') + this.$t('temperatureAlarmSituation')
          } else {
            this.trendOptions.title.text = this.$t('allDay') + this.$t('temperatureAlarmSituation')
          }
          for (let i = 0; i < res.data.length; i++) {
            this.trendOptions.xAxis.push(res.data[i].time)
            this.trendOptions.series[0].data.push({
              value: res.data[i].number1,
              itemStyle: { color: '#87CF86' },
            })
          }
        })
      }
    },
    watch: {
      datas: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.datas = newVal
          }
        },
        deep: true,
      },
      trendOptions: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.trendOptions = newVal
          }
        },
        deep: true,
      },
      arr: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.arr = newVal
          }
        },
        deep: true,
      },
    },
    props: {
      datas: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    components: {
      BarChart,
    },
  }
</script>

<style lang="less" scoped>
  .blockLseft {
    div {
      float: left;
      margin: 10px;
    }
    .output {
      float: right;
      margin: 10px;
      margin-top: 10px;
    }
    .btn {
      // position: relative;
      // right: 30px;
      // margin-top: 10px;
      .button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        line-height: 30px;
        border: none;
        color: #fff;
      }
    }
    .date {
      // float: left;
      // line-height: 50px;
      // margin-left: 10px;
      height: 50px;
    }
    .serach {
      // width: 300px;
      float: left;
      margin-left: -20px;
      .inp {
        float: left;
        margin: 10px;
        margin-top: 0px;
        margin-left: 0px;
        width: 200px;
      }
      .but {
        float: left;
        margin: 10px;
        margin-top: 0px;
        margin-left: 0;
      }
      .buts {
        float: left;
        margin: 10px;
        // margin-top: 0px;
        margin-left: 0;
      }
    }
  }
  .table {
    // width: 1000px;
    // float: left;
    .pointer {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }

  .echarts {
    margin-top: 50px;
    padding: 20px;
    div {
      width: 100%;
    }
  }
  .leakage {
    .head {
      width: 100%;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      background: #151518;
      margin-bottom: 10px;
      .head-left {
        display: flex;
        align-items: center;
        .type {
          span {
            margin: 0px 8px;
          }
        }
      }
      .head-right {
        display: flex;
        align-items: center;
        .btn {
          display: flex;
          .button {
            width: 50px;
            height: 50px;
            border-radius: 50%;
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
      background: #151518;
      padding-top: 10px;
      #main1 {
        width: 100%;
        height: 500px;
      }
      .mymain {
        .typeC {
          display: flex;
          justify-content: center;
          padding-bottom: 20px;
          span {
            display: flex;
            .active {
              width: 40px;
              height: 20px;
              border-radius: 5px;
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
              font-size: 14px;
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
      // width: 30px;
      height: 30px;
      // border-radius: 50%;
      padding: 0 8px;
      margin-right: 10px;
    }
    .circle {
      height: 30px;
      width: 30px;
      // border-radius: 50%;
      padding: 3px;
      margin-right: 10px;
    }
    span {
      margin-right: 5px;
    }
  }

  .lines {
    padding: 20px;
    margin-top: -50px;
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
  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
    // background-color: rgba(99, 110, 246, 0.5);
  }

  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /deep/::-webkit-scrollbar-thumb {
    background-color: #ccc;
    // #1A202E
  }
</style>
