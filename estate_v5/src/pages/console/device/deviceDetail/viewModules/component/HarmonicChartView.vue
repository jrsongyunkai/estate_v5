<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('harmonicTrend') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup v-model="harmonicSetting.type" type="button">
          <Radio v-for="op in typeOptions" :label="op.value" :key="op.value">{{ op.label }}</Radio>
        </RadioGroup>
        <Select style="width: 200px; margin-left: 5px" v-model="queryCondition.phaseList" multiple popper-class="auto-complete" :placeholder="$t('pleaseSelect')">
          <Option v-for="item in phaseOptions" :key="item.value" :label="item.label" :value="item.value"></Option>
        </Select>
        <Select style="width: 300px; margin-left: 5px" :max-tag-count="2" v-model="queryCondition.objsList" multiple popper-class="auto-complete" :placeholder="$t('pleaseSelect')">
          <Option v-for="item in objOptions" :key="item.value" :label="item.label" :value="item.value"></Option>
        </Select>
        <RadioGroup class="ml-5" v-model="harmonicSetting.model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" ghost v-if="harmonicSetting.model === 'table'" class="ml-5" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <QualityChart v-if="harmonicSetting.model === 'echart'" :options="harmonicTrend"></QualityChart>
      <div v-else>
        <Table border class="device-wrap" :data="tableData" :columns="harmonicTrendColumnsList" style="width: 100%">
          <template #valueSlot="{ row, column }">{{ row[column.key] }}%</template>
        </Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import QualityChart from '../common/QualityChart.vue'
  import useQualityMixin from '../mixins/useQualityMixin'
  import { elecQualityTrendHarm, xLRExportStatisticsHarm } from '@/api/console/elecQuality'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [useQualityMixin],
    components: { QualityChart },
    data() {
      return {
        typeOptions: [
          { label: this.$t('currentHarmonics'), value: 'cur' },
          { label: this.$t('voltageHarmonics'), value: 'vol' },
        ],
        harmonicSetting: { type: 'cur', model: 'echart' },
        harmonicTrendList: [],
        queryCondition: { phaseList: ['A', 'B', 'C'], objsList: ['harm'] },
        queryHarmTrendParams: { phaseList: [], objsList: [] },
        isLoading: false,
      }
    },
    computed: {
      harmonicTrend() {
        let seriesData = []
        const { phaseList, objsList } = this.queryHarmTrendParams
        if (phaseList && phaseList.length) {
          phaseList.forEach(p => {
            const pSeriesKeys = objsList && objsList.length > 0 ? objsList : Object.keys(this.objMapLabel)
            const pSeriesList = pSeriesKeys.map(v => ({
              type: 'line',
              showSymbol: false,
              name: this.harmNameMapAll[`${v}${p}`] || this.$t('unknown2'),
              data: this.harmonicTrendList.map(it => [it.createTime, it[`${v}${p}`]]),
              markPoint: this.markPoint,
            }))
            seriesData = seriesData.concat(pSeriesList)
          })
        }
        return {
          type: 'line',
          yAxisName: this.$t('unitPercentage'),
          xAxisData: this.harmonicTrendList.map(it => it.createTime),
          colors: this.colors,
          series: [...seriesData],
        }
      },
      harmonicTrendColumnsList() {
        let ColumnsKeys = []
        const { phaseList, objsList } = this.queryHarmTrendParams
        if (phaseList && phaseList.length) {
          phaseList.forEach(p => {
            let pColumnsKeys = objsList && objsList.length > 0 ? objsList : Object.keys(this.objMapLabel)
            let pColumns = pColumnsKeys.map(v => ({
              title: this.harmNameMapAll[`${v}${p}`] || this.$t('unknown2'),
              key: `${v}${p}`,
              align: 'center',
              minWidth: 150,
              slot: 'valueSlot',
            }))
            ColumnsKeys = ColumnsKeys.concat(pColumns)
          })
        }
        return [{ title: this.$t('collectionTime'), key: 'createTime', align: 'center', fixed: 'left', width: 200 }, ...ColumnsKeys]
      },
      choiceList() {
        let list = []
        let { phaseList, objsList } = cloneDeep(this.queryCondition)
        phaseList.forEach(p => {
          let seList = objsList.length && objsList.map(v => `${v}${p}`)
          list = list.concat(seList)
        })
        return list
      },
      total() {
        return this.harmonicTrendList.length
      },
      tableData() {
        const harmonicTrendList = cloneDeep(this.harmonicTrendList)
        return harmonicTrendList.reverse().slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
      },
    },
    methods: {
      async init() {
        if (this.isLoading) return
        if (this.choiceList.length === 0) return
        const params = {
          ...this.addrParams,
          harmType: this.harmonicSetting.type === 'cur' ? 1 : 2,
          choiceList: this.choiceList,
          startTime: dayjs(this.dateValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(this.dateValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
        this.isLoading = true
        const res = await elecQualityTrendHarm(params)
        if (res.success) {
          this.pageNo = 1
          this.isLoading = false
          this.queryHarmTrendParams = cloneDeep({ ...this.queryCondition, ...params })
          this.harmonicTrendList = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel() {
        if (this.harmonicTrendList.length === 0) return this.$Message.error(this.$t('currentlyNoDataCheckFirst'))
        const res = await xLRExportStatisticsHarm({
          harmType: this.queryHarmTrendParams.harmType,
          choiceStr: this.queryHarmTrendParams.choiceList.join('-'),
          statisticsHarm: cloneDeep(this.harmonicTrendList).reverse(),
        })
        this.getPostResFile(res, `${this.harmonicSetting.type === 'cur' ? this.$t('currentHarmonicsData') : this.$t('voltageHarmonicsData')}`)
      },
      handleCurrentChange(e) {
        this.pageNo = e
      },
    },
    mounted() {
      // this.init()
    },
    watch: {
      'harmonicSetting.type': {
        handler() {
          this.changeQueryParams()
        },
        deep: true,
      },
      dateValue: {
        handler() {
          this.changeQueryParams()
        },
        deep: true,
      },
      queryCondition: {
        handler(v) {
          this.$nextTick(() => {
            this.changeQueryParams()
          })
        },
        deep: true,
      },
    },
  }
</script>
