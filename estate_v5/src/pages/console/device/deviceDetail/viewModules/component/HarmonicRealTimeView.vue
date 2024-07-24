<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('realTimeHarmonicData') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup v-model="harmonicSetting.type" type="button">
          <Radio v-for="op in typeOptions" :label="op.value" :key="op.value">{{ op.label }}</Radio>
        </RadioGroup>
        <RadioGroup class="ml-5" v-model="harmonicSetting.model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" ghost v-if="harmonicSetting.model === 'table'" class="ml-5" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <QualityChart v-if="harmonicSetting.model === 'echart'" :options="harmonicData"></QualityChart>
      <div v-else style="padding-top: 20px; height: 300px">
        <Table class="device-wrap" border :data="harmonicDataList" :maxHeight="300" :columns="harmonicColumnsList" style="width: 100%">
          <template #valueSlot="{ row, column }">{{ row[column.key] }}%</template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
  import QualityChart from '../common/QualityChart.vue'
  import useQualityMixin from '../mixins/useQualityMixin'
  import { elecQualityHarm, xLRExportRealtimeHarm } from '@/api/console/elecQuality'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [useQualityMixin],
    components: { QualityChart },
    data() {
      return {
        typeOptions: [
          { label: this.$t('currentHarmonics'), value: 'cur', unit: '' },
          { label: this.$t('voltageHarmonics'), value: 'vol', unit: '' },
        ],
        harmonicSetting: { type: 'cur', model: 'echart' },
        harmonicMapData: {},
        queryResultParams: {},
        harmonicDataList: [],
      }
    },
    computed: {
      harmonicData() {
        const xAxisDataMapList = Object.entries(this.harmNameMap)
        return {
          type: 'bar',
          xAxisData: xAxisDataMapList.map(it => it[1]),
          yAxisName: this.$t('unitPercentage'),
          series: [
            {
              type: 'bar',
              name: this.$t('APhase'),
              color: '#dfe73d',
              data: xAxisDataMapList.map(it => {
                let [key, name] = it
                return [name, this.harmonicMapData && this.harmonicMapData[`${key}A`]]
              }),
              barGap: 0,
              barWidth: 10,
              markPoint: this.markPoint,
            },
            {
              type: 'bar',
              name: this.$t('BPhase'),
              color: '#21f27f',
              data: xAxisDataMapList.map(it => {
                let [key, name] = it
                return [name, this.harmonicMapData && this.harmonicMapData[`${key}B`]]
              }),
              barGap: 0,
              barWidth: 10,
              markPoint: this.markPoint,
            },
            {
              type: 'bar',
              name: this.$t('CPhase'),
              color: '#ff3d00',
              data: xAxisDataMapList.map(it => {
                let [key, name] = it
                return [name, this.harmonicMapData && this.harmonicMapData[`${key}C`]]
              }),
              barGap: 0,
              barWidth: 10,
              markPoint: this.markPoint,
            },
          ],
        }
      },
      harmonicColumnsList() {
        const xAxisDataMapList = Object.entries(this.harmNameMap)
        return [{ title: this.$t('phaseWave'), key: 'PhaseName', align: 'center', width: 100, fixed: 'left' }, ...xAxisDataMapList.map(it => ({ title: it[1], key: it[0], align: 'center', slot: 'valueSlot', width: 100 }))]
      },
    },
    methods: {
      async init() {
        const params = { ...this.addrParams, harmType: this.harmonicSetting.type === 'cur' ? 1 : 2 }
        const res = await elecQualityHarm(params)
        if (res.success) {
          this.queryResultParams = cloneDeep(params)
          this.harmonicMapData = res.data
          this.harmonicDataList = [
            { PhaseName: this.$t('APhase'), ...this.getPhaseMapData('A', res.data) },
            { PhaseName: this.$t('BPhase'), ...this.getPhaseMapData('B', res.data) },
            { PhaseName: this.$t('CPhase'), ...this.getPhaseMapData('C', res.data) },
          ]
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel() {
        const res = await xLRExportRealtimeHarm({
          harmType: this.queryResultParams.harmType,
          realtimeHarm: cloneDeep(this.harmonicMapData),
        })
        this.getPostResFile(res, `${this.queryResultParams.harmType === 1 ? this.$t('RealTimeHarmonicDataCurrent') : this.$t('RealTimeHarmonicDataVoltage')}`)
      },
    },
    mounted() {
      this.init()
    },
    watch: {
      'harmonicSetting.type': {
        handler() {
          this.changeQueryParams()
        },
        deep: true,
      },
    },
  }
</script>
