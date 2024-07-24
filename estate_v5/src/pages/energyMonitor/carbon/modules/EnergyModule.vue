<template>
  <div class="carbon-view">
    <div class="left" :class="{ fold: isFold }">
      <EnergyDeviceTree @clickNode="clickNode" :isFold="isFold" @fold="changeFold" treeHeight="calc(100vh - 326px)" :energyType="energyType" strictMode></EnergyDeviceTree>
    </div>
    <div class="right" ref="rightBox" v-resize="echartResize">
      <div class="right-top">
        <div class="left-content">
          <div class="icon-v5 icon-v5-shouqi2-01 mr-10 pointer" v-if="isFold" @click.stop="changeFold"></div>
          <div class="date-input"><MKindDatePick v-model="timeValue" :typeRange="energyType === 1 ? [$t('year'), $t('month'), $t('day')] : [$t('year'), $t('month')]"></MKindDatePick></div>
          <Button type="primary" class="ml-10" @click.stop="queryInit">{{ $t('query') }}</Button>
          <Button type="primary" class="ml-10" ghost @click.stop="resetTime">{{ $t('reset') }}</Button>
        </div>
        <div class="right-content">
          <Button type="primary" v-if="energyType === 1" class="ml-10" ghost @click.stop="$emit('setWarnSetting')">{{ $t('carbonEmissionAlarmSettings') }}</Button>
        </div>
      </div>
      <div class="top-cols">
        <div class="col-item" v-for="(item, index) in topColMapData" :key="item.type">
          <div class="item-image"><MImage :src="item.image" :preview="false" /></div>
          <div class="item-content">
            <div class="title">{{ item.title }}</div>
            <div class="value"><MCountUp :end="item.num" :decimals="3" /></div>
            <div class="trend" v-if="index === 0">
              <MTrend type="yoy" :value="item.yoy" />
              <MTrend v-if="carbonTopInfoQuery.levelRange !== 'year'" type="qoq" :value="item.qoq" />
            </div>
          </div>
        </div>
      </div>
      <div class="trend-view">
        <div class="chart-view" ref="chartRef"></div>
      </div>
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
                <div class="value-cell">{{ row.data[+column.key]['statData']['data'] || '0' }}</div>
                <div class="trend-cell">
                  <MTrend type="yoy" :value="row.data[+column.key]['statData']['yoy'] || 0" />
                  <MTrend type="qoq" :value="row.data[+column.key]['statData']['qoq'] || 0" />
                </div>
              </div>
            </template>
            <template #carbonSaving="{ row, column }">
              <div class="cell-content">
                <div class="value-cell">{{ row.data[+column.key]['saveData']['data'] || '0' }}</div>
                <div class="trend-cell">
                  <MTrend type="yoy" :value="row.data[+column.key]['saveData']['yoy'] || 0" />
                  <MTrend type="qoq" :value="row.data[+column.key]['saveData']['qoq'] || 0" />
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
              <template #carbonRatio="{ row, column }">{{ row.carbonRatios[+column.key]['statData']['percent'].toFixed(2) }}%</template>
              <template #savingRatio="{ row, column }">{{ row.carbonRatios[+column.key]['saveData']['percent'].toFixed(2) }}%</template>
            </Table>
          </div>
        </div>
      </div>
      <div class="ranking-box" v-if="energyType === 1 && queryParams.statType === 1 && !queryParams.mac && !queryParams.nodeId && trendTimeValue">
        <div>
          <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="mac" :energyType="energyType" dataType="carbon" unit="kgCO₂"></RankingChartView>
        </div>
        <div>
          <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="channel" :energyType="energyType" dataType="carbon" unit="kgCO₂"></RankingChartView>
        </div>
      </div>

      <div v-if="energyType !== 1 && queryParams.statType === 1 && !queryParams.mac && !queryParams.nodeId && trendTimeValue">
        <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="mac" :energyType="energyType" dataType="carbon" unit="kgCO₂"></RankingChartView>
      </div>
      <div v-if="queryParams.statType === 2 && !queryParams.mac && !queryParams.nodeId && trendTimeValue">
        <RankingChartView :key="randomKey" :queryParams="queryParams" :timeValue="trendTimeValue" rankType="node" :energyType="energyType" dataType="carbon" unit="kgCO₂"></RankingChartView>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'
  import EnergyDeviceTree from '@/components/deviceTree/EnergyDeviceTree.vue'
  import { queryCarbonOverview, queryCarbonTrend, carbonChartExport } from '@/api/energyMonitor/carbon'
  import RankingChartView from '@/pages/smartEnergy/statistics/modules/RankingChartView.vue'
  import { cloneDeep } from 'lodash'
  import mixins from './mixins/mixins'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
      alias: { type: String, default: 'elec' },
      label: { type: String, default: '' },
    },
    components: { EnergyDeviceTree, RankingChartView },
    mixins: [mixins],
    data() {
      return {}
    },
    methods: {
      clickNode(e) {
        this.queryParams.mac = e.mac
        this.queryParams.addr = e.addr || null
        this.queryParams.groupId = e.groupId
        this.queryParams.nodeId = e.nodeId
        this.queryParams.provinceName = e.provinceName
        this.queryParams.cityName = e.cityName
        this.queryParams.countyName = e.countyName
        this.queryParams.statType = e.statType
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
        let xAxisData = data.carbon.map((it, index) => this.handSeriesData[this.timeValue.levelRange](index))
        let seriesValue1 = [...data.carbon.map(it => it['statData']['data'] || 0)]
        let seriesValue2 = [...data.carbon.map(it => it['saveData']['data'] * -1 || 0)]
        const seriesData = [
          { name: this.$t('carbonSavings'), type: 'bar', barWidth: 20, stack: 'one', color: '#70b603', data: seriesValue2, markPoint: this.inverseMarkPoint },
          { name: this.$t('carbonEmission'), type: 'bar', barWidth: 20, stack: 'one', color: '#d9001b', data: seriesValue1, markPoint: this.markPoint },
        ]
        const seriesDataTooltip = [
          { name: this.$t('carbonEmission'), type: 'bar', barWidth: 20, stack: 'one', color: '#d9001b', data: seriesValue1, markPoint: this.markPoint },
          { name: this.$t('carbonSavings'), type: 'bar', barWidth: 20, stack: 'one', color: '#70b603', data: seriesValue2, markPoint: this.inverseMarkPoint },
        ]
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
                let value = Math.abs(item.data[dataIndex])
                let label = item.name
                const marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`
                res += `<br/>${marker}${label}: ${value} kgCO₂`
              }
              return res
            },
          },
          legend: { data: [this.$t('carbonEmission'), this.$t('carbonSavings')], right: '4%', itemStyle: {}, textStyle: { color: '#fff' }, icon: 'circle' },
          grid: [
            { left: 60, z: 0, right: 50 },
            { left: 60, z: 2, right: 50 },
          ],
          xAxis: [
            { type: 'category', axisTick: { alignWithLabel: true, show: false }, axisLine: { onZero: true }, axisLabel: { show: true, color: '#fff' }, data: xAxisData },
            { gridIndex: 1, type: 'category', axisTick: { alignWithLabel: true }, axisLine: { onZero: true, show: false }, axisLabel: { show: true, color: '#fff' }, data: xAxisData },
          ],
          yAxis: [
            { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#dedede' } }, axisLabel: { formatter: value => Math.abs(value) } },
            { gridIndex: 1, type: 'value', splitLine: { show: false } },
          ],
          series: seriesData,
        }
        this.echarts && this.echarts.clear()
        this.echarts && this.echarts.setOption(option)
        this.echarts && this.echarts.hideLoading()
      },
      // 查询获取概况
      async queryCarbonEmission() {
        const params = {
          ...this.queryParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
        const res = await queryCarbonOverview(params)
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
        let params = {
          ...this.queryParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
        let res = await queryCarbonTrend(params)
        if (res.success) {
          const info = res.data[this.alias]
          if (info) {
            this.echartSetOption(info)
            this.columnsSpanList =
              (info &&
                info.carbon.map((it, index) => ({
                  title: this.handSeriesData[this.timeValue.levelRange](index),
                  align: 'center',
                  children: [
                    { title: `${this.$t('carbonEmissions')}(kgCO₂)`, key: `${index}`, minWidth: 200, align: 'center', slot: 'carbonEmission' },
                    { title: `${this.$t('carbonSavings')}(kgCO₂)`, key: `${index}`, minWidth: 200, align: 'center', slot: 'carbonSaving' },
                  ],
                }))) ||
              []
            this.tableData = [{ category: this.label, data: info.carbon, carbonTotal: this.getSumTypeValue(info.carbon), carbonSavingTotal: this.getSumTypeValue(info.carbon, 'saveData') }]
            this.carbonRatiosQuery = cloneDeep(this.timeValue)
            this.carbonRatios = (info && info.carbon) || []
            this.tableDataRate = [{ category: this.label, carbonRatios: info.carbon }]
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel(exportType, name) {
        const params = {
          ...this.queryParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          exportType,
        }
        const res = await carbonChartExport(params)
        this.$func.getPostResFile(res, name)
      },
    },
    mounted() {
      this.echarts = echarts.init(this.$refs.chartRef)
      this.pieEchart = echarts.init(this.$refs.pieRef)
      window.addEventListener('resize', this.echartResize)
      this.trendTimeValue = this.timeValue
      this.$nextTick(() => {
        this.queryCarbonEmission()
        this.queryCarbonTrend()
      })
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
