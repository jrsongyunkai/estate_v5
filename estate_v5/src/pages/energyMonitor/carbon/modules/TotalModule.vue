<template>
  <div class="carbon-view">
    <div class="left" :class="{ fold: isFold }">
      <DeviceClassTree @clickNode="clickNode" @changeCheckedKeys="changeCheckedKeys" :isFold="isFold" @fold="changeFold" strictMode></DeviceClassTree>
    </div>
    <div class="right" ref="rightBox" v-resize="echartResize">
      <div class="right-top">
        <div class="left-content">
          <div class="icon-v5 icon-v5-shouqi2-01 mr-10 pointer" v-if="isFold" @click.stop="changeFold"></div>
          <div class="date-input"><MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month')]"></MKindDatePick></div>
          <Button type="primary" class="ml-10" @click.stop="queryInit">{{ $t('query') }}</Button>
          <Button type="primary" class="ml-10" ghost @click.stop="resetTime">{{ $t('reset') }}</Button>
        </div>
      </div>
      <div class="top-cols">
        <div class="col-item" v-for="(item, index) in topColMapData" :key="item.type">
          <div class="item-image"><MImage :src="item.image" :preview="false" /></div>
          <div class="item-content">
            <div class="title">{{ item.title }}</div>
            <div class="a-href" v-if="index === 0" @click.stop="targetBottom">{{ $t('carbonEmissionDetails') }}</div>
            <div class="value"><MCountUp :end="item.num" :decimals="3" /></div>
            <div class="trend" v-if="index === 0">
              <MTrend type="yoy" :value="item.yoy" />
              <MTrend v-if="carbonTopInfoQuery.levelRange !== 'year'" type="qoq" :value="item.qoq" />
            </div>
          </div>
        </div>
      </div>
      <div class="trend-view"><div class="chart-view" ref="chartRef"></div></div>
      <div class="table-view">
        <div class="header">
          <div>{{ $t('carbonEmissionTable') }}</div>
          <div class="right">
            <Button type="primary" ghost class="ml-10" @click.stop="exportExcel('chart', $t('carbonEmissionTable'))">{{ $t('export') }}</Button>
          </div>
        </div>
        <div class="table">
          <Table :columns="columns" :data="tableData" :max-height="400" border>
            <template #carbonEmission="{ row, column }">
              <div class="cell-content">
                <div class="value-cell">{{ (row.data[+column.key] && row.data[+column.key]['statData']['data']) || '-' }}</div>
                <div class="trend-cell">
                  <MTrend type="yoy" :value="(row.data[+column.key] && row.data[+column.key]['statData']['yoy']) || 0" />
                  <MTrend type="qoq" :value="(row.data[+column.key] && row.data[+column.key]['statData']['qoq']) || 0" />
                </div>
              </div>
            </template>
            <template #carbonSaving="{ row, column }">
              <div class="cell-content">
                <div class="value-cell">{{ (row.data[+column.key] && row.data[+column.key]['saveData']['data']) || '-' }}</div>
                <div class="trend-cell">
                  <MTrend type="yoy" :value="(row.data[+column.key] && row.data[+column.key]['saveData']['yoy']) || 0" />
                  <MTrend type="qoq" :value="(row.data[+column.key] && row.data[+column.key]['saveData']['qoq']) || 0" />
                </div>
              </div>
            </template>
          </Table>
        </div>
      </div>
      <div class="rate-view">
        <div class="left-box">
          <div class="header">
            <div>{{ $t('carbonEmissionRatio') }}</div>
            <div>
              <RadioGroup v-model="rateMode" type="button">
                <Radio :label="1">{{ $t('carbonEmissionRatio') }}</Radio>
                <Radio :label="2">{{ $t('carbonSavingRatio') }}</Radio>
              </RadioGroup>
            </div>
          </div>
          <div class="content">
            <div class="pie-chart" ref="pieRef"></div>
            <div class="pie-legend">
              <div class="legend-item" v-for="(item, index) in seriesData" :key="index" :style="{ '--rateBg': pieColors[index % pieColors.length] }" @click.stop="clickItemActive(index, item)" :class="{ hasActive: selectedPieIndexList.includes(index) }">
                <span class="icon-span"></span>
                <span class="name-span" v-textRoll>{{ item.name }}</span>
                <span class="rate-span">{{ `${(+item.value).toFixed(2)}%` }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right-box">
          <div class="header">
            <div>{{ $t('carbonEmissionRatioTable') }}</div>
            <div class="right">
              <Button type="primary" ghost class="ml-10" @click.stop="exportExcel('percent', $t('carbonEmissionRatioTable'))">{{ $t('export') }}</Button>
            </div>
          </div>
          <div class="table-content">
            <Table :columns="columnsRate" :data="tableDataRate" :max-height="400" border>
              <template #carbonRatio="{ row, column }">{{ getCarbonRatios(row, column.key, 'statData') }}%</template>
              <template #savingRatio="{ row, column }">{{ getCarbonRatios(row, column.key, 'saveData') }}%</template>
            </Table>
          </div>
        </div>
      </div>
      <div class="table-view" style="margin-top: 10px">
        <div class="header">
          <div>{{ $t('energyConsumption') }}</div>
          <div class="right">
            <Button type="primary" ghost class="ml-10" @click.stop="exportExcel('summary', $t('energyConsumption'))">{{ $t('export') }}</Button>
          </div>
        </div>
        <div class="table">
          <Table :columns="columnsConsume" :data="tableDataConsume" border>
            <template #value="{ row, column }">{{ row[column.key] || '-' }}</template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'
  import DeviceClassTree from '@/components/deviceTree/deviceClassTree.vue'
  import { queryCarbonOverview, queryCarbonTrend, carbonChartExport } from '@/api/energyMonitor/carbon'
  import { cloneDeep } from 'lodash'
  import mixins from './mixins/mixins'
  import { energyTypeMap } from '@/untils/configuration'
  export default {
    components: { DeviceClassTree },
    data() {
      return {
        columnsConsume: [
          { title: this.$t('category'), key: 'category', align: 'center', slot: 'value' },
          { title: this.$t('unit'), key: 'unit', align: 'center', slot: 'value' },
          {
            key: 'factor',
            align: 'center',
            slot: 'value',
            renderHeader: h => {
              return h('div', {}, [
                h('span', {}, this.$t('accountingCoefficient')),
                h('Tooltip', { props: { placement: 'top', maxWidth: '300', transfer: true } }, [
                  h('Icon', {
                    props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                    style: { marginLeft: '5px' },
                  }),
                  h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.$t('carbonEmissionTip')),
                ]),
              ])
            },
          },
          { title: this.$t('consumption'), key: 'energy', align: 'center', slot: 'value' },
          { title: `${this.$t('carbonEmissions')}(kgCO₂)`, key: 'carbon', align: 'center', slot: 'value' },
        ],
        tableDataConsume: [],
        equipmentTypes: [],
      }
    },
    mixins: [mixins],
    computed: {
      queryTotalParams() {
        return {
          energyType: 0,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          equipmentTypes: this.equipmentTypes,
          statType: 4,
        }
      },
    },
    methods: {
      changeCheckedKeys(e) {
        this.equipmentTypes = [...e]
        this.queryInit()
      },
      getCarbonRatios(row, key, alias = 'statData') {
        if (row.carbonRatios[+key] && row.carbonRatios[+key][alias]) return row.carbonRatios[+key][alias].percent.toFixed(2)
        return '0.00'
      },
      getAllTypes(tree) {
        const result = []
        if (tree.type) {
          result.push(tree.type)
        }
        if (tree.children) {
          tree.children.forEach(child => {
            result.push(...this.getAllTypes(child))
          })
        }
        return result
      },
      clickNode(e) {
        let types = this.getAllTypes(e)
        this.equipmentTypes = e.id === 'all' ? [] : types
        this.queryInit()
      },
      queryInit() {
        this.trendTimeValue = this.timeValue
        this.$nextTick(() => {
          this.queryCarbonEmission()
          this.queryCarbonTrend()
          this.randomKey = Math.random()
        })
      },
      echartSetOption(data) {
        let { total, elec, water, gas, heating } = data || { total: null, elec: null, water: null, gas: null, heating: null }
        let xAxisData = (total && total.carbon.map((it, index) => this.handSeriesData[this.timeValue.levelRange](index))) || []
        const getSeriesDataItemValue = (data, prop = 'statData') => {
          return Array.isArray(data) && data.length > 0 ? data.map(it => (!it[prop].data ? 0 : prop === 'saveData' ? it[prop].data * -1 : it[prop].data)) : []
        }
        const seriesData1 = [
          { name: this.$t('electricityCarbonSaving'), color: '#47ff32', type: 'bar', stack: 'elec', data: elec ? getSeriesDataItemValue(elec.carbon, 'saveData') : [] },
          { name: this.$t('waterCarbonSaving'), color: '#11bb14', type: 'bar', stack: 'water', data: water ? getSeriesDataItemValue(water.carbon, 'saveData') : [] },
          { name: this.$t('gasCarbonSaving'), color: '#3b9b1c', type: 'bar', stack: 'gas', data: gas ? getSeriesDataItemValue(gas.carbon, 'saveData') : [] },
          { name: this.$t('heatingCarbonSaving'), color: '#0eb52c', type: 'bar', stack: 'heating', data: heating ? getSeriesDataItemValue(heating.carbon, 'saveData') : [] },
          { name: this.$t('totalCarbonSaving'), color: '#70b603', type: 'line', markPoint: this.inverseMarkPoint, data: total ? getSeriesDataItemValue(total.carbon, 'saveData') : [] },
        ]
        const seriesData2 = [
          { name: this.$t('electricityCarbonEmissions2'), color: '#ff5555', type: 'bar', stack: 'elec', data: elec ? getSeriesDataItemValue(elec.carbon, 'statData') : [] },
          { name: this.$t('waterCarbonEmissions2'), color: '#ff1d1d', type: 'bar', stack: 'water', data: water ? getSeriesDataItemValue(water.carbon, 'statData') : [] },
          { name: this.$t('gasCarbonEmissions2'), color: '#ce0a0a', type: 'bar', stack: 'gas', data: gas ? getSeriesDataItemValue(gas.carbon, 'statData') : [] },
          { name: this.$t('heatingCarbonEmissions2'), color: '#b50e0e', type: 'bar', stack: 'heating', data: heating ? getSeriesDataItemValue(heating.carbon, 'statData') : [] },
          { name: this.$t('totalCarbonEmissions2'), color: '#d9001b', type: 'line', markPoint: this.markPoint, data: getSeriesDataItemValue(total.carbon, 'statData') },
        ]
        const seriesDataTooltip = [...seriesData2, ...seriesData1]
        let option = {
          title: { text: this.$t('carbonEmissionTrends'), textStyle: { color: '#fff', fontSize: 14 } },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            textStyle: { color: '#fff' },
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderWidth: 0,
            formatter: datas => {
              const { dataIndex } = datas[0]
              let res = `${datas[0].name}`
              for (let item of seriesDataTooltip) {
                let value = item.data[dataIndex] === void 0 ? '-' : Math.abs(item.data[dataIndex])
                let label = item.name
                const marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`
                res += `<br/>${marker}${label}：${value} kgCO₂`
              }
              return res
            },
          },
          legend: {
            show: true,
            data: [
              { name: this.$t('carbonEmissions2'), itemStyle: { color: '#d9001b' } },
              { name: this.$t('carbonSaving'), itemStyle: { color: '#70b603' } },
            ],
            right: 30,
            icon: 'circle',
            textStyle: { color: '#fff' },
            selectedMode: 'multiple',
          },
          grid: [
            { left: 60, z: 0, right: 50 },
            { left: 60, z: 0, right: 50 },
          ],
          xAxis: [
            { type: 'category', axisTick: { alignWithLabel: true }, axisLine: { onZero: true }, axisLabel: { show: true, color: '#fff' }, data: xAxisData },
            { gridIndex: 1, type: 'category', axisTick: { alignWithLabel: true }, axisLine: { onZero: true, show: false }, axisLabel: { show: true, color: '#fff' }, data: xAxisData },
          ],
          yAxis: [
            { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#dedede' } }, axisLabel: { formatter: value => Math.abs(value) } },
            { gridIndex: 1, type: 'value', splitLine: { show: false } },
          ],
          series: [...seriesData1.map(it => ({ ...it, name: this.$t('carbonSaving') })), ...seriesData2.map(it => ({ ...it, name: this.$t('carbonEmissions2') }))],
        }
        this.echarts && this.echarts.clear()
        this.echarts && this.echarts.setOption(option)
        this.echarts && this.echarts.hideLoading()
      },
      // 获取概况数据
      async queryCarbonEmission() {
        const res = await queryCarbonOverview({ ...this.queryTotalParams })
        if (res.success) {
          this.carbonTopInfo = { ...res.data }
          this.carbonTopInfoQuery = cloneDeep(this.timeValue)
        } else {
          this.$Message.error(res.message)
        }
      },
      // 获取碳排趋势
      async queryCarbonTrend() {
        this.echarts && this.echarts.showLoading({ text: this.$t('loading'), color: '#fff', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.4)' })
        let res = await queryCarbonTrend({ ...this.queryTotalParams })
        if (res.success) {
          this.echartSetOption(res.data)
          let { total, elec, water, gas, heating } = res.data || { total: null, elec: null, water: null, gas: null, heating: null }
          let elecCarbon = (elec && elec.carbon) || []
          let waterCarbon = (water && water.carbon) || []
          let gasCarbon = (gas && gas.carbon) || []
          let heatingCarbon = (heating && heating.carbon) || []
          let totalCarbon = (total && total.carbon) || []
          this.carbonRatiosQuery = cloneDeep(this.timeValue)
          this.carbonRatios = (total && total.carbon) || []
          this.columnsSpanList =
            (total &&
              total.carbon.map((it, index) => ({
                title: this.handSeriesData[this.timeValue.levelRange](index),
                align: 'center',
                children: [
                  { title: `${this.$t('carbonEmissions')}(kgCO₂)`, key: `${index}`, minWidth: 200, align: 'center', slot: 'carbonEmission' },
                  { title: `${this.$t('carbonSavings')}(kgCO₂)`, key: `${index}`, minWidth: 200, align: 'center', slot: 'carbonSaving' },
                ],
              }))) ||
            []

          this.tableData = [
            { category: this.$t('electricityCarbonEmissions'), data: elecCarbon, carbonTotal: this.getSumTypeValue(elecCarbon), carbonSavingTotal: this.getSumTypeValue(elecCarbon, 'saveData') },
            { category: this.$t('waterCarbonEmissions'), data: waterCarbon, carbonTotal: this.getSumTypeValue(waterCarbon), carbonSavingTotal: this.getSumTypeValue(waterCarbon, 'saveData') },
            { category: this.$t('gasCarbonEmissions'), data: gasCarbon, carbonTotal: this.getSumTypeValue(gasCarbon), carbonSavingTotal: this.getSumTypeValue(gasCarbon, 'saveData') },
            { category: this.$t('heatingCarbonEmissions'), data: heatingCarbon, carbonTotal: this.getSumTypeValue(heatingCarbon), carbonSavingTotal: this.getSumTypeValue(heatingCarbon, 'saveData') },
            { category: this.$t('totalCarbonEmissions'), data: totalCarbon, carbonTotal: this.getSumTypeValue(totalCarbon), carbonSavingTotal: this.getSumTypeValue(totalCarbon, 'saveData') },
          ]
          this.tableDataRate = [
            { category: this.$t('electricityCarbonEmissions'), carbonRatios: elecCarbon },
            { category: this.$t('waterCarbonEmissions'), carbonRatios: waterCarbon },
            { category: this.$t('gasCarbonEmissions'), carbonRatios: gasCarbon },
            { category: this.$t('heatingCarbonEmissions'), carbonRatios: heatingCarbon },
          ]
          this.tableDataConsume = [
            { category: this.$t('electricityCarbonEmissions'), ...(elec && elec.summary), unit: energyTypeMap[0].unit },
            { category: this.$t('waterCarbonEmissions'), ...(water && water.summary), unit: energyTypeMap[1].unit },
            { category: this.$t('gasCarbonEmissions'), ...(gas && gas.summary), unit: energyTypeMap[2].unit },
            { category: this.$t('heatingCarbonEmissions'), ...(heating && heating.summary), unit: energyTypeMap[3].unit },
            { category: this.$t('totalCarbonEmissions'), ...(total && total.summary) },
          ]
        } else {
          this.$Message.error(res.message)
        }
      },
      targetBottom() {
        this.$ScrollTop(this.$refs.rightBox, { to: 1000, time: 1000 })
      },
      async exportExcel(exportType, name) {
        const params = { ...this.queryTotalParams, exportType }
        const res = await carbonChartExport(params)
        this.$func.getPostResFile(res, name)
      },
    },
    mounted() {
      this.echarts = echarts.init(this.$refs.chartRef)
      this.pieEchart = echarts.init(this.$refs.pieRef)
      window.addEventListener('resize', this.echartResize)
      this.queryInit()
    },
    destroyed() {
      this.echarts && this.echarts.dispose()
      this.pieEchart && this.pieEchart.dispose()
      window.removeEventListener('resize', this.echartResize)
    },
  }
</script>

<style lang="less" scoped>
  .carbon-view {
    height: calc(~'100vh - 211px');
    display: flex;
    justify-content: space-between;
    .ml-10 {
      margin-left: 10px;
    }
    .mr-10 {
      margin-right: 10px;
    }
    .ml-5 {
      margin-left: 5px;
    }
    .left {
      width: 250px;
      margin-right: 10px;
      padding: 10px;
      background: #1a202e;
      height: 100%;
      overflow: hidden;
      transition: 0.5 all;
    }
    .left.fold {
      display: none;
    }
    .right {
      height: 100%;
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0px;
      }
      .right-top {
        padding: 10px;
        background: #1a202e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .left-content {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .date-input {
            width: 300px;
          }
        }
        .right-content {
          display: flex;
          justify-content: flex-end;
        }
      }
      .top-cols {
        width: 100%;
        display: flex;
        justify-content: space-between;
        overflow: auto;
        margin-bottom: 10px;
        &::-webkit-scrollbar {
          height: 0px;
        }
        .col-item {
          width: calc(~'33.333% - 7px');
          background: #1a202e;
          padding: 15px 0px 15px 15px;
          display: flex;
          align-items: center;
          min-width: 268px;
          margin-right: 8px;
          &:last-of-type {
            margin-right: 0;
          }
          .item-image {
            width: 60px;
            height: 60px;
            margin-right: 5px;
          }
          .item-content {
            width: calc(~'100% - 70px');
            position: relative;
            .title {
              width: 100%;
              font-size: 14px;
            }
            .value {
              font-size: 20px;
              line-height: 34px;
            }
            .a-href {
              position: absolute;
              right: 10px;
              color: #02a7f0;
              cursor: pointer;
              top: 0px;
            }
            .trend {
              font-size: 12px;
              line-height: 1;
              display: flex;
              .trend-span:first-of-type {
                margin-right: 5px;
              }
            }
          }
        }
      }
      .trend-view {
        height: 450px;
        padding: 20px;
        width: 100%;
        background: #1a202e;
        margin-bottom: 10px;
        .chart-view {
          width: 100%;
          height: 100%;
        }
      }
      .ranking-box {
        display: flex;
        justify-content: space-between;
        > div {
          width: calc(~'50% - 5px');
        }
      }
      .table-view {
        background: #1a202e;
        width: 100%;
        padding: 0px 20px;
        padding-bottom: 20px;
        margin-bottom: 10px;
        .header {
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .right {
            text-align: right;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
      .rate-view {
        display: flex;
        .left-box {
          width: 400px;
          padding: 0px 10px;
          background: #1a202e;
          flex-shrink: 0;
          padding-bottom: 20px;
          .header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            padding: 0 10px;
          }
          .content {
            width: 100%;
            height: 250px;
            display: flex;
            .pie-chart {
              width: 250px;
            }
            .pie-legend {
              width: calc(~'100% - 250px');
              height: 250px;
              overflow: auto;
              .legend-item {
                line-height: 28px;
                height: 28px;
                width: 100%;
                display: flex;
                align-items: center;
                cursor: pointer;
                .icon-span {
                  display: inline-block;
                  width: 10px;
                  height: 10px;
                  border-radius: 5px;
                  background: var(--rateBg);
                  margin-right: 3px;
                  flex-shrink: 0;
                }
                .rate-span {
                  display: inline-block;
                  width: 50px;
                  height: 20px;
                  font-size: 12px;
                  text-align: center;
                  line-height: 20px;
                  margin-right: 10px;
                  color: #fff;
                  flex-shrink: 0;
                }
                .name-span {
                  display: inline-block;
                  color: '#fff';
                  max-width: 100%;
                  margin-right: 5px;
                }
              }
              .legend-item.hasActive {
                .rate-span,
                .name-span {
                  color: #999;
                }
                .icon-span {
                  background: #dedede;
                }
              }
            }
          }
        }
        .right-box {
          width: calc(~'100% - 410px');
          margin-left: 10px;
          background: #1a202e;
          padding: 0px 20px;
          .header {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .right {
              text-align: right;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
          }
          .table-content {
            width: 100%;
          }
        }
      }
      .table {
        /deep/.ivu-table-cell {
          padding-left: 5px;
          padding-right: 5px;
        }
        .cell-content {
          width: 100%;
          font-size: 14px;
          line-height: 30px;
          padding-top: 10px;
          .trend-cell {
            font-size: 12px;
            display: flex;
            padding-top: 10px;
            padding-bottom: 10px;
            justify-content: space-between;
          }
        }
      }
    }
  }
</style>
