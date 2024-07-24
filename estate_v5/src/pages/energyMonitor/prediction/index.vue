<template>
  <div class="carbon-view">
    <div class="left">
      <DeviceTree @clickNode="clickNode" :isChangeFold="false" noAddress strictMode></DeviceTree>
    </div>
    <div class="right">
      <div class="view-item">
        <div class="header">{{ $t('batteryDiviner') }}</div>
        <Alert show-icon>
          <span>{{ ['1', '4', '5'].includes(formData.predictPlan) ? tipsTextOne : ['2', '3'].includes(formData.predictPlan) ? tipsTextTwo : tipsTextThree }}</span>
          <span class="red">{{ $t('thisDataForReferenceOnly') }}</span>
        </Alert>
        <div class="form-box">
          <div class="form_item">
            <span class="label">{{ $t('ns_batteryDiviner.predictionPlan') }}:</span>
            <div>
              <Select v-width="240" v-model="formData.predictPlan" :clearable="false">
                <Option v-for="item in programmeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
              <Tooltip placement="top" max-width="250">
                <Icon class="ml-10" color="#02a7f0" size="16" type="ios-information-circle-outline" />
                <div slot="content">{{ predictPlanTips }}</div>
              </Tooltip>
            </div>
          </div>
          <div class="form_item" v-if="formData.predictPlan === '4'">
            <span class="label">{{ $t('ns_batteryDiviner.yearOnYearCycle') }}:</span>
            <div>
              <Select v-width="240" v-model="formData.periodType" :clearable="false">
                <Option value="1">{{ $t('absolutePeriod') }}</Option>
                <Option value="2">{{ $t('relativePeriod') }}</Option>
              </Select>
              <Tooltip placement="top" max-width="250">
                <Icon class="ml-10" color="#02a7f0" size="16" type="ios-information-circle-outline" />
                <div slot="content">
                  <template v-if="formData.periodType === '1'">
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip1') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip3') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip4') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip5') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip6') }}</p>
                  </template>
                  <template v-else>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip2') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip3') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip4') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip7') }}</p>
                    <p>{{ $t('ns_batteryDiviner.yearOnYearCycleTip8') }}</p>
                  </template>
                </div>
              </Tooltip>
            </div>
          </div>
          <div class="form_item">
            <span class="label">{{ $t('ns_batteryDiviner.predictionPeriodType') }}:</span>
            <RadioGroup v-model="formData.timeType">
              <Radio label="1">{{ $t('hour') }}</Radio>
              <Radio label="2">{{ $t('day') }}</Radio>
              <Radio label="3">{{ $t('month') }}</Radio>
              <Radio label="4">{{ $t('year') }}</Radio>
            </RadioGroup>
          </div>
          <template v-if="['1', '4', '5'].includes(formData.predictPlan)">
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.observingSession') }}:</span>
              <LookTimeRangePicker :timeType="formData.timeType" v-model="timeRange" />
            </div>
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.predictionPeriod') }}:</span>
              <div style="width: 200px" v-if="formData.predictPlan === '5'">{{ `${formData.timeType === '1' ? $t('periodOfTime', { num: PredictionTimePoint }) : PredictionTimePoint}` }}</div>
              <PredictionTimeRangePicker v-if="['1', '4'].includes(formData.predictPlan)" :timeType="formData.timeType" v-model="predictTimeRange" />
              <Tooltip placement="top" max-width="250" v-if="formData.predictPlan === '4'">
                <Icon class="ml-10" color="#02a7f0" size="16" type="ios-information-circle-outline" />
                <div slot="content">{{ $t('ns_batteryDiviner.forReferenceOnlyTip') }}</div>
              </Tooltip>
              <Button type="primary" class="ml-10" @click.stop="querySubmit">{{ $t('query') }}</Button>
            </div>
          </template>
          <template v-if="['2', '3'].includes(formData.predictPlan)">
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.movingInterval') }}:</span>
              <div>
                <InputNumber v-model="formData.moveInterval" v-width="240" :min="1" v-inputNumberRule="'Integer'" :max="10000" />
              </div>
            </div>
            <div class="form_item" v-if="formData.predictPlan === '3'">
              <span class="label">{{ $t('ns_batteryDiviner.smoothnessIndex') }}:</span>
              <div>
                <InputNumber v-model="formData.smoothIndex" v-width="240" :max="1" v-inputNumberRule="'TwoDecimal'" :step="0.01" :placeholder="$t('ns_batteryDiviner.smoothnessIndexTip')" :min="0" />
              </div>
            </div>
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.observingSession') }}:</span>
              <div>{{ `${formData.timeType === '1' ? $t('periodOfTime', { num: ObservationTimePoint[0] }) : ObservationTimePoint[0]} - ${formData.timeType === '1' ? $t('periodOfTime', { num: ObservationTimePoint[1] }) : ObservationTimePoint[1]} ` }}</div>
            </div>
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.predictionTimePoint') }}:</span>
              <div style="width: 200px">{{ `${formData.timeType === '1' ? $t('periodOfTime', { num: PredictionTimePoint }) : PredictionTimePoint}` }}</div>
              <Button type="primary" class="ml-10" @click.stop="querySubmit">{{ $t('query') }}</Button>
            </div>
          </template>
          <template v-if="formData.predictPlan === '6'">
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.movingInterval') }}:</span>
              <div>
                <InputNumber v-model="formData.moveInterval" v-width="240" :min="1" v-inputNumberRule="'Integer'" :max="10000" />
              </div>
            </div>
            <div class="form_item">
              <span class="label">{{ $t('ns_batteryDiviner.predictionPeriod') }}:</span>
              <PredictionTimeRangePicker :timeType="formData.timeType" v-model="predictTimeRange" />
              <Button type="primary" class="ml-10" @click.stop="querySubmit">{{ $t('query') }}</Button>
            </div>
          </template>
        </div>
      </div>
      <div class="echart-view">
        <div class="header">{{ $t('ns_batteryDiviner.predictingElectricityTrends') }}</div>
        <div class="loading-chart" v-show="loading">
          <Icon type="md-sync" size="20" />
          {{ $t('ns_batteryDiviner.predictingPowerLoading') }}
        </div>
        <TrendEchartView v-show="!loading" :predictPlan="queryResultParams.predictPlan" v-if="['1', '4', '5'].includes(queryResultParams.predictPlan)" ref="trendEchartView" />
        <EsmMamTrendEchartView v-show="!loading" v-if="['2', '3'].includes(queryResultParams.predictPlan)" ref="esmMamTrendEchartView" />
        <CpdrsTrendEchartView v-show="!loading" v-if="queryResultParams.predictPlan === '6'" ref="cpdrsTrendEchartView" />
      </div>
      <div class="echart-view" v-if="queryResultParams.predictPlan === '1'">
        <div class="header">{{ $t('ns_batteryDiviner.linearRegressionEquation') }}</div>
        <div class="loading-chart" v-show="loading">
          <Icon type="md-sync" size="20" />
          {{ $t('ns_batteryDiviner.predictingPowerLoading') }}
        </div>
        <EquationEchartView v-show="!loading" ref="equationEchartView" />
      </div>
      <div class="view-item">
        <div class="header">
          <div>{{ $t('ns_batteryDiviner.forecastResults') }}</div>
          <div class="right">
            <Button type="primary" ghost class="ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
          </div>
        </div>
        <Table :columns="columns" :data="tableData" border>
          <template #Actual="{ row }">{{ row.realPower || $t('nullData') }}</template>
          <template #Value="{ row }">
            <span class="yellow" v-if="row.value === void 0">
              <Icon type="ios-alert-outline" size="16" />
              {{ $t('ns_batteryDiviner.predictionFailed') }}
            </span>
            <span v-else>{{ row.value }}</span>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
  import { powerModalData, getKeyValue, xLRExport } from '@/api/energyMonitor/prediction'
  import LookTimeRangePicker from './modules/LookTimeRangePicker.vue'
  import TrendEchartView from './modules/TrendEchartView.vue'
  import PredictionTimeRangePicker from './modules/PredictionTimeRangePicker.vue'
  import EquationEchartView from './modules/EquationEchartView.vue'
  import EsmMamTrendEchartView from './modules/EsmMamTrendEchartView.vue'
  import CpdrsTrendEchartView from './modules/CpdrsTrendEchartView.vue'
  import DeviceTree from '@/components/deviceTree/index.vue'
  import qs from 'qs'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'energyMonitor-prediction',
    components: {
      DeviceTree,
      LookTimeRangePicker,
      PredictionTimeRangePicker,
      TrendEchartView,
      EquationEchartView,
      EsmMamTrendEchartView,
      CpdrsTrendEchartView,
    },
    data() {
      return {
        programmeList: [
          { name: 'xLR', value: '1', tips: this.$t('ns_batteryDiviner.tip_xLR') },
          { name: 'MAM', value: '2', tips: this.$t('ns_batteryDiviner.tip_MAM') },
          { name: 'ESM', value: '3', tips: this.$t('ns_batteryDiviner.tip_ESM') },
          { name: 'YoYS', value: '4', tips: this.$t('ns_batteryDiviner.tip_YoYS') },
          { name: 'CRS', value: '5', tips: this.$t('ns_batteryDiviner.tip_CRS') },
          { name: 'CPDRS', value: '6', tips: this.$t('ns_batteryDiviner.tip_CPDRS') },
        ],
        tipsTextOne: this.$t('ns_batteryDiviner.tip1'), // [1,4,5]
        tipsTextTwo: this.$t('ns_batteryDiviner.tip2'), // [2,3]
        tipsTextThree: this.$t('ns_batteryDiviner.tip3'), // [6]
        echart: null,
        programme: '1',
        count: null,
        timeRange: [],
        predictTimeRange: [],
        formData: {
          predictPlan: '1',
          timeType: '1',
          projectCode: this.$store.state.projectCode,
          treeType: '1',
          mac: '',
          addr: null,
          province: '',
          city: '',
          county: '',
          groupId: null,
          nodeId: null,
          moveInterval: 1,
          smoothIndex: 0,
          periodType: '1',
        },
        tableData: [],
        loading: false,
        timeTypeMap: { 1: 'hour', 2: 'day', 3: 'month', 4: 'year' },
        timeTypeFormatMap: { 1: 'YYYY-MM-DD HH', 2: 'YYYY-MM-DD', 3: 'YYYY-MM', 4: 'YYYY' },
        queryResultParams: { predictPlan: '1' },
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        queryResult: null,
      }
    },
    computed: {
      predictPlanTips() {
        let programmeObj = this.programmeList.find(it => it.value === this.formData.predictPlan)
        return programmeObj && programmeObj.tips
      },
      ObservationTimePoint() {
        const moveInterval = this.formData.moveInterval
        const timeType = this.formData.timeType
        const timeUnit = this.timeTypeMap[timeType]
        const timeFormat = this.timeTypeFormatMap[timeType]
        return [dayjs().startOf(timeUnit).subtract(moveInterval, timeUnit).format(timeFormat), dayjs().startOf(timeUnit).subtract(1, timeUnit).format(timeFormat)]
      },
      PredictionTimePoint() {
        const timeType = this.formData.timeType
        const timeFormat = this.timeTypeFormatMap[timeType]
        return `${dayjs().format(timeFormat)}`
      },
      columns() {
        if (['1'].includes(this.queryResultParams.predictPlan)) {
          return [
            { title: this.$t('date'), key: 'date', align: 'center' },
            { title: `${this.$t('actualElectricityConsumption')}(kW·h)`, key: '', slot: 'Actual', align: 'center' },
            { title: `${this.$t('predictedElectricityConsumption')}(kW·h)`, key: 'value', slot: 'Value', align: 'center' },
            {
              title: this.$t('ns_batteryDiviner.goodnessOfFit'),
              key: 'rSquared',
              align: 'center',
              renderHeader: h => {
                return h('div', {}, [
                  h('span', {}, this.$t('ns_batteryDiviner.goodnessOfFit')),
                  h('Tooltip', { props: { placement: 'top', maxWidth: '300', transfer: true } }, [
                    h('Icon', {
                      props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                      style: { marginLeft: '5px' },
                    }),
                    h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.$t('ns_batteryDiviner.goodnessOfFitTip')),
                  ]),
                ])
              },
            },
          ]
        }
        return [
          { title: this.$t('date'), key: 'date', align: 'center' },
          { title: `${this.$t('actualElectricityConsumption')}(kW·h)`, key: '', slot: 'Actual', align: 'center' },
          { title: `${this.$t('predictedElectricityConsumption')}(kW·h)`, key: 'value', slot: 'Value', align: 'center' },
        ]
      },
    },
    methods: {
      clickNode(e) {
        this.formData.treeType = e.statType.toString()
        this.formData.addr = e.addr || ''
        this.formData.nodeId = e.nodeId || ''
        this.formData.groupId = e.groupId || ''
        this.formData.county = e.county || ''
        this.formData.mac = e.mac || ''
        this.formData.province = e.province || ''
        this.formData.city = e.city || ''
        this.queryResultParams = { predictPlan: '' }
        this.tableData = []
      },
      async querySubmit() {
        const { timeType, predictPlan } = this.formData
        const timeUnit = this.timeTypeMap[timeType]
        if (['2', '3'].includes(predictPlan)) {
          this.timeRange = [dayjs(this.ObservationTimePoint[0]).startOf(timeUnit).format(this.valueFormat), dayjs(this.ObservationTimePoint[1]).endOf(timeUnit).format(this.valueFormat)]
          this.predictTimeRange = [dayjs(this.PredictionTimePoint).startOf(timeUnit).format(this.valueFormat), dayjs(this.PredictionTimePoint).endOf(timeUnit).format(this.valueFormat)]
        } else if (predictPlan === '5') {
          this.predictTimeRange = [dayjs(this.PredictionTimePoint).startOf(timeUnit).format(this.valueFormat), dayjs(this.PredictionTimePoint).endOf(timeUnit).format(this.valueFormat)]
        } else if (predictPlan === '6') {
          this.timeRange = [dayjs(this.ObservationTimePoint[0]).startOf(timeUnit).format(this.valueFormat), dayjs(this.ObservationTimePoint[1]).endOf(timeUnit).format(this.valueFormat)]
        }
        if (this.timeRange.length === 0) return this.$message.error(this.$t('ns_batteryDiviner.searchTip1'))
        if (this.predictTimeRange.length === 0) return this.$message.error(this.$t('ns_batteryDiviner.searchTip2'))
        if (['2', '3', '6'].includes(predictPlan) && !this.formData.moveInterval) return this.$message.error(this.$t('ns_batteryDiviner.searchTip3'))
        this.loading = true
        const params = {
          ...this.formData,
          startTime: (this.timeRange && this.timeRange[0]) || '',
          endTime: (this.timeRange && this.timeRange[1]) || '',
          predictStartTime: (this.predictTimeRange && this.predictTimeRange[0]) || '',
          predictEndTime: (this.predictTimeRange && this.predictTimeRange[1]) || '',
        }
        const res = await powerModalData(params)
        if (res.success) {
          this.queryResultParams = cloneDeep(params)
          if (predictPlan === '1') {
            this.queryResult = res.data
          }
          this.loading = false
          this.$nextTick(() => {
            const { observations, predictions, rSquared, mulObservations, predictStatus } = res.data
            if (predictStatus === 1) {
              this.$message.warning(this.$t('ns_batteryDiviner.resultTip1'))
            } else if (predictStatus === 2) {
              this.$message.error(this.$t('ns_batteryDiviner.resultTip2'))
            }
            if (['1', '4', '5'].includes(predictPlan)) {
              this.$refs.trendEchartView && this.$refs.trendEchartView.echartSetOption(observations || [], predictions || [], rSquared)
              if (predictPlan === '1') {
                this.$refs.equationEchartView && this.$refs.equationEchartView.echartSetOption(res.data, this.timeTypeMap[this.formData.timeType])
              }
            } else if (['2', '3'].includes(predictPlan)) {
              this.$refs.esmMamTrendEchartView && this.$refs.esmMamTrendEchartView.echartSetOption(observations || [], predictions || [], rSquared)
            } else if (predictPlan === '6') {
              this.$refs.cpdrsTrendEchartView && this.$refs.cpdrsTrendEchartView.echartSetOption(mulObservations || [], predictions || [])
            }
            this.tableData =
              Array.isArray(predictions) && predictions.length
                ? predictions.map(it => {
                    const predictPower = Object.values(it)[0].predictPower
                    const realPower = Object.values(it)[0].realPower
                    const rSquaredValue = rSquared === void 0 ? '' : rSquared.toFixed(4)
                    return {
                      date: this.queryResultParams.timeType === '1' ? this.$t('periodOfTime', { num: Object.keys(it)[0] }) : `${Object.keys(it)[0]}`,
                      value: predictPower !== void 0 ? predictPower.toFixed(3) : void 0,
                      realPower: realPower !== void 0 ? realPower.toFixed(3) : void 0,
                      rSquared: rSquaredValue,
                    }
                  })
                : []
          })
        } else {
          this.queryResultParams = {}
          this.tableData = []
          this.loading = false
          this.$Message.error(res.message)
        }
      },
      async getDefaultKeyValue() {
        const params = { at: 'db', tag: 'prj', key: 'DEFAULT_POWER_PREDICTION_PLAN', ep: this.$store.state.projectCode }
        const res = await getKeyValue(params)
        if (res.success) {
          if (res.data) {
            this.programme = JSON.parse(res.data).default.toString() || '1'
            this.count = JSON.parse(res.data).count
            this.formData.predictPlan = this.programme
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel() {
        if (this.tableData.length === 0) return this.$Message.error(this.$t('currentlyNoDataCheckFirst'))
        if (this.queryResultParams.predictPlan === '1') {
          const res = await xLRExport(this.queryResult)
          const a = document.createElement('a')
          a.href = window.URL.createObjectURL(res)
          a.download = `batteryDiviner_${dayjs().valueOf()}.xlsx`
          a.click()
          document.body.removeChild(a)
        } else {
          let ctxPaths = this.$func.ctxPaths()
          let qsStringParams = qs.stringify(this.queryResultParams)
          this.$func.windowCountDown(`${ctxPaths}/energy/manage/v5/prediction/powerModalExport.as?${qsStringParams}`)
        }
      },
    },
    mounted() {
      this.getDefaultKeyValue()
    },
  }
</script>

<style lang="less" scoped>
  .carbon-view {
    height: calc(~'100vh - 142px');
    display: flex;
    justify-content: space-between;
    .left {
      width: 250px;
      margin-right: 10px;
      padding: 10px;
      background: #1a202e;
      height: 100%;
    }
    .right {
      height: 100%;
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0px;
      }
      .echart-view {
        width: 100%;
        background: #1a202e;
        padding: 0px 20px;
        padding-bottom: 20px;
        margin-bottom: 10px;
        .loading-chart {
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2d8cf0;
          /deep/.ivu-icon {
            animation: rotate 2s linear infinite;
          }
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }
        .header {
          height: 50px;
          line-height: 50px;
        }
        .search-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
      .view-item {
        width: 100%;
        padding: 0px 20px;
        padding-bottom: 20px;
        margin-bottom: 10px;
        background: #1a202e;
        .header {
          height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .right {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }
        .red {
          color: #d9001b;
        }
        .form_item {
          display: flex;
          padding-bottom: 10px;
          white-space: nowrap;
          align-items: center;
          margin-bottom: 10px;
          --itemLabelWidth: 200px;
          .label {
            display: inline-block;
            width: var(--itemLabelWidth);
            text-align: right;
            padding-right: 8px;
            flex-shrink: 0;
          }
          .input-box {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            .unit {
              position: absolute;
              right: 10px;
            }
          }
          .form-item-table {
            width: calc(~'100% - var(--itemLabelWidth)');
          }
        }
        .yellow {
          color: #f59a23;
        }
      }
    }
  }
</style>
