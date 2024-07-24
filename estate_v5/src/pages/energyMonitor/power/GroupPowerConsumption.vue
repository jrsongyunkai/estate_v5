<template>
  <div>
    <Row :gutter="10" class="head-query-consumption bg-power">
      <Col><GroupPick v-model="groupInfo" multiple ref="groupPickRef"></GroupPick></Col>
      <Col><MKindDatePick class="ml-10" v-model="timeValue" :typeRange="typeRange" /></Col>
      <Col>
        <Button type="primary" @click="queryList">{{ $t('query') }}</Button>
      </Col>
      <Col>
        <Button type="default" @click="restList">{{ $t('reset') }}</Button>
      </Col>
    </Row>
    <div class="power-content bg-power">
      <GroupPowerCharts v-if="!!groupPowerData.xAxis.length" :options="groupPowerData"></GroupPowerCharts>
    </div>
    <div class="power-content bg-power">
      <div class="use-ele-title">
        <h3 class="pd-20">{{ $t('electricityConsumptionDetails') }}</h3>
        <Button class="export mar-20" @click="handleExport">
          <Icon custom="icon-v5 icon-v5-daochu2" />
        </Button>
      </div>

      <!-- <Table :columns="columnsTable" :data="dataList"></Table> -->
      <div style="position: relative; height: calc(100vh - 340px)">
        <vxe-table
          border
          show-overflow
          show-header-overflow
          ref="xTable"
          :data="tableGroupData"
          :scroll-x="{ enabled: true, gt: 1, scrollToLeftOnChange: true }"
          :scroll-y="{ enabled: true, gt: 1, scrollToTopOnChange: true }"
          auto-resize
          minHeight="300px"
          maxHeight="100%"
          show-footer
          :footer-method="footerMethod"
          show-footer-overflow="title">
          <template v-for="column in columnsTable">
            <vxe-column v-if="!column.children" :key="column.key" v-bind="column" :field="column.key"></vxe-column>
            <vxe-colgroup v-else :key="column.key + 1" v-bind="column" align="center">
              <vxe-column v-for="item in column.children" :key="item.key" v-bind="item" :field="item.key">
                <template #header>
                  <div>{{ item.title }}</div>
                  <div>{{ item.unit }}</div>
                </template>
              </vxe-column>
            </vxe-colgroup>
          </template>
        </vxe-table>
      </div>
      <Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="totalData"></Page>
    </div>
  </div>
</template>

<script>
  import GroupPowerCharts from './GroupPowerCharts.vue'
  import { defaultTimeValue } from './constants'
  import { userGroupPowerStats } from '@api/energyMonitor/power'
  import qs from 'qs'
  import dayjs from 'dayjs'
  export default {
    components: { GroupPowerCharts },
    data() {
      return {
        groupInfo: { groupId: '', groupNodeId: '' },
        timeValue: defaultTimeValue(),
        groupPowerData: {
          xAxis: [],
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        totalData: 0,
        resData: null,
        columnsTable: [],
      }
    },
    mounted() {
      this.queryList()
    },
    computed: {
      typeRange() {
        return this.$store.state.isOpenPrjGrpHourPowerStat ? [this.$t('day'), this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')] : [this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')]
      },
      columns() {
        const mapTypes = {
          2: 'YYYY-MM-DD HH',
          3: 'YYYY-MM-DD',
          5: 'YYYY-MM-DD',
          4: 'YYYY-MM',
          6: 'YYYY-MM',
        }
        const startTime = this.timeValue.dataRange[0]
        const endTime = this.$func.getEndTime(this.timeValue.dataRange[1])
        const statsType = this.timeValue.timeType
        let tableTitle = (statsType && this.getAllDate(startTime, endTime, statsType)) || []
        let newArr = tableTitle.map((title, index) => ({
          title: `${dayjs(title).format(mapTypes[statsType])}`,
          align: 'center',
          key: `sum${title}`,
          children: [
            { title: this.$t('sharpHourElectricityConsumption'), unit: '(kW·h)', key: `dateDataList[${index}][0]`, align: 'center', width: 138 },
            { title: this.$t('peakHourElectricityConsumption'), unit: '(kW·h)', key: `dateDataList[${index}][1]`, align: 'center', width: 138 },
            { title: this.$t('regularElectricityConsumption'), unit: '(kW·h)', key: `dateDataList[${index}][2]`, align: 'center', width: 138 },
            { title: this.$t('electricityConsumptionDuringValleyHours'), unit: '(kW·h)', key: `dateDataList[${index}][3]`, align: 'center', width: 138 },
            { title: this.$t('totalElectricityConsumption'), unit: '(kW·h)', key: `dateDataList[${index}][4]`, align: 'center', width: 138 },
          ],
        }))
        return [
          { title: this.$t('groupName'), align: 'center', fixed: 'left', key: 'name', className: 'info-column', width: 200 },
          ...newArr,
          {
            title: this.$t('total'),
            align: 'center',
            key: 'totalPower',
            fixed: 'right',
            children: [
              { title: this.$t('sharpHourElectricityConsumption'), unit: '(kW·h)', key: 'totalDataList[0]', align: 'center', width: 138 },
              { title: this.$t('peakHourElectricityConsumption'), unit: '(kW·h)', key: 'totalDataList[1]', align: 'center', width: 138 },
              { title: this.$t('regularElectricityConsumption'), unit: '(kW·h)', key: 'totalDataList[2]', align: 'center', width: 138 },
              { title: this.$t('electricityConsumptionDuringValleyHours'), unit: '(kW·h)', key: 'totalDataList[3]', align: 'center', width: 138 },
              { title: this.$t('totalElectricityConsumption'), unit: '(kW·h)', key: 'totalDataList[4]', align: 'center', width: 138 },
            ],
            width: 120,
          },
        ]
      },
      tableGroupData() {
        return this.dataList.slice(this.pageNo * this.pageSize - this.pageSize, this.pageNo * this.pageSize)
      },
    },
    methods: {
      queryList() {
        this.getDataInit()
      },
      handleCurrentChange(e) {
        this.pageNo = e
      },
      async getDataInit() {
        let params = {
          projectCode: this.$store.state.projectCode,
          dateType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeIds: this.groupInfo.groupNodeId && !!this.groupInfo.groupNodeId.length ? this.groupInfo.groupNodeId.join(',') : '',
        }
        const res = await userGroupPowerStats(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.resData = res.data
        this.getChartsData(res.data)
        this.getTableList(res.data)
      },
      getChartsData(data) {
        this.groupPowerData.xAxis = data.map(item => item.name).slice(0, -1)
        const rawData = data.map(v => v.totalDataList.filter((itm, index) => index < 5)).slice(0, -1)
        let markArr = rawData.map(item => item[4])
        const markPoint = {
          data: [
            {
              type: 'max',
              symbol: this.$func.echartsSymbolMax,
              symbolOffset: [0, 0],
              label: {
                fontSize: 11,
                align: 'center',
                color: '#ff4f4f',
                offset: [0, -16],
              },
            },
            {
              type: 'min',
              symbolOffset: [0, -30],
              symbol: this.$func.echartsSymbolMin,
              label: {
                color: '#00ba8a',
                fontSize: 11,
                align: 'center',
                offset: [0, -16],
              },
            },
          ],
        }
        const maxPoint = {
          data: [
            {
              type: 'max',
              symbol: this.$func.echartsSymbolOverlap,
              symbolOffset: [0, -30],

              label: {
                fontSize: 11,
                align: 'center',
                color: '#007eff',
                offset: [0, -16],
              },
            },
          ],
        }
        const seriesMarkPoint = [
          {
            name: '',
            type: 'bar',
            barWidth: '20%',
            barGap: '-100%',
            backgroundStyle: {
              color: 'rgba(0, 0, 0, 0)',
            },
            itemStyle: {
              color: 'rgba(0, 0, 0, 0)', // 将颜色设置为透明
            },
            data: markArr,
            markPoint: this.$func.isSameArray(markArr) ? maxPoint : markPoint,
            z: -1,
          },
        ]

        const series = [this.$t('sharpHourElectricityConsumption'), this.$t('peakHourElectricityConsumption'), this.$t('regularElectricityConsumption'), this.$t('electricityConsumptionDuringValleyHours')].map((name, i) => {
          return {
            name,
            type: 'bar',
            stack: 'total1',
            barWidth: '20%',
            data: rawData.map(item => item[i]),
          }
        })
        this.groupPowerData.series = series.concat(seriesMarkPoint)
      },
      getTableList(data) {
        this.columnsTable = this.columns
        this.dataList = data.map(item => ({ name: item.name, dateDataList: item.dateDataList, totalDataList: item.totalDataList })).slice(0, -1)
        this.totalData = this.dataList.length
      },
      footerMethod() {
        const totalData = this.resData.slice(-1)[0]
        totalData.dateDataList = totalData.dateDataList.map(v => v.slice(0, 5))
        return [[this.$t('total')].concat(totalData.dateDataList.flat(), totalData.totalDataList)]
      },
      getAllDate(start, end, statsType) {
        if (statsType === 2) return Array.from({ length: 24 }, (_, index) => `${dayjs(start).format('YYYY-MM-DD')} ${`${index}`.padStart(2, '0')}`)
        const mapTypes = {
          3: { format: 'YYYY-MM-DD', unit: 'day' },
          5: { format: 'YYYY-MM-DD', unit: 'day' },
          4: { format: 'YYYY-MM', unit: 'month' },
          6: { format: 'YYYY-MM', unit: 'month' },
        }
        const startDate = dayjs(start)
        const endDate = dayjs(end)
        const datesArray = []
        let currentDate = startDate
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, mapTypes[statsType].unit)) {
          datesArray.push(currentDate.format(mapTypes[statsType].format))
          currentDate = currentDate.add(1, mapTypes[statsType].unit)
        }
        return datesArray
      },
      handleExport() {
        let params = {
          projectCode: this.$store.state.projectCode,
          dateType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeIds: this.groupInfo.groupNodeId && !!this.groupInfo.groupNodeId.length ? this.groupInfo.groupNodeId.join(',') : '',
        }
        const paramsStr = `/project/main/v5/xls/userGroupPowerStats.as?${qs.stringify(params)}`
        this.$func.windowCountDown(paramsStr)
      },
      restList() {
        this.timeValue = defaultTimeValue()
        this.$refs.groupPickRef.resetValue()
      },
    },
  }
</script>

<style lang="less" scoped>
  .mar-20 {
    margin: 20px 20px 0 0;
  }
  .use-ele-title {
    display: flex;
    justify-content: space-between;
  }
  .bg-power {
    background: #1a202e;
  }
  .head-query-consumption {
    padding: 10px;
  }
  .power-content {
    margin-top: 10px;
  }
  .pd-20 {
    padding: 20px;
  }
</style>
