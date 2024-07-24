<template>
  <div class="content-box" v-resize="resize">
    <div class="left" :class="{ fold: isFold }">
      <EnergyDeviceTree @clickNode="clickNode" treeHeight="calc(100vh - 327px)" :isFold="isFold" @fold="changeFold" :energyType="energyType" strictMode></EnergyDeviceTree>
    </div>
    <div class="right">
      <RightTopColModule ref="rightTopColModule" :energyType="energyType" :queryParams="queryParams" />
      <div class="search-bar">
        <Form ref="searchForm" label-position="right" style="display: flex; align-items: center">
          <div class="icon-v5 icon-v5-shouqi2-01 mr-10 pointer" v-if="isFold" @click.stop="changeFold"></div>
          <MKindDatePick v-model="timeValue" isComparison :typeRange="typeRange"></MKindDatePick>
          <Button class="b-blue ml-10" @click.stop="search">{{ $t('query') }}</Button>
          <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        </Form>
      </div>
      <div class="chart-box">
        <div class="header">{{ titlePrefixTrend }}</div>
        <div class="chart-content mt-10">
          <div class="left-box">
            <div class="left-box-item" v-for="(item, index) in trendLabelMarks" :key="index">
              <div class="item-image"><MImage :src="item.image" :preview="false" /></div>
              <div class="item-content">
                <div class="title">{{ item.name }}</div>
                <div class="value">{{ item.value }}</div>
                <div class="date" v-if="item.time">{{ item.time }}</div>
              </div>
            </div>
          </div>
          <div class="right-box" ref="chartElectricBoxLine" id="chart_electric_box_line"></div>
        </div>
      </div>

      <div class="ranking-box" v-if="energyType === 1 && queryParams.statType === 1 && !queryParams.mac && !queryParams.nodeId && trendTimeValue">
        <div>
          <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="mac" :unit="useUnit" dataType="energy" :energyType="energyType"></RankingChartView>
        </div>
        <div>
          <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="channel" :unit="useUnit" dataType="energy" :energyType="energyType"></RankingChartView>
        </div>
      </div>

      <div v-if="energyType !== 1 && queryParams.statType === 1 && !queryParams.mac && !queryParams.nodeId && trendTimeValue">
        <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="mac" :unit="useUnit" dataType="energy" :energyType="energyType"></RankingChartView>
      </div>

      <div v-if="queryParams.statType === 3 && !queryParams.nodeId && !queryParams.mac">
        <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="node" :unit="useUnit" dataType="energy" :energyType="energyType"></RankingChartView>
      </div>

      <div class="chart-box">
        <div class="header button-title">
          <div>{{ titlePrefix }} {{ $t('statistics') }}</div>
          <div>
            <Dropdown v-if="this.queryParamsList[0] && energyType === 1 && this.queryParamsList[0].nodeId" trigger="click" @on-click="handleCommand">
              <Button>
                {{ $t('export') }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="total">{{ $t('exportStatistics1') }}</DropdownItem>
                <DropdownItem name="details">{{ $t('exportDetail') }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button class="b-blue" v-else @click="excelExport">{{ $t('export') }}</Button>
          </div>
        </div>
        <div class="mt-10">
          <Table :columns="usedEnergyColumns" :data="tableData" :max-height="400" border show-summary></Table>
        </div>
      </div>
      <AlarmTableModule ref="alarmTableModule" :energyType="energyType" :queryParams="queryParams" :timeValue="trendTimeValue" @handleUrge="handleUrge" />
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { energyChart, energyChartExport, energyElecChartGroupExport } from '@/api/smartEnergy/statistics'
  import mixins from './mixins'
  import RankingChartView from './RankingChartView.vue'
  import EnergyDeviceTree from '@/components/deviceTree/EnergyDeviceTree.vue'
  import RightTopColModule from './RightTopColModule.vue'
  import AlarmTableModule from './AlarmTableModule.vue'
  import { energyTypeMap } from '@/untils/configuration'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
    },
    components: { EnergyDeviceTree, RankingChartView, RightTopColModule, AlarmTableModule },
    mixins: [mixins],
    data() {
      return {
        timeSpanColumns: [
          {
            title: '1',
            align: 'center',
            children: [
              { title: 'electricQuantity（kW·h）', key: 'name', minWidth: 140, align: 'center' },
              { title: this.$t('monthlyProportion'), key: 'name', minWidth: 90, align: 'center' },
            ],
          },
          {
            title: '2',
            align: 'center',
            children: [
              { title: 'electricQuantity（kW·h）', key: 'name', minWidth: 140, align: 'center' },
              { title: this.$t('monthlyProportion'), key: 'name', minWidth: 90, align: 'center' },
            ],
          },
        ],
        queryParams: { statType: 1, mac: null, addr: null, groupId: null, nodeId: null, loadId: null, provinceName: null, cityName: null, countyName: null },
        queryParamsList: [],
        levelRange: 'month',
        randomKey: null,
        energyTipsMap: energyTypeMap,
      }
    },
    computed: {
      titlePrefix() {
        return [this.$t('statisticsOfElectricityConsumption'), this.$t('statisticsOfWaterConsumption'), this.$t('statisticsOfGasConsumption'), this.$t('statisticsOfHeatingConsumption')][this.energyType - 1]
      },
      titlePrefixTrend() {
        return [this.$t('trendOfElectricityConsumption'), this.$t('trendOfWaterConsumption'), this.$t('trendOfGasConsumption'), this.$t('trendOfHeatingConsumption')][this.energyType - 1]
      },
      useUnit() {
        return this.energyTipsMap[this.energyType - 1].unit
      },
      trendLabelMarks() {
        const { unit } = this.energyTipsMap[this.energyType - 1]
        let timeType = this.trendLabelMarksNamePrefix[this.levelRange]
        return [
          {
            name: `${this.$t('maxOfTimeTypeText', { timeType })}${unit}`,
            value: this.trendLabelMarksLabel.max.value || 0,
            time: this.trendLabelMarksLabel.max.time || '',
            image: require('@/assets/energyImages/Max@1x.png'),
          },
          {
            name: `${this.$t('minOfTimeTypeText', { timeType })}${unit}`,
            value: this.trendLabelMarksLabel.min.value || 0,
            time: this.trendLabelMarksLabel.min.time || '',
            image: require('@/assets/energyImages/Min@1x.png'),
          },
          {
            name: `${this.$t('averageOfTimeTypeText', { timeType })}${unit}`,
            value: this.trendLabelMarksLabel.average || 0,
            time: '',
            image: require('@/assets/energyImages/average@1x.png'),
          },
        ]
      },
      usedEnergyColumns() {
        const title = [this.$t('totalElectricityConsumption3'), this.$t('totalWaterConsumption'), this.$t('totalGasConsumption'), this.$t('totalHeatingConsumption')][this.energyType - 1]
        return [
          {
            title: this.$t('objectInformation'),
            key: 'time',
            width: 150,
            fixed: 'left',
          },
          ...this.timeSpanColumns,
          { title, key: 'total', align: 'center', width: 120, fixed: 'right' },
        ]
      },
      selfQueryParams() {
        return {
          ...this.queryParams,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          energyType: this.energyType,
        }
      },
      comparisonQueryParams() {
        return {
          ...this.queryParams,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRangeComparison[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRangeComparison[1]),
          energyType: this.energyType,
        }
      },
      typeRange() {
        return this.energyType !== 1 ? [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week')] : [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week'), this.$t('day')]
      },
    },
    methods: {
      search() {
        this.trendTimeValue = this.timeValue
        this.$nextTick(() => {
          this.queryAlarmList()
          this.queryEnergyPowerTrend()
          this.randomKey = Math.random()
        })
      },
      async excelExport(type) {
        let params = { ...this.queryParamsList[0] }
        if (this.queryParamsList.length === 2) {
          params.compareStartTime = this.queryParamsList[1].startTime
          params.compareEndTime = this.queryParamsList[1].endTime
        }
        let res = null
        if (type === 'details') {
          res = await energyElecChartGroupExport({ projectCode: this.$store.state.projectCode, nodeId: params.nodeId, timeType: params.timeType, sTime: params.startTime, eTime: params.endTime })
        } else {
          res = await energyChartExport(params)
        }
        this.$func.getPostResFile(res, `${this.titlePrefix}统计`)
      },
      handleCommand(type) {
        this.excelExport(type)
      },
      // 查询电量趋势
      async queryEnergyPowerTrend() {
        this.seriesData = []
        this.tableData = []
        this.queryParamsList = []
        this.chart && this.chart.showLoading({ text: this.$t('loading'), color: '#fff', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.4)' })
        let res = await energyChart(this.selfQueryParams)
        if (!res.success) return this.$Message.error({ content: res.message })
        const levelRange = this.timeValue.levelRange
        this.queryParamsList.push(this.selfQueryParams)
        const listArr = [...res.data]
        this.xAxisData = listArr.map((it, index) => this.handSeriesData[levelRange](index))
        this.levelRange = levelRange
        let values = listArr.map(v => v.energyData || 0)
        this.setLabelMinAndMax(values, levelRange)
        this.setTimeSpanColumns(listArr, levelRange)
        this.seriesData.push({ name: this.timeValue.dateValueText, data: values })
        this.setTableDataRow(listArr, this.timeValue.dateValueText)
        if (this.timeValue.dateValueComparison && this.timeValue.dateValueComparison !== this.timeValue.dateValue) {
          let resComparison = await energyChart(this.comparisonQueryParams)
          if (!resComparison.success) return this.$Message.error({ content: resComparison.message })
          this.queryParamsList.push(this.comparisonQueryParams)
          let valuesComparison = resComparison.data.map(it => it.energyData || 0)
          if (valuesComparison.length > res.data.length) {
            this.xAxisData = valuesComparison.map((it, index) => this.handSeriesData[levelRange](index))
            this.setTimeSpanColumns(resComparison.data, levelRange)
          }
          this.seriesData.push({ name: this.timeValue.dateValueComparisonText, data: valuesComparison })
          this.setTableDataRow(resComparison.data, this.timeValue.dateValueComparisonText)
        }
        this.drawChart()
      },
      // 设置最大值，最小值与平均值
      setLabelMinAndMax(values, levelRange) {
        let sum = values.reduce((a, b) => a + +b, 0)
        let max = values.length > 0 ? Math.max(...values) : '-'
        let min = values.length > 0 ? Math.min(...values) : '-'
        let xAxisDataMaxIndex = values.length > 0 ? values.findIndex(it => it === Math.max(...values)) : 0
        let xAxisDataMInIndex = values.length > 0 ? values.findIndex(it => it === Math.min(...values)) : 0
        let maxTime = levelRange === 'month' || levelRange === 'year' ? `${this.timeValue.dateValueText}-${this.handSeriesDataTrendLabel[levelRange](xAxisDataMaxIndex)}` : this.handSeriesDataTrendLabel[levelRange](xAxisDataMaxIndex)
        let minTime = levelRange === 'month' || levelRange === 'year' ? `${this.timeValue.dateValueText}-${this.handSeriesDataTrendLabel[levelRange](xAxisDataMInIndex)}` : this.handSeriesDataTrendLabel[levelRange](xAxisDataMInIndex)
        this.trendLabelMarksLabel = { max: { value: max, time: maxTime }, min: { value: min, time: minTime }, average: (sum / values.length).toFixed(3) }
      },
      setTableDataRow(listArr, time) {
        let row = { time, total: 0 }
        listArr.forEach((it, index) => {
          let { energyData, percent } = it
          row[`value${index}`] = energyData || 0
          row[`rate${index}`] = `${percent || 0}%`
          row.total += +energyData
        })
        row.total = row.total.toFixed(3)
        this.tableData.push(row)
      },
      setTimeSpanColumns(listArr, levelRange) {
        const { column, unit } = this.energyTipsMap[this.energyType - 1]
        this.timeSpanColumns = listArr.map((it, index) => {
          return {
            title: this.handSeriesData[levelRange](index),
            align: 'center',
            children: [
              { title: `${column}(${unit})`, key: `value${index}`, minWidth: 140, align: 'center' },
              { title: this.columnNameMap[levelRange], key: `rate${index}`, minWidth: 90, align: 'center' },
            ],
          }
        })
      },
      handleUrge(id) {
        this.$emit('handleUrge', id)
      },
      queryAlarmList() {
        this.$refs.alarmTableModule && this.$refs.alarmTableModule.queryAlarmList()
      },
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chartElectricBoxLine)
      this.trendTimeValue = this.timeValue
      this.$nextTick(() => {
        this.$refs.rightTopColModule && this.$refs.rightTopColModule.getTopColSpanData()
        this.queryAlarmList()
        this.queryEnergyPowerTrend()
      })
    },
  }
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
