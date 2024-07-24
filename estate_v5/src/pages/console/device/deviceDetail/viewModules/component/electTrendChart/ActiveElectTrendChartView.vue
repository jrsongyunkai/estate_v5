<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('activeElectricalEnergy') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup class="ml-5" v-model="model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" v-if="model === 'table'" ghost class="ml-5" @click.stop="$emit('exportExcel', 1)">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <ElectTrendChart v-if="model === 'echart'" :options="electTrendData"></ElectTrendChart>
      <div v-else>
        <Table border class="device-wrap-electTrend" :data="tableData" :maxHeight="500" :row-class-name="rowClassName" :columns="electColumnsList" style="width: 100%" :span-method="handleSpan">
          <template #valueSlot="{ row, index, column }">
            <span v-if="index % 3 === 0">{{ row.meterPE }}｜100%</span>
            <span v-if="index % 3 === 1">{{ column._index === 1 ? `${row.meterPEp}｜${getRateRow(row, 'meterPEp')}` : `${row.meterPEn}｜${getRateRow(row, 'meterPEn')}` }}</span>
            <span v-if="index % 3 === 2">{{ `${row[column.key]}｜${getRateRow(row, column.key)}` }}</span>
          </template>
        </Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import ElectTrendChart from '../../common/ElectTrendChart.vue'
  import useElectTrendMixin from '../../mixins/useElectTrendMixin'
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
            title: this.$t('combinedActiveEnergyProportion'),
            key: 'meterPE',
            align: 'center',
            children: [
              {
                title: this.$t('positiveActiveEnergyProportion'),
                key: 'meterPEp',
                align: 'center',
                children: [
                  { title: this.$t('A-phaseActiveEnergyProportion'), key: 'meterPAEp', ...commonSet },
                  { title: this.$t('B-phaseActiveEnergyProportion'), key: 'meterPBEp', ...commonSet },
                  { title: this.$t('C-phaseActiveEnergyProportion'), key: 'meterPCEp', ...commonSet },
                ],
              },
              {
                title: this.$t('reverseActiveEnergyProportion'),
                key: 'meterPEn',
                align: 'center',
                children: [
                  { title: this.$t('A-phaseReverseActiveEnergyProportion'), key: 'meterPAEn', ...commonSet },
                  { title: this.$t('B-phaseReverseActiveEnergyProportion'), key: 'meterPBEn', ...commonSet },
                  { title: this.$t('C-phaseReverseActiveEnergyProportion'), key: 'meterPCEn', ...commonSet },
                ],
              },
            ],
          },
        ]
      },
      electTrendData() {
        const meterPEList = this.electDataList.map(it => this.getDataSetRow(it, 'meterPE'))
        const meterPECenterSumList = this.electDataList.map(it => this.getCenterDataSumRow(it))
        const meterPETopSumList = this.electDataList.map(it => this.getSumRow(it))
        const emptyLabels = this.electDataList.map(it => [dayjs(it.createTime).format('HH:mm'), 0, 0])
        return {
          xAxisUnitName: this.$t('unitKwh'),
          yAxisData: this.electDataList.map(it => dayjs(it.createTime).format('HH:mm')),
          seriesData: [
            { name: this.$t('A-phasePositiveActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPAEp')) },
            { name: this.$t('B-phasePositiveActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPBEp')) },
            { name: this.$t('C-phasePositiveActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPCEp')) },
            { name: this.$t('PositiveActiveEnergy'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPEp')) },
            { name: this.$t('A-phaseReverseActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPAEn')) },
            { name: this.$t('B-phaseReverseActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPBEn')) },
            { name: this.$t('C-phaseReverseActiveEnergy'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPCEn')) },
            { name: this.$t('ReverseActiveEnergy'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterPEn')) },
            { name: this.$t('combinedActiveEnergy'), stack: 'bottom', ...this.echartItem, data: meterPEList },
            { name: 'label', type: 'bar', stack: 'center', ...this.echartItem, emphasis: { focus: 'none' }, label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => meterPECenterSumList[params.dataIndex].toFixed(3) }, data: emptyLabels, tooltip: { show: false } },
            { name: 'label', type: 'bar', stack: 'top', ...this.echartItem, emphasis: { focus: 'none' }, label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => meterPETopSumList[params.dataIndex].toFixed(3) }, data: emptyLabels, tooltip: { show: false } },
            { name: 'label', type: 'bar', stack: 'bottom', ...this.echartItem, emphasis: { focus: 'none' }, label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterPEList[params.dataIndex][1].toFixed(3) }, data: emptyLabels, tooltip: { show: false } },
          ],
        }
      },
    },
    methods: {
      handleSpan({ rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return rowIndex % 3 === 0 ? [3, 1] : [0, 0]
        }
        if (rowIndex % 3 === 0) {
          return columnIndex === 1 ? [1, 6] : [0, 0]
        }
        if (rowIndex % 3 === 1) {
          return [1, 4].includes(columnIndex) ? [1, 3] : [0, 0]
        }
      },
      rowClassName(row, index) {
        if (Math.floor(index / 3) % 2 === 0) {
          return index % 3 === 0 ? 'row-first row-odd' : 'row-odd'
        } else {
          return index % 3 === 0 ? 'row-first row-even' : 'row-even'
        }
      },
      getSumRow(row) {
        return +row.meterPAEp + +row.meterPBEp + +row.meterPCEp + +row.meterPAEn + +row.meterPBEn + +row.meterPCEn
      },
      getRateRow(row, key = 'meterPAEp') {
        if (key === 'meterPE') return '100%'
        let rate = '-%'
        let sum = ['meterPEp', 'meterPEn'].includes(key) ? +row.meterPEp + +row.meterPEn : this.getSumRow(row)
        rate = `${sum ? ((+row[key] / sum) * 100).toFixed(2) : '-'}%`
        return rate
      },
      getDataSetRow(it, key = 'meterPAEp') {
        let rate = this.getRateRow(it, key)
        return [dayjs(it.createTime).format('HH:mm'), it[key] || 0, rate]
      },
      getCenterDataSumRow(row) {
        return +row.meterPEp + +row.meterPEn || 0
      },
    },
    mounted() {},
  }
</script>
