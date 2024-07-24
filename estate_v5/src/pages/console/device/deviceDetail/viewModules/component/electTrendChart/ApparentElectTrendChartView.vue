<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('ApparentElectricalEnergy') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup class="ml-5" v-model="model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" v-if="model === 'table'" class="ml-5" ghost @click.stop="$emit('exportExcel', 3)">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <ElectTrendChart v-if="model === 'echart'" :options="electTrendData"></ElectTrendChart>
      <div v-else>
        <Table border class="device-wrap-electTrend" :data="tableData" :maxHeight="500" :row-class-name="rowClassName" :columns="electColumnsList" style="width: 100%" :span-method="handleSpan">
          <template #valueSlot="{ row, index, column }">
            <span v-if="index % 2 === 0">{{ column._index === 1 ? `${row.meterSEp}｜${getRateRow(row, 'meterSEp')}` : `${row.meterSEn}｜${getRateRow(row, 'meterSEn')}` }}</span>
            <span v-if="index % 2 === 1">{{ `${row[column.key]}｜${getRateRow(row, column.key)}` }}</span>
          </template>
        </Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import ElectTrendChart from '../../common/ElectTrendChart.vue'
  import useElectTrendMixin from '../../mixins/useElectTrendMixin'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    components: { ElectTrendChart },
    mixins: [useElectTrendMixin],
    data() {
      return {
        echartItem: {
          type: 'bar',
          emphasis: { focus: 'self' },
          encode: {
            x: 1, // 表示维度 1 映射到 x 轴。
            y: 0, // 表示维度 0 映射到 x 轴。
            tooltip: [1, 2], // 表示维度 0,1 会在 tooltip 中显示。
          },
        },
      }
    },
    computed: {
      electColumnsList() {
        const commonSet = { align: 'center', minWidth: 200, slot: 'valueSlot' }
        return [
          { title: this.$t('collectionTime'), key: 'createTime', align: 'center', width: 200, fixed: 'left', className: 'column-time' },
          {
            title: this.$t('PositiveApparentEnergyProportion'),
            key: 'meterSEp',
            align: 'center',
            children: [
              { title: this.$t('A-PositiveApparentEnergyProportion'), key: 'meterSAEp', ...commonSet },
              { title: this.$t('B-PositiveApparentEnergyProportion'), key: 'meterSBEp', ...commonSet },
              { title: this.$t('C-PositiveApparentEnergyProportion'), key: 'meterSCEp', ...commonSet },
            ],
          },
          {
            title: this.$t('ReverseApparentEnergyProportion'),
            key: 'meterSEn',
            align: 'center',
            children: [
              { title: this.$t('A-ReverseApparentEnergyProportion'), key: 'meterSAEn', ...commonSet },
              { title: this.$t('B-ReverseApparentEnergyProportion'), key: 'meterSBEn', ...commonSet },
              { title: this.$t('C-ReverseApparentEnergyProportion'), key: 'meterSCEn', ...commonSet },
            ],
          },
        ]
      },
      electTrendData() {
        const meterSEpList = this.electDataList.map(it => this.getDataSetRow(it, 'meterSEp'))
        const meterSEnList = this.electDataList.map(it => this.getDataSetRow(it, 'meterSEn'))
        const emptyLabels = this.electDataList.map(it => [dayjs(it.createTime).format('HH:mm'), 0, 0])
        const meterTopSumList = this.electDataList.map(it => this.getSumRow(it))
        return {
          xAxisUnitName: this.$t('unitKVAh'),
          unit: 'kVA·h',
          yAxisData: this.electDataList.map(it => dayjs(it.createTime).format('HH:mm')),
          seriesData: [
            { name: this.$t('A-PhasePositiveApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSAEp')) },
            { name: this.$t('B-PhasePositiveApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSBEp')) },
            { name: this.$t('C-PhasePositiveApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSCEp')) },
            { name: this.$t('PositiveApparentEnergy'), stack: 'bottom', ...this.echartItem, data: meterSEpList },
            { name: this.$t('A-ReverseApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSAEn')) },
            { name: this.$t('B-ReverseApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSBEn')) },
            { name: this.$t('C-ReverseApparentEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterSCEn')) },
            { name: this.$t('ReverseApparentEnergy'), stack: 'bottom', ...this.echartItem, data: meterSEnList },
            {
              name: 'label',
              stack: 'bottom',
              ...this.echartItem,
              emphasis: { focus: 'none' },
              label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterSEpList[params.dataIndex][1] + +meterSEnList[params.dataIndex][1] },
              data: emptyLabels,
              tooltip: { show: false },
            },
            { name: 'label', stack: 'top', ...this.echartItem, emphasis: { focus: 'none' }, label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterTopSumList[params.dataIndex].toFixed(3) }, data: emptyLabels, tooltip: { show: false } },
          ],
        }
      },
      tableData() {
        let electDataList = cloneDeep(this.electDataList)
        let list = electDataList
          .reverse()
          .slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
          .flatMap(it => [it, it])
        return list
      },
    },
    methods: {
      handleSpan({ rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return rowIndex % 2 === 0 ? [2, 1] : [0, 0]
        }
        if (rowIndex % 2 === 0) {
          return columnIndex === 1 || columnIndex === 4 ? [1, 3] : [0, 0]
        }
      },
      rowClassName(row, index) {
        if (Math.floor(index / 2) % 2 === 0) {
          return index % 2 === 0 ? 'row-first row-odd' : 'row-odd'
        } else {
          return index % 2 === 0 ? 'row-first row-even' : 'row-even'
        }
      },
      getSumRow(row) {
        let sum = 0
        let keys = ['meterSAEp', 'meterSBEp', 'meterSCEp', 'meterSAEn', 'meterSBEn', 'meterSCEn']
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index]
          sum += +row[key]
        }
        return sum
      },
      getRateRow(row, key = 'meterSAEp') {
        let sum = ['meterSEp', 'meterSEn'].includes(key) ? +row.meterSEp + +row.meterSEn : this.getSumRow(row)
        let rate = `${sum ? ((+row[key] / sum) * 100).toFixed(2) : '-'}%`
        return rate
      },
      getDataSetRow(it, key = 'meterSAEp') {
        let rate = this.getRateRow(it, key)
        return [dayjs(it.createTime).format('HH:mm'), it[key] || 0, rate]
      },
    },
    mounted() {},
  }
</script>
