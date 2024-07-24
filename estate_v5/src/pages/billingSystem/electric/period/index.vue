<template>
  <div class="period">
    <Row class="header">
      <Row>
        <ELPCascader v-if="billingTarget === 2" filterable :options="macData" v-model="macLine" style="width: 250px; margin-right: 10px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine')">
          <template slot-scope="{ data }">
            <div class="el-cascader-label-content">
              <Tooltip placement="left" :disabled="data.label.length < 8" transfer transfer-class-name="el-cascader-label-tips">
                <div class="label-text-content">{{ data.label }}</div>
                <template #content>
                  <div>{{ data.label }}</div>
                </template>
              </Tooltip>
            </div>
          </template>
        </ELPCascader>
        <Select transfer v-if="billingTarget === 3" style="width: 150px" v-model="packetTypes" clearable :placeholder="$t('selectGroupingType')" class="en-unit" @on-change="handleTypes">
          <Option v-for="item in packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
        </Select>
        <TreeSelect v-if="billingTarget === 3" :placeholder="$t('selectGroup')" style="width: 150px; margin-left: 10px" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" />
        <div class="date-container">
          <DatePicker :value="searchDate" type="daterange" split-panels :placeholder="$t('pleaseSelectDateTime')" style="width: 200px" @on-change="dateChange" format="yyyy-MM-dd"></DatePicker>
        </div>
        <Button class="b-blue ml-10" @click="quertyinitList">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
      </Row>
    </Row>
    <div class="content">
      <Row class="header">
        <h3>{{ $t('unitPriceBreakdownOfElectricityBills') }}</h3>
        <Dropdown trigger="click" class="ml-10" @on-click="exportDetailsMoney">
          <Button class="b-blue">
            {{ $t('export') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="current">{{ $t('currentPageData') }}</DropdownItem>
            <DropdownItem name="all">{{ $t('allData') }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Table :columns="detailColumns" :data="elecMoneyDetail" :span-method="handleSpan" border>
        <template slot-scope="{ row }" slot="timer">
          <div style="padding: 10px">
            {{ row.startTime }}
            <div>{{ $t('to') }}</div>
            {{ row.endTime }}
          </div>
        </template>
        <template slot-scope="{ row }" slot="step">[{{ $t('timeRangeValue', { startTime: row.startStep, endTime: row.endStep }) }})</template>
      </Table>
      <div style="margin-top: 10px; display: flex; justify-content: right">
        <Page class="page" show-total :total="totalPage" :page-size="pageSize" @on-change="changePage" :current="pageNo" show-elevator />
      </div>
    </div>
    <div class="content">
      <Row class="header">
        <h3>{{ $t('electricityBillReport') }}</h3>
        <Dropdown trigger="click" class="ml-10" @on-click="exportElecFee">
          <Button class="b-blue">
            {{ $t('export') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="current">{{ $t('currentPageData') }}</DropdownItem>
            <DropdownItem name="all">{{ $t('allData') }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Row>
      <Table :columns="reportColumns" :data="data2" :span-method="handleSpan2" border class="elec-table"></Table>
      <div style="margin-top: 10px; display: flex; justify-content: right">
        <Page class="page" show-total :total="totalFee" :page-size="pageSize" @on-change="changePageFee" :current="pageNoFee" show-elevator />
      </div>
    </div>
  </div>
</template>
<script>
  import { getTree } from '../../electric/charging/statementList'
  import { getAllDate } from '@/pages/energyMonitor/report/mockData'
  import { priceUsageDetails, getPowerCycle, powerFeeReport, getMacChnQueryCondition, getGroupTypeQueryCondition, getGroupNodeQueryCondition } from '@/api/public'
  import dayjs from 'dayjs'
  import store from '@/store'
  export default {
    name: 'billingSystem-period',
    data() {
      return {
        pageNoFee: 1,
        totalFee: 0,
        totalPage: 0,
        elecMoneyDetail: [],
        packetFilterList: [],
        packetFilter: [],
        packetTypes: '',
        macData: [],
        macLine: [],
        packetList: [],
        data2: [],
        data: [],
        billingTarget: this.$store.state.billingTarget,
        targetValue: '',
        startTime: dayjs(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD'),
        endTime: dayjs(new Date().getTime()).format('YYYY-MM-DD'),
        searchDate: [],
        pageNo: 1,
        pageSize: 10,
        titlePower: '',
        titleType: '',
      }
    },
    computed: {
      detailColumns() {
        let beforeColumns = [{ title: this.$t('projectName'), key: 'mainInfo', width: 200 }]
        if (this.billingTarget === 2) {
          beforeColumns = [
            { title: this.$t('deviceMessage'), key: 'info', width: 200 },
            { title: this.$t('lineInfo'), key: 'mainInfo', width: 200 },
          ]
        } else if (this.billingTarget === 3) {
          beforeColumns = [
            { title: this.$t('groupType'), key: 'info', width: 200 },
            { title: this.$t('groupName'), key: 'mainInfo', width: 200 },
          ]
        }
        return [
          ...beforeColumns,
          { title: this.$t('timeSpan'), slot: 'timer', align: 'center' },
          { title: this.$t('step'), slot: 'step', align: 'center' },
          { title: this.$t('sharpeLectricityPrice'), key: 'pointed' },
          { title: this.$t('peakLectricityPrice'), key: 'peak' },
          { title: this.$t('performanceLectricityPrice'), key: 'flat' },
          { title: this.$t('valleyLectricityPrice'), key: 'valley' },
        ]
      },
      reportColumns() {
        let firstColumn = [{ title: this.$t('projectInfo'), key: 'mainInfo', align: 'center', fixed: 'left', width: 200 }]
        if (this.billingTarget === 2) {
          firstColumn = [
            { title: this.$t('deviceMessage'), key: 'info', align: 'center', fixed: 'left', width: 200 },
            { title: this.$t('lineInfo'), key: 'mainInfo', align: 'center', fixed: 'left', width: 200 },
          ]
        } else if (this.billingTarget === 3) {
          firstColumn = [
            { title: this.$t('groupName'), key: 'info', align: 'center', fixed: 'left', width: 200 },
            { title: this.$t('groupInfo'), key: 'mainInfo', align: 'center', fixed: 'left', width: 200 },
          ]
        }
        let titleList = getAllDate(dayjs(this.searchDate[0]).format('YYYY-MM-DD'), dayjs(this.searchDate[1]).format('YYYY-MM-DD')).map(item => ({ title: item }))
        let newArr = titleList.map(v => ({
          ...v,
          align: 'center',
          children: [
            {
              title: this.$t('sharp'),
              align: 'center',
              children: [
                { title: this.$t('leakageKwh'), align: 'center', key: `topPeakPower${v.title.split('-').join('')}`, width: 120 },
                { title: this.$t('electricityBillWithUnit'), align: 'center', width: 120, key: `topPeakFee${v.title.split('-').join('')}` },
              ],
            },
            {
              title: this.$t('peak'),
              align: 'center',
              children: [
                { title: this.$t('leakageKwh'), align: 'center', width: 120, key: `peakPower${v.title.split('-').join('')}` },
                { title: this.$t('electricityBillWithUnit'), align: 'center', width: 120, key: `peakFee${v.title.split('-').join('')}` },
              ],
            },
            {
              title: this.$t('performance'),
              align: 'center',
              children: [
                { title: this.$t('leakageKwh'), align: 'center', width: 120, key: `flatPower${v.title.split('-').join('')}` },
                { title: this.$t('electricityBillWithUnit'), align: 'center', width: 120, key: `flatFee${v.title.split('-').join('')}` },
              ],
            },
            {
              title: this.$t('valley'),
              align: 'center',
              children: [
                { title: this.$t('leakageKwh'), align: 'center', width: 120, key: `valleyPower${v.title.split('-').join('')}` },
                { title: this.$t('electricityBillWithUnit'), align: 'center', width: 120, key: `valleyFee${v.title.split('-').join('')}` },
              ],
            },
            {
              title: this.$t('subtotal'),
              align: 'center',
              children: [
                { title: this.$t('leakageKwh'), align: 'center', width: 120, key: `totalPower${v.title.split('-').join('')}` },
                { title: this.$t('electricityBillWithUnit'), align: 'center', width: 120, key: `totalFee${v.title.split('-').join('')}` },
              ],
            },
          ],
        }))
        newArr.push({
          title: this.$t('totalElectricityConsumption3'),
          align: 'center',
          className: 'info-column',
          fixed: 'right',
          children: [
            { title: this.$t('leakageKwh'), align: 'center', key: 'totalPower', width: 120, fixed: 'right' },
            { title: this.$t('electricityBillWithUnit'), align: 'center', key: 'totalFee', width: 120, fixed: 'right' },
          ],
        })
        return [...firstColumn, ...newArr]
      },
    },
    methods: {
      async init() {
        if (this.billingTarget) {
          this.initAction()
        } else {
          const res = await getPowerCycle({ projectCode: this.$store.state.projectCode, isCurr: true })
          if (res.success) {
            if (!res.data.billingTarget) return
            this.billingTarget = res.data.billingTarget
            store.commit('billingTarget', res.data.billingTarget)
            store.commit('billCycle', res.data.billingCycle)
            store.commit('billingCycleName', res.data.billingCycleName)
            this.initAction()
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      initAction() {
        if (this.billingTarget === 1) {
          this.targetValue = this.$store.state.projectCode
        } else if (this.billingTarget === 2) {
          this.getDeviceSelectList()
          if (this.$route.params.targetValue) {
            let [resId, addr] = this.$route.params.targetValue.split(':')
            this.macLine = [+resId, `${addr}`]
          }
        } else if (this.billingTarget === 3) {
          this.getGroupTypeList()
          if (this.$route.params.targetValue) {
            let [groupId, nodeId] = this.$route.params.targetValue.split(':')
            this.packetTypes = groupId
            this.handleTypes(groupId)
            this.packetFilter = [nodeId]
          }
        }
        if (this.$route.params.timer) {
          this.searchDate = [this.$route.params.timer.split(':')[0], this.$route.params.timer.split(':')[1]]
        } else {
          this.searchDate = [this.startTime, this.endTime]
        }
        this.quertyinitList()
      },

      quertyinitList() {
        if (!this.billingTarget) {
          return this.$Message.error(this.$t('pleaseConfigureBeforeQueryingTip'))
        }
        if (!this.searchDate[0]) {
          return this.$Message.error(this.$t('pleaseSelectDate'))
        }
        if (this.searchDate[0]) {
          this.startTime = this.searchDate[0]
          this.endTime = this.searchDate[1]
        } else {
          this.startTime = dayjs(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD')
          this.endTime = dayjs(new Date().getTime()).format('YYYY-MM-DD')
        }
        if (this.billingTarget === 1) {
          this.targetValue = this.$store.state.projectCode
        } else if (this.billingTarget === 2) {
          this.targetValue = `${(this.macLine[0] || '') + (this.macLine[0] ? ':' : '') + (this.macLine[1] || '')}`
        } else if (this.billingTarget === 3) {
          this.targetValue = this.packetFilter.join(',') || ''
        }
        this.pageNo = 1
        this.pageNoFee = 1
        this.getTableInit()
        this.getPowerFeeList()
      },
      changePage(e) {
        this.pageNo = e
        this.getTableInit()
      },
      async getTableInit() {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.billingTarget,
          targetValue: this.targetValue ? this.targetValue : undefined,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          startTime: this.startTime,
          endTime: this.endTime,
        }
        const res = await priceUsageDetails(params)
        if (res.success) {
          this.totalPage = res.total
          let dataElec = res.datas
            .map(v => ({ mainDetailVos: v.mainDetailVos.map(j => ({ ...j, info: v.info })) }))
            .map(val => val.mainDetailVos)
            .flat(Infinity)
          let newDataElec = dataElec
            .map(v => ({ detailVos: v.detailVos.map(j => ({ ...j, info: v.info, mainInfo: v.mainInfo })) }))
            .map(val => val.detailVos)
            .flat(Infinity)
          let detailList = newDataElec.map(v => ({ ...v, info: v.info, startStep: v.levelFrom, endStep: v.levelTo, pointed: v.topPeakPrice, peak: v.peakPrice, flat: v.flatPrice, valley: v.valleyPrice }))
          this.assembleData(detailList, 'datails')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changePageFee(e) {
        this.pageNoFee = e
        this.getPowerFeeList()
      },
      exportElecFee(val) {
        this.$func.windowCountDown(
          '/energy/manage/v5/xls/powerFeeReport.as?pageNo=' +
            this.pageNo +
            '&pageSize=' +
            this.pageSize +
            '&projectCode=' +
            this.$store.state.projectCode +
            '&billingTarget=' +
            this.billingTarget +
            '&targetValue=' +
            (this.targetValue || '') +
            '&startTime=' +
            this.startTime +
            '&endTime=' +
            this.endTime +
            '&exportType=' +
            val
        )
      },
      async getPowerFeeList() {
        let params = { projectCode: this.$store.state.projectCode, billingTarget: this.billingTarget, targetValue: this.targetValue ? this.targetValue : undefined, pageNo: this.pageNoFee, pageSize: this.pageSize, startTime: this.startTime, endTime: this.endTime }
        const res = await powerFeeReport(params)
        if (res.success) {
          let elecFeeData = res.datas
            .map(v => ({ mainDetailVos: v.mainDetailVos.length && v.mainDetailVos.map(j => ({ ...j, info: v.info })) }))
            .map(item => item.mainDetailVos)
            .flat(Infinity)
          elecFeeData.forEach(v => {
            if (Array.isArray(v.detailVos) && v.detailVos.length) {
              v.detailVos.forEach(j => {
                j['priceObj'] = {}
                j['priceObj'][`flatFee${j.time}`] = j.flatFee === 0 ? 0 : j.flatFee || '-'
                j['priceObj'][`flatPower${j.time}`] = j.flatPower === 0 ? 0 : j.flatPower || '-'
                j['priceObj'][`peakFee${j.time}`] = j.peakFee === 0 ? 0 : j.peakFee || '-'
                j['priceObj'][`peakPower${j.time}`] = j.peakPower === 0 ? 0 : j.peakPower || '-'
                j['priceObj'][`topPeakFee${j.time}`] = j.topPeakFee === 0 ? 0 : j.topPeakFee || '-'
                j['priceObj'][`topPeakPower${j.time}`] = j.topPeakPower === 0 ? 0 : j.topPeakPower || '-'
                j['priceObj'][`totalFee${j.time}`] = j.totalFee === 0 ? 0 : j.totalFee || '-'
                j['priceObj'][`totalPower${j.time}`] = j.totalPower === 0 ? 0 : j.totalPower || '-'
                j['priceObj'][`valleyFee${j.time}`] = j.valleyFee === 0 ? 0 : j.valleyFee || '-'
                j['priceObj'][`valleyPower${j.time}`] = j.valleyPower === 0 ? 0 : j.valleyPower || '-'
                j['priceObj'][`time`] = j.time || '-'
              })
            }
          })
          let eleNewFeeData = elecFeeData.map(item => ({
            ...item,
            ...item.detailVos
              .map(v => v.priceObj)
              .reduce((sum, v) => {
                return Object.assign(sum, v)
              }, {}),
          }))
          let totalPriceAndPower = res.totals
          totalPriceAndPower.forEach(v => {
            if (Array.isArray(v.detailVos) && v.detailVos.length) {
              v.detailVos.forEach(j => {
                j['priceObj'] = {}
                j['priceObj'][`flatFee${j.time}`] = j.flatFee === 0 ? 0 : j.flatFee || '-'
                j['priceObj'][`flatPower${j.time}`] = j.flatPower === 0 ? 0 : j.flatPower || '-'
                j['priceObj'][`peakFee${j.time}`] = j.peakFee === 0 ? 0 : j.peakFee || '-'
                j['priceObj'][`peakPower${j.time}`] = j.peakPower === 0 ? 0 : j.peakPower || '-'
                j['priceObj'][`topPeakFee${j.time}`] = j.topPeakFee === 0 ? 0 : j.topPeakFee || '-'
                j['priceObj'][`topPeakPower${j.time}`] = j.topPeakPower === 0 ? 0 : j.topPeakPower || '-'
                j['priceObj'][`totalFee${j.time}`] = j.totalFee === 0 ? 0 : j.totalFee || '-'
                j['priceObj'][`totalPower${j.time}`] = j.totalPower === 0 ? 0 : j.totalPower || '-'
                j['priceObj'][`valleyFee${j.time}`] = j.valleyFee === 0 ? 0 : j.valleyFee || '-'
                j['priceObj'][`valleyPower${j.time}`] = j.valleyPower === 0 ? 0 : j.valleyPower || '-'
                j['priceObj'][`time`] = j.time || '-'
              })
            }
          })
          let totalPowerList = totalPriceAndPower.map(v => ({
            ...v,
            mainInfo: this.$t('total'),
            info: '',
            ...v.detailVos
              .map(j => j.priceObj)
              .reduce((sum, val) => {
                return Object.assign(sum, val)
              }, {}),
          }))
          this.data2 = eleNewFeeData.concat(totalPowerList)
          this.totalFee = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      exportDetailsMoney(val) {
        this.$func.windowCountDown(
          '/energy/manage/v5/xls/priceUsageDetails.as?pageNo=' +
            this.pageNo +
            '&pageSize=' +
            this.pageSize +
            '&projectCode=' +
            this.$store.state.projectCode +
            '&billingTarget=' +
            this.billingTarget +
            '&targetValue=' +
            (this.targetValue || '') +
            '&startTime=' +
            this.startTime +
            '&endTime=' +
            this.endTime +
            '&exportType=' +
            val
        )
      },
      async getDeviceSelectList() {
        let param = { projectCode: this.$store.state.projectCode }
        const res = await getMacChnQueryCondition(param)
        if (res.success) {
          this.macData = res.data.map(item => ({
            value: item.resId,
            label: item.name + '(' + item.mac + ')',
            addrs: item.addrs,
            children:
              item.addrs.map(v => ({
                value: String(v.addr),
                label: v.title,
              })) || [],
          }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupTypeList() {
        const res = await getGroupTypeQueryCondition({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.packetList = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleTypes(val) {
        if (!val) return
        let parmas = { projectCode: this.$store.state.projectCode, groupId: val }
        const res = await getGroupNodeQueryCondition(parmas)
        if (res.success) {
          this.packetFilterList = getTree(res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSpan2({ rowIndex, column }) {
        if (column.key === 'info') {
          const row = this.data2[rowIndex]
          const preRow = this.data2[rowIndex - 1]
          const rowSpan = this.data2.filter(item => item.info === row.info).length
          if (!preRow || row.info !== preRow.info) {
            return [rowSpan, 1]
          } else {
            return [0, 0]
          }
        }
      },
      handleSpan({ row, columnIndex }) {
        // 合并第二列,这里columnIndex==1 根据具体业务要在前端写死
        if (columnIndex === 0) {
          // 计算合并的行数列数
          let x = row.mergeCol === 0 ? 0 : row.mergeCol
          let y = row.mergeCol === 0 ? 0 : 1
          return [x, y]
        }
        if (columnIndex === 1) {
          let x = row.mergeAddr === 0 ? 0 : row.mergeAddr
          let y = row.mergeAddr === 0 ? 0 : 1
          return [x, y]
        }
      },
      assembleData(data, type) {
        let names = []
        let addrname = []
        // 筛选出不重复的 name值,将其放到 names数组中
        data.forEach(e => {
          if (!names.includes(e.info)) {
            names.push(e.info)
          }
          if (!addrname.includes(e.mainInfo)) {
            addrname.push(e.mainInfo)
          }
        })
        let nameNums = []
        let addrNums = []
        // 将names数组中的 name值设置默认合并0个单元格,放到 nameNums中
        names.forEach(e => {
          nameNums.push({ info: e, num: 0 })
        })
        addrname.forEach(e => {
          addrNums.push({ mainInfo: e, addrnum: 0 })
        })
        // 计算每种 name值所在行需要合并的单元格数
        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.info === n.info) {
              n.num++
            }
          })
          addrNums.forEach(n => {
            if (e.mainInfo === n.mainInfo) {
              n.addrnum++
            }
          })
        })
        // 将计算后的合并单元格数整合到 data中
        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.info === n.info) {
              if (names.includes(e.info)) {
                e.mergeCol = n.num
                // 删除已经设置过的值(防止被合并的单元格进到这个 if 语句中)
                names.splice(names.indexOf(n.info), 1)
              } else {
                // 被合并的单元格设置为 0
                e.mergeCol = 0
              }
            }
          })
          addrNums.forEach(n => {
            if (e.mainInfo === n.mainInfo) {
              if (addrname.includes(e.mainInfo)) {
                e.mergeAddr = n.addrnum
                // 删除已经设置过的值(防止被合并的单元格进到这个 if 语句中)
                addrname.splice(addrname.indexOf(n.mainInfo), 1)
              } else {
                // 被合并的单元格设置为 0
                e.mergeAddr = 0
              }
            }
          })
        })

        // 将整理后的数据交给表格渲染
        if (type === 'datails') {
          this.elecMoneyDetail = data
        }
      },
      dateChange(val) {
        this.searchDate = val
      },
      reset() {
        this.searchDate = [dayjs(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD'), dayjs(new Date().getTime()).format('YYYY-MM-DD')]
        this.macLine = []
        this.packetTypes = ''
        this.packetFilter = []
        this.quertyinitList()
      },
    },
    activated() {
      this.init()
    },
  }
</script>
<style lang="less">
  .ivu-table-fixed {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .ivu-table-fixed-right {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .period {
    .header {
      background: #1a1f2e;
      padding: 10px;
      border-radius: 5px;
    }
    .content {
      margin-top: 10px;
      border-radius: 5px;
      padding: 10px;
      .header {
        justify-content: space-between;
      }
    }
    .date-container {
      display: inline-block;
      position: relative;
      .mask {
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
